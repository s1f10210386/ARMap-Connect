import { deletePost, getPost, postPost } from '$/repository/postRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => {
    const result = await getPost(query.userID);
    return { status: 200, body: result };
  },
  post: async ({ body }) => {
    const result = await postPost(
      body.username,
      body.content,
      body.latitude,
      body.longitude,
      body.userID
    );
    return { status: 201, body: result };
  },
  delete: async ({ query }) => {
    await deletePost(query.postID);
    return { status: 204 };
  },
}));
