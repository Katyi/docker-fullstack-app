import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().email('Invalid email format').nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
});

export const postcardSchema = z.object({
  title: z.string().nonempty('Title is reqired'),
  description: z.string().nonempty('Description is required'),
  imageUrl: z.string().nonempty('Image name is required'),
});

export const albumSchema = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string().nonempty('Description is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
});
