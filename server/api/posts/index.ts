import type { PostModel } from '$/commonTypesWithClient/models';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: { latitude: number; longitude: number };
    resBody: PostModel[];
  };
  post: {
    reqBody: {
      postId: string;
      userId: string;
    };
  };
}>;
