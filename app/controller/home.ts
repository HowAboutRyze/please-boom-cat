import { Controller, Context } from 'egg';

export default class AdminController extends Controller {
  public async game(ctx: Context): Promise<void> {
    await ctx.render('home/game.js', { url: ctx.url });
  }
}
