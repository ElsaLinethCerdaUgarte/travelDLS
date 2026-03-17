import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Rol from '#models/rol'
import Driver from '#models/driver'
import Provider from '#models/provider'
import Client from '#models/client'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true, columnName: 'idUser' })
  declare idUser: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column({ columnName: 'role_id' })
  declare roleId: number

  @belongsTo(() => Rol, { foreignKey: 'roleId' })
  declare role: BelongsTo<typeof Rol>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime | null

  @hasOne(() => Driver, { foreignKey: 'userId' })
  declare driver: HasOne<typeof Driver>

  @hasOne(() => Provider, { foreignKey: 'userId' })
  declare provider: HasOne<typeof Provider>

  @hasOne(() => Client, { foreignKey: 'userId' })
  declare client: HasOne<typeof Client>

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
