'use client';

import AddAlbum from '@/components/addAlbum/addAlbum';
import Modal from '@/components/modal/modal';
import { useEffect, useState } from 'react';
import useAlbumStore from '@/app/store/albumStore';
import usePostcardStore from '@/app/store/postcardStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Loader from '@/components/loader/loader';
import { Card } from '@radix-ui/themes';
import {
  CardStackPlusIcon,
  FileMinusIcon,
  // HeartIcon,
} from '@radix-ui/react-icons';
import Tooltip from '@/components/ui/tooltip';
import useAuthStore from '@/app/store/authStore';
import { pageSize } from '@/lib/constants';
import Pagination from '@/components/ui/pagination';
import { myImageLoader } from '@/lib/utils';

const Albums = () => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const {
    albums,
    isLoading,
    error,
    albumsCount,
    getAlbums,
    deleteAlbum,
    getUserAlbumCount,
  } = useAlbumStore();
  const { postcards, getUserPostcards } = usePostcardStore();
  const [addModal, setAddModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    description: '',
    // userId: user?.id ? user.id : '',
  });

  const numberOfPages = Math.ceil(albumsCount / pageSize);

  const handleDeleteAlbum = async (album: Album) => {
    await deleteAlbum(album.id);
    await getUserAlbumCount(album.userId);
    await getAlbums(album.userId, (currentPage - 1) * pageSize, pageSize);
    if (albums.length === 1 && albumsCount > pageSize)
      setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    if (user?.id) getUserAlbumCount(user.id);
  }, [user, getUserAlbumCount]);

  useEffect(() => {
    if (user?.id) {
      getAlbums(user.id, (currentPage - 1) * pageSize, pageSize);
      getUserPostcards(user.id, 0, 5);
    }
  }, [user?.id, getAlbums, getUserPostcards, currentPage]);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  return isLoading || !user ? (
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
          {"'s"} albums
        </h1>

        <Tooltip content={'Add new album'}>
          <button
            className="border-none focus:outline-none cursor-pointer"
            onClick={() => setAddModal(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setAddModal(false);
            }}
          >
            <CardStackPlusIcon />
          </button>
        </Tooltip>
      </div>

      <div
        className={`w-full p-5 ${
          albumsCount > 0 ? 'bg-white' : 'bg-transparent'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albums.map((album) => (
            // <div key={album.id} className="bg-white shadow rounded p-4">
            <Card
              key={album.id}
              className="bg-gray-100 shadow-lg h-[300px] md:h-[250px] xl:h-[300px] 
              w-full sm:w-[calc((80vw-40px-16px)/2)] md:w-[calc((80vw-40px-32px)/3)] 
              lg:w-[calc((80vw-40px-48px)/4)]"
            >
              {postcards.find((item) => item.albumId === album.id) ? (
                <Image
                  loader={myImageLoader}
                  src={`${
                    postcards.findLast((item) => item.albumId === album.id)
                      ?.imageUrl
                  }`}
                  alt="albumImage"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-[80%] object-cover cursor-pointer"
                  onClick={() => router.push(`/albums/${album.id}`)}
                />
              ) : (
                <div
                  className="w-[100%] h-[80%] bg-gray-200 flex items-center justify-center cursor-pointer px-4"
                  onClick={() => router.push(`/albums/${album.id}`)}
                >
                  No postcards yet in this album
                </div>
              )}
              <div className="flex items-center justify-between px-6 py-2">
                <div>
                  <h2 className="text-sm font-bold">{album.title}</h2>
                  <p className="text-gray-500 text-sm">{album.description}</p>
                </div>
                <Tooltip content="Delete album">
                  <div className="flex gap-2">
                    <FileMinusIcon
                      className="cursor-pointer"
                      onClick={() => handleDeleteAlbum(album)}
                    />
                  </div>
                </Tooltip>
              </div>
            </Card>
          ))}
        </div>

        {albumsCount > pageSize && (
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

      {/* modal for create new user */}
      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        setNewAlbum={setNewAlbum}
      >
        <AddAlbum
          setAddModal={setAddModal}
          newAlbum={{ ...newAlbum, userId: user?.id }}
          setNewAlbum={setNewAlbum}
          setCurrentPage={setCurrentPage}
        />
      </Modal>
    </main>
  );
};

export default Albums;
