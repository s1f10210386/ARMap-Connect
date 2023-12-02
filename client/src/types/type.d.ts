// type.d.ts
interface Window {
  handleLike: (postId: string) => Promise<void>;

  deletePostContent: (postID: string) => Promise<void>;
}
