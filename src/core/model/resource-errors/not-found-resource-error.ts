import { AbstractResourceError } from './abstract-resource-error';

export class NotFoundResourceError extends AbstractResourceError {
  getDefaults() {
    return { status: 404, code: 'not-found' };
  }
}
