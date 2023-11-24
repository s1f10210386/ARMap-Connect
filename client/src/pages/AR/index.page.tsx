import { useAtom } from 'jotai';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import { BasicHeader } from '../@components/BasicHeader/BasicHeader';

export default function AR() {
  const [user] = useAtom(userAtom);
  if (!user) return <Loading visible />;
  return (
    <div>
      <BasicHeader user={user} />
    </div>
  );
}
