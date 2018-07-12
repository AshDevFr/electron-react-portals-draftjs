# electron-react-portals-draft

Based on `electron-react-boilerplate` (https://github.com/chentsulin/electron-react-boilerplate)

The draft version used in this POC is from `brandcast/draft-js-built`, it fixes an issue with draft-js: https://github.com/facebook/draft-js/issues/1640


## Install

```bash
$ yarn
```
**Note**: If you can't use [yarn](https://github.com/yarnpkg/yarn), run `npm install`.

## Run

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
$ npm run dev
```

Alternatively, you can run the renderer and main processes separately. This way, you can restart one process without waiting for the other. Run these two commands **simultaneously** in different console tabs:

```bash
$ npm run start-renderer-dev
$ npm run start-main-dev
```
