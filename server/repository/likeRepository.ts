import { prismaClient } from '$/service/prismaClient';
import { randomUUID } from 'crypto';
async function createLike(postId: string, userId: string): Promise<void> {
  await prismaClient.like.create({
    data: {
      id: randomUUID(),
      post: { connect: { id: postId } },
      user: { connect: { id: userId } },
    },
  });
}
async function removeLike(likeId: string): Promise<void> {
  await prismaClient.like.delete({
    where: { id: likeId },
  });
}

const getLikeCount = async (postId: string) => {
  return await prismaClient.like.count({
    where: {
      postId,
    },
  });
};
export async function findLike(postId: string, userId: string) {
  return await prismaClient.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });
}
export const addLike = async (postId: string, userId: string): Promise<number> => {
  await createLike(postId, userId);
  return getLikeCount(postId);
};

// export const removeLike = async (postId: string, userId: string): Promise<number> => {
//   const like = await findLike(postId, userId);
//   if (like) {
//     await deleteLike(like.id);
//   }
//   return getLikeCount(postId);
// };

export const toggleLike = async (postId: string, userId: string) => {
  const like = await findLike(postId, userId);
  if (like) {
    await removeLike(like.id);
  } else {
    await createLike(postId, userId);
  }
  return getLikeCount(postId);
};

export const deleteLikeByPost = async (postId: string): Promise<void> => {
  await prismaClient.like.deleteMany({
    where: {
      postId,
    },
  });
};
