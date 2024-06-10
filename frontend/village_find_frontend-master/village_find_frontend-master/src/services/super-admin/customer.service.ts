import { HttpService } from '@/services/global';

export class CustomerService {
  static async findOne(id: string) {
    return await HttpService.get(`/user/customer/${id}`);
  }

  static async findAll(filter: string = '', category: string = '') {
    return await HttpService.get(
      `/user/customer?name=${filter}&status=${category}`,
    );
  }

  static async createOne(customer: any) {
    return await HttpService.post('/user/customer', customer);
  }

  static async updateOne(id: string, customer: any) {
    return await HttpService.put(`/user/customer/${id}`, customer);
  }

  static async deleteOne(id: string) {
    return await HttpService.delete(`/user/customer?id=${id}`);
  }
}
