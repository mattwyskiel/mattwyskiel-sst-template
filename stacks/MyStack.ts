import { StackContext, Api } from '@serverless-stack/resources';

export function MyStack({ stack }: StackContext) {
  const api = new Api(stack, 'api', {
    routes: {
      'POST /': 'functions/lambda.handler',
    },
    defaults: {
      function: {
        environment: {
          LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
        },
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
