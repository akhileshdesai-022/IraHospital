import { useState, useCallback } from "react"
import { createContext } from "react"
import axios from 'axios'
import { toast } from 'react-toastify'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [dToken, setDToken] = useState(
    localStorage.getItem('dToken') || ''
  )

  const [appointments, setAppointments] = useState([])

  const getAppointments = useCallback(async () => {
    if (!dToken) return

    try {
      const { data } = await axios.get(
        backendUrl + '/api/doctor/appointments',
        {
          headers: {
            Authorization: `Bearer ${dToken}`
          }
        }
      )
       console.log('Appointments from API:', data.appointments)
      if (data.success) {
        // ✅ create new array safely
        setAppointments([...data.appointments].reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }, [backendUrl, dToken])

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    getAppointments
  }

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider