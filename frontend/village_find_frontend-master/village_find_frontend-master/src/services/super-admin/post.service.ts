import { HttpService } from '@/services/global';

export class PostService {
  static async findOne(id: string) {
    return await HttpService.get(`/settings/general/scenter/${id}`);
  }

  static async findAll(filter: string = '', category: string = '') {
    return await HttpService.get(
      `/settings/general/scenter?name=${filter}&status=${category}`,
    );
  }

  static async createOne(category: any) {
    return await HttpService.post('/settings/general/scenter', category);
  }

  static async updateOne(id: string, category: any) {
    return await HttpService.put(
      `/settings/general/scenter?id=${id}`,
      category,
    );
  }

  static async deleteOne(id: string) {
    return await HttpService.delete(`/settings/general/scenter?id=${id}`);
  }
}
