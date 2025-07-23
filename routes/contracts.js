const express = require('express');
const router = express.Router();
const contractsController = require('../controllers/contracts');

// show all contracts
router.get('/', contractsController.getAllContracts);

// show a contract by ID
router.get('/:id', contractsController.getSingleContract);

// create a new contract
router.post('/', contractsController.createContract);

// edit a contract by ID
router.put('/:id', contractsController.updateContract);

// delete a contract by ID
router.delete('/:id', contractsController.deleteContract);

// change contract status
router.patch('/:id/status', contractsController.changeContractStatus);

module.exports = router;