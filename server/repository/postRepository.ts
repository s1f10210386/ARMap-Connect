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
  // console.log('userID', userID);
  const jstOffset = 9 * 60; // 日本はUTC+9
  const now = new Date();
  const jstNow = new Date(now.getTime() + jstOffset * 60 * 1000);
  try {
    const post = await prismaClient.post.create({
      data: {
        id: randomUUID(),
        userName: postUserName,
        postTime: jstNow,
        content: postcontent,
        latitude: postlatitude,
        longitude: postlongitude,
        userID,
        likeCount: 0,
      },
    });
    // console.log('post', post);
    return post;
  } catch (error) {
    console.error('Error creating post:', error);
  }
};

export const deletePost = async (postID: string) => {
  await prismaClient.post.delete({
    where: { id: postID },
  });
};

//２４時間以内の投稿かつ半径1km以内を引っ張ってくる
export const NearAndRecentRecords = async (currentLatitude: number, currentLongitude: number) => {
  // console.log('kita');

  const twentyFourHoursAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const latitudeRange = 0.09; // 約10kmの緯度範囲
  const longitudeRange = 0.118; // 約10kmの経度範囲

  // console.log({ currentLatitude, currentLongitude });
  const records = await prismaClient.post.findMany({
    where: {
      postTime: {
        gte: twentyFourHoursAgo,
      },
      latitude: {
        gte: currentLatitude - latitudeRange, //以上
        lte: currentLatitude + latitudeRange, //以下
      },
      longitude: {
        gte: currentLongitude - longitudeRange,
        lte: currentLongitude + longitudeRange,
      },
    },
    orderBy: {
      postTime: 'desc',
    },
  });

  //posttimeをDate->String型に(定義した型に合わせるため)
  const transformedRecords = records.map((record) => ({
    ...record,
    postTime: record.postTime.toISOString(),
  }));

  return transformedRecords;
};
//汚いからあとで治す
//とあるuserが投稿をイイネしたときにレコードの存在をチェック(イイネを追加、削除する関数)
//最後にlikeテーブルに含まれる投稿IDを数える(その投稿のイイネ数を更新)
export const togglelike = async (postId: string, userId: string) => {
  //イイネを押された投稿(postId)と押したユーザー(userId)が一致するレコードをlikeテーブルから探索
  const like = await prismaClient.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  //あるなら削除(イイネを取り消す)、ないなら追加(イイネをする)
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

  //この投稿のイイネ数を数える
  const likeCount = await prismaClient.like.count({
    where: {
      postId,
    },
  });

  //likeCountカラム更新
  await prismaClient.post.update({
    where: { id: postId },
    data: { likeCount },
  });

  //likeCountカラムを返す
  const updatedPost = await prismaClient.post.findUnique({
    where: { id: postId },
    select: { likeCount: true },
  });
  console.log('updatePost', updatedPost);
  if (updatedPost === null) return;
  else {
    return updatedPost.likeCount;
  }
};
