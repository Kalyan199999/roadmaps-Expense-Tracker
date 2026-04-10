const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')

const signUp = async (req,res)=>
{
    try 
    {
        const { username , password , email } = req.body;

        if( !password || !email )
        {
            return res.status(400).json({
                ok:false,
                message:"Fields can not be empty!"
            })
        }

        // check the email is already exists
        const [ users ] = await pool.execute( 'select email from user where email=? ' , [ email ] );

        if( users.length > 0 )
        {
            return res.status(400).json({
                ok:false,
                message:"Email is already exists!"
            })
        }

        const hashPaaword = await bcrypt.hash( password , 10 );

        const query = 'insert into user(username,email,password) values(?,?,?)';

        const [ result  ] = await pool.execute( query , [username,email,hashPaaword] );
        
        if( result.affectedRows === 0 )
        {
            return res.statsu(400).json({
                ok:false,
                message:"Sign up failed!Try again"
            })
        }
        
        const sql = 'select id, username,email from  user where email = ?'
        
        const [ user ] = await pool.execute( sql , [ email] )
        
        const secrete_key = process.env.SCRETE_KEY

        const token = jwt.sign( {
            id:user[0].id,
            email:email,
            username:username
        } ,secrete_key,{ expiresIn:'1h' } )

        return res.status(201).json({
            ok:true,
            data:user[0],
            token
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


const login = async (req,res)=>
{
    try 
    {
        const { email , password } = req.body;

        const sql = 'select id, username ,password from  user where email = ?';

        const [ result ] = await pool.execute( sql , [email]);

        if( result.length === 0 )
        {
            return res.status(400).json({
                ok:false,
                message:"Invalid Credientials!"
            })
        }

        const user = result[0];

        const hash = user.password;

        const isTrue = await bcrypt.compare( password , hash )

        if( !isTrue )
        {
            return res.status(400).json({
                ok:false,
                message:"Invalid Credientials!"
            })
        }

        const secrete_key = process.env.SCRETE_KEY

        const token = jwt.sign( {
            username: user.username,
            email: email
        } , secrete_key , {expiresIn:'1h'} )

        return res.status(200).json({
            ok:true,

            data:{
                id:user.id,
                username:user.username,
                email:email
            },

            token
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

module.exports = {
    signUp,
    login
}