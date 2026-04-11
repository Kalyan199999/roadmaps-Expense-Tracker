const express = require('express')

const verify = require('../middlewares/verification')

const {
    addExpense,
    userExpenses
} = require('../controllers/expenseController')

const router = express.Router();

router.post( '/' ,verify , addExpense )
router.get( '/',verify, userExpenses )

module.exports = router