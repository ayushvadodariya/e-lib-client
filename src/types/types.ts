export interface User {
  id: string,
  name: string,
  username: string;
  email: string,
  bio?: string;
  profilePhoto?: string,
  createdAt: Date;
  updatedAt?: Date;
}

export interface Author {
  _id: string,
  name: string,

} 
export interface Book {
  _id: string,
  title: string,
  description: string,
  genre: string,
  author: Author,
  coverImage: string,
  file: string,
  createdAt: string
}
