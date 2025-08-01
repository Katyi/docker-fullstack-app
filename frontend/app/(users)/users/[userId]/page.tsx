import { getUser } from '@/lib/actions';
import { formatDay } from '@/lib/formating';
import Image from 'next/image';
import Link from 'next/link';
import { myImageLoader } from '@/lib/utils';

const UserPage = async (props: UserPageProps) => {
  const { userId } = await props.params;
  const user = await getUser(userId);

  if (!user.id) {
    return (
      <div className="pageContainer justify-center">
        <p className="text-red-500 font-bold text-lg">User ID not found</p>
      </div>
    );
  }

  return (
    <main className="pageContainer">
      <div className="mt-6 flex flex-col md:flex-row items-center md:items-center md:justify-around bg-white w-full py-6">
        <Image
          loader={myImageLoader}
          src={user.imageUrl ? `${user.imageUrl}` : '/user.png'}
          alt="user"
          priority={true}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto md:w-auto md:h-96"
        />
        <div className="p-4 w-full flex flex-col md:items-center">
          <h1 className="text-xl font-bold text-gray-800 text-center mb-2">
            {user?.name}
          </h1>
          <p>Email: {user?.email}</p>
          <p>Country: {user?.country}</p>
          <p>City: {user?.city}</p>
          <p>Birthday: {formatDay(user?.birthday || null)}</p>
          <p>Joined: {formatDay(user?.createdAt || null)}</p>
          <p>About: {user?.about}</p>

          <Link
            className="font-bold text-[#3475B9] border-b border-[#3475B9]"
            href={`/users/${user.id}/postcards`}
          >
            User{`'`}s Gallery
          </Link>
        </div>
      </div>
    </main>
  );
};

export default UserPage;
