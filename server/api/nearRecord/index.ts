import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: { latitude: number; longitude: number };
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
}>;
