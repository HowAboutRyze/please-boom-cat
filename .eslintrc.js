module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'plugin:vue/recommended', // 这里也可以启用其他规则，如默认的 vue/essential
    'plugin:@typescript-eslint/recommended',
  ],
  parser: 'vue-eslint-parser', // 解析 .vue 文件
  parserOptions: {
    ecmaVersion: 6, // 也就是ES6语法支持的意思
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
    },
    parser: '@typescript-eslint/parser', // 解析 .ts 文件
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // 禁止使用 var
    'no-var': 2,
    // 优先使用 interface 而不是 type
    '@typescript-eslint/consistent-type-definitions': [
      "error",
      "interface",
    ],
    "no-spaced-func": 2, // 函数调用时 函数名与()之间不能有空格
    "no-trailing-spaces": 1, // 一行结束后面不要有空格
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"], // 不能有声明后未被使用的变量或参数
    '@typescript-eslint/no-var-requires': 0, // 不允许 require
    '@typescript-eslint/no-explicit-any': 0, // 不允许 any
    "comma-style": [2, "last"], // 逗号风格，换行时在行首还是行尾
    "default-case": 2, // 要求 switch 语句中有 default 分支
    "object-curly-spacing": [1, "always"], // 强制在花括号中使用一致的空格
    "comma-dangle": ["error", "always-multiline"], // 多行结尾逗号必须
  },
};
