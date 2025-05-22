'use client';

import useAuthStore from '@/app/store/authStore';
import useUserStore from '@/app/store/userStore';
import { Card } from '@radix-ui/themes';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const UsersPage = () => {
  // const { users, getUsers } = useUserStore();
  const { users, getUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <main className="pageContainer">
      <div className="flex w-full gap-2 mb-4 items-center">
        <h1 className="text-xl font-bold text-gray-600">Users</h1>
      </div>

      <div className="flex flex-wrap w-[80vw] justify-between after:flex-auto gap-10">
        {users.map((user: User) => (
          <Card key={user.id} className="bg-gray-100 shadow-lg h-[300px]">
            <Image
              src={user.imageUrl ? user.imageUrl : '/user.png'}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: 'auto',
                minWidth: '100px',
                height: '70%',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              onClick={() => redirect(`/users/${user.id}`)}
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
