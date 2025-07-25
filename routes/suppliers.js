const express = require("express");
const router = express.Router();
const suppliersController = require("../controllers/suppliers");
const { check, validationResult } = require("express-validator");
const { isAuthenticated } = require("../middleware/authenticate");

// validation rules
const supplierValidationRules = [
  check("name").notEmpty().withMessage("Name is required."),
  check("email").isEmail().withMessage("Valid email is required."),
  check("phone")
    .isLength({ min: 10 })
    .withMessage("Phone number must be at least 10 characters."),
  check("address").notEmpty().withMessage("Address is required."),
];

// show all suppliers
router.get("/", suppliersController.getAllSuppliers);

// show a supplier by ID
router.get("/:id", suppliersController.getSingleSupplier);

// create a new supplier
router.post(
  "/",
  isAuthenticated,
  supplierValidationRules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  suppliersController.createSupplier
);

// edit a supplier by ID
router.put(
  "/:id",
  isAuthenticated,
  supplierValidationRules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  suppliersController.updateSupplier
);

// delete a supplier by ID
router.delete("/:id", isAuthenticated, suppliersController.deleteSupplier);

module.exports = router;
