# pdd-182 服务器资源监控大屏

## 简介
全屏服务器资源监控看板，展示多台服务器的 CPU、内存、磁盘、网络流量等实时指标，底部卡片展示每台服务器的运行状态，异常服务器红闪提醒。

## 技术栈
- React 18 + TypeScript + Vite
- TailwindCSS
- ECharts (echarts-for-react)
- lucide-react

## 安装与运行

```bash
npm install
npm run dev
```

打开浏览器访问 `http://localhost:3000`。

## 功能
- 左侧：多台服务器 CPU 使用率折线图，实时滚动更新
- 中间：网络流量面积图，上行/下行双色区分
- 右侧：内存使用率仪表盘 + 磁盘使用率横向进度条
- 底部：服务器状态卡片，告警服务器红闪提醒
- 数据每 3 秒自动刷新模拟实时效果
