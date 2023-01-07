import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { startOfDay } from 'date-fns';
import { database } from 'src/mongoconfig';
import { Order } from 'src/orders/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async find(status): Promise<number> {
    const now = new Date();
    let data = [];

    if (status == 'overdue') {
      data = await this.orderRepository.find({
        where: {
          'status.text': { $ne: 'Completed' },
          dueDate: { $lt: now.toISOString() },
        },
      });
    }

    if (status == 'active') {
      data = await this.orderRepository.find({
        where: {
          'status.text': { $ne: 'Completed' },
        },
      });
    }
    if (status == 'total') {
      data = await this.orderRepository.find();
    }
    return data.length;
  }
}
