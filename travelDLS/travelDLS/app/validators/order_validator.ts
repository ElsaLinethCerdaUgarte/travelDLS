import vine from '@vinejs/vine'
import { OrderStatus } from '#enums/order_status'

export const createOrderValidator = vine.compile(
  vine.object({
    idClient: vine.number().exists({ table: 'clients', column: 'idClient' }),
    idDriver: vine.number().exists({ table: 'drivers', column: 'idDriver' }),
    status: vine.enum(Object.values(OrderStatus)).optional(),
  })
)

export const updateOrderValidator = vine.compile(
  vine.object({
    idClient: vine.number().exists({ table: 'clients', column: 'idClient' }).optional(),
    idDriver: vine.number().exists({ table: 'drivers', column: 'idDriver' }).optional(),
    status: vine.enum(Object.values(OrderStatus)).optional(),
  })
)
