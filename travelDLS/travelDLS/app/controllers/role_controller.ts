import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import RoleService from '#services/role_service'
import { createRoleValidator } from '#validators/role_validator'

@inject()
export default class RolesController {
  constructor(protected roleService: RoleService) {}

  /**
   * @store
   * @description Creates a new role in the system
   * @tag Roles
   * @security [BearerAuth]
   * @requestBody { "name": "string" }
   * @responseBody 201 - <Rol>
   * @responseBody 422 - Validation failed
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createRoleValidator)
    const role = await this.roleService.createRole(payload)

    return response.created(role)
  }
}
