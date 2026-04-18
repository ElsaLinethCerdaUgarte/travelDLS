import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'
import Order from '#models/order'
import { OrderStatus } from '#enums/order_status'

@inject()
export default class OrderService {
  async create(data: {
    idClient: number
    idCompany: number
    status?: OrderStatus
  }): Promise<Order> {
    try {
      const order = await Order.create(data)
      logger.info({ idOrder: order.idOrder }, 'Order header created successfully')
      return order
    } catch (error: any) {
      logger.error({ err: error }, 'Failed to create order')
      throw new Error('Failed to create order.')
    }
  }

  async update(
    id: number,
    data: Partial<{ idClient: number; idCompany: number; status: OrderStatus }>
  ): Promise<Order> {
    try {
      const order = await Order.query().whereNull('deletedAt').where('idOrder', id).firstOrFail()

      order.merge(data)
      await order.save()

      logger.info({ idOrder: order.idOrder }, 'Order updated successfully')
      return order
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new Error('Order not found.')
      }
      logger.error({ err: error }, 'Failed to update order')
      throw new Error('Failed to update order.')
    }
  }

  async list(filters: { page?: number; perPage?: number; idClient?: number } = {}) {
    try {
      const page = filters.page || 1
      const perPage = filters.perPage || 10
      const query = Order.query()
        .whereNull('deletedAt')
        .preload('client')
        .preload('company')
        .preload('details', (detailsQuery) => {
          detailsQuery.preload('driver')
        })

      if (filters.idClient) {
        query.where('idClient', filters.idClient)
      }

      return await query.orderBy('idOrder', 'desc').paginate(page, perPage)
    } catch (error: any) {
      logger.error({ err: error }, 'Failed to list orders')
      throw new Error('Failed to retrieve orders.')
    }
  }

  async findById(id: number): Promise<Order> {
    try {
      return await Order.query()
        .whereNull('deletedAt')
        .where('idOrder', id)
        .preload('client')
        .preload('company')
        .preload('details', (detailsQuery) => {
          detailsQuery.preload('driver')
        })
        .firstOrFail()
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new Error('Order not found.')
      }
      logger.error({ err: error }, 'Failed to find order')
      throw new Error('Failed to find order.')
    }
  }

  async softDelete(id: number): Promise<void> {
    try {
      const order = await this.findById(id)
      order.deletedAt = DateTime.now()
      await order.save()
      logger.info({ idOrder: order.idOrder }, 'Order soft-deleted successfully')
    } catch (error: any) {
      if (error.message === 'Order not found.') throw error
      logger.error({ err: error }, 'Failed to soft-delete order')
      throw new Error('Failed to soft-delete order.')
    }
  }
}
