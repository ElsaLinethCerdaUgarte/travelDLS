import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import Truck from '#models/truck'
import logger from '@adonisjs/core/services/logger'

@inject()
export default class TruckService {
  async create(data: {
    idCompany: number
    idDriver: number
    idCategory: number
    chassis: string
    plate: string
  }): Promise<Truck> {
    try {
      const truck = await Truck.create(data)
      logger.info({ idTruck: truck.idTruck }, 'Truck created successfully')
      return truck
    } catch (error: any) {
      logger.error({ err: error }, 'Failed to create truck')
      throw new Error('Failed to create truck.')
    }
  }

  async update(
    id: number,
    data: Partial<{
      idCompany: number
      idDriver: number
      idCategory: number
      chassis: string
      plate: string
    }>
  ): Promise<Truck> {
    try {
      const truck = await Truck.query().whereNull('deletedAt').where('id_truck', id).firstOrFail()
      truck.merge(data)
      await truck.save()
      logger.info({ idTruck: truck.idTruck }, 'Truck updated successfully')
      return truck
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new Error('Truck not found.')
      }
      logger.error({ err: error }, 'Failed to update truck')
      throw new Error('Failed to update truck.')
    }
  }

  async list(filters: { page?: number; perPage?: number; idCompany?: number } = {}) {
    try {
      const page = filters.page || 1
      const perPage = filters.perPage || 10
      const query = Truck.query()
        .whereNull('deletedAt')
        .preload('company')
        .preload('driver')
        .preload('category')

      if (filters.idCompany) {
        query.where('id_company', filters.idCompany)
      }

      return await query.orderBy('id_truck', 'desc').paginate(page, perPage)
    } catch (error: any) {
      logger.error({ err: error }, 'Failed to list trucks')
      throw new Error('Failed to retrieve trucks.')
    }
  }

  async findById(id: number): Promise<Truck> {
    try {
      return await Truck.query()
        .whereNull('deletedAt')
        .where('id_truck', id)
        .preload('company')
        .preload('driver')
        .preload('category')
        .firstOrFail()
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new Error('Truck not found.')
      }
      logger.error({ err: error }, 'Failed to find truck')
      throw new Error('Failed to find truck.')
    }
  }

  async softDelete(id: number): Promise<void> {
    try {
      const truck = await this.findById(id)
      truck.deletedAt = DateTime.now()
      await truck.save()
      logger.info({ idTruck: truck.idTruck }, 'Truck soft-deleted successfully')
    } catch (error: any) {
      if (error.message === 'Truck not found.') throw error
      logger.error({ err: error }, 'Failed to soft-delete truck')
      throw new Error('Failed to soft-delete truck.')
    }
  }
}
