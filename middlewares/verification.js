const jwt = require('jsonwebtoken')

const verify = async (req,res,next)=>
{
    try 
    {
        // get the header where the token is present
        const headers = req.headers;

        // get the actual bearer token
        const bearerToken = headers.authorization 

        // if the token is not present or not started with the bearer then user is unauthorized
        if( !bearerToken || !bearerToken.startsWith('Bearer ') )
        {
            return res.status(401).json({
                ok:false,
                message:"unauthorized"
            })
        }

        // get the actual token and secrete ket
        const token = bearerToken.split(' ')[1];

        const key = process.env.SCRETE_KEY;

        // verify the token and get the user info
        const user = jwt.verify( token,key );

        // add the use info to req to use in coming the functions of this present route
        req.user = user;

        // call the next function
        next();
    } 
    catch (error) 
    {
        const message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
        return res.status(401).json({ ok: false, message });
    }
}

module.exports = verify