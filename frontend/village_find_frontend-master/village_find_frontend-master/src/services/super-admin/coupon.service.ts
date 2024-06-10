import { HttpService } from '@/services/global';

export class CouponService {
  static async findOne(id: string) {
    return await HttpService.get(`/coupons/${id}`);
  }

  static async findAll(filter: string = '', category: string = '') {
    return await HttpService.get(`/coupons?name=${filter}&status=${category}`);
  }

  static async createOne(coupon: any) {
    return await HttpService.post('/coupons', coupon);
  }

  static async updateOne(id: string, coupon: any) {
    return await HttpService.put(`/coupons?id=${id}`, coupon);
  }

  static async deleteOne(id: string) {
    return await HttpService.delete(`/coupons?id=${id}`);
  }
}
