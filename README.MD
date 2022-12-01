# vite-plugin-appinfo

> Automatically insert the version or git_info in your app

自动将应用版本信息、git相关信息插入到你的应用中，方便做追溯。

<p align="center">
  <img src="https://img.shields.io/npm/dm/vite-plugin-appinfo" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vite-plugin-appinfo"><img src="https://img.shields.io/npm/v/vite-plugin-appinfo.svg" alt="Version"></a>
  <a href="https://github.com/BWrong/vite-plugin-appinfo/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/vite-plugin-appinfo.svg" alt="License"></a>
</p>

## Demo
支持console.log、meta、全局变量三种方式，默认开启meta，如果环境没有git，这无法插入git相关信息。
```json
{
    "name": "antd-vue3",
    "version": "0.1.2",
    "buildTime": "2022-12-01 16:08:06",
    "commitHash": "46c059d",
    "describe": "v0.1.2-147-g46c059d",
    "branch": "main",
    "buildUser": "bwrong"
}
```

## Install
```sh
yarn add -D vite-plugin-appinfo
# OR npm install -D vite-plugin-appinfo
```

## Usage
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vitePluginAppinfo from 'vite-plugin-appinfo'

export default defineConfig({
  plugins: [
    vitePluginAppinfo({
      showBuildUser: true
    })
  ],
})
```

## Config

- `showBuildUser` - 显示打包的用户 (`false` by default)
- `enableMeta` - 添加 \<meta name="app-info" content="{app-info}"> 到 \<head>中 (`true` by default)
- `enableLog` - Console打印 (`false` by default)
- `enableGlobal` - 设置全局变量 *\`__APP_INFO__\`* . (`true` by default)
