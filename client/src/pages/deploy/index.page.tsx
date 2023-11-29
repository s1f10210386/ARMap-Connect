import { useAtom } from 'jotai';
import { userAtom } from 'src/atoms/user';

const Home = () => {
  const [user] = useAtom(userAtom);
  console.log(user);
  return (
    <div>
      <p>aaaaaa</p>
      {user !== null && <div>{user.id}</div>}
      {/* <p>{user}</p> */}
    </div>
  );
};

export default Home;
