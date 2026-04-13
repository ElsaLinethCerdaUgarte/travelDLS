import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Client from '#models/client'
import DetailsOrder from '#models/details_order'
import Company from '#models/company'

export default class Order extends BaseModel {
  public static table = 'orders'

  @column({ isPrimary: true, columnName: 'idOrder' })
  declare idOrder: number

  @column({ columnName: 'id_client' })
  declare idClient: number

  @column({ columnName: 'id_company' })
  declare idCompany: number

  @column({
    prepare: (value?: string) => value || 'pendiente',
  })
  declare status: string

  @column.dateTime({ autoCreate: true, columnName: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updatedAt' })
  declare updatedAt: DateTime

  @column.dateTime({ columnName: 'deletedAt' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Client, { foreignKey: 'idClient' })
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => Company, { foreignKey: 'idCompany' })
  declare company: BelongsTo<typeof Company>

  @hasMany(() => DetailsOrder, { foreignKey: 'idOrder' })
  declare details: HasMany<typeof DetailsOrder>
}
