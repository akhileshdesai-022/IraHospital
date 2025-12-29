import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token

    if (!token) {
      return res.json({
        success: false,
        message: 'Not Authorized. Login Again'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Fetch full user without password
    const user = await userModel.findById(decoded.id).select('-password')

    if (!user) {
      return res.json({
        success: false,
        message: 'User not found'
      })
    }

    // Attach full user AND userId
    req.user = user        // full object, safe for getProfile
    req.userId = user._id  // for other controllers like cancelAppointment

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
