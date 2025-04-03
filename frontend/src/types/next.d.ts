import 'next';

declare module 'next' {
  interface NextApiRequest {
    params: {
      id: string;
    };
  }
}