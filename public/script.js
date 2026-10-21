// 页面加载完成后，向服务器请求 /api/time 接口获取当前服务器时间并显示
fetch('/api/time')
  .then((response) => response.json())
  .then((data) => {
    document.getElementById('server-time').textContent = data.time;
  })
  .catch(() => {
    document.getElementById('server-time').textContent = '获取时间失败';
  });
