import {Oath, Resolve} from './oath';

const stringOathToNumberHandler: (param: string) => Oath<number> = (param) => {
  console.log(`this is the handler that takes a string "${param}" and returns an Oath<number>`);
  
  return new Oath((resolve) => {
    // esto no está funcionando, cuando se devuelven oaths el SIGUIENTE handler parece no saltar.
    console.log('ABOUT TO RESOLVE 19');
    setTimeout(() => {
      resolve(19);
    },0);// we need this for the Oath to work. I find it puzzling because we're already waiting in the Oath constructor.
    
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

const numberOath = original.then(stringOathToNumberHandler).then(extraHandler);
