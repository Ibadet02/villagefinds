import { create } from 'zustand';

import { ICategory } from '@/interfaces';

interface ICategoryStore {
  categories: ICategory[];
  setCategories: (_categories: ICategory[]) => void;
  updateCategory: (id: string, category: ICategory) => void;
  deleteCategory: (id: string) => void;
}

const initialCategories: ICategory[] = [];

export const useCategoryStore = create<ICategoryStore>(set => ({
  categories: initialCategories,
  setCategories: (_categories: ICategory[]) => {
    set(state => ({
      ...state,
      categories: _categories,
    }));
  },
  updateCategory: (id: string, category: ICategory) => {
    set(state => ({
      ...state,
      categories: state.categories.map((_category: ICategory) =>
        _category._id === id ? category : _category,
      ),
    }));
  },
  deleteCategory: (id: string) => {
    set(state => ({
      ...state,
      categories: state.categories.filter(({ _id }) => id !== _id),
    }));
  },
}));
