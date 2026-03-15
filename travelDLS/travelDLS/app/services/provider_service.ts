import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import Provider from '#models/provider'
import logger from '@adonisjs/core/services/logger'

export interface ProviderFilters {
  page?: number
  perPage?: number
  search?: string
}

@inject()
export default class ProviderService {
  /**
   * Creates a new provider.
   */
  async create({
    data,
  }: {
    data: {
      businessName: string
      ruc: string
      logoUrl?: string
      address: string
    }
  }): Promise<Provider> {
    try {
      const provider = await Provider.create(data)
      logger.info({ idProvider: provider.idProvider }, 'Provider created successfully')
      return provider
    } catch (error: any) {
      if (error.code === '23505' || error.errno === 19 || error.code === 'ER_DUP_ENTRY') {
        throw new Error('A provider with this RUC already exists.')
      }
      logger.error({ err: error }, 'Failed to create provider')
      throw new Error('Failed to create provider.')
    }
  }

  /**
   * Updates an existing provider by ID.
   */
  async update(
    id: number,
    data: Partial<{
      businessName: string
      ruc: string
      logoUrl: string | null
      address: string
    }>
  ): Promise<Provider> {
    try {
      const provider = await Provider.query()
        .whereNull('deletedAt')
        .where('idProvider', id)
        .firstOrFail()

      provider.merge(data)
      await provider.save()

      logger.info({ idProvider: provider.idProvider }, 'Provider updated successfully')
      return provider
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new Error('Provider not found.')
      }
      if (error.code === '23505' || error.errno === 19 || error.code === 'ER_DUP_ENTRY') {
        throw new Error('A provider with this RUC already exists.')
      }
      logger.error({ err: error }, 'Failed to update provider')
      throw new Error('Failed to update provider.')
    }
  }

  /**
   * Lists providers with pagination, filtering out soft-deleted records.
   */
  async list(filters: ProviderFilters = {}) {
    try {
      const page = filters.page || 1
      const perPage = filters.perPage || 10

      const query = Provider.query().whereNull('deletedAt')

      if (filters.search) {
        query.where((builder) => {
          builder
            .where('businessName', 'ILIKE', `%${filters.search}%`)
            .orWhere('ruc', 'ILIKE', `%${filters.search}%`)
        })
      }

      const providers = await query.orderBy('idProvider', 'desc').paginate(page, perPage)

      return providers
    } catch (error: any) {
      logger.error({ err: error }, 'Failed to list providers')
      throw new Error('Failed to retrieve providers.')
    }
  }

  /**
   * Finds a single provider by ID (non-deleted).
   */
  async findById(id: number): Promise<Provider> {
    try {
      const provider = await Provider.query()
        .whereNull('deletedAt')
        .where('idProvider', id)
        .firstOrFail()

      return provider
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new Error('Provider not found.')
      }
      logger.error({ err: error }, 'Failed to find provider')
      throw new Error('Failed to find provider.')
    }
  }

  /**
   * Soft deletes a provider by setting deletedAt to the current timestamp.
   */
  async softDelete(id: number): Promise<void> {
    try {
      const provider = await Provider.query()
        .whereNull('deletedAt')
        .where('idProvider', id)
        .firstOrFail()

      provider.deletedAt = DateTime.now()
      await provider.save()

      logger.info({ idProvider: provider.idProvider }, 'Provider soft-deleted successfully')
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new Error('Provider not found.')
      }
      logger.error({ err: error }, 'Failed to soft-delete provider')
      throw new Error('Failed to soft-delete provider.')
    }
  }
}
