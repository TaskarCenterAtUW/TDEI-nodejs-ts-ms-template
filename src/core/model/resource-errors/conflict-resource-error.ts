import { AbstractResourceError } from './abstract-resource-error';

export class ConflictResourceError extends AbstractResourceError {
  getDefaults() {
    return { status: 409, code: 'duplicate' };
  }
}
