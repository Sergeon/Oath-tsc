/**
 *
 * This is some sort of a Promise implementation.
 *
 * I made this for fun. This module is not intended to be used in production.
 */
 import {EventEmitter} from 'events';

 type Resolve<T> = (subject: T) => void;

 class Oath<T> {
  public value: T|null = null;
  public callbacks = [] as Function[];
  constructor(callback: (resolve: Resolve<T>) => void) {

    const resolveFunction = async (payload: T) => {
      await 0;
      
      this.value = payload;

      this.callbacks.forEach((cb) => {
          cb(payload);
      });

    };
    callback(resolveFunction);
  }

  public then<N>(callback: (payload: T) => Oath<N>): Oath<N>;
  public then<N>(callback: (payload: T) => N): Oath<N>;
  public then<N>(callback: (payload: T) => void): Oath<N>;
  public then<N>(callback: Function): Oath<N> {
    return !!this.value ? this.flatOath(callback) : this.pendingOath(callback);
  }
  
  private flatOath<T>(callback: Function): Oath<T> {

    if (this.value && (this.value as any).then) {
      return (this.value as any as Oath<T>).then((resolvedValue: T) => {
        return callback(resolvedValue);
      });
    } else {
      return new Oath((resolve) => {
        resolve(callback(this.value));
      });
    }
  }

  private pendingOath<N>(callback: Function): Oath<N> {
    const self = this;
    return new Oath<N>( (resolve: Resolve<N>)  => {
      self.callbacks.push((payload: T) => {

        const callbackResult = callback(payload);
        if (callbackResult && callbackResult.then) {
          callbackResult.then( (result: N) => {
            resolve(result);
          });
        } else {
          resolve(callbackResult);
        }
      });
    });
  }
}

 export {Oath, Resolve};
