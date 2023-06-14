const express = require('express')
const adminRouter = express.Router()
const { loginAdmin, registerSuperVisior, addLocation, addBranch, addOrganisation, addProductUnit, addProductType, addProduct, getAllSupervisior, getAllLocations, getAllBranch, getAllOrganisation, getAllProductUnit, getAllProductType, getAllProduct, getProductById, updateProduct } = require('../controllers/adminController')



adminRouter.route('/login').post(loginAdmin)

adminRouter.route('/registerSupervisior').post(registerSuperVisior)

adminRouter.route('/addLocation').post(addLocation)

adminRouter.route('/addBranch').post(addBranch)

adminRouter.route('/addOrganisation').post(addOrganisation)

adminRouter.route('/addProductUnit').post(addProductUnit)

adminRouter.route('/addProductType').post(addProductType)

adminRouter.route('/addProduct').post(addProduct)

adminRouter.route('/getAllSupervisior').post(getAllSupervisior)

adminRouter.route('/getAllLocations').get(getAllLocations)

adminRouter.route('/getAllBranch').get(getAllBranch)

adminRouter.route('/getAllOrganisations').get(getAllOrganisation)

adminRouter.route('/getAllProductUnit').get(getAllProductUnit)

adminRouter.route('/getAllProductType').get(getAllProductType)

adminRouter.route('/getAllProducts').get(getAllProduct)

adminRouter.route('/getProductById/:productId').get(getProductById)

adminRouter.route('/updateProduct/:productId').post(updateProduct)



module.exports = adminRouter