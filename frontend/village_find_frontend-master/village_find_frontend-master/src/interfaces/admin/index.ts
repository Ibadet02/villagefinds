export interface IProductTag {
  _id?: string;
  name: string;
  status: string;
}

export interface IMetric {
  _id?: string;
  name: string;
  status: string;
}

export interface ICategory {
  _id?: string;
  name: string;
  status: string;
}

export interface IPost {
  _id?: string;
  name: string;
  topic: string;
  status: string;
}

export interface ICustomer {
  _id?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  status: string;
  phone: string;
  address: string;
}

export interface ICoupon {
  _id?: string;
  name: string;
  type: string;
  status: string;
  discount: number;
}

export interface IOrder {}

export interface ISubscription {
  _id?: string;
  name: string;
  title: string;
  status: string;
}
