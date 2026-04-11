const express = require('express')
const cors = require('express')
require('dotenv').config()

const pool = require('./config/db')

const userRoute = require('./routes/userRoute')
const expenseRoute = require('./routes/expenseRoute')

const app = express()

app.use( express.json() )
app.use( cors() )

app.use( '/api/user/' , userRoute )
app.use( '/api/expense/' , expenseRoute )

const port = process.env.PORT || 5000;

app.listen( port , async ()=>{
    try 
    {
        console.log(`server started on the port ${port}`);
    } 
    catch (error) 
    {
        console.log(error);
    }
})