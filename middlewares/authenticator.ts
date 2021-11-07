import createHttpError from 'http-errors';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { firebaseAdmin } from '../helpers/gcp';

export type AuthedEvent = APIGatewayProxyEvent & {
  loggedInUser: {
    uid: string;
    email: string;
    sub: string;
  };
};

interface Request {
  event: AuthedEvent | undefined;
}
export default () => ({
  before: async (request: Request) => {
    try {
      const { event = {} } = request;
      event.loggedInUser = {};
      if (process.env.SKIP_AUTH === 'true') {
        event.loggedInUser.sub = process.env.LOGGED_IN_USER_SUB;
        event.loggedInUser.email = process.env.LOGGED_IN_USER_EMAIL;
        event.loggedInUser.uid = process.env.LOGGED_IN_USER_UID;
        return;
      }
      if (!event.headers?.authorization) {
        throw createHttpError(403, 'Missing authorization token');
      }
      const [bearerWord, tokenValue] = event.headers.authorization.split(' ');
      if (bearerWord.toLowerCase() !== 'bearer' || !tokenValue) {
        throw createHttpError(403, 'Unauthorized');
      }
      const admin = firebaseAdmin();
      const decodedToken = await admin.auth().verifyIdToken(tokenValue);
      const { sub, email, uid } = decodedToken;
      if (!sub || !email) {
        throw createHttpError(403, 'Unauthorized');
      }
      event.loggedInUser.sub = sub;
      event.loggedInUser.email = email;
      event.loggedInUser.uid = uid;
    } catch (err) {
      console.log(err);
      throw createHttpError(403, `Unauthorized: ${err}`);
    }
  },
});
