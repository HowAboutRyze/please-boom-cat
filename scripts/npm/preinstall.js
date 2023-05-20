let err = false;

const nodeVersion = /^(\d+)\.(\d+)\.(\d+)/.exec(process.versions.node);
const majorNodeVersion = parseInt(nodeVersion[1]);
const minorNodeVersion = parseInt(nodeVersion[2]);

if (majorNodeVersion < 14 || (majorNodeVersion === 14 && minorNodeVersion < 17)) {
  console.error('\033[1;31m*** 请使用node.js大于14.17.x小于15版本\033[0;0m')
  err = true;
}

if (majorNodeVersion >= 15) {
  console.warn('\033[1;33m*** 警告: 没测试过node.js版本大于等于15，不保证程序正常运行\033[0;0m');
}

if (err) {
  console.error('');
  process.exit(1);
}

console.log('\033[32m 欢迎来到我的爆炸猫游戏 \033[0m');
