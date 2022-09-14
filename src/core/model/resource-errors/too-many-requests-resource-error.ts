import { AbstractResourceError } from './abstract-resource-error';

/**
 * Represents error when there are too many requests
 * to the system
 */
export class TooManyRequestsResourceError extends AbstractResourceError {
  getDefaults() {
    return { status: 429, code: 'too-many-requests' };
  }
}
