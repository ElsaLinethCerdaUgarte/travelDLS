//import cache from '@adonisjs/cache/services/main'
import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swaggerConfig from '#config/swagger'

const UserController = () => import('#controllers/user_controller')
const RolesController = () => import('#controllers/role_controller')
const ClientsController = () => import('#controllers/client_controller')

//Role routes
router.post('/api/roles', [RolesController, 'store'])

//Register routes
router.post('/api/register', [UserController, 'register'])

//Client routes
router.group(() => {
  router.get('/', [ClientsController, 'index'])
  router.get('/:id', [ClientsController, 'show'])
  router.post('/', [ClientsController, 'store'])
  router.put('/:id', [ClientsController, 'update'])
  router.delete('/:id', [ClientsController, 'destroy'])
}).prefix('/api/clients')

router.get('/', async ({ response }) => {
  return response.redirect('/docs')
})

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swaggerConfig)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swaggerConfig)
})
