// import jwt from 'jsonwebtoken'
// // user authentication middleware

// const authUser = async (req,res,next) => {
//     try {

//         const {token} = req.headers
//         if (!token) {
//             return res.json({success:false,message:"Not Authorized Login Again"})
//         }
//         const token_decode = jwt.verify(token,process.env.JWT_SECRET)

//         req.user.userId = token_decode.id

//          next()
        

      

      
//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }
// }

// export default authUser

import jwt from 'jsonwebtoken'

const authUser = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(' ')[1] ||
      req.headers.token   // 👈 accept token header

    if (!token) {
      return res.json({
        success: false,
        message: 'Not Authorized. Login Again'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = { id: decoded.id }

    next()
  } catch (error) {
    return res.json({
      success: false,
      message: 'Invalid Token'
    })
  }
}

export default authUser
