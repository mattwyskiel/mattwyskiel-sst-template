import { Stack, App, StackProps, Api } from '@serverless-stack/resources';

export default class MyStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a HTTP API
    const api = new Api(this, 'Api', {
      routes: {
        'POST /': 'src/functions/lambda.handler',
      },
    });

    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: api.url,
    });
  }
}
