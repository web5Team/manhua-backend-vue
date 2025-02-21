# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# 打包与部署

# 1. **概述**

本文档旨在指导开发人员如何对前端项目进行打包和部署。

# 2. **环境准备**

在开始之前，请确保以下工具已安装：

* Node.js(项目使用版本: v20.9.0)
* npm 或 yarn

* Git

# 3. **项目结构**

```shell
tg-cargame-frontend/

├── bot/

├── public/

├── src/

├── package.json

├── vue.config.js

└── ...
```

# 4. ** 打包流程**

## 4.1. ** 安装依赖**

**在项目根目录下运行以下命令安装依赖：**

```bash
npm install
# 或
yarn install
```


## 4.2. ** 执行打包**

**运行以下命令进行打包：**

```bash
npm run build
# 或
yarn build
```


打包完成后，生成的静态文件将位于 `dist/ `目录下。

# 5. ** 部署流程**

将文件夹`dist`目录下所有的文件复制放到服务器对应的文件夹下即可。
