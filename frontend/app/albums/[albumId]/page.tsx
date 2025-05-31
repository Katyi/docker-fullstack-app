'use client';

import { useEffect, useState } from 'react';
import AddPostcard from '@/components/addPostcard/addPostcard';
import Modal from '@/components/modal/modal';
import usePostcardStore from '@/app/store/postcardStore';
import Image from 'next/image';
import { Card } from '@radix-ui/themes';
import { redirect, useParams } from 'next/navigation';
import Loader from '@/components/loader/loader';
import useAlbumStore from '@/app/store/albumStore';
import {
  CardStackPlusIcon,
  FileMinusIcon,
  FilePlusIcon,
  HeartFilledIcon,
  HeartIcon,
} from '@radix-ui/react-icons';
import Tooltip from '@/components/ui/tooltip';
import useLikeStore from '@/app/store/likeStore';
import useAuthStore from '@/app/store/authStore';
import { userRequest } from '@/lib/requestMethods';
import Pagination from '@/components/ui/pagination';
import { pageSize } from '@/lib/constants';
import AddToAlbum from '@/components/addToAlbum/addToAlbum';

const AlbumPage = () => {
  const params = useParams<{ albumId: string }>();
  const albumId = params.albumId;

  const {
    postcardsInAlbum,
    isLoading,
    error,
    getPostcardByAlbumId,
    updatePostcard,
    deletePostcard,
    // postcardsCount,
    postcardsInAlbumCount,
    // getUserPostcardsCount,
    getPostcardByAlbumIdCount,
  } = usePostcardStore();
  const { user } = useAuthStore();
  const { album, getAlbum } = useAlbumStore();
  const { getLikes, likes, addLike, deleteLike, deleteLikesOfPostcard } =
    useLikeStore();
  const [addModal, setAddModal] = useState<boolean>(false);
  const [addModal1, setAddModal1] = useState<boolean>(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [file, setFile] = useState<FormData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPostcard, setCurrentPostcard] = useState<Postcard | null>(null);
  const [newPostcard, setNewPostcard] = useState<NewPostcard>({
    title: '',
    description: '',
    imageUrl: '',
    albumId: albumId,
    public: true,
  });

  const numberOfPages = Math.ceil(postcardsInAlbumCount / pageSize);

  const deleteImage = async (image: string) => {
    const fileName = image.slice(28);

    try {
      await userRequest.delete('/upload/image-delete', {
        data: { fileName: fileName },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikePostcard = async (postcard: Postcard) => {
    try {
      if (user?.id) {
        await addLike({ userId: user.id, postcardId: postcard.id });
        await getLikes(user.id);
        await updatePostcard({
          ...postcard,
          likes: postcard.likes ? postcard.likes + 1 : 1,
        });
        getPostcardByAlbumId(albumId, (currentPage - 1) * pageSize, pageSize);
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
          likes: postcard.likes ? postcard.likes - 1 : 0,
        });
        getPostcardByAlbumId(albumId, (currentPage - 1) * pageSize, pageSize);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToAlbum = async (postcard: Postcard, album: Album) => {
    if (!postcard.albumId) {
      await updatePostcard({ ...postcard, albumId: album.id });
      setAddModal1(false);
    } else if (postcard.albumId) {
      if (postcard.albumId === album.id) {
        await updatePostcard({ ...postcard, albumId: null });
        setAddModal1(false);
      } else {
        await updatePostcard({ ...postcard, albumId: album.id });
        setAddModal1(false);
      }
    }
  };

  const handleDeletePostcard = async (postcard: Postcard) => {
    await deleteImage(postcard.imageUrl);
    await deleteLikesOfPostcard(postcard.id);
    await deletePostcard(postcard.id);
    await getPostcardByAlbumIdCount(albumId);
    await getPostcardByAlbumId(albumId, (currentPage - 1) * pageSize, pageSize);
    if (postcardsInAlbum.length === 1 && postcardsInAlbumCount > pageSize)
      setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    getPostcardByAlbumIdCount(albumId);
  }, [getPostcardByAlbumIdCount, albumId]);

  useEffect(() => {
    getAlbum(albumId);
    getPostcardByAlbumId(albumId, (currentPage - 1) * pageSize, pageSize);
  }, [getPostcardByAlbumId, getAlbum, albumId, currentPage]);

  useEffect(() => {
    if (user?.id) getLikes(user.id);
  }, [user, getLikes]);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <div className="pageContainer justify-center">
      <p className="text-red-500 font-bold text-lg">{error}</p>
    </div>
  ) : (
    <div className="pageContainer">
      <div className="flex w-full items-center gap-2 mb-4">
        <h1 className="text-xl font-bold text-gray-600">
          Album: {album?.title}
        </h1>
        <Tooltip content={'Add new postcard'}>
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
          postcardsInAlbumCount > 0 ? 'bg-white' : 'bg-transparent'
        }`}
      >
        <div className="mt-5 flex flex-wrap w-[calc(80vw-40px)] gap-4 justify-between after:flex-auto mb-10">
          {postcardsInAlbum.map((postcard) => (
            <Card
              key={postcard.id}
              className="bg-gray-100 shadow-lg w-[80vw] h-fit sm:w-auto sm:h-[340px] flex-grow-0"
            >
              <Tooltip content="View postcard">
                <Image
                  src={`${postcard?.imageUrl}`}
                  alt="postcard"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto sm:min-h-[240px] sm:h-[80%] object-cover cursor-pointer"
                  onClick={() => redirect(`/postcards/${postcard.id}`)}
                />
              </Tooltip>
              {/* title, delete and likes */}
              <div className="flex flex-col px-4 py-2 gap-1">
                {/* title and description */}
                <h2 className="text-sm font-bold align-text-top">
                  {postcard.title}
                </h2>

                {/* delete and likes */}
                <div className="flex gap-1 items-center justify-between">
                  {/* Add to album and Delete postcard */}
                  <div className="flex items-center gap-0.5">
                    <Tooltip content="Add to album">
                      <button
                        type="button"
                        className="border-transparent focus:outline-none cursor-pointer"
                        onClick={() => {
                          setAddModal1(true);
                          setCurrentPostcard(postcard);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setAddModal1(false);
                          }
                        }}
                      >
                        <FilePlusIcon />
                      </button>
                    </Tooltip>

                    <Tooltip content="Delete postcard">
                      <FileMinusIcon
                        className="cursor-pointer"
                        onClick={() => handleDeletePostcard(postcard)}
                      />
                    </Tooltip>
                  </div>
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
                      <p className="text-sm text-gray-500">
                        {/* {postcard.likes} */}
                        {postcard.likes !== 0 ? postcard.likes : ''}
                      </p>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {postcardsInAlbumCount > pageSize && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            numberOfPages={numberOfPages}
          />
        )}
      </div>

      {/* modal for create new user */}
      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        setNewPostcard={setNewPostcard}
      >
        <AddPostcard
          album={album}
          postcardsInAlbum={postcardsInAlbum}
          setAddModal={setAddModal}
          newPostcard={{ ...newPostcard, userId: user?.id }}
          setNewPostcard={setNewPostcard}
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          file={file}
          setFile={setFile}
          setCurrentPage={setCurrentPage}
        />
      </Modal>

      <Modal isOpen={addModal1} onClose={() => setAddModal1(false)}>
        {currentPostcard && (
          <AddToAlbum
            setAddModal1={setAddModal1}
            handleAddToAlbum={handleAddToAlbum}
            currentPostcard={currentPostcard}
          />
        )}
      </Modal>
    </div>
  );
};

export default AlbumPage;
