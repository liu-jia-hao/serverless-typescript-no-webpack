// # sourceMappingURL=hello.js.map
require('dotenv').config();

import createError from 'http-errors';
import httpErrorHandler from '@middy/http-error-handler';
import middy from '@middy/core';
import type { APIGatewayProxyResult } from 'aws-lambda';

export default middy((): Promise<APIGatewayProxyResult> => {
  throw new createError.NotFound('hello. not found');
  // return {
  //   statusCode: 200,
  //   body: 'hello',
  // };
}).use(httpErrorHandler());
