// # sourceMappingURL=images.js.map
require('dotenv').config();

import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import type { APIGatewayProxyResult } from 'aws-lambda';
import { createAmazonS3PresignedURL } from '../helpers/image';
import { responseSerializer } from '../helpers/middy';
import authenticator, { AuthedEvent } from '../middlewares/authenticator';

export const getPresignedURL = middy(
  async (
    event: AuthedEvent & { authedUserId: string },
  ): Promise<APIGatewayProxyResult> => {
    const { authedUserId } = event;
    const presignedUrl = await createAmazonS3PresignedURL(authedUserId);
    return { body: presignedUrl, statusCode: 200 };
  },
)
  .use(cors())
  .use(httpEventNormalizer())
  .use(responseSerializer)
  .use(httpJsonBodyParser())
  .use(authenticator());
