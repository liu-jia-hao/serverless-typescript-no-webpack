// # sourceMappingURL=hello.js.map
import type { APIGatewayProxyResult } from 'aws-lambda';

export default async function hello(): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: 'hello',
  };
}
