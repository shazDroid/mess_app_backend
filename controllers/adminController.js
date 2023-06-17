const asyncHandler = require('express-async-handler')
const dbConnection = require('../config/dbConnection')
const errorHandler = require('../middleware/errorHandler')

//@desc login admin 
//@route POST /api/admin/login
//@access Public
const loginAdmin = asyncHandler(async (req, res) => {
    const { phoneNo, password } = req.body
    if (!phoneNo || !password) {
        res.status(400).json({ message: "All fields are required" })
    }
    dbConnection.query(`SELECT * FROM admin WHERE phone_no = '${phoneNo}' AND password = '${password}' LIMIT 1`, (err, result) => {
        if (err) {
            console.log(err)
            res.status(200).json(err)
        } else {
            if (result == "") {
                res.status(401).json({ message: "No such user !" })
            } else {
                res.status(200).json(result)
            }
        }
    })

    //res.status(200).json({message:"login api"})
})

//@desc register user 
//@route POST /api/admin/registerSupervisior
//@access Public
const registerSuperVisior = asyncHandler(async (req, res) => {
    const { adminId, firstName, lastName, phoneNo, branchId } = req.body

    let checkQuery = `SELECT * FROM supervisior WHERE phone = '${phoneNo}'`

    dbConnection.query(checkQuery, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            if (result.length > 0) {
                res.status(403).json({ message: "User already exists" })
            } else {
                let query = `INSERT INTO supervisior (admin_id, first_name, last_name, phone, branch_id, timestamp) VALUES (${adminId}, '${firstName}', '${lastName}','${phoneNo}',${branchId}, current_timestamp())`
                dbConnection.query(query, (err, result) => {
                    if (err) {
                        res.status(400).json({ message: err })
                    } else {
                        res.status(200).json({ message: `${firstName} ${lastName} added as a supervisior successfully` })
                    }
                })
            }
        }
    })
})


//@desc add location
//@route POST /api/admin/addLocation
//@access Public
const addLocation = asyncHandler(async (req, res) => {
    const { locationName } = req.body
    let query = `INSERT INTO locations (location_name, timestamp) VALUES ('${locationName}', current_timestamp())`
    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            res.status(200).json({ message: `${locationName} added successfully` })
        }
    })
})

//@desc add branch
//@route POST /api/admin/addBranch
//@access Public
const addBranch = asyncHandler(async (req, res) => {
    const { branchName, locationId } = req.body
    let checkQuery = `SELECT * FROM branch WHERE branch_name = '${branchName}' AND location_id = ${locationId}`
    dbConnection.query(checkQuery, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            if (result.length > 0) {
                res.status(403).json({ message: "Branch already exists !" })
            } else {
                let query = `INSERT INTO branch (branch_name, location_id, timestamp) VALUES ('${branchName}', ${locationId}, current_timestamp())`
                dbConnection.query(query, (err, result) => {
                    if (err) {
                        res.status(400).json({ message: err })
                    } else {
                        res.status(200).json({ message: `${branchName} added successfully` })
                    }
                })
            }
        }
    })
})


//@desc add organisation
//@route POST /api/admin/addOrganisation
//@access Public
const addOrganisation = asyncHandler(async (req, res) => {
    const { organisationName, branchId } = req.body
    let query = `INSERT INTO organisations (name, branch_id, timestamp) VALUES ('${organisationName}', ${branchId},current_timestamp())`
    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            res.status(200).json({ message: `${organisationName} added successfully` })
        }
    })
})


//@desc add product unit
//@route POST /api/admin/addProductUnit
//@access Public
const addProductUnit = asyncHandler(async (req, res) => {
    const { productUnit } = req.body
    let query = `INSERT INTO product_unit (product_unit, timestamp) VALUES ('${productUnit}', current_timestamp())`
    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            res.status(200).json({ message: `${productUnit} added successfully` })
        }
    })
})


