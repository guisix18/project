import { Request } from 'express';

export const urlGen = (request: Request) => {
  const protocol = request.protocol;
  const host = request.get('Host');
  const originalUrl = request.originalUrl;
  const fullUrl = `${protocol}://${host}${originalUrl}`;

  return fullUrl;
};
