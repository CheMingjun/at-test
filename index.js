/*!
 * 
 * Author: CheMingjun
 */
'use strict';
/**
 * define a file annotations
 */
var util = require('util'),fs = require('fs'),path = require('path');
require('at-js').define('test.\\S+', {
    scope: 'file', build: function () {
        var start = null, step = [], finish = null;
        return {
            which: {
                'test.start': function (_ctx, _argAry) {
                    start = "function*(){return " + (_ctx.refType==='generator' ? 'yield ' : '') + _ctx.refName + "();}";
                }, 'test.step': function (_ctx, _argAry) {
                    step.push("function*(){return " + (_ctx.isGenerator ? 'yield ' : '') + _ctx.refName + "();}");
                }, 'test.finish': function (_ctx, _argAry) {
                    finish = "function*(){return " + (_ctx.isGenerator ? 'yield ' : '') + _ctx.refName + "();}";
                }
            }, script: function () {
                return "module.exports = {" + (start ? ("start:" + start + "," ) : '') + "step:[" + step.join(',') + "]" + (finish ? (",finish:" + finish) : '') + "}";
            }
        }
    }
})
/**
 * test files
 * @param _v ['./test/t0.js','./test/t1.js']
 * @returns {{then: then}}
 */
module.exports = function (_v) {
    _v = _v||'test.js$';
    var comp = null, onErr = null,pro = function(_v){
        var gen = require('./lib/exe')(_v);
        require('co')(gen).then(function (_report) {
            comp && comp(_report);
        }, function (_err) {
            onErr && onErr(_err);
        })
    };
    if(util.isArray(_v)){//test files in array
        pro(_v);
    }else if(typeof _v ==='string'){//test files by ext name
        var bsFilePath = (function () {
            let pt = module.parent, rtn = pt ? pt.filename : __filename;
            while (pt != null) {
                rtn = pt ? pt.filename : __filename;
                pt = pt.parent;
            }
            if (!rtn) {
                throw new Error('Toybricks init error.');
            }
            return rtn;
        })();

        var dirPath = path.dirname(bsFilePath);
        var ts = './', tp = path.join(dirPath, ts + 'package.json');
        while (tp != '' && !fs.existsSync(tp)) {
            ts += '../';
            tp = path.join(dirPath, ts + 'package.json')
        }
        //------------------------------------------------------------------------------
        var fAry = [],reg = new RegExp(_v),parse = function(mdPath){
            let dirs = fs.readdirSync(mdPath);
            dirs.forEach(function (filename, _index) {
                let tp = path.join(mdPath, filename);
                let _stats = fs.statSync(tp);
                if (_stats.isDirectory()&&filename!=='node_modules') {
                    parse(tp);
                }else if(reg.test(filename)){
                    fAry.push(tp)
                }
            });
        }
        parse(path.dirname(tp));
        if(fAry.length>0){
            pro(fAry);
        }
    }

    return {
        then: function (_comp, _err) {
            comp = _comp;
            onErr = _err;
        }
    }
};


