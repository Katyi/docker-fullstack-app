'use client';

import { ChangeEvent, useState } from 'react';
import { userSchema } from '@/lib/schema';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/app/store/authStore';
import SelectComponent from '@/components/ui/select';
import { UploadIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { userRequest } from '@/lib/requestMethods';

const SignUp = () => {
  const { error, register, isLoggedIn } = useAuthStore();
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    password: '',
  });
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

      const forNameOfFile = `${Date.now()}_${files[0].name}`;
      const formData = new FormData();
      formData.append('file', files[0], forNameOfFile);
      if (setFile) {
        setFile(formData);
      }
      setNewUser({
        ...newUser,
        imageUrl: `http://212.113.120.58/media/${forNameOfFile}`,
      });
    }
  };

  const fetchImage = async () => {
    try {
      await userRequest.post('/upload/image-upload', file);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      await fetchImage();
    }

    const result = userSchema.safeParse(newUser);

    if (result.success) {
      try {
        setErrors({});
        if (newUser.birthday) {
          await register({
            ...newUser,
            birthday: new Date(newUser.birthday!).toISOString(),
          });
        } else {
          await register(newUser);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const validationErrors = result.error.flatten().fieldErrors;
      setErrors(validationErrors);
    }
  };

  if (isLoggedIn) {
    redirect('/');
  }

  return (
    <main className="pageContainer justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white rounded shadow w-full lg:w-[80%] xl:w-1/2"
      >
        <h1 className="text-2xl gelasio">Join!</h1>
        <div className="grid grid-cols-2 gap-x-8 gap-y-0 mt-2">
          {/* USER NAME */}
          <div>
            <input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full p-2 border bg-[#f6f6f6] border-gray-300 rounded outline-blue-300"
            />
            <div className="h-4 mb-2">
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>
          </div>
          {/* USER EMAIL */}
          <div>
            <input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="w-full p-2 border bg-[#f6f6f6] border-gray-300 rounded outline-blue-300"
            />
            <div className="h-4 mb-2">
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
          {/* USER COUNTRY */}
          <div className="bg-[#f6f6f6] border border-gray-300 rounded mb-6">
            <SelectComponent newUser={newUser} setNewUser={setNewUser} />
          </div>
          {/* USER CITY */}
          <input
            placeholder="City"
            value={newUser.city}
            onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
            className="w-full p-2 border bg-[#f6f6f6] border-gray-300 rounded outline-blue-300 mb-6"
          />
          {/* BIRTHDAY */}
          <input
            placeholder="Birthday"
            type="date"
            name="date"
            id="date"
            value={newUser.birthday || ''}
            onChange={(e) =>
              setNewUser({ ...newUser, birthday: e.target.value })
            }
            className="w-full p-2 border bg-[#f6f6f6] border-gray-300 rounded outline-blue-300 mb-10"
          />
          {/* USER PASSWORD */}
          <div className="">
            <input
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="w-full p-2 border bg-[#f6f6f6] border-gray-300 rounded outline-blue-300"
            />
            <div className="h-4">
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="h-4 mb-2">
              {!errors.password && !errors.email && (
                <p className="text-sm font-bold text-red-500">{error}</p>
              )}
            </div>
          </div>
          {/* ABOUT */}
          <textarea
            placeholder="Tell us about yourself"
            value={newUser.about}
            onChange={(e) => setNewUser({ ...newUser, about: e.target.value })}
            className="w-full p-2 border bg-[#f6f6f6] border-gray-300 rounded outline-blue-300 mb-6"
          />
          {/* USER IMAGE */}
          <div className="mb-6">
            <label
              htmlFor="file"
              className="cursor-pointer flex items-center gap-1"
            >
              <UploadIcon width={20} height={20} />{' '}
              <p className="font-bold text-sm text-gray-600">upload image</p>
            </label>
            <input
              id="file"
              type="file"
              className="hidden focus:bg-red-100 focus:text-gray-700"
              onChange={handleChangeImage}
            />
            {/* Image for upload */}
            <div className="flex gap-2 h-20 w-8 mt-2">
              {imageUrl?.map((url) => (
                <Image
                  key={url}
                  src={url}
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="img"
                  style={{
                    width: 'auto',
                    maxWidth: '100px',
                    height: '70px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="mt-2 w-28 p-2 text-white bg-blue-400 rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500 cursor-pointer"
        >
          Sign Up
        </button>
      </form>

      {/* LINK TO LOGIN */}
      <Link
        href={'/login'}
        className="mt-5 p-2 text-blue-400 font-bold focus:outline-none focus:text-blue-500"
      >
        You have already account? Sign In
      </Link>
    </main>
  );
};

export default SignUp;
