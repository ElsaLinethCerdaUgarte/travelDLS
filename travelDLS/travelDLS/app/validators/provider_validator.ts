import vine from '@vinejs/vine'

/**
 * Validator for creating a new provider.
 * All fields are required except logoUrl (optional).
 */
export const createProviderValidator = vine.compile(
  vine.object({
    businessName: vine.string().maxLength(255).trim(),
    ruc: vine.string().maxLength(20).trim(),
    logoUrl: vine.string().maxLength(500).trim().optional(),
    address: vine.string().trim(),
  })
)

/**
 * Validator for updating an existing provider.
 * All fields are optional (PATCH semantics).
 */
export const updateProviderValidator = vine.compile(
  vine.object({
    businessName: vine.string().maxLength(255).trim().optional(),
    ruc: vine.string().maxLength(20).trim().optional(),
    logoUrl: vine.string().maxLength(500).trim().nullable().optional(),
    address: vine.string().trim().optional(),
  })
)
