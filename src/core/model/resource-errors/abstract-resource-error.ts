type LogPrim = number | boolean | string | Date | undefined | string[] | number[];

export interface ResourceErrorPayloadItem {
  code: string;
  payload: {
    [key: string]: LogPrim;
  };
}

export type ResourceErrorPayload = {
  errors?: ResourceErrorPayloadItem[];
} & { [key: string]: LogPrim };

export interface ResourceErrorResponseBody {
  status: number;
  code: string;
  message?: string;
  payload?: ResourceErrorPayload;
  awsRequestId?: string;
}

export abstract class AbstractResourceError extends Error {
  public readonly status: number;
  public readonly body: ResourceErrorResponseBody;
  public readonly code: string;

  abstract getDefaults(): ResourceErrorResponseBody;

  constructor(messageOrCode: string, context?: Partial<ResourceErrorResponseBody>);
  constructor(context?: Partial<ResourceErrorResponseBody>);
  constructor(
    messageCodeOrContext?: string | Partial<ResourceErrorResponseBody>,
    context?: Partial<ResourceErrorResponseBody>
  ) {
    super();
    const body = this.getDefaults();

    if (messageCodeOrContext) {
      if (typeof messageCodeOrContext === 'string') {
        if (/^[a-z-_.]+$/.test(messageCodeOrContext)) {
          body.code = messageCodeOrContext;
        } else {
          body.message = messageCodeOrContext;
        }
      } else {
        context = messageCodeOrContext;
      }
    }
    if (context) {
      Object.assign(body, context);
    }
    this.message = body.message ?? body.code;
    delete body.message; // Do not return in payload

    this.status = body.status;
    this.body = body;
    body.code = this.code = "";
  }
}
