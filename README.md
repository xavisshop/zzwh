# 章振威新闻网

这是一个基于 Node.js (Express) 和 MySQL 的新闻网站，前端使用纯 HTML、CSS 和 JavaScript 实现。它旨在提供一个类似 Discourse 的新闻发布和浏览体验，并支持 Docker 一键部署。

## 项目结构

```
. 
├── README.md
├── package.json
├── server.js
├── db.js
├── routes/
│   └── news.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Dockerfile
└── docker-compose.yml
```

## 功能特性

- **新闻列表**: 显示所有新闻，支持分类筛选。
- **新闻详情**: 查看新闻的详细内容。
- **添加新闻**: 通过表单添加新的新闻。
- **删除新闻**: 删除已发布的新闻。
- **响应式设计**: 适应不同设备屏幕。

## 技术栈

- **前端**: HTML5, CSS3, JavaScript
- **后端**: Node.js, Express.js
- **数据库**: MySQL
- **部署**: Docker, Docker Compose

## 本地开发环境搭建

### 1. 克隆仓库

```bash
git clone https://github.com/xavisshop/zzwh.git
cd zzwh
```

### 2. 数据库设置

请确保你已安装 MySQL 数据库。创建一个名为 `news_db` 的数据库，并配置 `db.js` 中的数据库连接信息。

### 3. 安装依赖

```bash
npm install
```

### 4. 运行后端服务

```bash
node server.js
```

### 5. 访问前端

在浏览器中打开 `public/index.html` 文件，或者通过后端服务访问。

## Docker 一键部署

### 1. 安装 Docker 和 Docker Compose

请根据你的操作系统安装 Docker 和 Docker Compose。

### 2. 构建和运行

在项目根目录下执行：

```bash
docker-compose up --build -d
```

这将构建 Docker 镜像，启动 Node.js 应用容器和 MySQL 数据库容器。

### 3. 访问应用

应用将在 `http://localhost:3000` 上运行。

## API 文档

### 新闻 API

- `GET /api/news`: 获取所有新闻。
- `GET /api/news/:id`: 获取指定 ID 的新闻。
- `POST /api/news`: 添加新新闻。
  - Request Body:
    ```json
    {
      "title": "新闻标题",
      "category": "新闻分类",
      "author": "作者",
      "image": "图片URL",
      "summary": "新闻摘要",
      "content": "新闻内容"
    }
    ```

- `DELETE /api/news/:id`: 删除指定 ID 的新闻。
