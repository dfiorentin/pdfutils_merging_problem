
function beforeRender (req, res, done) {
var operations = [];
//After the first execution this is not empty!
console.log('operationsPRE:',JSON.stringify(req.template.pdfOperations,null,4))

if(isTrue() ) {
//Add report 1 and report 2
        operations.push({
            "type": "append",
            "templateShortid": "Ske32R8OVN",
            "mergeToFront": false,
            "renderForEveryPage": false,
            "mergeWholeDocument": false
        });
        operations.push({
            "type": "append",
            "templateShortid": "BkgPpR8u44",
            "mergeToFront": false,
            "renderForEveryPage": false,
            "mergeWholeDocument": false
        });
    }
else {
//Add report 2
        operations.push({
            "type": "append",
            "templateShortid": "BkgPpR8u44",
            "mergeToFront": false,
            "renderForEveryPage": false,
            "mergeWholeDocument": false
        });
    }
    
req.template.pdfOperations = operations;

console.log('operations:',JSON.stringify(req.template,null,4))
done();
//Change it to true or false to test merging template changing
function isTrue(){
    return  true
}

}