import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ClientService from '#services/client_service'
import { createClientValidator, updateClientValidator } from '#validators/client_validator'

@inject()
export default class ClientsController {
  constructor(private clientService: ClientService) {}

  /**
   * @index
   * @description Lists all clients with pagination
   * @tag Clients
   * @paramQuery page - Page number - @type(number)
   * @paramQuery perPage - Items per page - @type(number)
   * @paramQuery search - Search by companyName or ruc - @type(string)
   * @paramQuery typeClient - Filter by client type (legal, natural) - @type(string)
   * @responseBody 200 - Paginador de clientes
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search')
    const typeClient = request.input('typeClient')

    try {
      const clients = await this.clientService.list({ page, perPage, search, typeClient })
      return response.ok(clients)
    } catch {
      return response.internalServerError({ message: 'Failed to retrieve clients.' })
    }
  }

  /**
   * @show
   * @description Finds a client by ID
   * @tag Clients
   * @paramPath id - Client ID - @type(number) @required
   * @responseBody 200 - Objeto de cliente
   * @responseBody 404 - Client not found
   */
  async show({ params, response }: HttpContext) {
    try {
      const client = await this.clientService.findById(params.id)
      return response.ok(client)
    } catch {
      return response.notFound({ message: 'Client not found.' })
    }
  }

  /**
   * @store
   * @description Creates a new client
   * @tag Clients
   * @requestBody { "userId":"number","companyName": "string", "ruc": "string", "address": "string", "photoUrl": "string?", "typeClient": "legal | natural" }
   * @responseBody 201 - <Client>
   * @responseBody 422 - Validation failed
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createClientValidator)

    try {
      const client = await this.clientService.create({
        data,
      })
      return response.created(client)
    } catch (error: any) {
      return response.unprocessableEntity({ message: error.message })
    }
  }

  /**
   * @update
   * @description Updates an existing client
   * @tag Clients
   * @paramPath id - Client ID - @type(number) @required
   * @requestBody { "companyName": "string?", "ruc": "string?", "address": "string?", "photoUrl": "string?", "typeClient": "legal | natural" }
   * @responseBody 200 - <Client>
   * @responseBody 404 - Client not found
   * @responseBody 422 - Validation failed
   */
  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(updateClientValidator)

    try {
      const client = await this.clientService.update(params.id, data)
      return response.ok(client)
    } catch (error: any) {
      if (error.message === 'Client not found.') {
        return response.notFound({ message: error.message })
      }
      return response.unprocessableEntity({ message: error.message })
    }
  }

  /**
   * @destroy
   * @description Soft-deletes a client
   * @tag Clients
   * @paramPath id - Client ID - @type(number) @required
   * @responseBody 200 - { "message": "Client deleted successfully." }
   * @responseBody 404 - Client not found
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.clientService.softDelete(params.id)
      return response.ok({ message: 'Client deleted successfully.' })
    } catch {
      return response.notFound({ message: 'Client not found.' })
    }
  }
}
