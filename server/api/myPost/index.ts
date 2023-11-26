import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: { userID: string };
    resBody: {
      id: string;
      userName: string;
      postTime: string;
      content: string;
      latitude: number;
      longitude: number;
      userID: string;
    }[];
  };

  post: {
    reqBody: {
      username: string;
      content: string;
      latitude: number;
      longitude: number;
      userID: string;
    };
  };

  delete: {
    query: { postID: string };
  };
}>;
