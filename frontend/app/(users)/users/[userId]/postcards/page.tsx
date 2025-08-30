'use client';

import useAuthStore from '@/app/store/authStore';
import useLikeStore from '@/app/store/likeStore';
import usePostcardStore from '@/app/store/postcardStore';
import useUserStore from '@/app/store/userStore';
import Gallery from '@/components/gallery/Gallery';
import Loader from '@/components/loader/loader';
import Pagination from '@/components/ui/pagination';
import Tooltip from '@/components/ui/tooltip';
import { pageSize } from '@/lib/constants';
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';
import { Card } from '@radix-ui/themes';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const UserPostcards = () => {
  const { user, error, isLoading, getUser } = useUserStore();
  const { user: currentUser } = useAuthStore();
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
    if (currentUser?.id) getLikes(currentUser.id);
  }, [currentUser, getLikes]);

  if (error) {
    return (
      <div className="pageContainer justify-center">
        <p className="text-red-500 font-bold">Error loading users: {error}</p>
      </div>
    );
  }

  return isLoading || !user ? (
    <Loader />
  ) : (
    <main className="pageContainer">
      <div className="flex w-full gap-2 mb-4 items-center">
        <h1 className="text-xl font-bold text-gray-600">
          {user?.name}
          {"'"}s public postcards
        </h1>
      </div>
      <div
        className={`w-full p-5 ${
          userPublicPostcardsCount > 0 ? 'bg-white' : 'bg-transparent'
        }`}
      >
        <Gallery
          items={publicPostcards}
          getPostcard={(p) => p}
          renderCardContent={(postcard) => (
            <div className="flex w-[calc(100%-32px)] items-center justify-between mt-4">
              <p className="w-[200px] text-sm font-bold truncate ml-4">
                {postcard.title}
              </p>
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
                      {postcard.likes !== 0 ? postcard.likes : null}
                    </p>
                  </div>
                </div>
              </Tooltip>
            </div>
          )}
        />

        {userPublicPostcardsCount > pageSize && (
          <>
            <br />
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              numberOfPages={numberOfPages}
            />
          </>
        )}
      </div>
    </main>
  );
};

export default UserPostcards;
