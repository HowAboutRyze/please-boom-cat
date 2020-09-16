import { Context, Service } from 'egg';
import { deserialize } from '@hubcarl/json-typescript-mapper';
import Colllection from '../lib/db/collection';
import User from '../model/user';
import Condition from '../lib/condition';

export default class ArticeService extends Service {
  private context: Context;
  private colllection: Colllection;
  constructor(ctx: Context) {
    super(ctx);
    this.context = ctx;
    this.colllection = new Colllection(ctx.db, 'user');
  }

  public async saveUser(data: object) {
    const user: User = deserialize(User, data);
    if (user.userId) {
      return this.colllection.update({ userId: user.userId }, user);
    }
    user.userId = this.context.db.getUniqueId();
    this.colllection.add(user);
    return user;
  }

  public async query(json: object) {
    return this.colllection.query(json);
  }

}
