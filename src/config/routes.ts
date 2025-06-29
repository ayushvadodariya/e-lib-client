export const ROUTES = {
  ROOT: '/',
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  APP: {
    HOME: '/',
    BOOKS: '/books',
    BOOKS_CREATE: '/books/create',
    SETTINGS: '/settings',
    READ: '/read',
    PROFILE: '/profile'
  }
} as const;