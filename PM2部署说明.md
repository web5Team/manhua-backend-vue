# PM2 部署说明文档

## 1. 环境要求

- Node.js >= 8.9
- npm >= 3.0.0 或 yarn >= 1.0.0
- PM2 (全局安装)

## 2. 安装 PM2

```bash
# 使用 npm 安装
npm install -g pm2

# 或使用 yarn 安装
yarn global add pm2
```

## 3. 项目配置

### 3.1 环境变量配置

项目使用以下环境变量文件：

- `.env.development` - 开发环境
- `.env.staging` - 测试环境
- `.env.production` - 生产环境

### 3.2 PM2 配置文件

`ecosystem.config.js` 包含以下配置：

```javascript
module.exports = {
  apps: [
    {
      name: 'cartoon-admin',        // 应用名称
      script: 'node_modules/@vue/cli-service/bin/vue-cli-service.js',  // 启动脚本
      args: 'serve',                // 启动参数
      instances: 1,                 // 实例数量
      autorestart: true,           // 自动重启
      watch: false,                // 文件监听
      max_memory_restart: '1G',    // 内存限制
      env: {
        NODE_ENV: 'development',
        VUE_APP_BASE_API: 'http://localhost:8080/api'
      },
      env_staging: {
        NODE_ENV: 'staging',
        VUE_APP_BASE_API: 'http://test-api.example.com'
      },
      env_production: {
        NODE_ENV: 'production',
        VUE_APP_BASE_API: 'http://api.example.com'
      }
    }
  ]
};
```

## 4. 部署步骤

### 4.1 克隆项目

```bash
git clone <your-repo-url>
cd cartoon
```

### 4.2 启动项目

使用提供的启动脚本：

```bash
# 添加执行权限
chmod +x start.sh

# 启动项目
./start.sh
```

或手动执行：

```bash
# 安装依赖
yarn install

# 启动项目（生产环境）
pm2 start ecosystem.config.js --env production

# 保存进程列表
pm2 save
```

## 5. PM2 常用命令

### 5.1 进程管理

```bash
# 查看所有应用
pm2 list

# 查看应用详情
pm2 show cartoon-admin

# 重启应用
pm2 restart cartoon-admin

# 停止应用
pm2 stop cartoon-admin

# 删除应用
pm2 delete cartoon-admin
```

### 5.2 日志管理

```bash
# 查看实时日志
pm2 logs cartoon-admin

# 查看错误日志
pm2 logs cartoon-admin --err

# 查看输出日志
pm2 logs cartoon-admin --out

# 清空日志
pm2 flush cartoon-admin
```

### 5.3 监控

```bash
# 打开监控面板
pm2 monit

# 查看资源使用情况
pm2 status
```

## 6. 环境切换

```bash
# 开发环境
pm2 start ecosystem.config.js --env development

# 测试环境
pm2 start ecosystem.config.js --env staging

# 生产环境
pm2 start ecosystem.config.js --env production
```

## 7. 注意事项

1. **内存管理**
   - 默认内存限制为 1G
   - 可根据服务器配置调整 `max_memory_restart` 值

2. **自动重启**
   - 应用崩溃时自动重启
   - 可通过 `autorestart` 配置

3. **文件监听**
   - 默认关闭文件监听
   - 开发环境可设置 `watch: true`

4. **进程管理**
   - 默认启动 1 个实例
   - 可设置 `instances: 'max'` 启动多个实例

5. **日志管理**
   - 日志文件位于 `~/.pm2/logs/`
   - 建议定期清理日志文件

## 8. 故障排除

1. **应用无法启动**
   - 检查 Node.js 版本
   - 检查依赖安装
   - 查看错误日志

2. **内存占用过高**
   - 检查内存限制配置
   - 检查应用内存泄漏
   - 考虑增加服务器内存

3. **自动重启频繁**
   - 检查应用错误日志
   - 检查内存使用情况
   - 调整重启策略

## 9. 最佳实践

1. **环境配置**
   - 使用环境变量文件管理配置
   - 不同环境使用不同配置

2. **进程管理**
   - 生产环境使用 `instances: 'max'`
   - 配置合适的内存限制

3. **日志管理**
   - 定期清理日志文件
   - 配置日志轮转

4. **监控告警**
   - 配置 PM2 监控
   - 设置资源使用告警

## 10. 参考资料

- [PM2 官方文档](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Vue CLI 部署指南](https://cli.vuejs.org/guide/deployment.html)
- [Node.js 最佳实践](https://github.com/goldbergyoni/nodebestpractices) 