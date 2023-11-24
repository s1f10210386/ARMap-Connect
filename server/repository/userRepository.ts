import { prismaClient } from '$/service/prismaClient';

export const getUser = async (userID: string) => {
  return await prismaClient.user.findMany({
    where: { id: userID },
  });
};

export const postUser = async (userID: string) => {
  const user = await prismaClient.user.create({
    data: {
      id: userID,
    },
  });
  return user;
};
