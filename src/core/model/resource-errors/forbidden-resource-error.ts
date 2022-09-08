import { AbstractResourceError } from './abstract-resource-error';

export class ForbiddenResourceError extends AbstractResourceError {
  getDefaults() {
    return { status: 403, code: 'forbidden' };
  }
}
