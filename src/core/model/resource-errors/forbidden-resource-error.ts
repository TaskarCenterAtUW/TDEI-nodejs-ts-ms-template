import { AbstractResourceError } from './abstract-resource-error';

/**
 * Represents error for resources which the current user
 * does not have access to
 */
export class ForbiddenResourceError extends AbstractResourceError {
  getDefaults() {
    return { status: 403, code: 'forbidden' };
  }
}
