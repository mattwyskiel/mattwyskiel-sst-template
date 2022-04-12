import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import { APIGatewayJSONBodyEventHandler, json } from '../libs/lambda-utils';
import requestMonitoring from '../libs/middleware/request-monitoring';

const inputSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    },
  },
} as const;

const hello: APIGatewayJSONBodyEventHandler<typeof inputSchema.properties.body> = async event => {
  return json({
    message: `Hello, World! Your request was received at ${event.requestContext.time}.`,
  });
};

export const handler = middy(hello)
  .use(jsonBodyParser())
  .use(validator({ inputSchema }))
  .use(requestMonitoring<typeof inputSchema.properties.body>());
