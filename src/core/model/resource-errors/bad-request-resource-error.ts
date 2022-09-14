import { AbstractResourceError } from './abstract-resource-error';

/**
 * Represents a Bad request error. This typically happens
 * when there is a type mismatch or missing parameters
 * with the resource
 */
export class BadRequestResourceError extends AbstractResourceError {
  getDefaults() {
    return { status: 400, code: 'bad-request' };
  }
}
