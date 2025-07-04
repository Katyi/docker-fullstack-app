'use client';

import useAuthStore from '@/app/store/authStore';
import useUserStore from '@/app/store/userStore';
import Loader from '@/components/loader/loader';
import { Card } from '@radix-ui/themes';
import { error } from 'console';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const UsersPage = () => {
  const router = useRouter();
  const { getUsers, users, error, isLoading } = useUserStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (error) {
    return (
      <div className="pageContainer justify-center">
        <p className="text-red-500 font-bold">Error loading users: {error}</p>
      </div>
    );
  }

  return isLoading ? (
    <Loader />
  ) : (
    <main className="pageContainer">
      <div className="flex w-full gap-2 mb-4 items-center">
        <h1 className="text-xl font-bold text-gray-600">Users</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-[80vw]">
        {users.map((user: User) => (
          <Card
            key={user.id}
            className="bg-gray-100 shadow-lg h-fit sm:h-[300px] flex-grow-0"
          >
            <Image
              src={user.imageUrl ? user.imageUrl : '/user.png'}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto sm:min-h-[100px] sm:h-[70%] object-cover cursor-pointer"
              onClick={() => router.push(`/users/${user.id}`)}
            />
            <div className="p-2">
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{user.country}</p>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default UsersPage;
