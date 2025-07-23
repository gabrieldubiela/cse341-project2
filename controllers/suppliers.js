const Supplier = require("../models/suppliers");

// show all suppliers
const getAllSuppliers = async (req, res) => {
  //#swagger.tags = ['Suppliers'];
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// show supplier by ID
const getSingleSupplier = async (req, res) => {
  //#swagger.tags = ['Suppliers'];
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create a new supplier
const createSupplier = async (req, res) => {
  //#swagger.tags = ['Suppliers'];
  const supplier = new Supplier({
    name: req.body.name,
    contactPerson: req.body.contactPerson,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
  });

  try {
    const newSupplier = await supplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// edit a supplier by ID
const updateSupplier = async (req, res) => {
  //#swagger.tags = ['Suppliers'];
  try {
    const { id } = req.params;
    const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a supplier by ID
const deleteSupplier = async (req, res) => {
  //#swagger.tags = ['Suppliers'];
  try {
    const { id } = req.params;
    const deletedSupplier = await Supplier.findByIdAndDelete(id);

    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSuppliers,
  getSingleSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
