import { NearAndRecentRecords, togglelike } from '$/repository/postRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => {
    const result = await NearAndRecentRecords(query.latitude, query.longitude);
    return { status: 200, body: result };
  },

  post: async ({ body }) => {
    const results = await togglelike(body.postId, body.userId);
    return { status: 201, body: results };
  },
}));
