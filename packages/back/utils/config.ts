import path from 'path';

export const FILES_PATH =
  process.env.NODE_ENV === 'production'
    ? '/app/files'
    : path.join(__dirname, '..', 'files');
