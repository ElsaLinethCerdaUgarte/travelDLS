import vine from '@vinejs/vine'

export const createCompanyValidator = vine.compile(
  vine.object({
    userId: vine.number().exists({ table: 'users', column: 'idUser' }).optional(),
    businessName: vine.string().maxLength(255).trim(),
    ruc: vine.string().maxLength(20).trim(),
    photoUrl: vine.string().trim().optional(),
  })
)

export const updateCompanyValidator = vine.compile(
  vine.object({
    userId: vine.number().exists({ table: 'users', column: 'idUser' }).optional(),
    businessName: vine.string().maxLength(255).trim().optional(),
    ruc: vine.string().maxLength(20).trim().optional(),
    photoUrl: vine.string().trim().optional(),
  })
)