//@desc add product type
//@route POST /api/admin/addProductType
//@access Public
const addProductType = asyncHandler(async (req, res) => {
    const { productType } = req.body
    let query = `INSERT INTO product_type (product_type, timestamp) VALUES ('${productType}', current_timestamp())`
    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            res.status(200).json({ message: `${productType} added successfully` })
        }
    })
})


//@desc add product 
//@route POST /api/admin/addProduct
//@access Public
const addProduct = asyncHandler(async (req, res) => {
    const { productName, productTypeId, productUnitId, productPrice, organisationPrice } = req.body
    // Insert product & get product id
    let query = `INSERT INTO product (product_name, product_type_id, product_unit_id, product_price, timestamp) VALUES ('${productName}',${productTypeId},${productUnitId},'${productPrice}', current_timestamp())`

    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            // Insert organisation product price
            organisationPrice.forEach(element => {
                addOrganisationProductPrice(element.organisationId, result.insertId, element.price)
            });
            res.status(200).json({ message: `${productName} added successfully` })
        }
    })
})


function addOrganisationProductPrice(organisationId, productId, price) {
    let data = {
        organisation_id: organisationId,
        product_id: productId,
        price: price
    }
    let query = `INSERT INTO organisation_product_price set ?`
    dbConnection.query(query, data, (err, result) => {
        if (err) {
            throw errorHandler
        }
    })
}


//@desc get all supervisior
//@route POST /api/admin/getAllSupervisior
//@access Public
const getAllSupervisior = asyncHandler(async (req, res) => {
    const { adminId } = req.body
    let query = `SELECT
            sp.admin_id,
            sp.id as id,
            sp.first_name,
            sp.last_name,
            sp.phone,
            sp.password,
            sp.branch_id AS branch_id,
            bh.branch_name,
            ll.location_name,
            ll.id as location_id
        FROM
            supervisior sp,
            admin ad,
            branch bh,
            locations ll
        WHERE sp.admin_id = ad.id 
        AND sp.branch_id = bh.id 
        AND bh.location_id = ll.id 
        AND ad.id = ${adminId} ORDER BY sp.timestamp DESC`
    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            res.status(200).json(result)
        }
    })
})


//@desc get all location
//@route POST /api/admin/getAllLocations
//@access Public
const getAllLocations = asyncHandler(async (req, res) => {
    let query = `SELECT * FROM locations`
    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            res.status(200).json(result)
        }
    })
})




//@desc get all branch
//@route POST /api/admin/getAllBranch
//@access Public
const getAllBranch = asyncHandler(async (req, res) => {
    let query = `SELECT b.id,b.branch_name,b.location_id as location_id,l.location_name as location_name, b.timestamp FROM branch b, locations l WHERE b.location_id = l.id`
    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            res.status(200).json(result)
        }
    })
})



//@desc get all organisation
//@route POST /api/admin/getAllOrganisation
//@access Public
const getAllOrganisation = asyncHandler(async (req, res) => {
    let query = `SELECT o.id,o.name ,b.id as branch_id,b.branch_name,o.location_id as location_id, o.timestamp as timestamp 
    FROM organisations o, branch b
    WHERE o.branch_id = b.id`
    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            res.status(200).json(result)
        }
    })
})


//@desc get all qty
//@route POST /api/admin/getAllQty
//@access Public
const getAllProductUnit = asyncHandler(async (req, res) => {
    let query = `SELECT * FROM product_unit`
    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            res.status(200).json(result)
        }
    })
})


//@desc get all product type
//@route POST /api/admin/getAllProductType
//@access Public
const getAllProductType = asyncHandler(async (req, res) => {
    let query = `SELECT * FROM product_type`
    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            res.status(200).json(result)
        }
    })
})


