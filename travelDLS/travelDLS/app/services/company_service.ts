import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import Company from '#models/company'
import logger from '@adonisjs/core/services/logger'

export interface CompanyFilters {
  page?: number
  perPage?: number
  search?: string
}

@inject()
export default class CompanyService {
  /**
   * Creates a new company.
   */
  async create({
    data,
  }: {
    data: {
      ruc: string
      businessName: string
    }
  }): Promise<Company> {
    try {
      const company = await Company.create(data)
      logger.info({ idCompany: company.idCompany }, 'Company created successfully')
      return company
    } catch (error: any) {
      if (error.code === '23505' || error.errno === 19 || error.code === 'ER_DUP_ENTRY') {
        throw new Error('A company with this RUC already exists.')
      }
      logger.error({ err: error }, 'Failed to create company')
      throw new Error('Failed to create company.')
    }
  }

  /**
   * Updates an existing company by ID.
   */
  async update(
    id: number,
    data: Partial<{
      ruc: string
      businessName: string
    }>
  ): Promise<Company> {
    try {
      const company = await Company.query()
        .whereNull('deletedAt')
        .where('idCompany', id)
        .firstOrFail()

      company.merge(data)
      await company.save()

      logger.info({ idCompany: company.idCompany }, 'Company updated successfully')
      return company
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new Error('Company not found.')
      }
      if (error.code === '23505' || error.errno === 19 || error.code === 'ER_DUP_ENTRY') {
        throw new Error('A company with this RUC already exists.')
      }
      logger.error({ err: error }, 'Failed to update company')
      throw new Error('Failed to update company.')
    }
  }

  /**
   * Lists companies with pagination, filtering out soft-deleted records.
   */
  async list(filters: CompanyFilters = {}) {
    try {
      const page = filters.page || 1
      const perPage = filters.perPage || 10

      const query = Company.query().whereNull('deletedAt')

      if (filters.search) {
        query.where((builder) => {
          builder
            .where('businessName', 'ILIKE', `%${filters.search}%`)
            .orWhere('ruc', 'ILIKE', `%${filters.search}%`)
        })
      }

      const companies = await query.orderBy('idCompany', 'desc').paginate(page, perPage)

      return companies
    } catch (error: any) {
      logger.error({ err: error }, 'Failed to list companies')
      throw new Error('Failed to retrieve companies.')
    }
  }

  /**
   * Finds a single company by ID (non-deleted).
   */
  async findById(id: number): Promise<Company> {
    try {
      const company = await Company.query()
        .whereNull('deletedAt')
        .where('idCompany', id)
        .firstOrFail()

      return company
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new Error('Company not found.')
      }
      logger.error({ err: error }, 'Failed to find company')
      throw new Error('Failed to find company.')
    }
  }

  /**
   * Soft deletes a company by setting deletedAt to the current timestamp.
   */
  async softDelete(id: number): Promise<void> {
    try {
      const company = await Company.query()
        .whereNull('deletedAt')
        .where('idCompany', id)
        .firstOrFail()

      company.deletedAt = DateTime.now()
      await company.save()

      logger.info({ idCompany: company.idCompany }, 'Company soft-deleted successfully')
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new Error('Company not found.')
      }
      logger.error({ err: error }, 'Failed to soft-delete company')
      throw new Error('Failed to soft-delete company.')
    }
  }
}
