import vine from '@vinejs/vine'

/**
 * Validator for creating a new company.
 * All fields are required except logoUrl (optional).
 */
export const createCompanyValidator = vine.compile(
  vine.object({
    ruc: vine.string().maxLength(20).trim(),
    businessName: vine.string().maxLength(255).trim(),
    photoUrl: vine.string().trim().optional(),
  })
)

/**
 * Validator for updating an existing company.
 * All fields are optional (PATCH semantics).
 */
export const updateCompanyValidator = vine.compile(
  vine.object({
    ruc: vine.string().maxLength(20).trim().optional(),
    businessName: vine.string().maxLength(255).trim().optional(),
    photoUrl: vine.string().trim().optional(),
  })
)
