#at-test
>The node unit test framework base on [at-js](https://github.com/CheMingjun/at-js)

##Useage
###Sample test
1. Install at-test module: `npm install at-test --save-dev` 
2. Create test1.js and main.js files,your module's structure may looks like this:
```html
-myModule
    |-node_modules
    |-test1.js
    |-main.js
    |-package.json
```
2. Here is the content of test1.js file:
```js
var assert = require('assert');

'@test.step';
var t0 = function () {
    var ts = 'aaaaa';
    for (var i = 0; i < 10000; i++) {
        ts += 'aa';
    }
    return ts;
}

'@test.step';
var t1 = function () {
    var t = 900;
    t = 900/9;
    assert.equal(t,100);
}
```
3. And main.js is:
```js
require('at-test')(['./test1.js']).then(function(report){
    console.log(report);
});
```
4. Run or debug main.js,you will get the test report.

###Transaction test
In at-test,you can describe transactional test like this:
```js
var assert = require('assert');
var ds = null;

'@test.start';
var start = function () {
    ds = {};
}

'@test.step(timeout=2000)';
var test0 = function* () {
    ds.test0 = 'finish';
    var rtn = yield (function(){
        return function(_next){
            setTimeout(function(){
                _next(null,3);
            },2000)
        }
    })();
    assert.equal(rtn,3);
}

'@test.step';
var test1 = function () {
    ds.test1 = 'finish';
    return ds;
}

'@test.finish';
var fh = function () {
    ds = null;
}

module.exports = {
    deleteItem:function*(_itemObj){
        yield dao.del(_itemObj);
        return {suc:true};
    }
}
/**
 * Annotation for dao
 */
'@dao'
var dao = function(){
    throw new Error('No one implement me?oh my God....');
}
```