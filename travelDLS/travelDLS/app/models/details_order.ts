import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Order from '#models/order'

export default class DetailsOrder extends BaseModel {
  public static table = 'details_orders'

  @column({ isPrimary: true, columnName: 'idDetails' })
  declare idDetails: number

  @column({ columnName: 'id_order' })
  declare idOrder: number

  @column({ columnName: 'cargoDescription' })
  declare cargoDescription: string

  @column()
  declare amount: number

  @column({ columnName: 'unitWeight' })
  declare unitWeight: string

  @column({ columnName: 'deliveryAddress' })
  declare deliveryAddress: string

  @column({ columnName: 'typePackaging' })
  declare typePackaging: string

  @column.dateTime({ autoCreate: true, columnName: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updatedAt' })
  declare updatedAt: DateTime

  @column.dateTime({ columnName: 'deletedAt' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Order, { foreignKey: 'idOrder' })
  declare order: BelongsTo<typeof Order>
}
