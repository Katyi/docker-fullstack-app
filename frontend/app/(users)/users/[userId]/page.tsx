import { getUser } from '@/lib/actions';
import { formatDay } from '@/lib/formating';
import Image from 'next/image';
import Link from 'next/link';

const UserPage = async (props: UserPageProps) => {
  const { userId } = await props.params;
  const user = await getUser(userId);

  if (!user) {
    return (
      <div className="pageContainer justify-center">
        <p className="text-red-500 font-bold text-lg">User ID not found</p>
      </div>
    );
  }

  return (
    <main className="pageContainer">
      <div className="mt-6 flex items-center justify-around bg-white w-full py-6">
        <Image
          src={user.imageUrl ? user.imageUrl : '/user.png'}
          alt="user"
          priority={true}
          width={0}
          height={0}
          sizes="100vw"
          className="w-auto h-96"
        />
        {/* <div>
          <h1 className="text-xl font-bold text-gray-800 text-center mb-2">
            {user?.name}
          </h1>
          <p>Email: {user?.email}</p>
          <p>Country: {user?.country}</p>
          <p>Birthday: {user?.birthday ? 'Yes' : 'No'}</p>
          {user?.createdAt && <p>Joined: {formatDay(user?.createdAt)} </p>}
        </div> */}
        <div className="p-4">
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
            // onClick={() => router.push(`/users/${postcard.userId}`)}
          >
            User{`'`}s Gallery
          </Link>
        </div>
      </div>
    </main>
  );
};

export default UserPage;
