import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'providers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idProvider')

      table.string('businessName', 255).notNullable()
      table.string('ruc', 20).notNullable().unique()
      table.string('logoUrl', 500).nullable()
      table.text('address').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
      table.timestamp('deleted_at').nullable().defaultTo(null)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
