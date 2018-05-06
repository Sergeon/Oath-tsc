/**
 * 
 * This is some sort of a Promise implementation. 
 * 
 * I made this for fun. This module is not intended to be used in production.
 */
 import {EventEmitter} from 'events';

type Resolve<T> = (subject: T) => void;

class Oath<T>{

  emitter: EventEmitter;
  value: T|null = null;
  callbacks = [] as Function[];
  constructor(callback: (resolve: Resolve<T>) => void) {
    this.emitter = new EventEmitter;
    
    this.emitter.on('resolve', (payload: T) => {
      this.value = payload;
      console.log('Oath resolved:');
      console.log(payload);
      this.callbacks.forEach( (cb) => {
        cb(payload);
      } );
    });

    const resolveFunction = (payload: T) => {
      this.emitter.emit('resolve', payload);
    }

    callback(resolveFunction);
  }

  then(callback: (payload: T) => Oath<T>| null): Oath<T>|null {
    this.callbacks.push(callback);
    return null;
  }

}

export {Oath, Resolve};
