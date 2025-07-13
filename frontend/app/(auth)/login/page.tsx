'use client';

import { useEffect, useState } from 'react';
import { loginSchema } from '@/lib/schema';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/app/store/authStore';
import Link from 'next/link';
import Loader from '@/components/loader/loader';

const Login = () => {
  const router = useRouter();
  const {
    user: authUser,
    error,
    login,
    isLoggedIn,
    isLoading,
  } = useAuthStore();
  const [user, setUser] = useState<NewUser>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (isLoggedIn && authUser) {
      router.push('/');
    }
  }, [isLoggedIn, authUser, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = loginSchema.safeParse(user);

    if (result.success) {
      try {
        setErrors({});
        await login(user);
      } catch (error) {
        console.log(error);
      }
    } else {
      const validationErrors = result.error.flatten().fieldErrors;
      setErrors(validationErrors);
    }
  };

  if (error) {
    return (
      <div className="pageContainer justify-center">
        <p className="text-red-500 font-bold">Error: {error}</p>
      </div>
    );
  }

  return isLoading ? (
    <Loader />
  ) : (
    <main className="pageContainer justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white rounded shadow w-full lg:w-[80%] xl:w-1/2"
      >
        <h2 className="text-2xl gelasio">Log In</h2>
        <input
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="w-full mt-2 p-2 border bg-[#f6f6f6] border-gray-300 rounded outline-blue-300"
        />
        <div className="h-4 mb-2">
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>
        <input
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="w-full p-2 border bg-[#f6f6f6] border-gray-300 rounded outline-blue-300"
        />
        <div className="h-4">
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
        </div>
        <div className="h-auto mb-4 min-h-4">
          {!errors.password && !errors.email && (
            <p className="text-sm font-bold text-red-500">{error}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-28 p-2 text-white bg-blue-400 rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500 cursor-pointer"
        >
          Log In
        </button>
      </form>
      <Link
        href={'/sign-up'}
        className="mt-5 p-2 text-blue-400 font-bold focus:outline-none focus:text-blue-500"
      >
        Create New Account
      </Link>
    </main>
  );
};

export default Login;
