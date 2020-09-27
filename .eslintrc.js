module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // 禁止使用 var
    'no-var': 2,
    // 优先使用 interface 而不是 type
    '@typescript-eslint/consistent-type-definitions': [
      "error",
      "interface"
    ],
    "no-spaced-func": 2, // 函数调用时 函数名与()之间不能有空格
    "no-trailing-spaces": 1, // 一行结束后面不要有空格
    // "no-unused-vars": [2, {
    //   "vars": "all",
    //   "args": "after-used"
    // }], // 不能有声明后未被使用的变量或参数，一个问题：enum 没法用
    "comma-style": [2, "last"], // 逗号风格，换行时在行首还是行尾
    "default-case": 2, // 要求 switch 语句中有 default 分支
    "object-curly-spacing": [1, "always"], // 强制在花括号中使用一致的空格
  }
}
