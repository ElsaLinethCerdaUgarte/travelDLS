import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import Client from '#models/client'
import logger from '@adonisjs/core/services/logger'

export interface ClientFilters {
  page?: number
  perPage?: number
  search?: string
}

@inject()
export default class ClientService {
  /**
   * Creates a new client.
   */
  async create({
    data,
  }: {
    data: {
      companyName: string
      ruc: string
      address: string
    }
  }): Promise<Client> {
    try {
      const client = await Client.create(data)
      logger.info({ idClient: client.idClient }, 'Client created successfully')
      return client
    } catch (error: any) {
      if (error.code === '23505' || error.errno === 19 || error.code === 'ER_DUP_ENTRY') {
        throw new Error('A client with this RUC already exists.')
      }
      logger.error({ err: error }, 'Failed to create client')
      throw new Error('Failed to create client.')
    }
  }

  /**
   * Updates an existing client by ID.
   */
  async update(
    id: number,
    data: Partial<{ companyName: string; ruc: string; address: string }>
  ): Promise<Client> {
    try {
      const client = await Client.query().whereNull('deletedAt').where('idClient', id).firstOrFail()

      client.merge(data)
      await client.save()

      logger.info({ idClient: client.idClient }, 'Client updated successfully')
      return client
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new Error('Client not found.')
      }
      if (error.code === '23505' || error.errno === 19 || error.code === 'ER_DUP_ENTRY') {
        throw new Error('A client with this RUC already exists.')
      }
      logger.error({ err: error }, 'Failed to update client')
      throw new Error('Failed to update client.')
    }
  }

  /**
   * Lists clients with pagination, filtering out soft-deleted records.
   */
  async list(filters: ClientFilters = {}) {
    try {
      const page = filters.page || 1
      const perPage = filters.perPage || 10

      const query = Client.query().whereNull('deletedAt')

      if (filters.search) {
        query.where((builder) => {
          builder
            .where('companyName', 'ILIKE', `%${filters.search}%`)
            .orWhere('ruc', 'ILIKE', `%${filters.search}%`)
        })
      }

      const clients = await query.orderBy('idClient', 'desc').paginate(page, perPage)

      return clients
    } catch (error: any) {
      logger.error({ err: error }, 'Failed to list clients')
      throw new Error('Failed to retrieve clients.')
    }
  }

  /**
   * Finds a single client by ID (non-deleted).
   */
  async findById(id: number): Promise<Client> {
    try {
      const client = await Client.query().whereNull('deletedAt').where('idClient', id).firstOrFail()

      return client
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new Error('Client not found.')
      }
      logger.error({ err: error }, 'Failed to find client')
      throw new Error('Failed to find client.')
    }
  }

  /**
   * Soft deletes a client by setting deletedAt to the current timestamp.
   */
  async softDelete(id: number): Promise<void> {
    try {
      const client = await Client.query().whereNull('deletedAt').where('idClient', id).firstOrFail()

      client.deletedAt = DateTime.now()
      await client.save()

      logger.info({ idClient: client.idClient }, 'Client soft-deleted successfully')
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new Error('Client not found.')
      }
      logger.error({ err: error }, 'Failed to soft-delete client')
      throw new Error('Failed to soft-delete client.')
    }
  }
}
