import { getAlbum, getPostcard } from '@/lib/actions';
import { formatDay } from '@/lib/formating';
import Image from 'next/image';

const PostcardPage = async (props: PostcardPageProps) => {
  const { postcardId } = await props.params;
  const postcard: Postcard = await getPostcard(postcardId);
  const album = postcard?.albumId ? await getAlbum(postcard.albumId) : null;

  if (!postcard) {
    return (
      <div className="pageContainer justify-center">
        <p className="text-red-500 font-bold text-lg">Postcard ID not found</p>
      </div>
    );
  }
  return (
    <main className="pageContainer">
      <div className="mt-6 flex flex-col lg:flex-row lg:justify-around bg-white w-full lg:p-6">
        <Image
          src={postcard.imageUrl}
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
