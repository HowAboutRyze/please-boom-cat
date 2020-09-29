/**
 * 延时函数
 * @param delay 延时时间
 */
export function sleep(delay = 1000): Promise<void> {
  return new Promise(resolve => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, delay);
  });
}
