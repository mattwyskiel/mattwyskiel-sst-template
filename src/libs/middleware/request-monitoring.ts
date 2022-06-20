/* eslint-disable @typescript-eslint/no-explicit-any */

import middy from '@middy/core';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { APIGatewayJSONBodyEvent } from '../lambda-utils';
import { Logger } from '../logger';

interface IError {
  status: number;
  message: string;
  details?: any;
}

type APIGatewayEvent<S> = APIGatewayProxyEventV2 | APIGatewayJSONBodyEvent<S>;

const requestMonitoring = <S>(): middy.MiddlewareObj<
  APIGatewayEvent<S>,
  APIGatewayProxyResultV2
> => {
  const before: middy.MiddlewareFn<APIGatewayEvent<S>, APIGatewayProxyResultV2> = async (
    request
  ): Promise<void> => {
    Logger.info('Incoming API Gateway Request', { request: request.event });
  };

  const after: middy.MiddlewareFn<APIGatewayEvent<S>, APIGatewayProxyResultV2> = async (
    request
  ): Promise<void> => {
    Logger.info('API Gateway Response', { response: request.response });
  };

  const onError: middy.MiddlewareFn<
    APIGatewayEvent<S>,
    APIGatewayProxyResultV2,
    IError | Error
  > = async (request): Promise<void> => {
    if (request.error as IError) {
      const error = request.error as IError;
      Logger.error(error.message, error.details ? { details: error.details } : undefined);
      request.response = {
        statusCode: error.status,
        body: JSON.stringify({
          message: error.message,
          details: error.details,
          trackingId: request.context.awsRequestId,
        }),
      };
    } else {
      const error = request.error as Error;
      Logger.error(error.message, { stack: error.stack });
    }
  };

  return {
    before,
    after,
    onError,
  };
};

export default requestMonitoring;
