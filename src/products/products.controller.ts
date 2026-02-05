import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto
  ) {
    try {
      return await firstValueFrom(this.client.send({ cmd: "create_product" }, createProductDto));
    } catch (error: any) {
      throw new RpcException(error);
    }

  }

  @Get()
  async findAllProducts(@Query() paginationDto: PaginationDto) {
    try {
      return await firstValueFrom( this.client.send({ cmd: "find_all_products" }, paginationDto) );
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findProduct(@Param('id') id: string) {
    return this.client.send({ cmd: "find_one_product" }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )

    // try {
    //   const products = await firstValueFrom(
    //     this.client.send({ cmd: "find_one_product" }, { id })
    //   )
    //   return products;
    // } catch (error) {
    //   throw new RpcException(error);
    // }
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.client.send({ cmd: "delete_product" }, { id }));
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    try {
      return await firstValueFrom(this.client.send({ cmd: "update_product" }, { id, ...updateProductDto }));
    } catch (error: any) {
      throw new RpcException(error);
    }
  }
}
