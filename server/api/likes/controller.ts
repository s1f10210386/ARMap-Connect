import { addLike, deleteLikeByPost, findLike, toggleLike } from '$/repository/likeRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => {
    const like = await findLike(query.postId, query.userId);
    const isLiked = like !== null;
    return { status: 200, body: isLiked };
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
