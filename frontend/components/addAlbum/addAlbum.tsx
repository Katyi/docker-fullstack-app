import { Dispatch, SetStateAction, useState } from 'react';
import { albumSchema } from '@/lib/schema';
import useAuthStore from '@/app/store/authStore';
import useAlbumStore from '@/app/store/albumStore';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { pageSize } from '@/lib/constants';

interface ComponentProps {
  newAlbum: NewAlbum;
  setNewAlbum: Dispatch<SetStateAction<NewAlbum>>;
  setAddModal: Dispatch<SetStateAction<boolean>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const AddAlbum = ({
  setAddModal,
  newAlbum,
  setNewAlbum,
  setCurrentPage,
}: ComponentProps) => {
  const { user } = useAuthStore();
  const { addAlbum, getAlbums, getUserAlbumCount } = useAlbumStore();
  const [errors, setErrors] = useState<ValidationErrors>({});

  //create album
  const handleAddAlbum = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = albumSchema.safeParse(newAlbum);

    if (result.success) {
      await addAlbum(newAlbum);
      if (user?.id) {
        await getAlbums(user.id, 0, pageSize);
        await getUserAlbumCount(user.id);
        setAddModal(false);
        setNewAlbum({
          title: '',
          description: '',
          userId: newAlbum.userId,
        });
        setCurrentPage(1);
      }
    } else {
      const validationErrors = result.error?.flatten().fieldErrors || {};
      setErrors(validationErrors);
    }
  };

  return (
    <form
      onSubmit={handleAddAlbum}
      className="p-3 bg-[#bbd6e2] rounded shadow w-[40vw]"
    >
      <div className="flex w-full justify-end mb-4">
        <CrossCircledIcon
          className="cursor-pointer"
          onClick={() => setAddModal(false)}
        />
      </div>
      <input
        placeholder="Title"
        value={newAlbum.title}
        onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none bg-slate-200 focus:bg-slate-50"
      />
      <div className="h-4 mb-2">
        {errors && <p className="text-xs text-red-500">{errors.title}</p>}
      </div>

      <input
        placeholder="Description"
        value={newAlbum.description}
        onChange={(e) =>
          setNewAlbum({ ...newAlbum, description: e.target.value })
        }
        className="w-full p-2 border border-gray-300 rounded focus:outline-none bg-slate-200 focus:bg-slate-50"
      />
      <div className="h-4 mb-3">
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-28 p-1 text-white bg-[#5f9ea0] rounded hover:opacity-80 focus:outline-none focus:bg-[#008080]"
      >
        Add Album
      </button>
    </form>
  );
};

export default AddAlbum;
