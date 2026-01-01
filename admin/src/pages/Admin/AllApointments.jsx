import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

/* ✅ SAFE IMAGE RESOLVER */
const resolveImage = (image, fallback) => {
  if (!image) return fallback

  // string image
  if (typeof image === 'string') {
    if (image.trim() === '') return fallback
    return image.startsWith('http') ? image : fallback
  }

  // cloudinary object
  if (image.secure_url) return image.secure_url
  if (image.url) return image.url

  return fallback
}

const AllApointments = () => {

  const {
    aToken,
    appointments = [],
    getAllAppointments,
    cancelAppointment
  } = useContext(AdminContext)

  const {
    calculateAge,
    slotDateFormat,
    currency
  } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>

        {/* TABLE HEADER */}
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b font-medium'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {/* EMPTY STATE */}
        {appointments.length === 0 && (
          <p className='p-6 text-center text-gray-400'>
            No appointments found
          </p>
        )}

        {/* TABLE BODY */}
        {appointments.map((item, index) => (
          <div
            key={item._id}
            className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
          >
            {/* INDEX */}
            <p className='max-sm:hidden'>{index + 1}</p>

            {/* PATIENT */}
            <div className='flex items-center gap-2'>
              <img
                className='w-8 rounded-full'
                src={resolveImage(item?.userData?.image, assets.defaultUser)}
                alt="Patient"
                onError={(e) => (e.target.src = assets.defaultUser)}
              />
              <p>{item?.userData?.name || 'Patient'}</p>
            </div>

            {/* AGE */}
            <p className='max-sm:hidden'>
              {item?.userData?.dob ? calculateAge(item.userData.dob) : '-'}
            </p>

            {/* DATE */}
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>

            {/* DOCTOR */}
            <div className='flex items-center gap-2'>
              <img
                className='w-8 rounded-full bg-gray-200'
                src={resolveImage(item?.docData?.image, assets.defaultDoctor)}
                alt="Doctor"
                onError={(e) => (e.target.src = assets.defaultDoctor)}
              />
              <p>{item?.docData?.name || 'Doctor'}</p>
            </div>

            {/* FEES */}
            <p>{currency}{item.amount}</p>

            {/* ACTION */}
            {
              item.cancelled
                ? <p className='text-red-400 text-sm font-medium'>Cancelled</p>
                : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className='w-8 cursor-pointer'
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                )
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllApointments
