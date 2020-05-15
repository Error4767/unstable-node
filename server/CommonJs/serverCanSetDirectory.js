const http = require('http');
const fs = require('fs');
//配置
let config = {
	basePath: __dirname + '/这里是你的目录路径，记得前后加上斜杠表示是目录，此处我已经加了/'//默认路径
}
let {
	basePath = ''
} = config;
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};
let contentTypes = {
 "css": "text/css",
 "gif": "image/gif",
 "html": "text/html",
 "ico": "image/x-icon",
 "jpeg": "image/jpeg",
 "jpg": "image/jpeg",
 "js": "text/javascript",
 "json": "application/json",
 "pdf": "application/pdf",
 "png": "image/png",
 "svg": "image/svg+xml",
 "swf": "application/x-shockwave-flash",
 "tiff": "image/tiff",
 "txt": "text/plain",
 "wav": "audio/x-wav",
 "wma": "audio/x-ms-wma",
 "wmv": "video/x-ms-wmv",
 "xml": "text/xml"
}
const server = http.createServer((request,response)=>{
    let ip = getClientIp(request).substr(7);
    let url = request.url;
    // response.writeHead(200,{'Content-Type':'text/html'});
    if(url=='/') {
        response.writeHead(200,{'Content-Type':'text/html'});
         let ns = fs.readFile(basePath + 'index.html',(err, data)=>{
             if (err) {
                 //console.error(err);
                 console.log(`访问请求 从${ip}发起 状态->失败 ${err}`);
                 return;
             }
             console.log(`访问请求 从${ip}发起 状态->成功`);
             response.end(data);
         });
    }else if(url != '/') {
        //let surl = '.'+url;
        let surl = url;
        let type = surl.substr(surl.lastIndexOf(".")+1,surl.length);
        type = contentTypes[type] ? contentTypes[type] : 'text/' + type;
        response.writeHead(200,{'Content-type': type});
        console.log(__dirname + '/' + basePath + surl);
        let ns = fs.readFile(basePath + surl,(err, data)=>{
            if (err) {
                //console.error(err);
                console.log(`文件请求 ${url} 从${ip}发起 状态->失败 ${err}`);
                return;
            }
            console.log(`文件请求 ${url} 从${ip}发起 状态->成功`);
            response.end(data);
        });
    }

});
server.listen(8000);
