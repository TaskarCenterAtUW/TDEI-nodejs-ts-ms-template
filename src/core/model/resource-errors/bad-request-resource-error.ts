import { AbstractResourceError } from './abstract-resource-error';

export class BadRequestResourceError extends AbstractResourceError {
  getDefaults() {
    return { status: 400, code: 'bad-request' };
  }
}
