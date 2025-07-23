const mongoose = require("mongoose");

const Contract = require("../models/contracts");
const Supplier = require("../models/suppliers");

// messages
const contractNotFound = "Contract not found";
const supplierNotFound = "Supplier not found";
const invalidSupplierIdFormat = "Supplier ID don't have 24 characters.";
const invalidContractIdFormat = "Contract ID don't have 24 characters.";
const contractDeleted = "Contract deleted successfully";

// show all contracts
const getAllContracts = async (req, res, next) => {
  //#swagger.tags = ['Contracts'];
  try {
    const contracts = await Contract.find();
    res.status(200).json(contracts);
  } catch (error) {
    next(error);
  }
};

// show a contract by ID
const getSingleContract = async (req, res, next) => {
  //#swagger.tags = ['Contracts'];
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: contractNotFound });
    }
    res.status(200).json(contract);
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: invalidContractIdFormat });
    }
    next(error);
  }
};

// create a new contract
const createContract = async (req, res, next) => {
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
      return res.status(400).json({ message: supplierNotFound });
    }

    const savedContract = await newContract.save();
    res.status(201).json(savedContract);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: error.message, errors: error.errors });
    }
    next(error);
  }
};

// edit a contract
const updateContract = async (req, res, next) => {
  //#swagger.tags = ['Contracts'];
  try {
    const { id } = req.params;
    const {
      contractNumber,
      supplier,
      object,
      startDate,
      endDate,
      value,
      status,
    } = req.body;
    if (req.body.supplier) {
      if (!mongoose.Types.ObjectId.isValid(supplier)) {
        return res.status(400).json({ message: invalidSupplierIdFormat });
      }

      const existingSupplier = await Supplier.findById(supplier);
      if (!existingSupplier) {
        return res.status(400).json({ message: supplierNotFound });
      }
    }

    const updatedContract = await Contract.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedContract) {
      return res.status(404).json({ message: contractNotFound });
    }
    res.status(200).json(updatedContract);
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: invalidContractIdFormat });
    }
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: error.message, errors: error.errors });
    }
    next(error);
  }
};

// delete a contract by ID
const deleteContract = async (req, res, next) => {
  //#swagger.tags = ['Contracts'];
  try {
    const { id } = req.params;
    const deletedContract = await Contract.findByIdAndDelete(id);

    if (!deletedContract) {
      return res.status(404).json({ message: contractNotFound });
    }
    res.status(200).json({ message: contractDeleted });
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: invalidContractIdFormat });
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
};
