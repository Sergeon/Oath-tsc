import {Oath, Resolve} from './oath';

const a = new Oath(function(resolve: Resolve<string>){
  setTimeout(() => {
    resolve('end of setTimeout');
  },2000);
});
a.then( str => {
  console.log('inside the thenable handler:' + str);
  return null;
});

a.then( str => {
  console.log('the second thenable also triggers: ' + str);
  return null;
})