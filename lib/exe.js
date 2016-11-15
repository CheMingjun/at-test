/*!
 *
 * Author: CheMingjun
 */
'use strict';
const MN = 'Toybricks-test';
var path = require('path'), util = require('util');
module.exports = function*(_fileAry) {
    var btFile = (function () {
        var pt = module.parent, rtn = pt ? pt.filename : __filename;
        while (pt != null) {
            rtn = pt ? pt.filename : __filename;
            pt = pt.parent;
        }
        if (!rtn) {
            throw new Error('Toybricks test init error.');
        }
        return rtn;
    })(), exe = function*(_name, _fn) {
        var t0 = new Date().getTime(), t1;
        try {
            var ts = yield _fn();
            t1 = new Date().getTime();
            var cost = t1 - t0;
            var msg = '[' + MN + '] [' + _name + '] passed, cost ' + cost + 'ms'
                + (typeof ts !== 'undefined' ? ' => ' + (typeof ts === 'object' ? JSON.stringify(ts) : ts) || '' : '');
            logger.info(msg);
            return {
                name: _name, suc: true, msg: msg, cost: cost
            }
        } catch (_ex) {
            t1 = new Date().getTime();
            var cost = t1 - t0;
            var msg = '[' + MN + '] [' + _name + '] failed, cost ' + cost + 'ms.';
            logger.error(msg);
            logger.error(_ex.stack || _ex);
            return {
                name: _name, suc: false, msg: msg + (_ex.stack || _ex), cost: cost
            }
        }
    }, sReport = [];
    btFile = /.js$/.test(btFile) ? btFile.substring(0, btFile.lastIndexOf('.js')) : btFile;
    btFile = btFile.substring(0, btFile.lastIndexOf(path.sep));
    if (util.isArray(_fileAry)) {
        for (var i = 0; i < _fileAry.length; i++) {
            var fPath = _fileAry[i];
            if (/^.\//ig.test(fPath)) {
                fPath = path.join(btFile, fPath)
            }
            var js = require(fPath);
            if (!js || typeof js !== 'object') {
                throw new Error('Build test file[' + fPath + '] error.');
            }
            var suc = 0, fal = 0, dReport = [], pro = function (_info) {
                dReport.push(_info);
                if (_info.suc) {
                    suc++;
                } else {
                    fal++;
                }
            };
            logger.info('\n');
            logger.warn('[' + MN + ']----Test File[' + fPath + '] begining...');
            if (js.start) {
                pro(yield exe('Start', js.start));
            }
            for (var j = 0; j < js.step.length; j++) {
                pro(yield exe('Step ' + j, js.step[j]));
            }
            if (js.finish) {//////TODO
                pro(yield exe('Finish', js.finish));
            }
            var count = (js.start ? 1 : 0) + js.step.length + (js.finish ? 1 : 0);
            sReport.push({
                file: fPath,
                count: count,
                suc: suc,
                failed: fal,
                info: ' File[' + fPath + '], success ' + suc + '(' + count + '),failed ' + fal + '(' + count + ').',
                detail: dReport
            });
        }
        logger.warn('----Report------------------------------------------------');
        sReport.forEach(function (_sm) {
            if (_sm.failed > 0) {
                logger.error(_sm.info);
            } else {
                logger.info(_sm.info);
            }
        })
        return sReport;
    }
}
//--------------------------------------------------------------------------------------
'@logger';
var logger = function () {
    var logColor = {
        'INFO': '\x1b[32m', 'WARN': '\x1b[33m', 'ERROR': '\x1b[31m', 'TRACE': '\x1b[34m'
    }, lfn = function (_t, _m) {
        if (/^(\n)*$/ig.test(_m)) {
            console.log(_m);
        } else {
            console.log(logColor[_t] + '[' + _t + ']' + _m, '\x1b[0m');
        }
    }
    return {
        trace: function (_msg) {
            lfn('TRACE', _msg);
        }, debug: function (_msg) {
            lfn('TRACE', _msg);
        }, info: function (_msg) {
            lfn('INFO', _msg);
        }, warn: function (_msg) {
            lfn('WARN', _msg);
        }, error: function (_msg) {
            lfn('ERROR', _msg);
        }
    }
}();