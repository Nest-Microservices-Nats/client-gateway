import { Controller, Get, Post, Body, Patch, Param, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, OrderStatusDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return await firstValueFrom(this.client.send('createOrder', createOrderDto))
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    try {

      return await firstValueFrom(this.client.send('findAllOrders', orderPaginationDto));
    } catch (error: any) {
      throw new RpcException(error);

    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await firstValueFrom(this.client.send('findOneOrder', { id }));
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  @Get('/status/:status')
  async findByStatus(
    @Param() statusDto: OrderStatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      return await firstValueFrom(this.client.send('findAllOrders', { ...paginationDto, status: statusDto.status }));
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: OrderStatusDto
  ) {
    try {
      return await firstValueFrom(this.client.send('changeOrderStatus', { id, status: updateOrderDto.status }));
    } catch (error: any) {
      throw new RpcException(error);
    }
  }


}
