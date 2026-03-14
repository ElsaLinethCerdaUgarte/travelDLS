import Role from '#models/rol'

export default class RoleService {
  async createRole(data: { name: string }) {
    const role = await Role.firstOrCreate({ name: data.name }, data)
    return role
  }
}
