import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Driver from '#models/driver'
import User from '#models/user'

export default class Provider extends BaseModel {
  public static table = 'providers'

  @column({ isPrimary: true, columnName: 'idProvider' })
  declare idProvider: number

  @column({ columnName: 'businessName' })
  declare businessName: string

  @column()
  declare ruc: string

  @column({ columnName: 'logoUrl' })
  declare logoUrl: string | null

  @column()
  declare address: string

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  declare deletedAt: DateTime | null

  @column({ columnName: 'user_id' })
  declare userId: number

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @hasMany(() => Driver, { foreignKey: 'idProvider' })
  declare drivers: HasMany<typeof Driver>
}
