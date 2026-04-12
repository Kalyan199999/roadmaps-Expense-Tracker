const express = require('express')

const verify = require('../middlewares/verification')

const {
    addExpense,
    userExpenses,
    userExpenseCustomDate,
    userExpenseForWeek
} = require('../controllers/expenseController')

const router = express.Router();

router.post( '/' ,verify , addExpense )
router.get( '/',verify, userExpenses )
router.get( '/custom-date' , verify , userExpenseCustomDate)
router.get( '/for-week' , verify , userExpenseForWeek)

module.exports = router