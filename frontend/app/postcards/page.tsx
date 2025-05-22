'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/app/store/authStore';
import usePostcardStore from '@/app/store/postcardStore';
import useLikeStore from '../store/likeStore';
import { Card } from '@radix-ui/themes';
import Loader from '@/components/loader/loader';
import Modal from '@/components/modal/modal';
import AddPostcard from '@/components/addPostcard/addPostcard';
import {
  CardStackPlusIcon,
  FileMinusIcon,
  FilePlusIcon,
  HeartFilledIcon,
  HeartIcon,
} from '@radix-ui/react-icons';
import AddToAlbum from '@/components/addToAlbum/addToAlbum';
import Tooltip from '@/components/ui/tooltip';
import { userRequest } from '@/lib/requestMethods';
import Pagination from '@/components/ui/pagination';
import { pageSize } from '@/lib/constants';

const Postcards = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    postcards,
    isLoading,
    error,
    postcardsCount,
    getPostcards,
    deletePostcard,
    updatePostcard,
    getUserPostcardsCount,
  } = usePostcardStore();
  const { getLikes, likes, addLike, deleteLike, deleteLikesOfPostcard } =
    useLikeStore();
  const [addModal, setAddModal] = useState<boolean>(false);
  const [addModal1, setAddModal1] = useState<boolean>(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [file, setFile] = useState<FormData | null>(null);
  const [newPostcard, setNewPostcard] = useState<NewPostcard>({
    title: '',
    description: '',
    imageUrl: '',
    public: true,
  });
  const [currentPostcard, setCurrentPostcard] = useState<Postcard | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const numberOfPages = Math.ceil(postcardsCount / pageSize);

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
    await getUserPostcardsCount(postcard.userId);
    await getPostcards(postcard.userId, (currentPage - 1) * pageSize, pageSize);
    if (postcards.length === 1 && postcardsCount > pageSize)
      setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    if (user?.id) getUserPostcardsCount(user.id);
  }, [user, getUserPostcardsCount]);

  useEffect(() => {
    if (user?.id) getPostcards(user.id, (currentPage - 1) * pageSize, pageSize);
  }, [getPostcards, user, currentPage]);

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
    <main className="pageContainer">
      <div className="flex w-full gap-2 mb-4 items-center">
        <h1 className="text-xl font-bold text-gray-600">
          {user?.name}
          {"'s"} all postcards
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
          postcardsCount > 0 ? 'bg-white' : 'bg-transparent'
        }`}
      >
        <div className="flex flex-wrap justify-between after:flex-auto gap-4 mb-10">
          {postcards?.map((postcard: Postcard) => (
            <Card key={postcard.id} className="bg-gray-100 shadow-lg h-[340px]">
              <Tooltip content="View postcard">
                <Image
                  src={`${postcard.imageUrl}`}
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
                  onClick={() => router.push(`/postcards/${postcard.id}`)}
                />
              </Tooltip>
              <div className="flex flex-col px-4 py-2 gap-1">
                {/* title */}
                <p className="w-[200px] text-sm font-bold truncate ">
                  {postcard.title}
                </p>

                {/* add, delete and like buttons */}
                <div className="flex gap-2 items-center justify-between">
                  <div className="flex gap-2 items-center justify-start">
                    {/* Add to album */}
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
                    {/* Delete postcard */}
                    <Tooltip content="Delete postcard">
                      <FileMinusIcon
                        className="cursor-pointer"
                        onClick={() => handleDeletePostcard(postcard)}
                      />
                    </Tooltip>
                  </div>
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

        {postcardsCount > pageSize && (
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
    </main>
  );
};

export default Postcards;
