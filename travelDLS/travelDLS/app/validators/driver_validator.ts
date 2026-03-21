import vine from '@vinejs/vine'
import { DriverStatus } from '#enums/driver_status'

export const createDriverValidator = vine.compile(
  vine.object({
    idCompany: vine.number().exists({ table: 'companies', column: 'idCompany' }),
    userId: vine.number().exists({ table: 'users', column: 'idUser' }),
    license: vine.string().trim().minLength(5),
    passport: vine.string().trim().minLength(5),
    photoUrl: vine.string().url().optional(),
    status: vine.enum(DriverStatus).optional(),
  })
)
export const updateDriverValidator = vine.compile(
  vine.object({
    idCompany: vine.number().exists({ table: 'companies', column: 'idCompany' }).optional(),
    userId: vine.number().exists({ table: 'users', column: 'idUser' }).optional(),
    license: vine.string().trim().minLength(5).optional(),
    passport: vine.string().trim().minLength(5).optional(),
    photoUrl: vine.string().url().optional(),
    status: vine.enum(DriverStatus).optional(),
  })
)
