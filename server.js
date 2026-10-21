// =============================================
// Hello World 网站服务器（零第三方依赖，Node.js 原生实现）
// 功能：
//   1. 提供 public/ 下的静态页面
//   2. 提供 /api/time 接口，返回当前服务器时间
// 启动：node server.js  （或 npm start）
// 访问：http://localhost:3000
// =============================================

const http = require('http');
const fs = require('fs');
const path = require('path');

// 端口：默认 3000，可通过环境变量 PORT 覆盖（如 PORT=8080 node server.js）
const PORT = process.env.PORT || 3000;

// 静态资源根目录
const PUBLIC_DIR = path.join(__dirname, 'public');

// 静态文件扩展名与 MIME 类型的映射
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // ---------- 接口 1：返回当前服务器时间 ----------
  if (url.pathname === '/api/time') {
    const now = new Date();
    const body = JSON.stringify({
      // 按中国时区（UTC+8）格式化，若想显示服务器自身时区，可去掉 timeZone 选项
      time: now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
      timestamp: now.getTime()
    });
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(body);
    return;
  }

  // ---------- 接口 2：提供静态文件 ----------
  // 根路径 "/" 默认返回 index.html
  const requestPath = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.join(PUBLIC_DIR, requestPath);

  // 安全校验：防止路径穿越（如 /../etc/passwd）
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // 文件不存在
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Hello World 网站已启动，请在浏览器打开：`);
  console.log(`   http://localhost:${PORT}`);
});
