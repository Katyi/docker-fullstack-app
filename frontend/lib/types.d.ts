interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  country?: string;
  city?: string;
  birthday?: string;
  about?: string;
  imageUrl?: string;
  createdAt?: string;
}

interface NewUser {
  name: string;
  email: string;
  country?: string;
  city?: string;
  birthday?: string;
  password: string;
  about?: string;
  imageUrl?: string;
}
interface UpdUser {
  id: string;
  name?: string;
  email?: string;
  country?: string;
  city?: string;
  birthday?: string;
  about?: string;
  imageUrl?: string | null;
}

interface ValidationErrors {
  [key: string]: string[];
}

type HeaderMenuItem = {
  url: string;
  label: string;
};

interface Postcard {
  user: User;
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tag?: string;
  public?: boolean;
  likes?: number | null;
  userId: string;
  albumId?: string | null;
  createdAt?: string;
  user?: User;
  Like?: Like;
}
interface NewPostcard {
  title: string;
  description: string;
  imageUrl?: string;
  albumId?: string | null;
  userId?: string;
  public: boolean;
}

interface UserPageProps {
  params: Params;
  searchParams: SearchParams;
}

interface PostcardPageProps {
  params: Params;
  searchParams: SearchParams;
}

interface NavBarProps {
  params: Params;
  searchParams: SearchParams;
}

interface Album {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  userId: string;
  postcard?: Postcard[];
}
interface NewAlbum {
  title: string;
  description: string;
  userId?: string | null;
}

interface UpdateAlbum {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
}

interface Like {
  id: string;
  userId: string;
  postcardId: string;
  postcard?: Postcard;
  user?: User;
}

interface newLike {
  userId: string;
  postcardId: string;
}

interface PaginationProps {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  numberOfPages: number;
}

interface Countries {
  name: string;
  code: string;
  emoji: string;
  unicode: string;
  image: string;
  dial_code: string;
}
