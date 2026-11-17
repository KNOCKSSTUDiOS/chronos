const http = require('http');
const fs = require('fs');
const path = require('path');
const root = 'C:\\\\KNOCKSSTUDiOS\\\\VORTEX_7';
const mime = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.mp4':'video/mp4', '.webm':'video/webm', '.mov':'video/quicktime', '.webmanifest':'application/manifest+json' };
http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  let fp = path.join(root, rel);
  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); return res.end(); }
  let stat = fs.statSync(fp);
  let ext = path.extname(fp).toLowerCase();
  let ct = mime[ext] || 'application/octet-stream';
  let range = req.headers.range;
  if (range) {
    let parts = range.replace(/bytes=/, '').split('-');
    let start = parseInt(parts[0], 10);
    let end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + stat.size, 'Accept-Ranges': 'bytes', 'Content-Length': (end - start) + 1, 'Content-Type': ct });
    fs.createReadStream(fp, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Length': stat.size, 'Accept-Ranges': 'bytes', 'Content-Type': ct });
    fs.createReadStream(fp).pipe(res);
  }
}).listen(8765, '127.0.0.1');
