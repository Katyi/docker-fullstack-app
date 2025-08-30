import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { postcardSchema } from '@/lib/schema';
import usePostcardStore from '@/app/store/postcardStore';
import { CrossCircledIcon, UploadIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { Checkbox } from '@radix-ui/themes';
import { pageSize } from '@/lib/constants';
import useImageStore from '@/app/store/imageStore';

interface ComponentProps {
  newPostcard: NewPostcard;
  setNewPostcard: Dispatch<SetStateAction<NewPostcard>>;
  setAddModal: Dispatch<SetStateAction<boolean>>;
  album?: Album | null;
  postcardsInAlbum?: Postcard[];
  imageUrls?: string[];
  setImageUrls?: Dispatch<SetStateAction<string[]>>;
  file?: FormData | null;
  setFile?: Dispatch<SetStateAction<FormData | null>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const AddPostcard = ({
  setAddModal,
  newPostcard,
  setNewPostcard,
  album,
  imageUrls,
  setImageUrls,
  file,
  setFile,
  setCurrentPage,
}: ComponentProps) => {
  const {
    getUserPostcards,
    addPostcard,
    getPostcardByAlbumId,
    getUserPostcardsCount,
    getPostcardByAlbumIdCount,
  } = usePostcardStore();
  const { uploadImage } = useImageStore();
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const filesArray = Array.from(files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      if (setImageUrls) {
        setImageUrls(newImageUrls);
      }

      const formData = new FormData();
      formData.append('file', files[0], files[0].name);
      if (setFile) {
        setFile(formData);
      }
    }
  };

  //create postcard
  const handleAddPostcard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let width, height, imageUrl;
    if (file) {
      await uploadImage(file);
      const uploaded = useImageStore.getState().uploadedImage;
      if (uploaded) {
        width = uploaded?.width;
        height = uploaded?.height;
        imageUrl = uploaded?.imageUrl;
      }
    }

    const postcardToSend = {
      ...newPostcard,
      width,
      height,
      imageUrl,
    };

    const result = postcardSchema.safeParse(postcardToSend);
    if (result.success) {
      await addPostcard(postcardToSend);
      if (!album && newPostcard.userId) {
        await getUserPostcards(newPostcard.userId, 0, pageSize);
        await getUserPostcardsCount(newPostcard.userId);
      }
      if (album && newPostcard.albumId) {
        await getPostcardByAlbumId(album.id, 0, pageSize);
        await getPostcardByAlbumIdCount(newPostcard.albumId);
      }

      setCurrentPage(1);
      setAddModal(false);
      setNewPostcard({
        title: '',
        description: '',
        imageUrl: '',
        albumId: album?.id,
        userId: newPostcard.userId,
        public: true,
      });
      if (setImageUrls) {
        setImageUrls([]);
      }
    } else {
      const validationErrors = result.error.flatten().fieldErrors;
      setErrors(validationErrors);
    }
  };

  return (
    <form
      onSubmit={handleAddPostcard}
      className="p-4 w-[30vw] bg-[#bbd6e2] rounded shadow flex flex-col"
    >
      <div className="flex w-full justify-end mb-4">
        <CrossCircledIcon
          className="cursor-pointer"
          onClick={() => setAddModal(false)}
        />
      </div>

      {/* Title */}
      <input
        placeholder="Title"
        value={newPostcard.title}
        onChange={(e) =>
          setNewPostcard({ ...newPostcard, title: e.target.value })
        }
        className="w-full p-2 border border-gray-300 rounded focus:outline-none bg-slate-200 focus:bg-slate-50"
      />
      <div className="h-4 mb-2">
        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
      </div>

      {/* Description */}
      <input
        placeholder="Description"
        value={newPostcard.description}
        onChange={(e) =>
          setNewPostcard({ ...newPostcard, description: e.target.value })
        }
        className="w-full p-2 border border-gray-300 rounded focus:outline-none bg-slate-200 focus:bg-slate-50"
      />
      <div className="h-4 mb-1">
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Public or Not */}
      <div className="flex gap-2 mb-3 items-center">
        <Checkbox
          id="publicPostcard"
          size="3"
          className="bg-teal-600 w-4 h-4 flex items-center justify-center text-white font-semibold rounded-sm"
          onCheckedChange={(checked) =>
            setNewPostcard({ ...newPostcard, public: checked === true })
          }
          checked={newPostcard.public}
        />
        <label
          htmlFor="publicPostcard"
          className="font-bold text-sm text-gray-600"
        >
          public view
        </label>
      </div>

      {/* Upload image */}
      <label htmlFor="file" className="cursor-pointer flex items-center gap-1">
        <UploadIcon width={20} height={20} />{' '}
        <p className="font-bold text-sm text-gray-600 ">upload postcard</p>
      </label>
      <input
        id="file"
        type="file"
        className="hidden focus:bg-red-100 focus:text-gray-700"
        onChange={handleChangeImage}
      />
      <div className="h-4 mb-3 flex">
        {errors.imageUrl && (
          <p className="text-xs text-red-500">{errors.imageUrl}</p>
        )}
      </div>

      {/* Image for upload */}
      <div className="flex gap-2 h-8 w-8">
        {imageUrls?.map((url) => (
          <Image key={url} src={url} width={30} height={30} alt="img" />
        ))}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-28 mt-4 p-1 text-white bg-[#5f9ea0] rounded hover:opacity-80 focus:outline-none focus:bg-[#008080] cursor-pointer"
      >
        Add Postcard
      </button>
    </form>
  );
};

export default AddPostcard;
