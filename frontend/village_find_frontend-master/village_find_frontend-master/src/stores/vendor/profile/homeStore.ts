import { create } from 'zustand';

export interface IBusinessInfo {
  name: string;
  phone: string;
  owner: string;
  address: string;
  email: string;
  zipcode: string;
}

export interface ISocialMediaUrls {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  linkedin: string;
}

export interface IStoreInfo {
  capacity: string;
  tags: string[];
  shortDesc: string;
  longDesc: string;
  miles: number;
}

export interface IProHomeStore {
  business: IBusinessInfo;
  socialUrls: ISocialMediaUrls;
  store: IStoreInfo;
  isOpen: boolean;
  setOpen: (_isOpen: boolean) => void;
}

const initialBusiness: IBusinessInfo = {
  name: '',
  phone: '',
  owner: '',
  address: '',
  email: '',
  zipcode: '',
};

const initialSocialUrls: ISocialMediaUrls = {
  facebook: 'http://facebook.com',
  twitter: 'http://twitter.com',
  instagram: 'http://instagram.com',
  youtube: 'http://youtube.com',
  linkedin: 'http://linkedin.com',
};

const initialStore: IStoreInfo = {
  capacity: '',
  tags: [],
  shortDesc: '',
  longDesc: '',
  miles: 0,
};

export const useProHomeStore = create<IProHomeStore>(set => ({
  business: initialBusiness,
  socialUrls: initialSocialUrls,
  store: initialStore,
  isOpen: false,
  setOpen: (_isOpen: boolean) => {
    set(state => ({
      ...state,
      isOpen: _isOpen,
    }));
  },
}));
