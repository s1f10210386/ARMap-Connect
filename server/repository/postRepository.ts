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

//とあるuserが投稿をイイネしたときにレコードの存在をチェック(イイネを追加、削除する関数)
//最後にlikeテーブルに含まれる投稿IDを数える(その投稿のイイネ数を更新)
export const togglelike = async (postId: string, userId: string) => {
  const like = await prismaClient.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (like) {
    await prismaClient.like.delete({
      where: { id: like.id },
    });
  } else {
    await prismaClient.like.create({
      data: {
        id: randomUUID(),
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });
  }

  const likeCount = await prismaClient.like.count({
    where: {
      postId,
    },
  });
  console.log('likeCount', likeCount);
  return likeCount;
};
