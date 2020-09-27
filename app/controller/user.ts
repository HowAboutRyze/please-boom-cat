import { Controller, Context } from 'egg';
import { deserialize } from '@hubcarl/json-typescript-mapper';
import User from '../model/user';

export default class AdminController extends Controller {

  public async getUserById(ctx: Context) {
    const { id } = ctx.params;
    ctx.body = await ctx.service.user.query({ userId: id });
  }

  public async saveUser(ctx: Context) {
    const user = deserialize(User, ctx.request.body);
    ctx.body = await ctx.service.user.saveUser(user);
  }
}
