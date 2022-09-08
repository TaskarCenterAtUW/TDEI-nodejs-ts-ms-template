import 'reflect-metadata';

/**
 * A decorator to mark a properties of an object. This allows other classes and
 * decorators to know the names of all the properties of an object before they are
 * set. Because of the dynamicness of JavaScript it is not possible to do this at runtime
 * unless we use this decorator.
 *
 * If you pass a string to @Prop(). And the decorated class extends DomainObject it will
 * assume the name of the property in the Json payload is the string you passed
 *
 * @param {string} propName
 * @returns {(target: any, name: string) => void}
 * @constructor
 *
 * @Example
 *   ```typescript
 *   class Person {
 *     @Prop('first_name')
 *     public firstName;
 *   }
 *
 *   // because of the 'first_name' string DomainObject would expect a Json payload like the following:
 *   const person = new Person({first_name: 'John'});
 *   // which would result in
 *   console.log(person.firstName); // John
 *   ```
 */
export const Prop = function (propName?: string): (...args) => void {
  return function (target: any, name: string) {
    const modelProps = Reflect.getMetadata('modelProps', target) || [];
    const propAliases = Reflect.getMetadata('propAliases', target) || {};
    propAliases[name] = typeof propName === 'undefined' ? name : propName;

    Reflect.defineMetadata('propAliases', propAliases, target);
    Reflect.defineMetadata('modelProps', [...modelProps, name], target);
  };
};
