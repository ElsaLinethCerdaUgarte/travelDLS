import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Client from '#models/client'
import Driver from '#models/driver'
import DetailsOrder from '#models/details_order'

export default class Order extends BaseModel {
  public static table = 'orders'

  @column({ isPrimary: true, columnName: 'idOrder' })
  declare idOrder: number

  @column({ columnName: 'id_client' })
  declare idClient: number

  @column({ columnName: 'id_driver' })
  declare idDriver: number

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true, columnName: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updatedAt' })
  declare updatedAt: DateTime

  @column.dateTime({ columnName: 'deletedAt' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Client, { foreignKey: 'idClient' })
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => Driver, { foreignKey: 'idDriver' })
  declare driver: BelongsTo<typeof Driver>

  @hasMany(() => DetailsOrder, { foreignKey: 'idOrder' })
  declare details: HasMany<typeof DetailsOrder>
}
