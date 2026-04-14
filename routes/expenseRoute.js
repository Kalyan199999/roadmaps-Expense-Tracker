const express = require('express')

const verify = require('../middlewares/verification')

const {
    addExpense,
    userExpenses,
    userExpenseCustomDate,
    userExpenseForWeek,
    updateExpense
} = require('../controllers/expenseController')

const router = express.Router();

router.post( '/' ,verify , addExpense )
router.get( '/',verify, userExpenses )
router.get( '/custom-date' , verify , userExpenseCustomDate)
router.get( '/for-week' , verify , userExpenseForWeek)
router.patch( '/' ,verify , updateExpense )

module.exports = router