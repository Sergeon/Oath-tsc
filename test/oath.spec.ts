import {Oath} from '../src/oath';
import {EventEmitter} from 'events';

const PLAIN_VALUE = 'the value';
const RESOLVE_EVENT = 'custom-resolve';

describe('Oath.ts', function(){
  describe('then() handlers', function(){

    it('a \'then\' handler is invoked when an oath resolves', async (done) => {

      // given
      const handler = jest.fn();
      const emitter = new EventEmitter();
  
      const oath = new Oath<string>((resolve) => {
        emitter.on(RESOLVE_EVENT, function(){
          resolve(PLAIN_VALUE);
        });
      });

      oath.then(handler);
      
      // when
      emitter.emit(RESOLVE_EVENT);

      // then
      await Promise.resolve();
      expect(handler).toHaveBeenCalledWith(PLAIN_VALUE);
      done();
    });

    it(`a 'then' handler is called asynchronously when its Oath resolves,
    so it don't get called until the next tick`, async () => {

      // given
      const handler = jest.fn();
      const emitter = new EventEmitter();
  
      const oath = new Oath<string>((resolve) => {
        emitter.on(RESOLVE_EVENT, function(){
          resolve(PLAIN_VALUE);
        });
      });

      oath.then(handler);
      
      // when
      emitter.emit(RESOLVE_EVENT);

      // then
      expect(handler).not.toHaveBeenCalledWith(PLAIN_VALUE);

    });

    it('a then call returns a new Promise from its handler return value', async (done) => {

      // given
      const oath = new Oath<string>(async (resolve) => {
        resolve('');
      });

      const mock = jest.fn();

      const handler = () => PLAIN_VALUE;

      oath.then(handler).then(mock);

      await Promise.resolve();
      await Promise.resolve();
      
      expect(mock).toHaveBeenCalledWith(PLAIN_VALUE);
      done();

    });

    

    describe('when a then() is called on a fulfilled Oath ', () => {

      it('when it is not a thenable, returns an Oath of the fullfillment value', async (done) => {
  
        // given
        const oath = new Oath<string>((resolve) => {
          resolve(PLAIN_VALUE);
        });
        const handler = jest.fn();
  
        // when
        await 0;
        oath.then(handler);
        await 0;
  
        // then
        expect(handler).toHaveBeenCalledWith(PLAIN_VALUE);
        done();
      });

      it('when it is a thenable, flattens the fullfillment thenable and returns an Oath of it', async (done) => {
        // given
        const promise = Promise.resolve(PLAIN_VALUE);
        const oath = new Oath<Promise<string>>((resolve) => {
          resolve(promise);
        });
        const handler = jest.fn();
  
        // when
        await 0;
        oath.then(handler);
        await 0;
  
        // then
        expect(handler).toHaveBeenCalledWith(PLAIN_VALUE);
        done();
      });
    });

    it('an oath that resolves to an oath, returns the oath itself -instead of a metaoath-', async (done) => {
      // given

      const resolvedOath = new Oath<string>( (resolve) => {
        resolve('');
      })
      const oath = new Oath((resolve) => {
        resolve(resolvedOath);
      });


      const spy = jest.fn();
      // when
      oath.then(spy);

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      // then
      expect(spy).toHaveBeenCalledWith(resolvedOath);
      done();

    });

    it('a then handler that returns an oath, returns the oath itself -instead of a metaoath-', async (done) => {
      // given
      const oath = new Oath((resolve) => {
        resolve(PLAIN_VALUE);
      });

      const handler = (val: any) => new Oath((resolve)=> {
        resolve(val);
      });

      const spy = jest.fn();
      // when
      oath.then(handler).then(spy);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      // then
      expect(spy).toHaveBeenCalledWith(PLAIN_VALUE);
      done();

    });


    describe('callback aggregation', () => {
      it('when an oath have several callbacks, all of them are called with the fulfillment value', async (done) =>  {
        // given
        const emitter = new EventEmitter();

        const oath = new Oath((resolve) => {
          emitter.on(RESOLVE_EVENT, () => {
            resolve(PLAIN_VALUE);
          });
        });

        const firstHandler = jest.fn();
        const secondHandler = jest.fn();
        const thirdHandler = jest.fn();

        oath.then(firstHandler);
        oath.then(secondHandler);
        oath.then(thirdHandler);

        // when
        emitter.emit(RESOLVE_EVENT);

        // then
        await Promise.resolve();
        expect(firstHandler).toHaveBeenCalledWith(PLAIN_VALUE);
        expect(secondHandler).toHaveBeenCalledWith(PLAIN_VALUE);
        expect(thirdHandler).toHaveBeenCalledWith(PLAIN_VALUE);
        done();


      });
    });
  });
});
