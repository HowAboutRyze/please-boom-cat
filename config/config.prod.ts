/**
 * production
 *
 *  prod + default（override）
 */

import { EggAppConfig, PowerPartial } from 'egg';
// 获取 default config
import defaultConfig from './config.default';
type DefaultConfig = ReturnType<typeof defaultConfig>;

export default () => {
  const config = {} as PowerPartial<EggAppConfig & DefaultConfig>;

  return config;
};
