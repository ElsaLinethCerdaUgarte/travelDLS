import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import OrderService from '#services/order_service'
import { createOrderValidator, updateOrderValidator } from '#validators/order_validator'

@inject()
export default class OrdersController {
  constructor(private orderService: OrderService) {}

  /**
   * @index
   * @description Lists all orders with pagination
   * @tag Orders
   * @paramQuery page - Page number - @type(number)
   * @paramQuery perPage - Items per page - @type(number)
   * @paramQuery idClient - Optional client ID filter - @type(number)
   * @responseBody 200 - Paginador de órdenes
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const idClient = request.input('idClient')

    try {
      const orders = await this.orderService.list({ page, perPage, idClient })
      return response.ok(orders)
    } catch {
      return response.internalServerError({ message: 'Failed to retrieve orders.' })
    }
  }

  /**
   * @show
   * @description Finds an order by ID
   * @tag Orders
   * @paramPath id - Order ID - @type(number) @required
   * @responseBody 200 - Objeto de orden con sus detalles
   * @responseBody 404 - Order not found
   */
  async show({ params, response }: HttpContext) {
    try {
      const order = await this.orderService.findById(params.id)
      return response.ok(order)
    } catch {
      return response.notFound({ message: 'Order not found.' })
    }
  }

  /**
   * @store
   * @description Creates a new order header
   * @tag Orders
   * @requestBody { "idClient": "number", "idCompany": "number", "status": "pendiente" }
   * @responseBody 201 - <Order>
   * @responseBody 422 - Validation failed
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createOrderValidator)

    try {
      const order = await this.orderService.create(data)
      return response.created(order)
    } catch (error: any) {
      return response.unprocessableEntity({ message: error.message })
    }
  }

  /**
   * @update
   * @description Updates an existing order header
   * @tag Orders
   * @paramPath id - Order ID - @type(number) @required
   * @requestBody { "idClient": "number?", "idCompany": "number?", "status": "pendiente" }
   * @responseBody 200 - <Order>
   * @responseBody 404 - Order not found
   * @responseBody 422 - Validation failed
   */
  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(updateOrderValidator)

    try {
      const order = await this.orderService.update(params.id, data)
      return response.ok(order)
    } catch (error: any) {
      if (error.message === 'Order not found.') {
        return response.notFound({ message: error.message })
      }
      return response.unprocessableEntity({ message: error.message })
    }
  }

  /**
   * @destroy
   * @description Soft-deletes an order
   * @tag Orders
   * @paramPath id - Order ID - @type(number) @required
   * @responseBody 200 - { "message": "Order deleted successfully." }
   * @responseBody 404 - Order not found
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.orderService.softDelete(params.id)
      return response.ok({ message: 'Order deleted successfully.' })
    } catch {
      return response.notFound({ message: 'Order not found.' })
    }
  }
}
