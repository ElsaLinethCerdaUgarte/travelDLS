import vine from '@vinejs/vine'

export const createCompanyValidator = vine.compile(
  vine.object({
    ruc: vine.string().maxLength(20).trim(),
    businessName: vine.string().maxLength(255).trim(),
    photoUrl: vine.string().trim().optional(),
    userId: vine.number().exists({ table: 'users', column: 'idUser' }).optional(),
  })
)

export const updateCompanyValidator = vine.compile(
  vine.object({
    ruc: vine.string().maxLength(20).trim().optional(),
    businessName: vine.string().maxLength(255).trim().optional(),
    photoUrl: vine.string().trim().optional(),
    userId: vine.number().exists({ table: 'users', column: 'idUser' }).optional(),
  })
)
