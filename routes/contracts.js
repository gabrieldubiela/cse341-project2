const express = require("express");
const router = express.Router();
const contractsController = require("../controllers/contracts");
const { check, validationResult } = require("express-validator");

// validation rules
const contractValidationRules = [
  check("contractNumber").notEmpty().withMessage("Number is required."),
  check("supplier").notEmpty().withMessage("Supplier ID is required."),
  check("object").notEmpty().withMessage("Object is required."),
  check("startDate").notEmpty().withMessage("Object is required."),
  check("value")
    .notEmpty().withMessage("Value is required.")
    .isInt().withMessage("Value must be a number.")
];

// show all contracts
router.get("/", contractsController.getAllContracts);

// show a contract by ID
router.get("/:id", contractsController.getSingleContract);

// create a new contract
router.post(
  "/",
  contractValidationRules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  contractsController.createContract
);

// edit a contract by ID
router.put(
  "/:id",
  contractValidationRules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  contractsController.updateContract
);

// delete a contract by ID
router.delete("/:id", contractsController.deleteContract);

// change contract status
router.patch("/:id/status", 
    contractValidationRules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  contractsController.createContract
);

module.exports = router;
