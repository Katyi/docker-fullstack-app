'use client';

import useAuthStore from '@/app/store/authStore';
import useLikeStore from '@/app/store/likeStore';
import usePostcardStore from '@/app/store/postcardStore';
import useUserStore from '@/app/store/userStore';
import Pagination from '@/components/ui/pagination';
import Tooltip from '@/components/ui/tooltip';
import { pageSize } from '@/lib/constants';
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';
import { Card } from '@radix-ui/themes';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const UserPostcards = () => {
  const { user } = useAuthStore();
  const { user: currentUser, getUser } = useUserStore();
  const {
    getPublicPostcards,
    publicPostcards,
    userPublicPostcardsCount,
    getPublicPostcardsCount,
    updatePostcard,
  } = usePostcardStore();
  const { getLikes, likes, addLike, deleteLike, deleteLikesOfPostcard } =
    useLikeStore();
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const numberOfPages = Math.ceil(userPublicPostcardsCount / pageSize);

  const handleLikePostcard = async (postcard: Postcard) => {
    try {
      if (user?.id) {
        await addLike({ userId: user.id, postcardId: postcard.id });
        await getLikes(user.id);
        await updatePostcard({
          ...postcard,
          likes: postcard.likes ? postcard.likes + 1 : 1,
        });
        await getPublicPostcards(
          userId,
          (currentPage - 1) * pageSize,
          pageSize
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteLikePostcard = async (postcard: Postcard) => {
    try {
      const like = likes.find((item) => item.postcardId === postcard.id);
      if (like) {
        await deleteLike(like.id);
        await getLikes(like.userId);
        await updatePostcard({
          ...postcard,
          likes:
            postcard.likes !== 1 && postcard.likes ? postcard.likes - 1 : null,
        });
        await getPublicPostcards(
          userId,
          (currentPage - 1) * pageSize,
          pageSize
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) getPublicPostcardsCount(userId);
  }, [userId, getPublicPostcardsCount]);

  useEffect(() => {
    if (userId) {
      getPublicPostcards(userId, (currentPage - 1) * pageSize, pageSize);
      getUser(userId);
    }
  }, [getPublicPostcards, getUser, userId, currentPage]);

  useEffect(() => {
    if (user?.id) getLikes(user.id);
  }, [user, getLikes]);

  return (
    <main className="pageContainer">
      <div className="flex w-full gap-2 mb-4 items-center">
        <h1 className="text-xl font-bold text-gray-600">
          {currentUser?.name}
          {"'"}s public postcards
        </h1>
      </div>
      <div
        className={`w-full p-5 ${
          userPublicPostcardsCount > 0 ? 'bg-white' : 'bg-transparent'
        }`}
      >
        <div className="flex flex-wrap justify-between after:flex-auto gap-4 mb-10">
          {publicPostcards.map((postcard: Postcard) => (
            <Card
              key={postcard.id}
              className="bg-gray-100 shadow-lg w-[80vw] h-fit sm:w-auto sm:h-[340px] flex-grow-0"
            >
              <Tooltip content="View postcard">
                <Image
                  src={`${postcard.imageUrl}`}
                  alt="postcard"
                  priority={true}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto sm:min-h-[240px] sm:h-[80%] object-cover cursor-pointer"
                  onClick={() => router.push(`/postcards/${postcard.id}`)}
                />
              </Tooltip>

              <div className="flex w-[calc(100%-32px)] items-center justify-between mt-4">
                {/* title */}
                <p className="w-[200px] text-sm font-bold truncate ml-4">
                  {postcard.title}
                </p>
                {/* Likes */}
                <Tooltip content="Like">
                  <div className="flex gap-1 items-center justify-between w-7 h-6">
                    {postcard.likes &&
                    likes.find((item) => item.postcardId === postcard.id) ? (
                      <HeartFilledIcon
                        color="red"
                        className="cursor-pointer"
                        onClick={() => handleDeleteLikePostcard(postcard)}
                      />
                    ) : (
                      <HeartIcon
                        className="cursor-pointer"
                        onClick={() => handleLikePostcard(postcard)}
                      />
                    )}
                    <div className="">
                      <p className="text-sm text-gray-500">
                        {/* {postcard.likes} */}
                        {postcard.likes !== 0 ? postcard.likes : null}
                      </p>
                    </div>
                  </div>
                </Tooltip>
              </div>
            </Card>
          ))}
        </div>

        {userPublicPostcardsCount > pageSize && (
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

export default UserPostcards;
