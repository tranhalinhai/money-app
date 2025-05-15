const jwt = require('jsonwebtoken');

const AuthMiddleware = async (req, res, next) => {
        const authHeader = req.headers.authorization;
        console.log("authHeader:", authHeader); // log header
        const token = authHeader && authHeader.split(' ')[1]; // get token
         console.log("token:", token); // log token
        if(!token){
            return res.status(401).json({ message: 'Token missing' });
         }
       try {
             const decoded = jwt.verify(token, 'moneki'); // thay bằng secret key của bạn
               console.log("payload:", decoded) // log payload
              req.user = decoded;
             next(); // chuyển đến route tiếp theo
       } catch (error) {
           console.log("Error while verifying token:", error); // log error
           return res.status(403).json({ message: 'Invalid Token'});
     }
}
module.exports = { AuthMiddleware }