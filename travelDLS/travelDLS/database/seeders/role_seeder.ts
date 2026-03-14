import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/rol'
import { Roles } from '#enums/roles'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([{ name: Roles.PROVIDER }, { name: Roles.CLIENT }])
  }
}
