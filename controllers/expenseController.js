const pool = require('../config/db')

const addExpense = async (req,res)=>
{
    try 
    {
        const user = req.user;

        const { category , product_name , amount , date } = req.body;

        let values = [];
        let params = [];
        let questionMarks = [];

        if( !category )
        {
            return res.status(404).json({
                ok:false,
                message:"Category can not be null"
            })
        }
        else
        {
            values.push( category );
            params.push('category');
            questionMarks.push('?')
        }

        if( !product_name )
        {
            return res.status(404).json({
                ok:false,
                message:"product_name can not be null"
            })
        }
        else
        {
            values.push( product_name );
            params.push('product_name');
            questionMarks.push('?')
        }

        if( !amount )
        {
            return res.status(404).json({
                ok:false,
                message:"amount can not be null"
            })
        }
        else
        {
            values.push( amount );
            params.push('amount');
            questionMarks.push('?')
        }
        
        if( date )
        {
            values.push( date );
            params.push('date');
            questionMarks.push('?')
        }

        params.push('user_id')
        values.push( user.id );
        questionMarks.push('?')

        const query = `insert into expense( ${params.join(',')} ) values(${questionMarks.join(',')})`;

        const [ result ] = await pool.execute( query , values );

        if( result.affectedRows === 0 )
        {
            return res.status(400).json({
                ok:false,
                message:"Expense is not added!"
            })
        }

        return res.status(201).json({
            ok:true,
            message:"Expense is added successfully!"
        })
    } 
    catch (error) 
    {
        return res.status(500).json({
            ok:false,
            message:error.message
        })
    }
}

const userExpenses = async (req,res)=>
{
    try
    {
        const user = req.user;

        const query = "select expense_id,category,product_name,amount,date from expense where user_id = ? order by date desc";

        const [ result ] = await pool.execute( query , [ user.id] );
        
        return res.status(200).json({
            ok:true,
            data:result,
            message:"Fetched successfully!"
        })

    }
    catch(err)
    {
        return res.status(500).json({
            ok:false,
            message:err.message
        })
    }
}

const userExpenseCustomDate = async (req,res)=>
{
    try
    {
        const { start , end } = req.query;

        if( !start || !end )
        {
            return res.status(404).json({
                ok:false,
                message:"Please specify the custom dates!"
            })
        }
        
        const user = req.user;

        const query = "select category,product_name,amount,date from  expense where user_id = ? and date between ? and ?";

        const [result] = await pool.execute( query , [ user.id, start, end ] );

        return res.status(200).json({
            ok:true,
            data:result
        })
    }
    catch(err)
    {
        return res.status(500).json({
            ok:false,
            message:err.message
        })
    }
}

const userExpenseForWeek = async (req,res)=>
{
    try
    {
        const user = req.user;

        const query = "select category,product_name,amount,date from  expense where user_id = ? and DATEDIFF(CURDATE(), date) <= 7";

        const [ result ] =await pool.execute( query ,[user.id]);

        return res.status(200).json({
            ok:true,
            data:result
        })
    }
    catch(err)
    {
        return res.status(500).json({
            ok:false,
            message:err.message
        })
    }
}

const updateExpense = async (req,res)=>
{
    try
    {
        const user = req.user;

        const { amount , expense_id } = req.body;
        
        if(  !amount || !expense_id )
        {
            return res.status(400).json({
                ok:false,
                message:"expense_id and amount can not be null!"
            })
        }

        const query = "update expense set amount=? ,date=? where user_id=? and expense_id=?";

        const curDate = new Date();

        const values = [ amount,curDate,user.id,expense_id];

        const [ result ] = await pool.execute( query , values );

        if( result.affectedRows === 0 )
        {
            return res.status(404).json({
                ok:false,
                message:"No record found with those details to update."
            })
        }

        return res.status(200).json({
            ok:true,
            message: "Expense updated successfully",
            message:result
        })
    }
    catch(err)
    {
        return res.status(500).json({
            ok:false,
            message:err.message
        })
    }
}

module.exports = {
    addExpense,
    userExpenses,
    userExpenseCustomDate,
    userExpenseForWeek,
    updateExpense
}