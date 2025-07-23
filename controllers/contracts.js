const Contract = require('../models/contracts');
const Supplier = require('../models/suppliers'); 

// show all contracts
const getAllContracts = async (req, res) => {
  //#swagger.tags = ['Contracts'];
  try {
    const contracts = await Contract.find();
    res.status(200).json(contracts);
  } catch (error) {
    next(error);
  }
};

// show a contract by ID
const getSingleContract = async (req, res) => {
  //#swagger.tags = ['Contracts'];
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json(contract);
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Contract ID format.' });
    }
    next(error);
  }
};

// create a new contract
const createContract = async (req, res) => {
  //#swagger.tags = ['Contracts'];
  try {
    const newContract = new Contract({
      contractNumber: req.body.contractNumber,
      supplier: req.body.supplier,
      object: req.body.object,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      value: req.body.value,
      status: req.body.status,
    });

    const existingSupplier = await Supplier.findById(req.body.supplier);
    if (!existingSupplier) {
        return res.status(400).json({ message: 'Supplier not found with the provided ID.' });
    }

    const savedContract = await newContract.save();
    res.status(201).json(savedContract);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    next(error);
  }
};

// edit a contract
const updateContract = async (req, res) => {
  //#swagger.tags = ['Contracts'];
  try {
    const { id } = req.params;
    const { contractNumber, supplier, object, startDate, endDate, value, status } = req.body;
    if (req.body.supplier) {
        const existingSupplier = await Supplier.findById(req.body.supplier);
        if (!existingSupplier) {
            return res.status(400).json({ message: 'Supplier not found with the provided ID.' });
        }
    }

    const updatedContract = await Contract.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json(updatedContract);
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Contract ID format.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    next(error);
  }
};

// delete a contract by ID
const deleteContract = async (req, res) => {
  //#swagger.tags = ['Contracts'];
  try {
    const { id } = req.params;
    const deletedContract = await Contract.findByIdAndDelete(id);

    if (!deletedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json({ message: 'Contract deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Contract ID format.' });
    }
    next(error);
  }
};


// change the status of a contract
const changeContractStatus = async (req, res) => {
  //#swagger.tags = ['Contracts'];
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !['active', 'inactive', 'pending', 'expired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid or missing status provided. Must be one of: active, inactive, pending, expired.' });
    }

    const updatedContract = await Contract.findByIdAndUpdate(
      id,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!updatedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json(updatedContract);
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Contract ID format.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    next(error);
  }
};

module.exports = {
  getAllContracts,
  getSingleContract,
  createContract,
  updateContract,
  deleteContract,
  changeContractStatus,
};