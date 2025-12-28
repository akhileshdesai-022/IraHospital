// import { createContext, useEffect, useState } from "react";

// import axios from 'axios'
// import {toast} from 'react-toastify'

// export const AppContext = createContext()

// const AppContextProvider = (props) => {

//     const currencySymbol = '$'
//     const backendUrl = import.meta.env.VITE_BACKEND_URL
//     const [doctors,setDoctors] = useState([])
//     const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)


//     const getDoctorsData = async () => {
//         try {
//             const {data} = await axios.get(backendUrl + '/api/doctor/list')
//             if (data.success) {
//                 setDoctors(data.doctors)
                
//             } else {
//                 toast.error(data.message)

//             }
//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
            
//         }
// }

    
//     const value= {
//         doctors,
//         currencySymbol,
//         token,setToken,
//         backendUrl,

//     }


//     useEffect(()=>{
//         getDoctorsData()

//     },[])

//     return(
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>

//     )
// }

// export default AppContextProvider

import { createContext, useEffect, useState } from "react"
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = (props) => {

  const currencySymbol = '$'
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [doctors, setDoctors] = useState([])
  const [user, setUser] = useState(null)

  const [token, setToken] = useState(
    localStorage.getItem('token')
      ? localStorage.getItem('token')
      : ''
  )
  const [userData,setUserData] = useState(false)

  /* ================= GET DOCTORS ================= */
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/doctor/list'
      )

      if (data.success) {
        setDoctors(data.doctors)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const loadUserProfileData = async () => {
    try {
      
      const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}})
      if (data.success) {
        setUserData(data.userData)
        
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }
  }

  /* ================= GET USER PROFILE ================= */
  const getUserProfile = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/user/get-profile',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (data.success) {
        setUser(data.userData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  /* ================= EFFECTS ================= */
  useEffect(() => {
    getDoctorsData()
  }, [])

  useEffect(()=>{
    if (token) {
      loadUserProfileData()
    } else {
      setUserData(false)
    }
    
  },[token])

  useEffect(() => {
    if (token) {
      getUserProfile()
    } else {
      setUser(null)
    }
  }, [token])

  const value = {
    doctors,
    user,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,setUserData,
    loadUserProfileData

  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
