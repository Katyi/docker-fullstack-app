'use client';

import Loader from '@/components/loader/loader';
import useAuthStore from './store/authStore';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import usePostcardStore from './store/postcardStore';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card } from '@radix-ui/themes';
import Pagination from '@/components/ui/pagination';
import Tooltip from '@/components/ui/tooltip';
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';
import useLikeStore from './store/likeStore';
import { pageSize } from '@/lib/constants';
import Postcards from './postcards/page';

const Home = () => {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const {
    allPublicPostcards,
    publicPostcardsCount,
    getAllPublicPostcards,
    getAllPublicPostcardsCount,
    updatePostcard,
  } = usePostcardStore();
  const { getLikes, likes, addLike, deleteLike } = useLikeStore();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const numberOfPages = Math.ceil(publicPostcardsCount / pageSize);

  const handleLikePostcard = async (postcard: Postcard) => {
    try {
      if (user?.id) {
        await addLike({ userId: user.id, postcardId: postcard.id });
        await getLikes(user.id);
        await updatePostcard({
          ...postcard,
          likes: postcard.likes ? postcard.likes + 1 : 1,
        });
        await getAllPublicPostcards((currentPage - 1) * pageSize, pageSize);
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
      }
      await getAllPublicPostcards((currentPage - 1) * pageSize, pageSize);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllPublicPostcards((currentPage - 1) * pageSize, pageSize);
  }, [getAllPublicPostcards, currentPage]);

  useEffect(() => {
    getAllPublicPostcardsCount();
  }, [getAllPublicPostcardsCount]);

  useEffect(() => {
    if (user?.id) getLikes(user.id);
  }, [user, getLikes]);

  return isLoading ? (
    <Loader />
  ) : (
    <main className="pageContainer">
      {/* <NavBar /> */}
      <div className="w-full bg-white p-5 z-1">
        <h1 className="text-3xl font-bold mb-4">What about this project?</h1>
        <p className="mt-3 mb-3">
          It is a project that allows you store your Postcrossing collection,
          either privately or share them with the world.
          <Link href={'./about'} className="text-blue-500">
            {'  '}
            Learn more about Postcrossing.
          </Link>
        </p>
        <h1 className="text-3xl font-bold mb-4">How does it work?</h1>
        <p className="mt-3 mb-3">
          Welcome to home for all your postcards. It is the site on the web for
          organizing, sharing and storing your postcrossing postcards. We
          provide you the tools for easy collaboration between postcrossers.
        </p>
      </div>
      <br />

      {/* PUBLIC POSTCARDS */}
      <div className="w-full bg-white p-5">
        <p className="mt-3 mb-3 text-3xl font-bold text-center sm:text-left">
          Postcards gallery
        </p>
        <div className="flex flex-wrap w-full justify-center sm:justify-between gap-4 sm:after:flex-auto mb-10">
          {allPublicPostcards.map((postcard) => (
            // <Card key={postcard.id} className="bg-gray-100 shadow-lg h-[340px]">
            <Card
              key={postcard.id}
              className="bg-gray-100 shadow-lg w-[80vw] h-fit sm:w-auto sm:h-[340px] flex-grow-0"
            >
              <Tooltip content="View postcard">
                <Image
                  src={postcard.imageUrl}
                  alt="postcard"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto sm:w-auto sm:min-h-[240px] sm:h-[84%] object-cover cursor-pointer"
                  onClick={() => redirect(`/postcards/${postcard.id}`)}
                />
              </Tooltip>
              <div className="flex items-center justify-between px-4">
                <div className="flex flex-col py-2">
                  {/* Username */}
                  <Tooltip content="User profile">
                    <p
                      className="text-sm font-bold text-gray-500 underline cursor-pointer"
                      onClick={() => router.push(`/users/${postcard.userId}`)}
                    >
                      {postcard.user.name}
                    </p>
                  </Tooltip>
                  {/* title */}
                  <p className="w-[120px] text-sm font-bold truncate">
                    {postcard.title}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {/* Likes */}
                  <Tooltip content="Like">
                    <div className="flex gap-1 items-center">
                      {postcard.likes &&
                      likes.find((item) => item.postcardId === postcard.id) ? (
                        // {postcard.Like?.userId
                        <HeartFilledIcon
                          color="red"
                          className="cursor-pointer"
                          // onClick={() => handleLikePostcard(postcard)}
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
                          {postcard.likes !== 0 ? postcard.likes : ''}
                        </p>
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {publicPostcardsCount > pageSize && (
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

export default Home;
