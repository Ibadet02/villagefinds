import { HttpService } from '@/services/global';

export class MetricService {
  static async findOne(id: string) {
    return await HttpService.get(`/settings/general/metric/${id}`);
  }

  static async findAll(filter: string = '', category: string = '') {
    return await HttpService.get(
      `/settings/general/metric?name=${filter}&status=${category}`,
    );
  }

  static async createOne(metric: any) {
    return await HttpService.post('/settings/general/metric', metric);
  }

  static async updateOne(id: string, metric: any) {
    return await HttpService.put(`/settings/general/metric?id=${id}`, metric);
  }

  static async deleteOne(id: string) {
    return await HttpService.delete(`/settings/general/metric?id=${id}`);
  }
}
