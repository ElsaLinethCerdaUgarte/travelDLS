import vine from '@vinejs/vine'

/**
 * Validator for creating a new client.
 * All fields are required.
 */
export const createClientValidator = vine.compile(
  vine.object({
    companyName: vine.string().maxLength(255).trim(),
    ruc: vine.string().maxLength(20).trim(),
    address: vine.string().trim(),
  })
)

/**
 * Validator for updating an existing client.
 * All fields are optional (PATCH semantics).
 */
export const updateClientValidator = vine.compile(
  vine.object({
    companyName: vine.string().maxLength(255).trim().optional(),
    ruc: vine.string().maxLength(20).trim().optional(),
    address: vine.string().trim().optional(),
  })
)
