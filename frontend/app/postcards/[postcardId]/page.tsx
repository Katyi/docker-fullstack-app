'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useAlbumStore from '@/app/store/albumStore';
import usePostcardStore from '@/app/store/postcardStore';
import { formatDay } from '@/lib/formating';
import { myImageLoader } from '@/lib/utils';
import Image from 'next/image';

const PostcardPage = () => {
  const params = useParams<{ postcardId: string }>();
  const postcardId = params?.postcardId;
  const {
    postcard,
    getPostcard,
    isLoading: isPostcardLoading,
  } = usePostcardStore();
  const { album, getAlbum, isLoading: isAlbumLoading } = useAlbumStore();
  // const [isLoading, setIsLoading] = useState(true);
  // const [albumLoading, setAlbumLoading] = useState(false);

  useEffect(() => {
    // Выполняем загрузку только если ID открытки есть и она еще не загружена в хранилище
    if (postcardId && postcard?.id !== postcardId) {
      getPostcard(postcardId);
    }
  }, [postcardId, getPostcard, postcard?.id]);

  useEffect(() => {
    // Выполняем загрузку только если ID альбома есть и он еще не загружен в хранилище
    if (postcard?.albumId && album?.id !== postcard.albumId) {
      getAlbum(postcard.albumId);
    }
  }, [postcard?.albumId, album?.id, getAlbum, postcard]);

  if (!postcardId) {
    return (
      <div className="pageContainer justify-center">
        <p className="text-red-500 font-bold text-lg">Postcard ID not found</p>
      </div>
    );
  }

  if (isPostcardLoading || !postcard) {
    return (
      <div className="pageContainer justify-center">
        <p className="text-gray-600 font-bold text-lg">Loading postcard...</p>
      </div>
    );
  }

  return (
    <main className="pageContainer">
      <div className="mt-6 flex flex-col lg:flex-row lg:justify-around bg-white w-full lg:p-6">
        <Image
          loader={myImageLoader}
          src={`${postcard?.imageUrl}`}
          alt="postcard"
          priority={true}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto lg:w-auto lg:h-96"
        />

        <div className="p-4 w-full flex flex-col lg:items-center">
          <h1 className="text-xl font-bold text-gray-800 text-center mb-2">
            {postcard?.title}
          </h1>
          <p>Description: {postcard?.description}</p>
          <p>Album: {album?.title ? album.title : 'no album'}</p>
          <p>Public: {postcard?.public ? 'Yes' : 'No'}</p>
          <p>Tag: {postcard?.tag}</p>
          <p>Created: {formatDay(postcard?.createdAt || '')} </p>
        </div>
      </div>
    </main>
  );
};

export default PostcardPage;
