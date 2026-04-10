const jwt = require('jsonwebtoken')

const verify = async (req,res)=>
{
    try 
    {
        const token = req.he
    } 
    catch (error) 
    {
        return res.status(500).json({
            ok:false,
            message:error.message
        })
    }
}

module.exports = verify