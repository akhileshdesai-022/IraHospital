

import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
//import { AppContext } from '../../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../Components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {

  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  /* ---------------- FETCH DOCTOR INFO ---------------- */
  const fetchDocInfo = () => {
    const doc = doctors.find(doc => doc._id === docId)
    setDocInfo(doc)
  }

  /* ---------------- GENERATE SLOTS ---------------- */
  /* ---------------- GENERATE SLOTS ---------------- */
const getAvailableSlots = () => {
  if (!docInfo) return

  const slots = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() + i)

    const endTime = new Date(currentDate)
    endTime.setHours(21, 0, 0, 0)

    // Start time
    if (today.toDateString() === currentDate.toDateString()) {
      currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
      currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
    } else {
      currentDate.setHours(10, 0, 0, 0)
    }

    const timeSlots = []

    while (currentDate < endTime) {
      const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      const day = currentDate.getDate()
      const month = currentDate.getMonth() + 1 // Month is 0-indexed
      const year = currentDate.getFullYear()
      const slotDate = `${day}_${month}_${year}`

      const isSlotAvailable =
        !docInfo.slots_booked ||
        !docInfo.slots_booked[slotDate] ||
        !docInfo.slots_booked[slotDate].includes(formattedTime)

      if (isSlotAvailable) {
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })
      }

      // Increment by 30 mins
      currentDate.setMinutes(currentDate.getMinutes() + 30)
    }

    slots.push(timeSlots)
  }

  setDocSlots(slots)
}

  /* ---------------- BOOK APPOINTMENT (FRONTEND ONLY) ---------------- */
  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    if (!slotTime) {
      return toast.warn('Please select a time slot')
    }

    try {
      const date = docSlots[slotIndex][0].datetime
      const slotDate =
        date.getDate() + '_' +
        (date.getMonth() + 1) + '_' +
        date.getFullYear()

      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  /* ---------------- USE EFFECTS ---------------- */
  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) getAvailableSlots()
  }, [docInfo])

  /* ---------------- UI ---------------- */
  return docInfo && (
    <div>

      {/* Doctor detail */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img
            className='bg-primary w-full sm:max-w-72 rounded-lg'
            src={docInfo.image}
            alt=""
          />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>

          <p className='text-sm text-gray-600 mt-1'>
            {docInfo.degree} - {docInfo.speciality}
          </p>

          <p className='text-sm text-gray-500 mt-3'>{docInfo.about}</p>

          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee:
            <span className='text-gray-600'>
              {currencySymbol}{docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* Booking slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>

        <div className='flex gap-3 overflow-x-scroll mt-4'>
          {docSlots.map((item, index) => (
            <div
              key={index}
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                slotIndex === index
                  ? 'bg-primary text-white'
                  : 'border border-gray-200'
              }`}
            >
              <p>{daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className='flex gap-3 overflow-x-scroll mt-4'>
          {docSlots[slotIndex]?.map((item, index) => (
            <p
              key={index}
              onClick={() => setSlotTime(item.time)}
              className={`px-5 py-2 rounded-full cursor-pointer text-sm ${
                slotTime === item.time
                  ? 'bg-primary text-white'
                  : 'text-gray-400 border'
              }`}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button
          onClick={bookAppointment}
          className='bg-primary text-white px-14 py-3 rounded-full my-6'
        >
          Book an appointment
        </button>
      </div>

      {/* Related doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment