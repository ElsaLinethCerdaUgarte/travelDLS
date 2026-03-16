import { BaseSchema } from '@adonisjs/lucid/schema'
import { DriverStatus } from '#enums/driver_status'

export default class extends BaseSchema {
  protected tableName = 'drivers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idDriver')
      table
        .integer('id_provider')
        .unsigned()
        .references('idProvider')
        .inTable('providers')
        .onDelete('CASCADE')
      table.string('license', 50).notNullable()
      table.string('passport', 50).notNullable()
      table.string('photo_url').nullable()

      // Estado como Enum
      table.enum('status', Object.values(DriverStatus)).defaultTo(DriverStatus.INACTIVE)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
