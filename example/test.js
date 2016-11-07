/*!
 * 
 * Author: CheMingjun
 */
require('./../index')(['./transaction.js', './sample.js']).then(function(report){
    console.log(report);
});