require('dotenv').config();

import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
// import {
// Context,
// Callback,
// APIGatewayProxyEvent,
// APIGatewayProxyResult,
// } from 'aws-lambda';
import { createAmazonS3PresignedURL } from '../helpers/image';
import { responseSerializer } from '../helpers/middy';
import authenticator, { AuthedEvent } from '../middlewares/authenticator';

export const getPresignedURL = middy(
  async (event: AuthedEvent & { authedUserId: string }) => {
    const { authedUserId } = event;
    const presignedUrl = await createAmazonS3PresignedURL(authedUserId);
    return presignedUrl;
  },
);

getPresignedURL.use(cors());
getPresignedURL.use(httpEventNormalizer());
getPresignedURL.use(responseSerializer);
getPresignedURL.use(httpJsonBodyParser());
getPresignedURL.use(authenticator());

export const hello = async () => 'hello';
