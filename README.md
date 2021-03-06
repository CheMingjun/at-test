#at-test(基于注释的JS单元测试框架)
>Base on [at-js](https://github.com/CheMingjun/at-js)

##使用方法
###安装
```
    npm install at-test --save-dev
```
###示例一
1. 假设您的module文件结构是这样的:
```html
-myModule
    |-node_modules
    |-test1.js
    |-main.js
    |-package.json
```
2. 文件test1.js的内容:
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
3. 文件main.js的内容:
```js
require('at-test')(['./test1.js']).then(function(report){
    console.log(report);
});
```
4. 运行
```
    node main.js
```

###示例二：复杂测试
module中的test.js中，代码修改成：

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

###示例三：测试文件自动扫描
1. module文件结构如下:
```html
-myModule
    |-node_modules
    |-folder0
        |-a.test.js
    |-folder1
        |-b.test.js
    |-main.js
    |-package.json
```
> 在module的除node_modules外的任意位置，
创建任意名称后缀为.test.js的单元测试文件
2. 文件main.js的内容:
```js
require('at-test')().then(function(report){
    console.log(report);
});
```
4. 运行
```
    node main.js
```

> 欢迎提issue，或者直接联系作者即时交流(微信号:ALJZJZ) 
