import { Context, Service } from 'egg';
import { deserialize } from '@hubcarl/json-typescript-mapper';
import Colllection from '../lib/db/collection';
import Article from '../model/article';
import Condition from '../lib/condition';

export default class ArticeService extends Service {
  private context: Context;
  private colllection: Colllection;
  constructor(ctx: Context) {
    super(ctx);
    this.context = ctx;
    this.colllection = new Colllection(ctx.db, 'user');
  }

  public async query(json: object) {
    return this.colllection.query(json);
  }

}
