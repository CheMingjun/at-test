/*!
 * sample型单元测试
 * Author: CheMingjun
 */

//@test.step
var start = function () {
    var ts = 'aaaaa';
    for (var i = 0; i < 10000; i++) {
        ts += 'aa';
    }
    return ts;
}