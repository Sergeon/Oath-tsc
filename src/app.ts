import {Oath, Resolve} from './oath';

new Oath(function(resolve: Resolve<string>){
  setTimeout(() => {
    resolve('end of setTimeout');
  },2000);
});