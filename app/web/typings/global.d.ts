declare const window: Window;
declare const EASY_ENV_IS_NODE: boolean;

interface Window {
  __INITIAL_STATE__: any;
  localStorage: any;
  sessionStorage: any;
}
