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

module.exports = {
    addExpense,
    userExpenses
}