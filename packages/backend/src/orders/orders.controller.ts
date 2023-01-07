import {
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Param,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/user.decorator';
import { OrdersService } from './orders.service';
import { FilesService } from 'src/files/files.service';
import Moment from 'moment';
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly filesService: FilesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createOrder(@Body() data, @CurrentUser() user) {
    data.owner = !user.owner ? user._id : user.owner;
    let orderData;
    if (!data._id) {
      data.owner = !user.owner ? user._id : user.owner;
      data.createDate = data.statusUpdateDate = new Date();
      orderData = await this.orderService.create(data);
    } else {
      const order = await this.orderService.getOrder(data._id);
      const oldStatus = JSON.stringify(order.status);
      const newStatus = JSON.stringify(data.status);
      const oldMember = JSON.stringify(order.teammate);
      const newMember = JSON.stringify(data.teammate);
      const oldProduct = JSON.stringify(order.product);
      const newProduct = JSON.stringify(data.product);
      const oldCustomer = JSON.stringify(order.customer);
      const newCustomer = JSON.stringify(data.customer);
      const oldSize = JSON.stringify(order.size);
      const newSize = JSON.stringify(data.size);
      const oldPrimColor = JSON.stringify(order.primary_color);
      const newPrimColor = JSON.stringify(data.primary_color);
      const oldSecColor = JSON.stringify(order.secondary_color);
      const newSecColor = JSON.stringify(data.secondary_color);
      const oldProbe = JSON.stringify(order.probe);
      const newProbe = JSON.stringify(data.probe);
      const oldWeight = JSON.stringify(order.expected_weight);
      const newWeight = JSON.stringify(data.expected_weight);
      const oldDueDate = JSON.stringify(order.dueDate);
      const newDueDate = JSON.stringify(data.dueDate);

      if (oldMember !== newMember) {
        if (order.logs) {
          order.logs.push({
            user: user.fname + ' ' + user.lname,
            date: new Date(),
            activity: `Asignee changed from ${order.teammate?.fname} to ${data.teammate?.fname}`,
          });
        } else {
          order.logs = [
            {
              user: user.fname + ' ' + user.lname,
              date: new Date(),
              activity: `Asignee changed from ${order.teammate?.fname}  to ${data.teammate?.lname}`,
            },
          ];
        }
      }
      if (oldProduct !== newProduct) {
        if (order.logs) {
          order.logs.push({
            user: user.fname + ' ' + user.lname,
            date: new Date(),
            activity: `Product changed from ${order.product.name} to ${data.product.name}`,
          });
        } else {
          order.logs = [
            {
              user: user.fname + ' ' + user.lname,
              date: new Date(),
              activity: `Product changed from ${order.product.name} to ${data.product.name}`,
            },
          ];
        }
      }
      if (oldCustomer !== newCustomer) {
        if (order.logs) {
          order.logs.push({
            user: user.fname + ' ' + user.lname,
            date: new Date(),
            activity: `Customer changed from ${order.customer.fname} to ${data.customer.fname}`,
          });
        } else {
          order.logs = [
            {
              user: user.fname + ' ' + user.lname,
              date: new Date(),
              activity: `Customer changed from ${order.customer.fname} to ${data.customer.fname}`,
            },
          ];
        }
      }
      if (oldSize !== newSize) {
        if (order.logs) {
          order.logs.push({
            user: user.fname + ' ' + user.lname,
            date: new Date(),
            activity: `Size changed from ${order.size} to ${data.size}`,
          });
        } else {
          order.logs = [
            {
              user: user.fname + ' ' + user.lname,
              date: new Date(),
              activity: `Size changed from ${order.size} to ${data.size}`,
            },
          ];
        }
      }
      if (oldPrimColor !== newPrimColor) {
        if (order.logs) {
          order.logs.push({
            user: user.fname + ' ' + user.lname,
            date: new Date(),
            activity: `Primary color changed from ${order.primary_color} to ${data.primary_color}`,
          });
        } else {
          order.logs = [
            {
              user: user.fname + ' ' + user.lname,
              date: new Date(),
              activity: `Primary color changed from ${order.primary_color} to ${data.primary_color}`,
            },
          ];
        }
      }
      if (oldSecColor !== newSecColor) {
        if (order.logs) {
          order.logs.push({
            user: user.fname + ' ' + user.lname,
            date: new Date(),
            activity: `Secondary color changed from ${order.secondary_color} to ${data.secondary_color}`,
          });
        } else {
          order.logs = [
            {
              user: user.fname + ' ' + user.lname,
              date: new Date(),
              activity: `Secondary color changed from ${order.secondary_color} to ${data.secondary_color}`,
            },
          ];
        }
      }
      if (oldWeight !== newWeight) {
        if (order.logs) {
          order.logs.push({
            user: user.fname + ' ' + user.lname,
            date: new Date(),
            activity: `Weight changed from ${order.expected_weight} to ${data.expected_weight}`,
          });
        } else {
          order.logs = [
            {
              user: user.fname + ' ' + user.lname,
              date: new Date(),
              activity: `Weight changed from ${order.expected_weight} to ${data.expected_weight}`,
            },
          ];
        }
      }
      if (oldProbe !== newProbe) {
        if (order.logs) {
          order.logs.push({
            user: user.fname + ' ' + user.lname,
            date: new Date(),
            activity: `Probe changed from ${order.probe} to ${data.probe}`,
          });
        } else {
          order.logs = [
            {
              user: user.fname + ' ' + user.lname,
              date: new Date(),
              activity: `Probe changed from ${order.probe} to ${data.probe}`,
            },
          ];
        }
      }
      if (oldDueDate !== newDueDate) {
        if (order.logs) {
          order.logs.push({
            user: user.fname + ' ' + user.lname,
            date: new Date(),
            activity: `Due date changed ${order.dueDate} to ${data.dueDate}`,
          });
        } else {
          order.logs = [
            {
              user: user.fname + ' ' + user.lname,
              date: new Date(),
              activity: `Due date changed ${order.dueDate} to ${data.dueDate}`,
            },
          ];
        }
      }
      data.logs = order.logs;
      orderData = await this.orderService.update(data);
      if (oldStatus !== newStatus) {
        if (order.logs) {
          order.logs.push({
            user: user.fname + ' ' + user.lname,
            date: new Date(),
            activity: `Status changed from ${order.status.text}  to ${data.status.text}`,
          });
        } else {
          order.logs = [
            {
              user: user.fname + ' ' + user.lname,
              date: new Date(),
              activity: `Status changed from ${order.status.text}  to ${data.status.text}`,
            },
          ];
        }
        this.statusUpdated(orderData, data.status?.notification);
      }
    }
    return orderData;
  }

  @Get(':status')
  @UseGuards(AuthGuard('jwt'))
  async getOrders(@Req() data, @Param('status') status, @CurrentUser() user) {
    console.log('Orders')
    const order = await this.orderService.get(user, status);
    return order;
  }

  @Get('/order/:id')
  async getOrder(@Param('id') id) {
    return await this.orderService.getOrder(id);
  }

  @Post('delete')
  @UseGuards(AuthGuard('jwt'))
  async deleteOrder(@Body() data) {
    const order = await this.orderService.delete(data);
    return order;
  }

  statusUpdated(order, notify) {
    order.statusUpdateDate = new Date();
    this.orderService.update(order);
    if (notify) {
      this.orderService.informCustomer(order);
    }
  }
}
