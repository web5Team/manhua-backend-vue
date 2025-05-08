#!/bin/bash

# 安装依赖
echo "Installing dependencies..."
#yarn install

# 使用pm2启动项目
echo "Starting application with PM2..."
pm2 start ecosystem.config.js --env development

# 保存pm2进程列表
pm2 save

echo "Application started successfully!" 