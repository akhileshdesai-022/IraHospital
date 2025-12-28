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
import userModel from '../models/userModel.js'

const authUser = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(' ')[1] ||
      req.headers.token

    if (!token) {
      return res.json({
        success: false,
        message: 'Not Authorized. Login Again'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 🔥 FETCH FULL USER
    const user = await userModel.findById(decoded.id).select('-password')

    if (!user) {
      return res.json({
        success: false,
        message: 'User not found'
      })
    }

    // 🔥 ATTACH FULL USER
    req.user = user

    next()
  } catch (error) {
    console.log(error)
    return res.json({
      success: false,
      message: 'Invalid Token'
    })
  }
}

export default authUser
