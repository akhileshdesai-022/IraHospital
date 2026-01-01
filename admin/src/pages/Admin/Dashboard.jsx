import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

/* 🔹 Helper to safely resolve images */
const resolveImage = (image, fallback) => {
  if (!image) return fallback

  if (typeof image === 'string') {
    if (image.trim() === '') return fallback
    return image.startsWith('http') ? image : fallback
  }

  if (image.secure_url) return image.secure_url
  if (image.url) return image.url

  return fallback
}

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='m-5'>

      {/* Stats */}
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Booking */}
      <div className='bg-white mt-10'>
        <div className='flex items-center gap-2.5 px-4 py-4 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Booking</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointmemts?.map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>

              {/* Doctor Image */}
              <img
                className='rounded-full w-10'
                src={resolveImage(item?.docData?.image, assets.defaultDoctor)}
                alt={item?.docData?.name || "Doctor"}
                onError={(e) => e.target.src = assets.defaultDoctor}
              />

              {/* Doctor Info */}
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>
                  {item?.docData?.name || "Doctor"}
                </p>
                <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
              </div>

              {/* Actions */}
              {item.cancelled
                ? <p className='text-red-400 text-sm font-medium'>Cancelled</p>
                : <img
                    onClick={() => cancelAppointment(item._id)}
                    className='w-10 cursor-pointer'
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
