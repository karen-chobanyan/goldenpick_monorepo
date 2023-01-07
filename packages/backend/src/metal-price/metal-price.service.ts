import { Injectable } from '@nestjs/common';
import { UpdateMetalPriceDto } from './dto/update-metal-price.dto';
import { MetalPrice } from 'src/metal-price/metal-price.entity';
import { MoreThan, Repository, LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { startOfDay, format } from 'date-fns';
import axios from 'axios';

export const MoreThanDate = (date: Date) =>
  MoreThan(format(date, 'YYYY-MM-DD HH:MM:SS'));
export const LessThanDate = (date: Date) =>
  LessThan(format(date, 'YYYY-MM-DD HH:MM:SS'));
@Injectable()
export class MetalPriceService {
  constructor(
    @InjectRepository(MetalPrice)
    private readonly priceRepository: Repository<MetalPrice>,
  ) {}

  async getPrice(id): Promise<MetalPrice[]> {
    return await this.priceRepository.find({
      where: {
        id: id,
      },
      order: {
        date: 'DESC',
      },
    });
  }

  async create(data: any): Promise<MetalPrice> {
    return this.priceRepository.save(data);
  }

  findAll() {
    return `This action returns all metalPrice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} metalPrice`;
  }

  update(id: number, updateMetalPriceDto: UpdateMetalPriceDto) {
    return `This action updates a #${id} metalPrice`;
  }

  remove(id: number) {
    return `This action removes a #${id} metalPrice`;
  }

  async updatePrices() {
    let priceData = {};
    const prices1 = await this.priceRepository.find({
      where: {
        id: '1',
        date: { $gt: startOfDay(new Date()).toISOString() },
      },
    });

    if (prices1.length < 1) {
      axios
        .get(process.env.X_RAPIDAPI_URI + '0', {
          headers: {
            'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
          },
        })
        .then((response) => {
          if (response.data) {
            priceData = {
              id: '1',
              price: response.data,
              name: 'Gold',
              date: new Date().toISOString(),
            };
            this.create(priceData);
          }
        })
        .catch(function (error) {
          // console.error(error);
          return error;
        });
    }

    const prices2 = await this.priceRepository.find({
      where: {
        id: '2',
        date: { $gt: startOfDay(new Date()).toISOString() },
      },
    });

    if (prices2.length < 1) {
      axios
        .get(process.env.X_RAPIDAPI_URI + '1', {
          headers: {
            'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
          },
        })
        .then((response) => {
          if (response.data) {
            priceData = {
              id: '2',
              price: response.data,
              name: 'Silver',
              date: new Date().toISOString(),
            };
            this.create(priceData);
          }
        })
        .catch(function (error) {
          // console.error(error);
        });
    }

    const prices3 = await this.priceRepository.find({
      where: {
        id: '3',
        date: { $gt: startOfDay(new Date()).toISOString() },
      },
    });

    if (prices3.length < 1) {
      axios
        .get(process.env.X_RAPIDAPI_URI + '3', {
          headers: {
            'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
          },
        })
        .then((response) => {
          if (response.data) {
            priceData = {
              id: '3',
              price: response.data,
              name: 'Platinum',
              date: new Date().toISOString(),
            };
            this.create(priceData);
          }
        })
        .catch(function (error) {
          // console.error(error);
        });
    }
  }
}
