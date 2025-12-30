import jwt from 'jsonwebtoken'
import doctorModel from '../models/doctorModel.js'

const authDoctor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({
        success: false,
        message: 'Not Authorized. Login Again'
      })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // ✅ MUST be doctorModel
    const doctor = await doctorModel
      .findById(decoded.id)
      .select('-password')

    if (!doctor) {
      return res.json({
        success: false,
        message: 'Doctor not found'
      })
    }

    req.doctor = doctor
    req.docId = doctor._id

    next()
  } catch (error) {
    console.error('AUTH ERROR:', error.message)
    return res.json({
      success: false,
      message: 'Invalid Token'
    })
  }
}

export default authDoctor
