//import cache from '@adonisjs/cache/services/main'
import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swaggerConfig from '#config/swagger'
import { middleware } from './kernel.js'

const UserController = () => import('#controllers/user_controller')
//const RolesController = () => import('#controllers/role_controller')
const ClientsController = () => import('#controllers/client_controller')
const CompaniesController = () => import('#controllers/company_controller')
const DriversController = () => import('#controllers/driver_controller')
const CategoriesController = () => import('#controllers/category_controller')
const TrucksController = () => import('#controllers/truck_controller')
const OrdersController = () => import('#controllers/order_controller')
const DetailsOrderController = () => import('#controllers/detail_order_controller')
const AuthController = () => import('#controllers/auth_controller')
const DriverAuthController = () => import('#controllers/driver_auth_controller')

//Role routes
//router.post('/api/roles', [RolesController, 'store'])

router
  .group(() => {
    router.post('/signup', [AuthController, 'signup'])
    router.post('/login', [AuthController, 'login'])
    router.post('/forgot-password', [AuthController, 'forgotPassword'])
    router.post('/reset-password', [AuthController, 'resetPassword'])
    // Logout requiere auth — el CookieAuthMiddleware ya inyecta el token automáticamente
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('/me', [AuthController, 'me']).use(middleware.auth())
  })
  .prefix('/api/auth')

// Auth routes — Drivers
router
  .post('/api/auth/register-driver', [DriverAuthController, 'registerDriver'])
  .use([middleware.auth(), middleware.roleGuard(['company'])])

//Trucks routes
router
  .group(() => {
    router.get('/', [TrucksController, 'index'])
    router.get('/:id', [TrucksController, 'show'])
    router.post('/', [TrucksController, 'store'])
    router.put('/:id', [TrucksController, 'update'])
    router.delete('/:id', [TrucksController, 'destroy'])
  })
  .prefix('/api/trucks')
  .use([middleware.auth(), middleware.roleGuard(['company', 'platform_admin'])])

// Driver routes
router
  .group(() => {
    router.get('/', [DriversController, 'index'])
    router.get('/:id', [DriversController, 'show'])
    router.delete('/:id', [DriversController, 'destroy'])
  })
  .prefix('/api/drivers')
  .use([middleware.auth(), middleware.roleGuard(['company'])])

router
  .put('/api/drivers/:id', [DriversController, 'update'])
  .use([middleware.auth(), middleware.roleGuard(['driver', 'company'])])
router
  .post('/api/drivers', [DriversController, 'store'])
  .use([middleware.auth(), middleware.roleGuard(['company', 'driver'])])

//Register routes
router
  .post('/api/register', [UserController, 'register'])
  .use([middleware.auth(), middleware.roleGuard(['platform_admin'])])

//Client routes
router
  .group(() => {
    router.get('/', [ClientsController, 'index'])
    router.get('/:id', [ClientsController, 'show'])
    router.delete('/:id', [ClientsController, 'destroy'])
  })
  .prefix('/api/clients')
  .use([middleware.auth(), middleware.roleGuard(['platform_admin'])])

router
  .put('/api/clients/:id', [ClientsController, 'update'])
  .use([middleware.auth(), middleware.roleGuard(['client'])])
router
  .post('/api/clients', [ClientsController, 'store'])
  .use([middleware.auth(), middleware.roleGuard(['platform_admin', 'client'])])

//Company routes
router
  .group(() => {
    router.delete('/:id', [CompaniesController, 'destroy'])
  })
  .prefix('/api/companies')
  .use([middleware.auth(), middleware.roleGuard(['platform_admin'])])

router
  .get('/api/companies/', [CompaniesController, 'index'])
  .use([middleware.auth(), middleware.roleGuard(['platform_admin', 'client'])])
router
  .get('/api/companies/:id', [CompaniesController, 'show'])
  .use([middleware.auth(), middleware.roleGuard(['platform_admin', 'client'])])

router
  .put('/api/companies/:id', [CompaniesController, 'update'])
  .use([middleware.auth(), middleware.roleGuard(['platform_admin', 'company'])])

router
  .post('/api/companies', [CompaniesController, 'store'])
  .use([middleware.auth(), middleware.roleGuard(['platform_admin', 'company'])])

// Category routes
router
  .group(() => {
    router.get('/', [CategoriesController, 'index'])
    router.get('/:id', [CategoriesController, 'show'])
    router.post('/', [CategoriesController, 'store'])
    router.put('/:id', [CategoriesController, 'update'])
    router.delete('/:id', [CategoriesController, 'destroy'])
  })
  .prefix('/api/categories')
  .use([middleware.auth(), middleware.roleGuard(['company', 'platform_admin'])])

// Order routes
router
  .group(() => {
    router.post('/', [OrdersController, 'store'])
    router.delete('/:id', [OrdersController, 'destroy'])
  })
  .prefix('/api/orders')
  .use([middleware.auth(), middleware.roleGuard(['company', 'client'])])

router
  .get('/api/orders', [OrdersController, 'index'])
  .use([middleware.auth(), middleware.roleGuard(['company', 'client'])])
router
  .get('/api/orders/:id', [OrdersController, 'show'])
  .use([middleware.auth(), middleware.roleGuard(['company', 'client', 'driver'])])
router
  .put('/api/orders/:id', [OrdersController, 'update'])
  .use([middleware.auth(), middleware.roleGuard(['company', 'client'])])

// Details order routes
router
  .group(() => {
    router.get('/:id', [DetailsOrderController, 'show'])
    router.put('/:id', [DetailsOrderController, 'update'])
  })
  .prefix('/api/order-details')
  .use([middleware.auth(), middleware.roleGuard(['company', 'client'])])

router
  .post('/api/order-details', [DetailsOrderController, 'store'])
  .use([middleware.auth(), middleware.roleGuard(['client'])])
router
  .delete('/api/order-details/:id', [DetailsOrderController, 'destroy'])
  .use([middleware.auth(), middleware.roleGuard(['client'])])

router.get('/', async ({ response }) => {
  return response.redirect('/docs')
})

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swaggerConfig)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swaggerConfig)
})
