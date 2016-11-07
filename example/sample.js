/*!
 * sample型单元测试
 * Author: CheMingjun
 */
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