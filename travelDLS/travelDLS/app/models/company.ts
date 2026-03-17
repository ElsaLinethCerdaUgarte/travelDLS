import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Driver from '#models/driver'
import User from '#models/user'

export default class Company extends BaseModel {
  public static table = 'companies'

  @column({ isPrimary: true, columnName: 'idCompany' })
  declare idCompany: number

  @column()
  declare ruc: string

  @column({ columnName: 'businessName' })
  declare businessName: string

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updatedAt' })
  declare updatedAt: DateTime

  @column.dateTime({ columnName: 'deletedAt' })
  declare deletedAt: DateTime | null

  @column({ columnName: 'idUser' })
  declare idUser: number | null

  @belongsTo(() => User, { foreignKey: 'idUser' })
  declare user: BelongsTo<typeof User>

  @hasMany(() => Driver, { foreignKey: 'idCompany' })
  declare drivers: HasMany<typeof Driver>
}
