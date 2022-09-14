// Sample code to be added

import 'reflect-metadata';

import { DeepPartial } from "./types/deep-partial";
import { forEach, isEmpty, isFunction, reduce } from 'lodash';
import { BadRequestResourceError } from './resource-errors/bad-request-resource-error';
import { ResourceErrorPayload } from './resource-errors/abstract-resource-error';

export class AbstractDomainEntityFromOptions {
  public preserveNulls?= false;

  constructor(opts: AbstractDomainEntityFromOptions) {
    Object.assign(this, opts);
  }
}



/**
 * A base class that represents an object
 * in our Domain/Solution/Project. All the models
 * of the project can be derived from this abstract class.
 * It allows @Prop() definitions to be imported into the object
 * with `.from()` static method.
 */
export abstract class AbstractDomainEntity {
  private static getValueForAlias(
    json: any,
    jsonAliases: string | [] = [], // modified
    propAlias: string,
    preserveNulls = false
  ): any {
    const aliasList = [...jsonAliases, propAlias];
    return aliasList.reduce((acc, alias) => {
      return json[alias] || (preserveNulls && json[alias] === null) ? json[alias] : acc;
    }, undefined);
  }
  /**
   * A constructor to create a fully initialized instance
   * of the class from an object literal
   */
  public static from<T>(
    this: { new(...args: any[]): T },
    json: DeepPartial<T> & Record<string, any> = {},
    options: AbstractDomainEntityFromOptions = {}
  ): T {
    const opts = new AbstractDomainEntityFromOptions(options);
    const model = new this();
    const propAliases: string[] = Reflect.getMetadata('propAliases', model as Object);
    const jsonAliases: string[] = Reflect.getMetadata('jsonAliases', model as Object) || {};
    const propDescriptors = Object.getOwnPropertyDescriptors(this.prototype);
    forEach<string>(Reflect.getMetadata('modelProps', model as Object), (propName) => {
      const propDescriptor = propDescriptors[propName];
      if (propDescriptor && (propDescriptor.writable === false || !propDescriptor.set)) {
        return;
      }
      if (!opts.preserveNulls) {
        /* eslint-disable:next-line */
        model[propName] =
          AbstractDomainEntity.getValueForAlias(
            json,
            jsonAliases[propName],
            propAliases[propName]
          ) ??
          json[propName] ??
          model[propName];
        return;
      }

      const aliasValue = AbstractDomainEntity.getValueForAlias(
        json,
        jsonAliases[propName],
        propAliases[propName],
        opts.preserveNulls
      );
      if (aliasValue !== undefined) {
        model[propName] = aliasValue;
      } else if (json[propName] !== undefined) {
        model[propName] = json[propName];
      } else {
        // This seems dumb but is necessary. Some of our decorators work by defining setters.
        // If we don't have this line the setter never gets called, and doesn't work. An example of this
        // is @UUID()
        model[propName] = model[propName]; // eslint-disable-line
      }
    });
    return model;
  }

  /**
   * @deprecated please use AbstractDomainEntity.from() instead
   */
  constructor() {
  }

  /**
   * Serializes this AbstractDomainEntity to json. mapping back to prop aliases defined
   * in @Prop(<prop-alias>) and removing any properties decorated with @JsonIgnore().[TBD]
   * @param excludes {Array<string>} if calling this manually you may pass an array of
   * strings to exclude from the resulting Json
   *
   * NOTE: This method is typically called automatically when passing an object
   * to JSON.stringify()
   */
  public toJSON(...excludes: string[]): { [key: string]: any } {
    const jsonIgnoreProps = Reflect.getMetadata('jsonIgnoreProps', this) || new Set<string>();
    const jsonIgnoreNullProps =
      Reflect.getMetadata('jsonIgnoreNullProps', this) || new Set<string>();
    const propAliases = Reflect.getMetadata('propAliases', this);
    const modelProps = Reflect.getMetadata('modelProps', this);
    return reduce(
      modelProps,
      (acc, propName) => {
        if (!jsonIgnoreProps.has(propName) && excludes.indexOf(propName) === -1) {
          /* eslint-disable:next-line */
          const value = this.getPropValue(this[propName]);
          if (value !== null || !jsonIgnoreNullProps.has(propName)) {
            acc[propAliases[propName]] = value;
          }
        }
        return acc;
      },
      {} as any
    );
  }

  /**
   * Checks for toJSON method and returns value of toJSON or
   * value of property if it doesn't exist. The first condition
   * checks if property is an Array and calls getPropValue
   * recursively.
   * @param prop
   */
  private getPropValue(prop): any {
    if (prop instanceof Set) {
      prop = Array.from(prop);
    }
    if (Array.isArray(prop)) {
      return prop.map((p) => this.getPropValue(p));
    } else if (prop && prop.toJSON) {
      return prop.toJSON();
    } else if (prop !== null && prop !== undefined) {
      return prop;
    } else {
      return null;
    }
  }

  /**
   * Validate all the @Prop()s in this model by default. If a list of props are passed
   * validate those instead. This is still in progress
   * @param {string} propsToValidate
   * @returns {any}
   */
  public validate(...propsToValidate: (keyof this)[]): any {
    if (isEmpty(propsToValidate)) {
      // validate all the properties of this domain model
      propsToValidate = Reflect.getMetadata('modelProps', this);
    }

    const errorMap = reduce(
      propsToValidate,
      (acc, propName) => {
        const propErrorList = this.validateProp(propName);
        if (propErrorList) {
          acc[propName] = propErrorList;
        }
        return acc;
      },
      {} as any
    );

    return isEmpty(errorMap) ? null : errorMap;
  }

  /**
   * Throw a properly formatted BadRequestResourceError if validation fails
   */
  public validateWithBadRequestResourceException(): void {
    const errors = this.validate();
    if (errors) {
      let errorsArray = [];
      for (const field in errors) {
        errorsArray = errorsArray.concat(
          errors[field].map((error) => {
            return {
              code: 'invalid-format',
              payload: { ...error, field },
            };
          })
        );
      }

      throw new BadRequestResourceError({
        payload: { errors: errorsArray } as ResourceErrorPayload,
      });
    }
  }

  /**
   * Validate just one property by name. If propName is a nested model,
   * return the value of it's .validate() method
   * @param {string} propName
   * @returns {any}
   */
  public validateProp(propName: keyof this): any {
    if (this[propName] && isFunction(this[propName]['validate'])) {
      return this[propName]['validate']();
    } else {
      const validators = Reflect.getMetadata('validatorsMetadata', this, propName as string) || [];

      const propErrorList = reduce(
        validators,
        (acc, validator) => {
          const errorObj = validator.call(this, this[propName]);
          if (errorObj) {
            // return assign({}, acc, errorObj);
            acc.push(errorObj);
          }
          return acc;
        },
        [] as any
      );

      return isEmpty(propErrorList) ? null : propErrorList;
    }
  }
}
