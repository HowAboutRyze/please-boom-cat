# please-boom-cat

一个爆炸猫游戏

基于 Egg + Vue + socket.io + Webpack SSR 服务端渲染和 CSR 前端渲染工程骨架项目。

## QuickStart

- Development

```bash
$ npm install
$ npm run dev
$ open http://localhost:7001
```

> 开发过程中多次启动应用，可能会导致 7001 端口进程未关闭，影响开发，可以使用 `npm run kill 7001` 干掉端口进程

- Publish

```bash
npm run tsc
npm run build
npm start
```

## 效率

### 前端开发代码片段

1. vue 文件中输入 `cvue` 然后按 tab 键即可输出组件 vue 模板
2. ts 文件中输入 `cts` 然后按 tab 键即可输出组件 ts 模板

## 参考技术文档

- https://www.yuque.com/easy-team/egg-vue
- https://www.yuque.com/easy-team/easywebpack
- https://easyjs.cn

## Rendering

- Front-End TypeScript

![Front-End TypeScript](https://github.com/easy-team/egg-vue-typescript-boilerplate/blob/master/docs/images/vue-front-end.png?raw=true)

- Node TypeScript

![Node TypeScript](https://github.com/easy-team/egg-vue-typescript-boilerplate/blob/master/docs/images/vue-node.png?raw=true)

## TypeScript

- https://github.com/kaorun343/vue-property-decorator
- https://github.com/ktsn/vuex-class


## License

[MIT](LICENSE)
