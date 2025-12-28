// import validator from 'validator'
// import bycrypt from 'bcrypt'
// import userModel from '../models/userModel.js'
// import jwt from 'jsonwebtoken'



// // API to register user

// const registerUser = async (req,res) =>{

//     try {

//         const { name, email, password} = req.body
        
//         if (!name || !password || !email) {
//             return res.json({success:false,message:"Missing Details"})
            
//         }
//         // validating email format
//         if (!validator.isEmail(email)) {
//             return res.json({success:false,message:"enter a valid email"})
            
            
//         }

//         // validating strong password
//         if (password.length < 8) {
//             return res.json({success:false,message:"enter a strong password"})
            
//         }

//         // hashing user password
//         const salt = await bycrypt.genSalt(10)
//         const hashedPassword = await bycrypt.hash(password,salt)


//         const userData = {
//             name,
//             email,
//             password : hashedPassword
             
//         }

//         const newUser = new userModel(userData)
//         const user = await newUser.save()

//         const token = jwt.sign({id:user._id}, process.env.JWT_SECRET  )

//         res.json({success:true,token})
        


//     } catch (error) {
//          console.log(error)
//           res.json({success:false,message:error.message})
        
        
//     }
// }

// // API for user Login

// const loginUser = async (req,res) => {
//     try {
        
//         const {email,password} = req.body
//         const user = await userModel.findOne({email})


//         if (!user) {
//            return res.json({success:false,message:'user does not exist'})

//         }

//         const isMatch = await bycrypt.compare(password,user.password)

//         if (isMatch) {
//             const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
//             res.json({success:true,token})
            
//         }else{
//             res.json({success:false,message:"Invalid Credentials"})
//         }



//     } catch (error) {
        
//         console.log(error)
//          res.json({success:false,message:error.message})
//     }
// }

// // API to get user profile data

// const getProfile = async (req,res) => {
//     try {
        
//         const { userId } = req.body
//         const userData = await userModel.findById(userId).select('-password')

//         res.json({success:true,userData})
//     } catch (error) {
//          console.log(error)
//          res.json({success:false,message:error.message})
        
//     }
// }

// export {registerUser,loginUser,getProfile}

import validator from 'validator'
import bcrypt from 'bcrypt'          // ✅ FIX: bcrypt (not bycrypt)
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

/* ================= REGISTER USER ================= */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing Details' })
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Enter a valid email' })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Enter a strong password' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword
    })

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/* ================= LOGIN USER ================= */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid Credentials' })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/* ================= GET USER PROFILE ================= */
const getProfile = async (req, res) => {
  try {
    // ✅ FIX: GET USER ID FROM MIDDLEWARE
    const userId = req.user.id

    const userData = await userModel
      .findById(userId)
      .select('-password')

    res.json({ success: true, userData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to update user profile
// const updateProfile = async (req,res) => {
//     try {

//         const {userId, name, phone, address, dob, gender} = req.body
//         const imageFile = req.file

//         if (!name || !phone || !dob || !gender) {
//             return res.json({success:false,message:"Data Missing"})
            
//         }

//         await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

//         if(imageFile) {
//         // upload image to cloudinary
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
//         const imageURL = imageUpload.secure_url

//         await userModel.findByIdAndUpdate(userId,{image:imageURL})

        
//     }

//     res.json({success:true,message:"Profile Updated"})
        
//     } catch (error) {
//         console.log(error)
//     res.json({ success: false, message: error.message })
        
    
//     }

// }

// export { registerUser, loginUser, getProfile, updateProfile }

//import cloudinary from '../config/cloudinary.js'
//import userModel from '../models/userModel.js'

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id  // ✅ TAKE ID FROM AUTH MIDDLEWARE

    const { name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" })
    }

    // SAFE PARSING OF ADDRESS
    let parsedAddress = null
    if (address) {
      try {
        parsedAddress = JSON.parse(address)
      } catch (err) {
        return res.json({ success: false, message: "Invalid address format" })
      }
    }

    // UPDATE USER
    const updateData = {
      name,
      phone,
      dob,
      gender,
      ...(parsedAddress && { address: parsedAddress })
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    )

    // UPLOAD IMAGE IF EXISTS
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      const imageURL = imageUpload.secure_url

      user.image = imageURL
      await user.save()
    }

    res.json({ success: true, message: "Profile Updated", user })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body

    // ✅ userId from token (NOT body)
    const userId = req.user.id

    // fetch doctor
    const docData = await doctorModel.findById(docId).select('-password')
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" })
    }

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" })
    }

    let slots_booked = docData.slots_booked || {}

    // check slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" })
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = [slotTime]
    }

    // ✅ fetch full user data
    const userData = await userModel.findById(userId).select('-password')
    if (!userData) {
      return res.json({ success: false, message: "User not found" })
    }

    // remove slots before saving doctor snapshot
    const docSnapshot = docData.toObject()
    delete docSnapshot.slots_booked

    const appointmentData = {
      userId,
      docId,
      userData,
      docData: docSnapshot,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    // update booked slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: "Appointment Booked" })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

 export { registerUser, loginUser, getProfile, updateProfile, bookAppointment }
  