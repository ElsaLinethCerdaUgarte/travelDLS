import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Provider from '#models/provider'
import User from '#models/user'

export default class Driver extends BaseModel {
  public static table = 'drivers'

  @column({ isPrimary: true, columnName: 'idDriver' })
  declare idDriver: number

  @column({ columnName: 'id_provider' })
  declare idProvider: number

  @column()
  declare license: string

  @column()
  declare passport: string

  @column({ columnName: 'photo_url' })
  declare photoUrl: string | null

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  declare deletedAt: DateTime | null

  @column({ columnName: 'user_id' })
  declare userId: number

  @belongsTo(() => Provider, { foreignKey: 'idProvider' })
  declare provider: BelongsTo<typeof Provider>

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>
}
