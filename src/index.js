let Promise = require('./Promise');
let fs = require('fs');

new Promise((resolve, reject) => {
  fs.readFile('xxx.text', 'utf8', (error, data) => {
    if (error) {
      console.log('error', error);
      reject(error);
    }
    resolve(data);
  })
}).then(data => {
  console.log('promise then');
}, error => {
  console.log('i reject you', error);
  throw ("i throw error on purpose")
}).catch(error => {
  console.log('here is the catch error', error);
})