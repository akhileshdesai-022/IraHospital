import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'


const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments } = useContext(DoctorContext)
  const { calculateAge, slotDateFormat, currency} = useContext(AppContext)
  useEffect(()=>{
    if (dToken) {
      getAppointments()
    }
  },[dToken, getAppointments])


return (
  <div className='w-full max-w-6xl m-5'> 
    {/* <h2>Doctor Appointments</h2>
    {appointments.length === 0 ? (
      <p>No appointments found</p>
    ) : (
      appointments.map(app => (
        <div key={app._id}>
          <p>Patient: {app.patientName}</p>
          <p>Date: {new Date(app.date).toLocaleString()}</p>
          <p>Status: {app.status}</p>
        </div>
      ))
    )} */}

    <p className='mb-3 text-lg font-medium'>All Appointments</p>

    <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll '>
      <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
        <p>#</p>
        <p>Patient</p>
        <p>Payment</p>
        <p>Age</p>
        <p>Date & Time</p>
        <p>fee</p>
        <p>Action</p>
      </div>

      {
        appointments.map((item,index)=>(
          <div key={index}>
            <p>{index+1}</p>
            <div>
              <img src={item.userData.image} alt="" /> <p>{item.userData.name}</p>
            </div>
            <div>
              <p>
                {item.payment ? 'Online' : 'CASH'}
              </p>
            </div>
            <p>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime} </p>
            <p>{currency}{item.amount}</p>
            <div>
              <img src={assets.cancel_icon} alt="" />
              <img src={assets.tick_icon} alt="" />
            </div>
          
    </div>
        ))
      }
    </div>
  </div>
)

}

export default DoctorAppointments 