import { create } from 'zustand';

import { IProductTag } from '@/interfaces';

interface ITagStore {
  tags: IProductTag[];
  setTags: (_tags: IProductTag[]) => void;
  updateTag: (id: string, tags: IProductTag) => void;
  deleteTag: (id: string) => void;
}

const initialPosts: IProductTag[] = [];

export const useTagsStore = create<ITagStore>(set => ({
  tags: initialPosts,
  setTags: (_tags: IProductTag[]) => {
    set(state => ({
      ...state,
      tags: _tags,
    }));
  },
  updateTag: (id: string, tag: IProductTag) => {
    set(state => ({
      ...state,
      tags: state.tags.map((_tag: IProductTag) =>
        _tag._id === id ? tag : _tag,
      ),
    }));
  },
  deleteTag: (id: string) => {
    set(state => ({
      ...state,
      tags: state.tags.filter(({ _id }) => id !== _id),
    }));
  },
}));
