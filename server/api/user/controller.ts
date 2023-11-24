import { getUser, postUser } from '$/repository/userRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => {
    return { status: 200, body: await getUser(query.userID) };
  },
  post: async ({ body }) => ({
    status: 201,
    body: await postUser(body.userID),
  }),
}));
