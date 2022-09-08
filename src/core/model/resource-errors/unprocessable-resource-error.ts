import { AbstractResourceError } from './abstract-resource-error';

export class UnprocessableResourceError extends AbstractResourceError {
  getDefaults() {
    return { status: 422, code: 'unprocessable' };
  }
}
