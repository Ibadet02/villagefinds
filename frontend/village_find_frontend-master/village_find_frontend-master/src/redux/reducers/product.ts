import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface IAttribute {
  name: string;
  values: string[];
}

export interface IInventory {
  attrs: string[];
  price: number;
  quantity: number;
  status: string;
  image: string;
}

export interface IGeneral {
  name: string;
  deliveryTypes: string[];
  category: string;
  shortDesc: string;
  longDesc: string;
  disclaimer: string;
  price: number;
  quantity: number;
  soldByUnit: string;
  tax: number;
}

type IUpdateGeneral = Partial<IGeneral>;

export interface IStyle {
  index: number;
  name: string;
  discount?: number;
  attributes: IAttribute[];
  inventories: IInventory[];
  images?: (File | null)[];
  imageSrcs: string[];
  status: string;
}

type IUpdateStyle = Partial<IStyle>;

export interface ISpecification {
  index: number;
  name: string;
  value: string;
}

type IUpdateSpec = Partial<ISpecification>;

export interface ICustomization {
  customText: string;
  fee: number;
}

export interface ISubscription {
  iscsa: boolean;
  frequencies: string[];
  discount: number;
  csa?: {
    frequency: string;
    duration: number;
    startDate?: string;
    endDate?: string;
  };
}

interface ProductState {
  styles: IStyle[];
  general: IGeneral;
  specifications: ISpecification[];
  iscustomizable: boolean;
  customization: ICustomization;
  subscription: ISubscription;
  currentStyleID: number;
}

const initialState: ProductState = {
  styles: [],
  general: {
    name: '',
    deliveryTypes: [],
    category: '',
    shortDesc: '',
    longDesc: '',
    disclaimer: '',
    soldByUnit: '',
    price: 0,
    quantity: 0,
    tax: 0,
  },
  specifications: [],
  iscustomizable: false,
  customization: {
    customText: '',
    fee: 0,
  },
  subscription: {
    iscsa: false,
    frequencies: [],
    discount: 0,
  },
  currentStyleID: -1,
};

export const productReducer = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetProduct: (state: ProductState) => {
      state.general = initialState.general;
      state.styles = initialState.styles;
      state.iscustomizable = initialState.iscustomizable;
      state.customization = initialState.customization;
      state.specifications = initialState.specifications;
      state.subscription = initialState.subscription;
      state.currentStyleID = initialState.currentStyleID;
    },
    updateGeneral: (
      state: ProductState,
      action: PayloadAction<IUpdateGeneral>,
    ) => {
      state.general = { ...state.general, ...action.payload };
      const deliveryTypes = action.payload.deliveryTypes;
      state.subscription.iscsa =
        deliveryTypes?.includes('Local Subscriptions') || false;
    },
    createStyle: (state: ProductState, action: PayloadAction<IStyle>) => {
      const count = state.styles.length;
      state.styles.push({ ...action.payload, index: count });
      state.currentStyleID = count;
    },
    updateStyle: (
      state: ProductState,
      action: PayloadAction<{ id: number; style: IUpdateStyle }>,
    ) => {
      const style = state.styles[action.payload.id];
      const result = { ...style, ...action.payload.style };
      state.styles = state.styles.map(item =>
        item.index === action.payload.id ? result : item,
      );
    },
    deleteStyle: (state: ProductState, action: PayloadAction<number>) => {
      state.styles = state.styles.filter(item => item.index !== action.payload);
    },
    createSpec: (
      state: ProductState,
      action: PayloadAction<ISpecification>,
    ) => {
      const count = state.specifications.length;
      state.specifications.push({ ...action.payload, index: count });
    },
    updateSpec: (
      state: ProductState,
      action: PayloadAction<{ id: number; spec: IUpdateSpec }>,
    ) => {
      const spec = state.specifications[action.payload.id];
      const result = { ...spec, ...action.payload.spec };
      state.specifications = state.specifications.map((item: ISpecification) =>
        item.index === action.payload.id ? result : item,
      );
    },
    deleteSpec: (state: ProductState, action: PayloadAction<number>) => {
      state.specifications.filter(item => item.index !== action.payload);
    },
    updateCustomization: (
      state: ProductState,
      action: PayloadAction<{
        iscustomizable: boolean;
        customization: ICustomization;
      }>,
    ) => {
      state.iscustomizable = action.payload.iscustomizable;
      state.customization = action.payload.customization;
    },
    updateSubscription: (
      state: ProductState,
      action: PayloadAction<ISubscription>,
    ) => {
      state.subscription = action.payload;
    },
  },
});

export const {
  resetProduct,
  updateGeneral,
  createStyle,
  updateStyle,
  deleteStyle,
  createSpec,
  updateSpec,
  deleteSpec,
  updateCustomization,
  updateSubscription,
} = productReducer.actions;

export default productReducer.reducer;
