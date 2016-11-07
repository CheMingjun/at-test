/*!
 * 
 * Author: CheMingjun
 */
'use strict';
/**
 * define a file annotations
 */
require('at-js').defAnnotation('test', {
    scope: 'file', build: function () {
        var start = null, step = [], finish = null;
        return {
            which: {
                'start': function (_ctx, _argAry) {
                    start = "function*(){return " + (_ctx.isGenerator ? 'yield ' : '') + _ctx.refName + "();}";
                }, 'step': function (_ctx, _argAry) {
                    step.push("function*(){return " + (_ctx.isGenerator ? 'yield ' : '') + _ctx.refName + "();}");
                }, 'finish': function (_ctx, _argAry) {
                    finish = "function*(){return " + (_ctx.isGenerator ? 'yield ' : '') + _ctx.refName + "();}";
                }
            }, script: function () {
                return {
                    exports: "{" + (start ? ("start:" + start + "," ) : '') + "step:[" + step.join(',') + "]" + (finish ? (",finish:" + finish) : '') + "}"
                }
            }
        }
    }
})
/**
 * test files
 * @param _fileAry ['./test/t0.js','./test/t1.js']
 * @returns {{then: then}}
 */
module.exports = function (_fileAry) {
    var comp = null, onErr = null;
    var gen = require('./lib/exe')(_fileAry);
    require('co')(gen).then(function (_report) {
        comp && comp(_report);
    }, function (_err) {
        onErr && onErr(_err);
    })
    return {
        then: function (_comp, _err) {
            comp = _comp;
            onErr = _err;
        }
    }
};


