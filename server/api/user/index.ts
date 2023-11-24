import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: { userID: string };
    resBody: { id: string }[];
  };
  post: {
    reqBody: {
      userID: string;
    };
  };
}>;
