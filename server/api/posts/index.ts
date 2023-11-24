import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: {
      id: string;
      userName: string;
      postTime: string;
      content: string;
      latitude: number;
      longitude: number;
      likes: number;
      userID: string;
    }[];
  };
  patch: {
    reqBody: {
      postID: string;
      increment: boolean;
    };
  };
}>;
