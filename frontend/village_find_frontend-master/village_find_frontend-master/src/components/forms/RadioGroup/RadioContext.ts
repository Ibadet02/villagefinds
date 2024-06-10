import React from 'react';

export interface IRadioContext {
  value: string | string[];
  color: string;
  multiple: boolean;
  updateValue: (_value: string) => void;
}

export const initialContext: IRadioContext = {
  value: '',
  color: 'primary',
  multiple: false,
  updateValue: () => {},
};

export const RadioContext: React.Context<IRadioContext> =
  React.createContext(initialContext);
