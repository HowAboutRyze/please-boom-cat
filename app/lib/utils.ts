/**
 * 生成给 uuid
 * @return {string} uuid
 */
export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

/**
 * 随机整数
 * @param minNum 最小
 * @param maxNum 最大
 */
export function randomInt(minNum: number, maxNum: number): number {
  return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
}
