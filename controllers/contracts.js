const Contract = require('../models/contracts');
const Supplier = require('../models/suppliers'); 

// show all contracts
const getAllContracts = async (req, res) => {
  //#swagger.tags = ['Contracts'];
  try {
    const contracts = await Contract.find().populate('supplier', 'name email'); 
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// show a contract by ID
const getSingleContract = async (req, res) => {
  //#swagger.tags = ['Contracts'];
  try {
    const contract = await Contract.findById(req.params.id).populate('supplier', 'name email');
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create a new contract
const createContract = async (req, res) => {
  //#swagger.tags = ['Contracts'];
  const { contractNumber, supplier, object, startDate, endDate, value, status } = req.body;
  if (!contractNumber || !supplier || !object || !startDate || !endDate || !value) {
    return res.status(400).json({ message: 'Missing required contract fields.' });
  }

  try {
    const existingSupplier = await Supplier.findById(supplier);
    if (!existingSupplier) {
      return res.status(400).json({ message: 'Supplier not found for this contract.' });
    }

    const contract = new Contract({
      contractNumber,
      supplier,
      object,
      startDate,
      endDate,
      value,
      status: status || 'pending',
    });

    const newContract = await contract.save();
    await newContract.populate('supplier', 'name email');
    res.status(201).json(newContract);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// edit a contract
const updateContract = async (req, res) => {
  //#swagger.tags = ['Contracts'];
  try {
    const { id } = req.params;
    const { supplier, ...updateData } = req.body; 
    if (supplier) {
      const existingSupplier = await Supplier.findById(supplier);
      if (!existingSupplier) {
        return res.status(400).json({ message: 'Provided supplier not found.' });
      }
    }

    const updatedContract = await Contract.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true 
    }).populate('supplier', 'name email');

    if (!updatedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json(updatedContract);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete a contract by ID
const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContract = await Contract.findByIdAndDelete(id);

    if (!deletedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    ).populate('supplier', 'name email');

    if (!updatedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json(updatedContract);
  } catch (error) {
    res.status(400).json({ message: error.message });
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