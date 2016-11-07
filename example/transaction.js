/*!
 * 事务型单元测试
 * Author: CheMingjun
 */
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
        delExt(rtn);
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

/**
 * Extention for delete an object
 */
'@extention';
var delExt = function(_itemObj){}