import { AbstractResourceError } from './abstract-resource-error';

export class TooManyRequestsResourceError extends AbstractResourceError {
  getDefaults() {
    return { status: 429, code: 'too-many-requests' };
  }
}
