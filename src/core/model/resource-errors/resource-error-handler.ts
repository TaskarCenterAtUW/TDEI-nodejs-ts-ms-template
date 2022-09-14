import { Middleware, ParameterizedContext } from 'koa'; // Not sure about this one yet.
import { AbstractResourceError } from './abstract-resource-error';

/**
 * Middleware for resource error handling and responds appropriate
 * error when there is an exception. 
 * **NOTE: Not used yet**
 * @returns 
 */
export const resourceErrorHandler = (): Middleware => async (
  ctx: ParameterizedContext,
  next: () => Promise<any>
) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof AbstractResourceError) {
      ctx.status = err.status;
      ctx.body = err.body;
      console.warn('Error Response', {
        code: err.code,
        status: err.status,
        message: ctx.status !== 401 ? err.message : undefined,
      });
    } else {
      ctx.status = 500;
      ctx.body = { message: 'Internal Server Error' };
      console.error('Internal Server Error', { error: err as Error });
    }
  }
};
