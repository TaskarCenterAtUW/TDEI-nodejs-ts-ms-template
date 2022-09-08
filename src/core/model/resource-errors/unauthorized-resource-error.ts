import { AbstractResourceError } from './abstract-resource-error';

export class UnauthorizedResourceError extends AbstractResourceError {
  getDefaults() {
    return { status: 401, code: 'unauthorized' };
  }
}
