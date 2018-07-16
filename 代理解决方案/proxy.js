
var http = require('http'),
    httpProxy = require('http-proxy');
 
//
// Create a proxy server with latency
//
var proxy = httpProxy.createProxyServer();
 
var reqNum  = 0; // 缓存目前请求的数量
 
 
 
proxy.on("proxyRes",()=>{
    reqNum --;
    console.log("完成一个请求,当前的剩余的请求数量是 "+reqNum);
})
proxy.on("proxyReq",()=>{
    reqNum++;
    console.log("接收到一个请求,当前的请求数量是 "+reqNum);
})
 
//
// Create your server that makes an operation that waits a while
// and then proxies the request
//
http.createServer(function (req, res) {
    // This simulates an operation that takes 500ms to execute
    setTimeout(function () {
        proxy.web(req, res, {
            target: 'http://localhost:9008'
        },(e)=>{
           console.log("proxy error call back ");
           console.log(e);
        });
    }, 10);
}).listen(8008);
 
//
// Create your target server
//
http.createServer(function (req, res) {
    setTimeout(()=>{
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
        res.end();
    },10*1000)
}).listen(9008);