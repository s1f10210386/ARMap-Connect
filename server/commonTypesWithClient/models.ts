import { z } from 'zod';
import { taskIdParser } from '../service/idParsers';

export type UserModel = {
  id: string;
  email: string | undefined;
  displayName: string | undefined;
  photoURL: string | undefined;
};
export type PostModel = {
  id: string;
  userName: string;
  postTime: string;
  content: string;
  latitude: number;
  longitude: number;
  userID: string;
  likeCount: number;
};

export const taskParser = z.object({
  id: taskIdParser,
  label: z.string(),
  done: z.boolean(),
  created: z.number(),
});

export type TaskModel = z.infer<typeof taskParser>;
