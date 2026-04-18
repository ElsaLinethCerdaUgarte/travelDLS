import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator } from '#validators/user_validator'
import UserService from '#services/register_service'

@inject()
export default class UsersController {
  constructor(private userService: UserService) {}

  /**
   * @register
   * @description Registers a new user into the system
   * @tag Auth
   * @requestBody { "name": "string", "email": "string", "password": "string", "roleId": "number" }
   * @responseBody 201 - <User>
   * @responseBody 422 - Validation failed
   */
  async register({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const result = await this.userService.register(data, auth)

    if (!result.success) {
      return response.unprocessableEntity({ message: result.error })
    }

    return response.created({
      message: 'User registered successfully',
      token: result.tokenValue,
      user: result.user,
    })
  }
}
