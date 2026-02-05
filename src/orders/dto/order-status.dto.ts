import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";

export class OrderStatusDto {
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `valid status are ${OrderStatusList}`
    })
    status: OrderStatus;
}