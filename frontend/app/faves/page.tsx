'use client';

import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import useLikeStore from '../store/likeStore';
import usePostcardStore from '../store/postcardStore';
import Loader from '@/components/loader/loader';
import { Card } from '@radix-ui/themes';
import Tooltip from '@/components/ui/tooltip';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
import Pagination from '@/components/ui/pagination';
import { pageSize } from '@/lib/constants';
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';

const Faves = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    getLikesWithPostcards,
    getUserLikesCount,
    deleteLike,
    likesCount,
    likesWithPostcards,
    isLoading,
    error,
  } = useLikeStore();
  const { updatePostcard, getPostcard, postcard } = usePostcardStore();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const numberOfPages = Math.ceil(likesCount / pageSize);

  const handleDeleteLikePostcard = async (like: Like) => {
    try {
      await deleteLike(like.id);
      if (user?.id) {
        await getLikesWithPostcards(
          user.id,
          (currentPage - 1) * pageSize,
          pageSize
        );
        await getUserLikesCount(user.id);
      }
      if (like.postcard) {
        await updatePostcard({
          ...like.postcard,
          likes:
            like.postcard.likes !== 1 && like.postcard.likes
              ? like.postcard.likes - 1
              : null,
        });
      } else {
        console.error('Postcard or user is undefined');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.id) getUserLikesCount(user.id);
  }, [user, getUserLikesCount]);

  useEffect(() => {
    if (user?.id)
      getLikesWithPostcards(user.id, (currentPage - 1) * pageSize, pageSize);
  }, [user, getLikesWithPostcards, currentPage]);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <div className="pageContainer justify-center">
      <p className="text-red-500 font-bold text-lg">{error}</p>
    </div>
  ) : (
    <main className="pageContainer">
      <div className="flex w-full gap-2 mb-4 items-center">
        <h1 className="text-xl font-bold text-gray-600">
          {user?.name}
          {"'s"} favorites
        </h1>
      </div>
      {/* <div className="w-full bg-white p-5"> */}
      <div
        className={`w-full p-5 ${
          likesCount > 0 ? 'bg-white' : 'bg-transparent'
        }`}
      >
        <div className="flex flex-wrap justify-between after:flex-auto gap-4 mb-10">
          {likesWithPostcards.map((like) => (
            <Card key={like.id} className="bg-gray-100 shadow-lg h-[340px]">
              <Image
                src={`${like.postcard?.imageUrl}`}
                alt="postcard"
                priority={true}
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  width: 'auto',
                  minWidth: '240px',
                  height: '80%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
                onClick={() => redirect(`/postcards/${like.postcardId}`)}
              />
              {/* {like.postcard?.title} */}
              <div className="flex items-center justify-between px-4">
                <div className="flex flex-col py-2">
                  {/* userName */}
                  <Tooltip content="User profile">
                    <p
                      className="text-sm font-bold text-gray-500 underline cursor-pointer"
                      onClick={() =>
                        router.push(`/users/${like.postcard?.user.id}`)
                      }
                    >
                      {like.postcard?.user?.name}
                    </p>
                  </Tooltip>
                  {/* title */}
                  <p className="w-[120px] text-sm font-bold truncate">
                    {like.postcard?.title}
                  </p>
                </div>
                {/* Likes */}
                <Tooltip content="Like">
                  <div className="flex gap-1 items-center">
                    <HeartFilledIcon
                      color="red"
                      className="cursor-pointer"
                      onClick={() => handleDeleteLikePostcard(like)}
                    />

                    <div className="">
                      <p className="text-sm text-gray-500">
                        {like?.postcard?.likes !== 0
                          ? like?.postcard?.likes
                          : ''}
                      </p>
                    </div>
                  </div>
                </Tooltip>
              </div>
            </Card>
          ))}
        </div>

        {likesCount > pageSize && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            numberOfPages={numberOfPages}
          />
        )}
      </div>
    </main>
  );
};

export default Faves;
