import 'reflect-metadata';

/**
 * A decorator to mark a properties of an object. This allows other classes and
 * decorators to know the names of all the properties of an object before they are
 * set. Because of the dynamics of JavaScript it is not possible to do this at runtime
 * unless we use this decorator.
 *
 * If you pass a string to @Prop(). And the decorated class extends AbstractDomainEntity it will
 * assume the name of the property in the Json payload is the string you passed
 *
 * @param {string} propName
 * @returns {(target: any, name: string) => void}
 * @constructor
 *
 * @Example
 *   ```typescript
 *   class Event {
 *     @Prop('event_name')
 *     public eventName;
 *   }
 *
 *   // because of the 'event_name' string AbstractDomainEntity would expect a Json payload like the following:
 *   const theEvent = new Event({eventName: 'GTFS Upload'});
 *   // which would result in
 *   console.log(theEvent.eventName); // GTFS Upload
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
