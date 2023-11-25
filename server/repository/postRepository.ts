import { prismaClient } from '$/service/prismaClient';
import { randomUUID } from 'crypto';

export const getPost = async (userID: string) => {
  const post = await prismaClient.post.findMany({
    where: { userID },
  });

  return post.map((post) => ({
    ...post,
    postTime: post.postTime.toISOString(),
  }));
};

export const postPost = async (
  postUserName: string,
  postcontent: string,
  postlatitude: number,
  postlongitude: number,
  userID: string
) => {
  const jstOffset = 9 * 60; // 日本はUTC+9
  const now = new Date();
  const jstNow = new Date(now.getTime() + jstOffset * 60 * 1000);
  const post = await prismaClient.post.create({
    data: {
      id: randomUUID(),
      userName: postUserName,
      postTime: jstNow,
      content: postcontent,
      latitude: postlatitude,
      longitude: postlongitude,
      userID,
    },
  });
  return post;
};

export const deletePost = async (postID: string) => {
  await prismaClient.post.delete({
    where: { id: postID },
  });
};

//24時間以内の投稿を見ることができる。これに１ｋｍ範囲内を見るなどを加える
export const getRecentPosts = async () => {
  const twentyFourHoursAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

  const posts = await prismaClient.post.findMany({
    where: {
      postTime: {
        gte: twentyFourHoursAgo,
      },
    },
    orderBy: {
      postTime: 'desc',
    },
  });
  return posts.map((post) => ({
    ...post,
    postTime: post.postTime.toISOString(),
  }));
};

//半径1km以内を引っ張ってくる
export const nearbyRecords = async (currentLatitude: number, currentLongitude: number) => {
  console.log('kita');
  const latitudeRange = 0.009; // 約1kmの緯度範囲
  const longitudeRange = 0.0118; // 約1kmの経度範囲
  console.log('currentLatitude', currentLatitude);
  const records = await prismaClient.post.findMany({
    where: {
      latitude: {
        // gte: currentLatitude - latitudeRange,
        lte: currentLatitude + latitudeRange,
      },
      longitude: {
        // gte: currentLongitude - longitudeRange,
        lte: currentLongitude + longitudeRange,
      },
    },
  });

  //posttimeをDate->String型に(定義した型に合わせるため)
  const transformedRecords = records.map((record) => ({
    ...record,
    postTime: record.postTime.toISOString(),
  }));

  return transformedRecords;
};

//likesは未完成・修正必要
export const updateLikes = async (postId: string, increment: boolean) => {
  const post = await prismaClient.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  const newLikes = increment ? post.likes + 1 : post.likes - 1;

  await prismaClient.post.update({
    where: { id: postId },
    data: { likes: newLikes },
  });
};
