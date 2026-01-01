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
import axios from "axios"
import { toast } from "react-toastify"

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {

  const currencySymbol = "$"
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [doctors, setDoctors] = useState([])
  const [userData, setUserData] = useState(null)
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  )

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/list"
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
      const { data } = await axios.get(
        backendUrl + "/api/user/get-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (data.success) {
        setUserData(data.userData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getDoctorsData()
  }, [])

  useEffect(() => {
    if (token) {
      loadUserProfileData()
    } else {
      setUserData(null)
    }
  }, [token])

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
