import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(255).trim(),
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8),
    roleId: vine.number().exists({ table: 'roles', column: 'id' }),
  })
)
