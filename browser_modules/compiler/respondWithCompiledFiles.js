module.exports = function (response, request, compilerOptions) {
    var compile = require('./compile.js');
    
    compilerOptions.callback = function (err, src) {
        if(err) {
            response.writeHead(500, {'Content-Type' : 'text/plain'});
            response.write(err, 'utf8');
        } else {
            response.writeHead(200, {'Content-Type' : 'text/javascript'});
            response.write(src, 'utf8');
        }
        response.end();
    }
    
    compile(compilerOptions);
};