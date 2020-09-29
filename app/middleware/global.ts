import { Context } from 'egg';
export default () => {
  return async function global(ctx: Context, next: () => Promise<void>): Promise<void> {
    ctx.locals.locale = ctx.query.locale || 'cn';
    ctx.locals.origin = ctx.request.origin;
    await next();
  };
};
