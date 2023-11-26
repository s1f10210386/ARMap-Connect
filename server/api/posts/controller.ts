import { getRecentPosts, togglelike } from '$/repository/postRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => {
    const result = await getRecentPosts();
    return { status: 200, body: result };
  },

  post: async ({ body }) => {
    const results = await togglelike(body.postId, body.userId);
    return { status: 201, body: results };
  },
}));
