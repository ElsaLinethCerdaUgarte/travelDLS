import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import DriverService from '#services/driver_service'
import { createDriverValidator, updateDriverValidator } from '#validators/driver_validator'

@inject()
export default class DriversController {
  constructor(private driverService: DriverService) {}

  /**
   * @index
   * @description Lists all drivers with pagination
   * @tag Drivers
   * @paramQuery page - Page number - @type(number)
   * @paramQuery perPage - Items per page - @type(number)
   * @responseBody 200 - <Driver[]>.paginated()
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    try {
      const drivers = await this.driverService.list({ page, perPage })
      return response.ok(drivers)
    } catch {
      return response.internalServerError({ message: 'Failed to retrieve drivers.' })
    }
  }

  /**
   * @show
   * @description Finds a driver by ID
   * @tag Drivers
   * @paramPath id - Driver ID - @type(number) @required
   * @responseBody 200 - <Driver>
   * @responseBody 404 - Driver not found
   */
  async show({ params, response }: HttpContext) {
    try {
      const driver = await this.driverService.findById(params.id)
      return response.ok(driver)
    } catch {
      return response.notFound({ message: 'Driver not found.' })
    }
  }

  /**
   * @store
   * @description Creates a new driver
   * @tag Drivers
   * @requestBody { "idCompany": "number", "license": "string", "passport": "string", "photoUrl": "string?" }
   * @responseBody 201 - <Driver>
   * @responseBody 422 - Validation failed
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createDriverValidator)

    try {
      const driver = await this.driverService.create({ data })
      return response.created(driver)
    } catch (error: any) {
      return response.unprocessableEntity({ message: error.message })
    }
  }

  /**
   * @update
   * @description Updates an existing driver
   * @tag Drivers
   * @paramPath id - Driver ID - @type(number) @required
   * @requestBody { "idCompany": "number?", "license": "string?", "passport": "string?", "photoUrl": "string?", "status": "inactive | offline | available | on_trip" }
   * @responseBody 200 - <Driver>
   * @responseBody 404 - Driver not found
   * @responseBody 422 - Validation failed
   */
  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(updateDriverValidator)

    try {
      const driver = await this.driverService.update(params.id, data)
      return response.ok(driver)
    } catch (error: any) {
      if (error.message === 'Driver not found.') {
        return response.notFound({ message: error.message })
      }
      return response.unprocessableEntity({ message: error.message })
    }
  }

  /**
   * @destroy
   * @description Soft-deletes a driver
   * @tag Drivers
   * @paramPath id - Driver ID - @type(number) @required
   * @responseBody 200 - { "message": "Driver deleted successfully." }
   * @responseBody 404 - Driver not found
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.driverService.softDelete(params.id)
      return response.ok({ message: 'Driver deleted successfully.' })
    } catch {
      return response.notFound({ message: 'Driver not found.' })
    }
  }
}
