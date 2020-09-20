// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportRoom from '../../../app/model/room';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Room: ReturnType<typeof ExportRoom>;
    User: ReturnType<typeof ExportUser>;
  }
}
