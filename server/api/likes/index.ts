import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: { postId: string };
    resBody: {
      likeCount: number;
    };
  };
  post: {
    reqBody: {
      postId: string;
      userId: string;
    };
    resBody: {
      likeCount: number;
    };
  };
  patch: {
    reqBody: {
      postId: string;
      userId: string;
    };
    resBody: number;
  };
  delete: {
    reqBody: {
      postId: string;
    };
    resBody: string;
  };
}>;
