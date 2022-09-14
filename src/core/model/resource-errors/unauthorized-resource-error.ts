import { AbstractResourceError } from './abstract-resource-error';
/**
 * Represents error when the current user is unauthorized
 */
export class UnauthorizedResourceError extends AbstractResourceError {
  getDefaults() {
    return { status: 401, code: 'unauthorized' };
  }
}
