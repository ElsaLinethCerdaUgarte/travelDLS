import { inject } from '@adonisjs/core'
import User from '#models/user'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import logger from '@adonisjs/core/services/logger'

export interface AuthResult {
  success: boolean
  tokenValue?: string
  user?: User
  error?: string
}

@inject()
export default class UserService {
  async register(
    data: { name: string; email: string; password: string },
    auth: Authenticator<Authenticators>
  ): Promise<AuthResult> {
    try {
      const user = await User.create(data)
      const token = await auth.use('api').createToken(user)

      logger.info({ email: user.email, idUser: user.idUser }, 'New user correctly registered')
      return {
        success: true,
        tokenValue: token.value!.release(),
        user,
      }
    } catch (error: any) {
      if (error.code === '23505' || error.errno === 19 || error.code === 'ER_DUP_ENTRY') {
        return { success: false, error: 'Email or Name already exists.' }
      }
      return { success: false, error: 'Registration failed' }
    }
  }
}
