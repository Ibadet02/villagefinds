import { HttpService } from '@/services';
import React, { useEffect, useState } from 'react';

interface ICategory {
  _id: string;
  name: string;
}

interface ICategoryContext {
  isCategoryBar: boolean;
  toggleCategoryBar: () => void;
  setCategoryBar: (show: boolean) => void;
  categories: ICategory[];
  filter: string;
  setFilter: (filter: string) => void;
}

export const CategoryContext = React.createContext<ICategoryContext>({
  isCategoryBar: false,
  toggleCategoryBar: () => {},
  setCategoryBar: () => {},
  categories: [],
  filter: '',
  setFilter: () => {},
});

interface ICategoryContextProps {
  children: React.ReactNode;
}

export function CategoryProvider({ children }: ICategoryContextProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    HttpService.get(
      '/settings/general/category',
      filter ? { filter } : {},
    ).then(response => {
      setCategories(response || []);
    });
  }, [filter]);

  return (
    <CategoryContext.Provider
      value={{
        isCategoryBar: isEnabled,
        toggleCategoryBar: () => setIsEnabled(!isEnabled),
        setCategoryBar: (show: boolean) => setIsEnabled(show),
        categories,
        filter,
        setFilter,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}
