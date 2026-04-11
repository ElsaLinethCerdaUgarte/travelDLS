import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import DetailsOrderService from '#services/details_order_service'
import {
  createDetailsOrderValidator,
  updateDetailsOrderValidator,
} from '#validators/details_order_validator'

@inject()
export default class DetailsOrdersController {
  constructor(private detailsService: DetailsOrderService) {}

  /**
   * @store
   * @description Adds a new item detail to an order
   * @tag OrderDetails
   * @requestBody { "idOrder": "number", "cargoDescription": "string", "amount": "number", "unitWeight": "string", "deliveryAddress": "string", "typePackaging": "string" }
   * @responseBody 201 - <DetailsOrder>
   * @responseBody 422 - Validation failed
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createDetailsOrderValidator)

    try {
      const detail = await this.detailsService.create(data)
      return response.created(detail)
    } catch (error: any) {
      return response.unprocessableEntity({ message: error.message })
    }
  }

  /**
   * @show
   * @description Finds a specific order detail by ID
   * @tag OrderDetails
   * @paramPath id - Detail ID - @type(number) @required
   * @responseBody 200 - Objeto de detalle
   * @responseBody 404 - Detail not found
   */
  async show({ params, response }: HttpContext) {
    try {
      const detail = await this.detailsService.findById(params.id)
      return response.ok(detail)
    } catch {
      return response.notFound({ message: 'Detail not found.' })
    }
  }

  /**
   * @update
   * @description Updates a specific order detail item
   * @tag OrderDetails
   * @paramPath id - Detail ID - @type(number) @required
   * @requestBody { "cargoDescription": "string?", "amount": "number?", "unitWeight": "string?", "deliveryAddress": "string?", "typePackaging": "string?" }
   * @responseBody 200 - <DetailsOrder>
   * @responseBody 404 - Detail not found
   * @responseBody 422 - Validation failed
   */
  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(updateDetailsOrderValidator)

    try {
      const detail = await this.detailsService.update(params.id, data)
      return response.ok(detail)
    } catch (error: any) {
      if (error.message === 'Detail not found.') {
        return response.notFound({ message: error.message })
      }
      return response.unprocessableEntity({ message: error.message })
    }
  }

  /**
   * @destroy
   * @description Soft-deletes a specific order detail
   * @tag OrderDetails
   * @paramPath id - Detail ID - @type(number) @required
   * @responseBody 200 - { "message": "Detail removed successfully." }
   * @responseBody 404 - Detail not found
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.detailsService.softDelete(params.id)
      return response.ok({ message: 'Detail removed successfully.' })
    } catch {
      return response.notFound({ message: 'Detail not found.' })
    }
  }
}
