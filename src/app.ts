import {Oath, Resolve} from './oath';

const stringOathToNumberHandler: (param: string) => Oath<number> = (param) => {
  console.log(`this is the handler that takes a string "${param}" and returns an Oath<number>`);
  
  return new Oath((resolve) => {
      resolve(19);
  })
}

const extraHandler: (param:number) => boolean = (param)  => {
  console.log(`this is the extra handler. This takes a number ${param} and returns a boolean`);
  return true;
}

const original = new Oath(function(resolve: Resolve<string>){
  setTimeout(() => {
    console.log('ABOUT TO RESOLVE THE ORIGINAL STRING:');
    resolve('original value');
  },200);
});

const numberOath = original.then(stringOathToNumberHandler).then(extraHandler).then(console.log);
