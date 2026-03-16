//import cache from '@adonisjs/cache/services/main'
import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swaggerConfig from '#config/swagger'

const UserController = () => import('#controllers/user_controller')
//const RolesController = () => import('#controllers/role_controller')
const ClientsController = () => import('#controllers/client_controller')
const ProvidersController = () => import('#controllers/providers_controller')
const DriversController = () => import('#controllers/driver_controller')

//Role routes
//router.post('/api/roles', [RolesController, 'store'])

// Driver routes
router
  .group(() => {
    router.get('/', [DriversController, 'index'])
    router.get('/:id', [DriversController, 'show'])
    router.post('/', [DriversController, 'store'])
    router.put('/:id', [DriversController, 'update'])
    router.delete('/:id', [DriversController, 'destroy'])
  })
  .prefix('/api/drivers')

//Register routes
router.post('/api/register', [UserController, 'register'])

//Client routes
router
  .group(() => {
    router.get('/', [ClientsController, 'index'])
    router.get('/:id', [ClientsController, 'show'])
    router.post('/', [ClientsController, 'store'])
    router.put('/:id', [ClientsController, 'update'])
    router.delete('/:id', [ClientsController, 'destroy'])
  })
  .prefix('/api/clients')

//Provider routes
router
  .group(() => {
    router.get('/', [ProvidersController, 'index'])
    router.get('/:id', [ProvidersController, 'show'])
    router.post('/', [ProvidersController, 'store'])
    router.put('/:id', [ProvidersController, 'update'])
    router.delete('/:id', [ProvidersController, 'destroy'])
  })
  .prefix('/api/providers')

router.get('/', async ({ response }) => {
  return response.redirect('/docs')
})

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swaggerConfig)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swaggerConfig)
})
