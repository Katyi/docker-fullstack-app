import useAlbumStore from '@/app/store/albumStore';
import useAuthStore from '@/app/store/authStore';
import usePostcardStore from '@/app/store/postcardStore';
import { pageSize } from '@/lib/constants';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { Checkbox } from '@radix-ui/themes';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, use, useEffect } from 'react';

interface ComponentProps {
  setAddModal1: Dispatch<SetStateAction<boolean>>;
  handleAddToAlbum: (postcard: Postcard, album: Album) => void;
  currentPostcard: Postcard;
}

const AddToAlbum = ({
  setAddModal1,
  handleAddToAlbum,
  currentPostcard,
}: ComponentProps) => {
  const { user } = useAuthStore();
  const { albums, getAlbums } = useAlbumStore();
  const { postcards } = usePostcardStore();

  useEffect(() => {
    if (user?.id) getAlbums(user.id, 0, pageSize);
  }, [getAlbums, user]);

  return (
    <div className="w-[400px] h-[300px] bg-[#bbd6e2] flex flex-col items-center overflow-y-scroll pb-4">
      <div className="flex w-full justify-end pr-2 pt-2">
        <CrossCircledIcon
          className="cursor-pointer"
          onClick={() => setAddModal1(false)}
        />
      </div>
      <p className="text-sm font-bold my-3 uppercase">Choose album</p>
      {albums.map((album) => (
        <div
          key={album.id}
          className="flex flex-col w-full hover:bg-gray-200 py-2 px-4"
        >
          <div className="flex justify-between  items-center">
            {postcards.reverse().find((item) => item.albumId === album.id) ? (
              <Image
                src={`${
                  postcards.find((item) => item.albumId === album.id)?.imageUrl
                }`}
                alt="image"
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div className="w-[50px] h-[50px] bg-gray-400 flex items-center justify-center">
                <p className="text-[7px] font-thin">no postcards</p>
              </div>
            )}
            <div className="flex flex-col w-[200px]">
              <p className="text-sm font-bold">{album.title}</p>
              <p className="text-sm font-thin">{album.description}</p>
            </div>
            <Checkbox
              size="3"
              className="bg-teal-600 w-4 h-4 flex items-center justify-center text-white font-semibold rounded-sm "
              onCheckedChange={() => handleAddToAlbum(currentPostcard, album)}
              checked={currentPostcard.albumId === album.id}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddToAlbum;
