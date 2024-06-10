import { create } from 'zustand';

import { IPost } from '@/interfaces';

interface IPostStore {
  posts: IPost[];
  setPosts: (_posts: IPost[]) => void;
  updatePost: (id: string, post: IPost) => void;
  deletePost: (id: string) => void;
}

const initialPosts: IPost[] = [];

export const usePostStore = create<IPostStore>(set => ({
  posts: initialPosts,
  setPosts: (_posts: IPost[]) => {
    set(state => ({
      ...state,
      posts: _posts,
    }));
  },
  updatePost: (id: string, post: IPost) => {
    set(state => ({
      ...state,
      posts: state.posts.map((_post: IPost) =>
        _post._id === id ? post : _post,
      ),
    }));
  },
  deletePost: (id: string) => {
    set(state => ({
      ...state,
      posts: state.posts.filter(({ _id }) => id !== _id),
    }));
  },
}));
