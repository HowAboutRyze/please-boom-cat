const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const file = new FileSync('game.json');
const db = lowdb(file);
db._.mixin({
  like(array, predicate){
    Object.keys(predicate).forEach(item => {

    });
  }
})
const result = db.get('user')
  .filter(item => {
    return item.userId && item.userId.indexOf('3')>-1;
  })
  .value();

console.log(result);
