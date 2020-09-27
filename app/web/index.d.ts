import { Socket } from '@lib/socket';

declare var EASY_ENV_IS_NODE: boolean;
type PlainObject<T = any> = { [key: string]: T };
declare module 'vue/types/vue' {
  interface Vue {
    $socket: any;
    $socketServer: Socket;
  }
}
