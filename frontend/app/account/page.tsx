'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import useAuthStore from '../store/authStore';
import useUserStore from '../store/userStore';
import { userRequest } from '@/lib/requestMethods';
import { formatDay } from '@/lib/formating';
import Loader from '@/components/loader/loader';
import SelectComponent from '@/components/ui/select';
import { userSchema } from '@/lib/schema';
import { UploadIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

const Account = () => {
  const router = useRouter();
  const { user: authUser, isLoading: authLoading, error } = useAuthStore();
  const { user, getUser, updateUser } = useUserStore();
  const [hydrated, setHydrated] = useState(false);

  const [currentUser, setCurrentUser] = useState<UpdUser>(
    user || ({} as UpdUser)
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [file, setFile] = useState<FormData | null>(null);

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const filesArray = Array.from(files);
      const newImageUrl = filesArray.map((file) => URL.createObjectURL(file));
      if (setImageUrl) {
        setImageUrl(newImageUrl);
      }

      // const forNameOfFile = `${Date.now()}_${files[0].name}`;
      const formData = new FormData();
      // formData.append('file', files[0], forNameOfFile);
      formData.append('file', files[0], files[0].name);
      if (setFile) {
        setFile(formData);
      }
      // setCurrentUser({
      //   ...currentUser,
      //   imageUrl: `http://212.113.120.58/media/${forNameOfFile}`,
      // });
    }
  };

  const deleteImage = async (image: string) => {
    if (image) {
      const fileName = image.slice(28);
      console.log(fileName);
      try {
        await userRequest.delete('/upload/image-delete', {
          data: { fileName: fileName },
        });
        await updateUser({ ...currentUser, imageUrl: null });
        await getUser(currentUser.id);
        setCurrentUser({ ...currentUser, imageUrl: null });
        setImageUrl([]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchImage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (file) {
      try {
        if (user?.imageUrl) {
          const fileName = user.imageUrl.slice(28);
          await userRequest.delete('/upload/image-delete', {
            data: { fileName: fileName },
          });
        }
        const response = await userRequest.post('/upload/image-upload', file);
        const imageUrl = response.data.imageUrl;
        await updateUser({ ...currentUser, imageUrl });
        setImageUrl([]);
        if (user?.id) await getUser(user.id);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = userSchema.safeParse(currentUser);

    if (result.success) {
      setErrors({});
      try {
        if (currentUser?.birthday) {
          await updateUser({
            ...currentUser,
            birthday: new Date(currentUser.birthday!).toISOString(),
          });
        } else {
          await updateUser(currentUser);
        }
        if (user?.id) await getUser(user.id);
      } catch (error) {
        console.log(error);
      }
    } else {
      const validationErrors = result.error.flatten().fieldErrors;
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    if (authUser?.id) getUser(authUser.id);
  }, [getUser, authUser?.id]);

  useEffect(() => {
    if (user?.id) setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !authLoading && !authUser) {
      router.push('/');
    }
  }, [hydrated, authUser, authLoading, router]);

  if (!hydrated || authLoading) return <Loader />;
  if (!authUser) return <Loader />;

  if (error) {
    return (
      <div className="pageContainer justify-center">
        <p className="text-red-500 font-bold">Error loading users: {error}</p>
      </div>
    );
  }

  return authLoading ? (
    <Loader />
  ) : (
    <main className="pageContainer bg-white">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 w-full p-5 md:p-6">
        {/* USER IMAGE */}
        <form onSubmit={fetchImage}>
          <div className="flex flex-col w-full">
            <h1 className="text-2xl font-bold text-gray-600">Settings</h1>
            <p>You can edit your settings below.</p>
          </div>
          <Image
            src={
              imageUrl.length === 1
                ? imageUrl[0]
                : currentUser?.imageUrl
                ? currentUser.imageUrl
                : '/user.png'
            }
            alt="currUser"
            priority={true}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto md:h-96"
          />
          <label
            htmlFor="file"
            className="cursor-pointer flex items-center gap-1 mt-4"
          >
            <UploadIcon width={20} height={20} />{' '}
            <p className="font-bold text-sm text-gray-600">Choose file</p>
          </label>
          <input
            id="file"
            type="file"
            className="hidden focus:bg-red-100 focus:text-gray-700"
            onChange={handleChangeImage}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="w-28 mt-4 p-1 text-white bg-[#3475b9] rounded hover:bg-[#3465b9] focus:outline-none focus:bg-[#3465b9] cursor-pointer appearance-auto"
            >
              Upload
            </button>
            <button
              type="button"
              className="w-28 mt-4 p-1 text-white bg-[#d72147] rounded hover:bg-[#b81134] focus:outline-none focus:bg-[#b81134] cursor-pointer appearance-auto"
              onClick={() =>
                currentUser?.imageUrl && deleteImage(currentUser.imageUrl)
              }
            >
              Delete
            </button>
          </div>
        </form>

        {/* USER DATA */}
        <form
          className="w-[100%] md:w-[40%] flex flex-col"
          onSubmit={handleSubmit}
        >
          <label className="text-sm text-gray-700 font-bold">Username:</label>
          <input
            placeholder="Username"
            className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none bg-slate-50 focus:bg-slate-200"
            value={currentUser?.name || ''}
            onChange={(e) =>
              setCurrentUser({ ...currentUser!, name: e.target.value })
            }
          />
          <div className="h-4">
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <label className="text-sm text-gray-700 font-bold">Email:</label>
          <input
            placeholder="Email"
            className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none bg-slate-50 focus:bg-slate-200"
            value={currentUser?.email || ''}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, email: e.target.value })
            }
          />
          <div className="h-4">
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <label className="text-sm text-gray-700 font-bold">Country:</label>
          <div className="bg-[#f6f6f6] border border-gray-300 focus:outline-none mb-3">
            <SelectComponent
              newUser={currentUser}
              setNewUser={setCurrentUser}
            />
          </div>

          <label className="text-sm text-gray-700 font-bold">City:</label>
          <input
            placeholder="City"
            className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none bg-slate-50 focus:bg-slate-200 mb-3"
            value={currentUser?.city || ''}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, city: e.target.value })
            }
          />

          <label className="text-sm text-gray-700">Birthday:</label>
          <input
            placeholder="Birthday"
            type="date"
            className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none bg-slate-50 focus:bg-slate-200 mb-3"
            value={
              currentUser?.birthday?.length === 10
                ? currentUser?.birthday
                : currentUser?.birthday?.slice(0, 10) || ''
            }
            onChange={(e) =>
              setCurrentUser({ ...currentUser, birthday: e.target.value })
            }
          />

          <label className="text-sm text-gray-700">About:</label>
          <textarea
            placeholder="Tell us about yourself"
            className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none bg-slate-50 focus:bg-slate-200"
            value={currentUser?.about || ''}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, about: e.target.value })
            }
          />

          <p className="mt-2 text-sm text-gray-700">
            Joined: {formatDay(user?.createdAt || null)}
          </p>

          {/* Submit button */}
          <button
            type="submit"
            className="w-28 mt-4 p-1 text-white bg-[#3475b9] rounded hover:bg-[#3465b9] focus:outline-none focus:bg-[#3465b9] cursor-pointer appearance-auto"
          >
            Edit Account
          </button>
        </form>
      </div>
    </main>
  );
};

export default Account;
