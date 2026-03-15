import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ProviderService from '#services/provider_service'
import { createProviderValidator, updateProviderValidator } from '#validators/provider_validator'

@inject()
export default class ProvidersController {
  constructor(private providerService: ProviderService) {}

  /**
   * @index
   * @description Lists all providers with pagination
   * @tag Providers
   * @paramQuery page - Page number - @type(number)
   * @paramQuery perPage - Items per page - @type(number)
   * @paramQuery search - Search by businessName or ruc - @type(string)
   * @responseBody 200 - <Provider[]>.paginated()
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search')

    try {
      const providers = await this.providerService.list({ page, perPage, search })
      return response.ok(providers)
    } catch {
      return response.internalServerError({ message: 'Failed to retrieve providers.' })
    }
  }

  /**
   * @show
   * @description Finds a provider by ID
   * @tag Providers
   * @paramPath id - Provider ID - @type(number) @required
   * @responseBody 200 - <Provider>
   * @responseBody 404 - Provider not found
   */
  async show({ params, response }: HttpContext) {
    try {
      const provider = await this.providerService.findById(params.id)
      return response.ok(provider)
    } catch {
      return response.notFound({ message: 'Provider not found.' })
    }
  }

  /**
   * @store
   * @description Creates a new provider
   * @tag Providers
   * @requestBody { "idRol": "number", "businessName": "string", "ruc": "string", "logoUrl": "string?", "address": "string" }
   * @responseBody 201 - <Provider>
   * @responseBody 422 - Validation failed
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProviderValidator)

    try {
      const provider = await this.providerService.create({ data: payload })
      return response.created(provider)
    } catch (error: any) {
      return response.unprocessableEntity({ message: error.message })
    }
  }

  /**
   * @update
   * @description Updates an existing provider
   * @tag Providers
   * @paramPath id - Provider ID - @type(number) @required
   * @requestBody { "idRol": "number?", "businessName": "string?", "ruc": "string?", "logoUrl": "string?", "address": "string?" }
   * @responseBody 200 - <Provider>
   * @responseBody 404 - Provider not found
   * @responseBody 422 - Validation failed
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProviderValidator)

    try {
      const provider = await this.providerService.update(params.id, payload)
      return response.ok(provider)
    } catch (error: any) {
      if (error.message === 'Provider not found.') {
        return response.notFound({ message: error.message })
      }
      return response.unprocessableEntity({ message: error.message })
    }
  }

  /**
   * @destroy
   * @description Soft-deletes a provider
   * @tag Providers
   * @paramPath id - Provider ID - @type(number) @required
   * @responseBody 200 - { "message": "Provider deleted successfully." }
   * @responseBody 404 - Provider not found
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.providerService.softDelete(params.id)
      return response.ok({ message: 'Provider deleted successfully.' })
    } catch {
      return response.notFound({ message: 'Provider not found.' })
    }
  }
}
