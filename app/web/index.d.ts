import { Socket } from '@lib/socket';

declare const EASY_ENV_IS_NODE: boolean;
interface PlainObject<T = any> { [key: string]: T }
declare module 'vue/types/vue' {
  interface Vue {
    $socket: any;
    $socketServer: Socket;
  }
}
