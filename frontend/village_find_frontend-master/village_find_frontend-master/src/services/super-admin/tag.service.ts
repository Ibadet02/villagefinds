import { HttpService } from '@/services/global';

export class TagService {
  static async findOne(id: string) {
    return await HttpService.get(`/settings/general/tag/${id}`);
  }

  static async findAll(filter: string = '', category: string = '') {
    return await HttpService.get(
      `/settings/general/tag?name=${filter}&status=${category}`,
    );
  }

  static async createOne(category: any) {
    return await HttpService.post('/settings/general/tag', category);
  }

  static async updateOne(id: string, category: any) {
    return await HttpService.put(`/settings/general/tag?id=${id}`, category);
  }

  static async deleteOne(id: string) {
    return await HttpService.delete(`/settings/general/tag?id=${id}`);
  }
}
