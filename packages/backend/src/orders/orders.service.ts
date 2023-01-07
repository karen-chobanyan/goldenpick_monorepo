import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'bson';
import { viberBot } from 'src/main';
import { Order } from 'src/orders/order.entity';
import { ViberService } from 'src/viber/viber.service';
import { Repository } from 'typeorm';
import { Events as BotEvents } from 'viber-bot';
import { Message } from 'viber-bot';

const TextMessage = Message.Text;
const PictureMessage = Message.Picture;

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly viberService: ViberService,
    private httpService: HttpService,
  ) {
    this.setupBot();
  }

  async get(user, status?): Promise<Order[]> {
    const owner = user.owner ? user.owner : user._id;
    const query = { owner: owner };
    const userStasuses = user.userRole.statuses;
    if (user.userType !== 'Admin') {
      query['status.text'] = { $in: userStasuses };
    }
    if (status == 'active') {
      query['status.text'] = { ...query['status.text'], $ne: 'Completed' };
    } else if (status == 'overdue') {
      query['status.text'] = { $ne: 'Completed' };
      query['dueDate'] = { $lte: new Date() };
    } else {
      query['status.text'] = 'Completed';
    }

    return this.orderRepository.find({ where: query });
  }

  async create(data: Order): Promise<Order> {
    return this.orderRepository.save(data);
  }

  async update(orderData: Order): Promise<Order> {
    return this.orderRepository.save({
      ...orderData,
      _id: new ObjectID(orderData._id),
    });
  }

  async getOrder(_id): Promise<Order> {
    return this.orderRepository.findOne(_id);
  }

  async find(q): Promise<Order[]> {
    return this.orderRepository.find(q);
  }

  async delete(_id): Promise<any> {
    return await this.orderRepository.remove(
      await this.orderRepository.findOne(_id._id),
    );
  }

  setupBot() {
    console.log('response');
    viberBot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
      console.log('response');
      const newUser = await this.checkSaveProfile(response.userProfile);
      if (newUser) {
        this.informAdminsNewSubscription(response);
      } else {
        this.sendMessageToAdmins(response, message);
      }
    });

    viberBot.on(BotEvents.SUBSCRIBED, (response) => {
      this.checkSaveProfile(response.userProfile);
      response.send(
        new TextMessage(
          `Hope to see you again soon ${response.userProfile?.name}!)`,
        ),
      );
      this.informAdminsNewSubscription(response);
    });

    viberBot.on(BotEvents.UNSUBSCRIBED, (response) => {
      this.deleteProfile(response);
    });

    viberBot.onTextMessage(/^hi|hello$/i, (message, response) =>
      response.send(
        new TextMessage(
          `Hi there ${JSON.stringify(response.userProfile?.name)}. I am ${
            viberBot.name
          }`,
        ),
      ),
    );
  }

  sendMessageToAdmins(response, message) {
    this.httpService
      .get('https://chatapi.viber.com/pa/get_account_info', {
        headers: {
          'X-Viber-Auth-Token':
            '4d6d9feadca7d3ad-c68c681b3aedebcb-6a3e54d2089e97d5',
        },
      })
      .subscribe(
        (profile: any) => {
          const admins = profile.data.members;
          admins.map((admin) => {
            viberBot.sendMessage(admin, [
              new TextMessage(
                response.userProfile?.name +
                  ' wrote:\n' +
                  (message.text ? message.text : 'Not a Text Message!!!'),
              ),
            ]);
          });
        },
        (error) => {
          console.log(error);
        },
      );
  }

  informAdminsNewSubscription(response) {
    this.httpService
      .get('https://chatapi.viber.com/pa/get_account_info', {
        headers: {
          'X-Viber-Auth-Token':
            '4d6d9feadca7d3ad-c68c681b3aedebcb-6a3e54d2089e97d5',
        },
      })
      .subscribe(
        (profile: any) => {
          const admins = profile.data.members;
          admins.map((admin) => {
            viberBot.sendMessage(admin, [
              new TextMessage(
                `${response.userProfile?.name} subscribed to receive messages from me.`,
              ),
              new TextMessage(
                `Please add the Viber ID of the user to his contact`,
              ),
              new TextMessage(`The ID is: ${response.userProfile?.id}`),
            ]);
          });
        },
        (error) => {
          console.log(error);
        },
      );
  }

  informCustomer(order) {
    this.viberService.findOne(order.customer.viberId).then((profile) => {
      if (!!profile) {
        if (order.product.images.length) {
          viberBot.sendMessage(profile, [
            new PictureMessage(order.product.images[0]?.url),
          ]);
        }
        viberBot.sendMessage(profile, [
          new TextMessage(`${order.status?.text}`),
        ]);
      }
    });
  }

  async checkSaveProfile(profile) {
    return await this.viberService.checkSave(profile);
  }

  deleteProfile(id) {
    this.viberService.delete(id);
  }
}
