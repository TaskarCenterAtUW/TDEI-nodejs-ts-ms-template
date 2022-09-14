import { AbstractResourceError } from './abstract-resource-error';

/**
 * Represents error when the resource is not found
 */
export class NotFoundResourceError extends AbstractResourceError {
  getDefaults() {
    return { status: 404, code: 'not-found' };
  }
}
