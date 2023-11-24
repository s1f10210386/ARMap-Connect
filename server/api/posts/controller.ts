import { getRecentPosts, updateLikes } from '$/repository/postRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => {
    const result = await getRecentPosts();
    return { status: 200, body: result };
  },

  //↓これは未完成いいねきのうをやろうとした
  patch: async ({ body }) => {
    const { postID, increment } = body;
    await updateLikes(postID, increment);
    return { status: 203 };
  },
}));
