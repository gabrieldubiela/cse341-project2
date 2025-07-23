const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliers');

// show all suppliers
router.get('/', suppliersController.getAllSuppliers);

// show a supplier by ID
router.get('/:id', suppliersController.getSingleSupplier);

// create a new supplier
router.post('/', suppliersController.createSupplier);

// edit a supplier by ID
router.put('/:id', suppliersController.updateSupplier);

// delete a supplier by ID
router.delete('/:id', suppliersController.deleteSupplier);

module.exports = router;