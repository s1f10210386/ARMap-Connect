import { addLike, deleteLikeByPost, getLikeCount, toggleLike } from '$/repository/likeRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => {
    const likeCount = await getLikeCount(query.postId);
    return { status: 200, body: { likeCount } };
  },
  post: async ({ body }) => {
    const likeCount = await addLike(body.postId, body.userId);
    return { status: 201, body: { likeCount } };
  },
  patch: async ({ body }) => {
    const likeCount = await toggleLike(body.postId, body.userId);
    return { status: 202, body: likeCount };
  },
  delete: async ({ body }) => {
    await deleteLikeByPost(body.postId);
    return { status: 203, body: '投稿によるいいねが削除されました' };
  },
}));
