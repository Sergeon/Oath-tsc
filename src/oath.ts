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
  constructor(callback: (resolve: Resolve<T>) => void) {
    this.emitter = new EventEmitter;
    
    this.emitter.on('resolve', (payload: T) => {
      this.value = payload;
      console.log('Oath resolved:');
      console.log(payload);
    });

    const resolveFunction = (payload: T) => {
      this.emitter.emit('resolve', payload);
    }

    callback(resolveFunction);
  }

}

export {Oath, Resolve};