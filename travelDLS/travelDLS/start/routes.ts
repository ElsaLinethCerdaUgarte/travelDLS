//import cache from '@adonisjs/cache/services/main'
import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swaggerConfig from '#config/swagger'

const UserController = () => import('#controllers/user_controller')
//const RolesController = () => import('#controllers/role_controller')
const ClientsController = () => import('#controllers/client_controller')
const CompaniesController = () => import('#controllers/company_controller')
const DriversController = () => import('#controllers/driver_controller')
const CategoriesController = () => import('#controllers/category_controller')
const TrucksController = () => import('#controllers/truck_controller')
const OrdersController = () => import('#controllers/order_controller')
const DetailsOrderController = () => import('#controllers/detail_order_controller')

//Role routes
//router.post('/api/roles', [RolesController, 'store'])

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

//Company routes
router
  .group(() => {
    router.get('/', [CompaniesController, 'index'])
    router.get('/:id', [CompaniesController, 'show'])
    router.post('/', [CompaniesController, 'store'])
    router.put('/:id', [CompaniesController, 'update'])
    router.delete('/:id', [CompaniesController, 'destroy'])
  })
  .prefix('/api/companies')

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

// Order routes
router
  .group(() => {
    router.get('/', [OrdersController, 'index'])
    router.get('/:id', [OrdersController, 'show'])
    router.post('/', [OrdersController, 'store'])
    router.put('/:id', [OrdersController, 'update'])
    router.delete('/:id', [OrdersController, 'destroy'])
  })
  .prefix('/api/orders')

// Details order routes
router
  .group(() => {
    router.post('/', [DetailsOrderController, 'store'])
    router.get('/:id', [DetailsOrderController, 'show'])
    router.put('/:id', [DetailsOrderController, 'update'])
    router.delete('/:id', [DetailsOrderController, 'destroy'])
  })
  .prefix('/api/order-details')

router.get('/', async ({ response }) => {
  return response.redirect('/docs')
})

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swaggerConfig)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swaggerConfig)
})
