## vite 快的原因

利用浏览器原生 ES 模块的支持，实现开发阶段的 Dev Server，进行模块的按需加载，而不是先整体打包再进行加载

## 初识配置

### root

如果想把`index.html`放到 src 目录下配置如下

`vite.config.ts`

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: path.join(__dirname, 'src'),
  publicDir: '../public',
  server: {
    port: 8989
  }
})

```

## css 预处理

Vite 本身对 CSS 各种预处理器语言(Sass/Scss、Less 和 Stylus)做了内置支持。也就是说，即使你不经过任何的配置也可以直接使用各种 CSS 预处理器。

### 引入全局 scss 文件

比如在每个 scss 文件引入 src 下的 variable.scss

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { normalizePath } from 'vite';
const variablePath = normalizePath(path.resolve('./src/variable.scss'));
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        //additionalData 的内容会在每个 scss 文件的开头自动注入
        additionalData: `@import "${variablePath}";`
      }
    }
  }
})

```

### CSS Modules

vite 对 CSS Modules 也是开箱即用的

src 下新建`index.module.scss`

```
.header {
    color: red;
}
```

App.tsx 中引入

```
import styles from "./index.module.scss";

function App() {
  return (
    <div className={styles.header}>
      header
    </div>
  );
}

export default App;
```

### PostCSS

一般你可以通过 postcss.config.js 来配置 postcss ，不过在 Vite 配置文件中已经提供了 PostCSS 的配置入口，我们可以直接在 Vite 配置文件中进行操作。

比如一个常用的自动添加前缀 PostCSS 插件: autoprefixer

```
pnpm i autoprefixer -D
```

`vite.config.ts`

```
import autoprefixer from 'autoprefixer';

export default {
  css: {
    // 进行 PostCSS 配置
    postcss: {
      plugins: [
        autoprefixer({
          // 指定目标浏览器
          overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11']
        })
      ]
    }
  }
}
```

常用的插件还有

-   postcss-px-to-viewport-8-plugin: 用来将 px 转换为 vw 单位，对于移动端适配很好用
-   postcss-pxtorem： 用来将 px 转换为 rem 单位
-   cssnano: 主要用来压缩 CSS 代码，跟常规的代码压缩工具不一样，它能做得更加智能，比如提取一些公共样式进行复用、缩短一些常见的属性值等等。

## ESlint

ESLint 的主要优势在于代码的风格检查并给出提示

安装

```
pnpm i eslint -D
```

初始化

```
npx eslint --init
```

安装

```
 pnpm i eslint-plugin-react@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest -D
```

## Prettier

代码格式化

安装

```
pnpm i prettier -D
```

新建`.prettierrc.cjs`

```
module.exports = {
  printWidth: 80, //一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 2, // 一个 tab 代表几个空格数，默认为 2 个
  useTabs: false, //是否使用 tab 进行缩进，默认为false，表示用空格进行缩减
  singleQuote: true, // 字符串是否使用单引号，默认为 false，使用双引号
  semi: true, // 行尾是否使用分号，默认为true
  trailingComma: "none", // 是否使用尾逗号
  bracketSpacing: true // 对象大括号直接是否有空格，默认为 true，效果：{ a: 1 }
};
```

将 Prettier 集成到 Eslint

```
pnpm i eslint-config-prettier eslint-plugin-prettier -D
```

其中 eslint-config-prettier 用来覆盖 ESLint 本身的规则配置，而 eslint-plugin-prettier 则是用于让 Prettier 来接管 eslint --fix 即修复代码的能力。

## vite 引入 ESlint 插件

```
pnpm i vite-plugin-eslint -D
```

`vite.config.ts`

```
// vite.config.ts
import viteEslint from 'vite-plugin-eslint';

// 具体配置
{
  plugins: [
    // 省略其它插件
    viteEslint(),
  ]
}
```

## Stylelint 样式规范工具

安装

```
pnpm i stylelint stylelint-prettier stylelint-config-prettier stylelint-config-recess-order stylelint-config-standard stylelint-config-standard-scss -D
```

新建 `.stylelintrc.js`

```
export default {
    // 注册 stylelint 的 prettier 插件
    plugins: ['stylelint-prettier'],
    // 继承一系列规则集合
    extends: [
        // standard 规则集合
        'stylelint-config-standard',
        // standard 规则集合的 scss 版本
        'stylelint-config-standard-scss',
        // 样式属性顺序规则
        'stylelint-config-recess-order',
        // 接入 Prettier 规则
        'stylelint-config-prettier',
        'stylelint-prettier/recommended'
    ],
    // 配置 rules
    rules: {
        // 开启 Prettier 自动格式化功能
        'prettier/prettier': true
    }
}
```

### vite 集成 Stylelint

```
pnpm i @amatlash/vite-plugin-stylelint -D
```

`.stylelintrc.cjs`

```
import viteStylelint from '@amatlash/vite-plugin-stylelint';

// 具体配置
{
  plugins: [
    // 省略其它插件
    viteStylelint({
      // 对某些文件排除检查
      exclude: /node_modules/
    }),
  ]
}
```

## Husky + lint-staged 的 Git 提交工作流集成

安装

```
pnpm i husky -D
```

script 脚本配置项目启动执行命令`husky install`

```
 "scripts": {
        "prepare": "husky install"
    },
```

添加 husky 钩子

```
npx husky add .husky/pre-commit "npm run lint"
```

但是这样会全量检测,如果我们要只检测暂存区的话可以安装`lint-staged`

```
pnpm i -D lint-staged
```

然后`package.json`中

```
{
  "lint-staged": {
    "**/*.{js,jsx,tsx,ts}": [
      "npm run lint:script",
      "git add ."
    ],
    "**/*.{scss}": [
      "npm run lint:style",
      "git add ."
    ]
  }
}
```

b 把.husky/pre-commit 中的内容换成

```
npx --no -- lint-staged
```

### 提交规范

安装工具库

```
pnpm i commitlint @commitlint/cli @commitlint/config-conventional -D
```

新建`.commitlintrc.cjs`

```
module.exports = {
  extends: ["@commitlint/config-conventional"]
};
```

直接使用`@commitlint/config-conventional`规范集就可以了

```
<type>: <subject>
```

常见的规范如下

-   feat: 添加新功能。
-   fix: Bug 修复。
-   chore: 不影响功能的更改。
-   docs: 文档修改。
-   perf: 性能优化。
-   refactor: 代码重构。
-   test: 测试相关。

将`commitlint`集成到 `Husky`中

```
npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS"
```

然后.husky 目录下多出了 commit-msg 脚本文件

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint -e

```
