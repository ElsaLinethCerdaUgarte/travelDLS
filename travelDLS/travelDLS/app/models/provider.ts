import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