//@desc get all product
//@route POST /api/admin/getAllProduct
//@access Public
const getAllProduct = asyncHandler(async (req, res) => {
    const { adminId } = req.body
    let query = `SELECT * FROM product WHERE product.admin_id = ${adminId}`

    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            const productPromise = result.map(product => {
                return new Promise((resolve, reject) => {
                    let query = `SELECT pi.id,pi.name,pi.unit_type,pi.price,pi.timestamp FROM product_item pi, product_item_product pip
                    WHERE pi.id = pip.product_item_id 
                    AND pip.product_id = ${product.id}`
                    dbConnection.query(query, (err, productItems) => {
                        if (err) {
                            reject(err)
                            res.status(403).json({ message: err })
                        } else {
                            resolve({ product, productItems })
                        }
                    })
                })
            })
            Promise.all(productPromise)
                .then(result => {
                    res.status(200).json(result)
                })
        }
    })
})


//@desc get all product
//@route POST /api/admin/getAllProduct
//@access Public
const getAllProductItems = asyncHandler(async (req, res) => {
    const { adminId } = req.body
    let query = `SELECT * FROM product_item WHERE product_item.admin_id = ${adminId}`

    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
           res.status(200).json(result)
        }
    })
})



//@desc get product by id
//@route POST /api/admin/getProductById
//@access Public
const getProductById = asyncHandler(async (req, res) => {
    let productId = req.params.productId
    let query = `SELECT p.id,p.product_name,p.product_type_id,p.product_unit_id,p.product_price,p.timestamp,pu.product_unit,pt.product_type FROM product p, product_unit pu, product_type pt
    WHERE p.product_unit_id = pu.id
    AND p.product_type_id = pt.id
    AND p.id = ${productId}`

    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
        } else {
            const productPromise = result.map(product => {
                return new Promise((resolve, reject) => {
                    let query = `SELECT op.id,o.id as organisation_id,op.product_id,op.price,o.name FROM organisation_product_price op,organisations o 
                    WHERE op.organisation_id = o.id
                    AND op.product_id = ${product.id}`
                    dbConnection.query(query, (err, organisationPrice) => {
                        if (err) {
                            reject(err)
                            res.status(403).json({ message: err })
                        } else {
                            resolve({ product, organisationPrice })
                        }
                    })
                })
            })
            Promise.all(productPromise)
                .then(result => {
                    if (result.length > 0)
                        res.status(200).json(result[0])
                    else res.status(200).json({})
                })
        }
    })
})


//@desc add product 
//@route POST /api/admin/addProduct
//@access Public
const updateProduct = asyncHandler(async (req, res) => {
    const { productName, productTypeId, productUnitId, productPrice, organisationPrice } = req.body;
    const productId = req.params.productId;

    // Update product details
    let query = `UPDATE product SET product_name = '${productName}', product_type_id = ${productTypeId}, product_unit_id = ${productUnitId}, product_price = '${productPrice}', timestamp = current_timestamp() WHERE id = ${productId}`;

    dbConnection.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: err });
        } else {
            // Delete existing organisation product prices
            deleteOrganisationProductPrices(productId, () => {
                // Insert updated organisation product prices
                organisationPrice.forEach(element => {
                    addOrganisationProductPrice(element.organisationId, productId, element.price);
                });
                res.status(200).json({ message: `${productName} updated successfully` });
            });
        }
    });
});



const deleteOrganisationProductPrices = (productId, callback) => {
    // Delete organisation product prices for the given productId
    let query = `DELETE FROM organisation_product_price WHERE product_id = ${productId}`;
  
    dbConnection.query(query, (err, result) => {
      if (err) {
        console.error('Error deleting organisation product prices:', err);
      }
      // Execute the callback function after deleting the prices
      callback();
    });
  };



module.exports = { loginAdmin, registerSuperVisior, addLocation, addBranch, addOrganisation, addProductUnit, addProductType, addProduct, getAllSupervisior, getAllLocations, getAllBranch, getAllOrganisation, getAllProductUnit, getAllProductType, getAllProduct, getProductById, updateProduct, getAllProductItems }