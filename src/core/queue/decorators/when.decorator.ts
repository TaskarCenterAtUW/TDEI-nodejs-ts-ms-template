import 'reflect-metadata';

// This class is right now competent but not yet final
// Down the lane, the parameter has to change to a class
// This way, the conversion of the event to respective class can
// be easily handled
export function when(eventName:string) {
    // console.log("first(): factory evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const eventHandlerMap = Reflect.getMetadata('eventHandlers', target) || new Map();
    const eventHandlers = eventHandlerMap.get(eventName) || [];
    eventHandlers.unshift({ handler: target[propertyKey] });
    eventHandlerMap.set(eventName, eventHandlers);
    Reflect.defineMetadata('eventHandlers', eventHandlerMap, target);
    };
  }