import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import CompanyService from '#services/company_service'
import { createCompanyValidator, updateCompanyValidator } from '#validators/company_validator'

@inject()
export default class CompaniesController {
  constructor(private companyService: CompanyService) {}

  /**
   * @index
   * @description Lists all companies with pagination
   * @tag Companies
   * @paramQuery page - Page number - @type(number)
   * @paramQuery perPage - Items per page - @type(number)
   * @paramQuery search - Search by businessName or ruc - @type(string)
   * @responseBody 200 - <Company[]>.paginated()
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search')

    try {
      const companies = await this.companyService.list({ page, perPage, search })
      return response.ok(companies)
    } catch {
      return response.internalServerError({ message: 'Failed to retrieve companies.' })
    }
  }

  /**
   * @show
   * @description Finds a company by ID
   * @tag Companies
   * @paramPath id - Company ID - @type(number) @required
   * @responseBody 200 - <Company>
   * @responseBody 404 - Company not found
   */
  async show({ params, response }: HttpContext) {
    try {
      const company = await this.companyService.findById(params.id)
      return response.ok(company)
    } catch {
      return response.notFound({ message: 'Company not found.' })
    }
  }

  /**
   * @store
   * @description Creates a new company
   * @tag Companies
   * @requestBody { "ruc": "string", "businessName": "string" }
   * @responseBody 201 - <Company>
   * @responseBody 422 - Validation failed
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCompanyValidator)

    try {
      const company = await this.companyService.create({ data: payload })
      return response.created(company)
    } catch (error: any) {
      return response.unprocessableEntity({ message: error.message })
    }
  }

  /**
   * @update
   * @description Updates an existing company
   * @tag Companies
   * @paramPath id - Company ID - @type(number) @required
   * @requestBody { "ruc": "string", "businessName": "string" }
   * @responseBody 200 - <Company>
   * @responseBody 404 - Company not found
   * @responseBody 422 - Validation failed
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateCompanyValidator)

    try {
      const company = await this.companyService.update(params.id, payload)
      return response.ok(company)
    } catch (error: any) {
      if (error.message === 'Company not found.') {
        return response.notFound({ message: error.message })
      }
      return response.unprocessableEntity({ message: error.message })
    }
  }

  /**
   * @destroy
   * @description Soft-deletes a company
   * @tag Companies
   * @paramPath id - Company ID - @type(number) @required
   * @responseBody 200 - { "message": "Company deleted successfully." }
   * @responseBody 404 - Company not found
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.companyService.softDelete(params.id)
      return response.ok({ message: 'Company deleted successfully.' })
    } catch {
      return response.notFound({ message: 'Company not found.' })
    }
  }
}
