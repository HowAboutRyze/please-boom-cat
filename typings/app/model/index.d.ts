// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportGame from '../../../app/model/game';
import ExportRoom from '../../../app/model/room';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Game: ReturnType<typeof ExportGame>;
    Room: ReturnType<typeof ExportRoom>;
    User: ReturnType<typeof ExportUser>;
  }
}
