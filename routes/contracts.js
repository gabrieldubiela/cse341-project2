const express = require("express");
const router = express.Router();
const contractsController = require("../controllers/contracts");
const { check, validationResult } = require("express-validator");
const { isAuthenticated } = require("../middleware/authenticate");

const contractValidationRules = [
  check("contractNumber")
    .notEmpty()
    .withMessage("Contract number is required.")
    .isNumeric()
    .withMessage("Contract number must be a number."),
  check("supplier").notEmpty().withMessage("Supplier ID is required."),
  check("object").notEmpty().withMessage("Object is required."),
  check("startDate")
    .notEmpty()
    .withMessage("Start Date is required.")
    .isISO8601()
    .toDate()
    .withMessage("Start Date must be a valid date in YYYY-MM-DD format."),
  check("endDate")
    .notEmpty()
    .withMessage("End Date is required.")
    .isISO8601()
    .toDate()
    .withMessage("End Date must be a valid date in YYYY-MM-DD format."),
  check("value")
    .notEmpty()
    .withMessage("Value is required.")
    .isFloat({ min: 0 })
    .withMessage("Value must be a non-negative number."),
  check("status")
    .optional()
    .isIn(["active", "inactive", "pending", "expired"])
    .withMessage(
      "Invalid status provided. Must be one of: active, inactive, pending, expired."
    ),
];

// show all contracts
router.get("/", contractsController.getAllContracts);

// show a contract by ID
router.get("/:id", contractsController.getSingleContract);

// create a new contract
router.post(
  "/",
  isAuthenticated,
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
  isAuthenticated,
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
router.delete("/:id", isAuthenticated, contractsController.deleteContract);

module.exports = router;
