import { Middleware, ParameterizedContext } from "koa";
import { tdeiLogger } from "./tdei_logger";

/**
 * Koa based middleware that logs all the requests into
 * the cloud. Use this as
 * ```typescript
 *  app.use(requestLogger());
 * ```
 * to include all the requests of the system in the logs.
 * 
 */
export const requestLogger = (): Middleware => async (
    ctx: ParameterizedContext,
    next: () => Promise<any>
  ) => {
    const start = Date.now();
    try {
      console.debug('Request Start', { method: ctx.method, url: ctx.url });

      await next();
    } finally {
      const ms = Date.now() - start;
      console.debug('Request End', { method: ctx.method, url: ctx.url, duration: ms });
      tdeiLogger.recordRequest(ctx.request,ctx.response);
    }
  };
  