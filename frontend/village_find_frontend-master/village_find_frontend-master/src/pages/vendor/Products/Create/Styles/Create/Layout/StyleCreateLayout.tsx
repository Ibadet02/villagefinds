import { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { IAttribute } from '..';

interface IStyleContext {
  styleName: string;
  setStyleName: (name: string) => void;
  attributes: IAttribute[];
  setAttributes: (attributes: IAttribute[]) => void;
}

export const StyleCreateContext = createContext<IStyleContext>({
  styleName: '',
  setStyleName: () => {},
  attributes: [],
  setAttributes: () => {},
});

export function StyleCreateLayout() {
  const [styleName, setStyleName] = useState('');
  const [attributes, setAttributes] = useState<IAttribute[]>([]);

  return (
    <StyleCreateContext.Provider
      value={{ attributes, setAttributes, styleName, setStyleName }}
    >
      <Outlet />
    </StyleCreateContext.Provider>
  );
}
