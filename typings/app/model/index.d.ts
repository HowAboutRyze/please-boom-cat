// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

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
