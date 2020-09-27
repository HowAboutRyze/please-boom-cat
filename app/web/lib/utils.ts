/**
 * 延时函数
 * @param delay 延时时间
 */
export function sleep(delay = 1000) {
  return new Promise(resolve => {
    let timer = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, delay);
  });
}
