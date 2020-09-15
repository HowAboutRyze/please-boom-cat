import { Controller, Context } from 'egg';
import { deserialize } from '@hubcarl/json-typescript-mapper';
import Condition from '../lib/condition';

export default class AdminController extends Controller {

  public async getUserById(ctx: Context) {
    const { id } = ctx.params;
    ctx.body = await ctx.service.user.query({ userId: id });
  }
}