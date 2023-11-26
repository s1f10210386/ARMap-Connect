import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
// import { Loading } from 'src/components/Loading/Loading';
import { coordinatesAtom, userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import { BasicHeader } from 'src/pages/@components/BasicHeader/BasicHeader';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';

const Home = () => {
  const [user] = useAtom(userAtom);

  const [coordinates, setCoordinates] = useAtom(coordinatesAtom);
  // console.log('coordinates', coordinates);
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation !== null) {
      navigator.geolocation.watchPosition((posithon) => {
        setCoordinates({
          latitude: posithon.coords.latitude,
          longitude: posithon.coords.longitude,
        });
      });
    }
  }, [setCoordinates, user]);

  const [myPostData, setMyPostData] = useState<
    | {
        id: string;
        userName: string;
        postTime: string;
        content: string;
        latitude: number;
        longitude: number;
        userID: string;
      }[]
    | null
  >(null);

  const [postContent, setPostContent] = useState('');

  const getMyPostContent = useCallback(async () => {
    // console.log('getMyPostContent関数呼び出し');
    if (user?.id === undefined) return;
    const data = await apiClient.myPost.$get({ query: { userID: user?.id } }).catch(returnNull);
    setMyPostData(data);
  }, [user?.id]);

  const [posts, setPosts] = useState<
    | {
        id: string;
        userName: string;
        postTime: string;
        content: string;
        latitude: number;
        longitude: number;
        userID: string;
      }[]
    | null
  >(null);

  //useEffectで呼出し、半径1km以内のものをgetしてくる
  const getPosts = useCallback(async () => {
    // console.log('getPosts関数呼び出し');
    if (coordinates.latitude === null || coordinates.longitude === null) return;
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;
    // const data = await apiClient.posts.$get().catch(returnNull);
    const data = await apiClient.nearRecord
      .$get({ query: { latitude, longitude } })
      .catch(returnNull);
    setPosts(data);
  }, [coordinates.latitude, coordinates.longitude]);

  //現在位置情報を付けてPOSTする
  const postPostContent = async () => {
    if (user?.id === undefined || postContent === '') return;
    if (coordinates.latitude === null || coordinates.longitude === null) return;

    const postUserName = 'Hotaka';
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;

    const result = await apiClient.myPost.$post({
      body: { username: postUserName, content: postContent, latitude, longitude, userID: user.id },
    });

    setPostContent('');
    await getMyPostContent();
    console.log('result', result);
  };

  const deletePostContent = async (postID: string) => {
    await apiClient.myPost.$delete({ query: { postID } }).catch(returnNull);
    await getMyPostContent();
  };

  const [likecount, setLikecount] = useState(0);

  const handleLike = async (postId: string) => {
    if (user?.id === undefined || postId === undefined) return;

    const result = (await apiClient.posts.$post({
      body: { postId, userId: user.id },
    })) as unknown as number;
    setLikecount(result);
    await getPosts();

    console.log('result', result);
  };

  useEffect(() => {
    getMyPostContent();
    getPosts();
  }, [getMyPostContent, getPosts, user]);

  if (!user) return <Loading visible />;
  // if (!user) return;
  return (
    <>
      <BasicHeader user={user} />

      <div style={{ display: 'flex' }}>
        <Box sx={{ padding: 2, paddingLeft: 10 }}>
          <h1>自分の投稿</h1>
          <TextField
            label="投稿内容"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            InputProps={{
              endAdornment: (
                <Button onClick={postPostContent} disabled={!postContent.trim()}>
                  投稿する
                </Button>
              ),
            }}
          />

          <Box sx={{ paddingTop: 2 }}>
            {myPostData &&
              myPostData.map((post) => (
                <div key={post.id}>
                  <Button onClick={() => deletePostContent(post.id)}>Delete Post</Button>

                  <p>{post.postTime}</p>
                  <h4>Content: {post.content}</h4>

                  <p>latitude: {post.latitude}</p>
                  <p>longitude: {post.longitude}</p>
                  <br />
                </div>
              ))}
          </Box>
        </Box>

        <Box sx={{ padding: 2, paddingLeft: 10 }}>
          <h1>近くに{posts ? posts.length : 0}件の投稿があります</h1>
          <Box sx={{ paddingTop: 2 }}>
            {posts &&
              posts.map((post) => (
                <div key={post.id}>
                  <Button onClick={() => handleLike(post.id, user.id)}>いいね</Button>
                  <p>{likecount}いいね</p>
                  <h3>user: {post.userName}</h3>
                  <p>Content: {post.content}</p>
                  <p>Time: {post.postTime}</p>
                  <p>latitude: {post.latitude}</p>
                  <p>longitude: {post.longitude}</p>
                  <br />
                </div>
              ))}
          </Box>
        </Box>
      </div>
    </>
  );
};

export default Home;
