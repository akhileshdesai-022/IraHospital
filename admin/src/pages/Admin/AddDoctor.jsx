import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const { backendUrl, aToken } = useContext(AdminContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!docImg) {
      return toast.error('Please select doctor image')
    }

    try {
      const formData = new FormData()

      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append(
        'address',
        JSON.stringify({ line1: address1, line2: address2 })
      )

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: { aToken }
        }
      )

      if (data.success) {
        toast.success(data.message)

        // reset form
        setDocImg(null)
        setName('')
        setEmail('')
        setPassword('')
        setExperience('1 Year')
        setFees('')
        setAbout('')
        setSpeciality('General physician')
        setDegree('')
        setAddress1('')
        setAddress2('')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">

        {/* Upload Image */}
        <div className="flex items-center gap-4 text-gray-500">
          <label htmlFor="doctor-image">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload"
            />
          </label>
          <input
            id="doctor-image"
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setDocImg(e.target.files[0])}
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 mt-6 text-gray-600">

          {/* Left Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">

            <div>
              <p>Doctor Name</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                type="text"
                required
              />
            </div>

            <div>
              <p>Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                type="email"
                required
              />
            </div>

            <div>
              <p>Password</p>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                type="password"
                required
              />
            </div>

            <div>
              <p>Experience</p>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`${i + 1} Year`}>
                    {i + 1} Year
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p>Fees</p>
              <input
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                type="number"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">

            <div>
              <p>Speciality</p>
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div>
              <p>Education</p>
              <input
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                type="text"
                required
              />
            </div>

            <div>
              <p>Address</p>
              <input
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                className="border rounded px-3 py-2 w-full mb-2"
                type="text"
                placeholder="Address line 1"
                required
              />
              <input
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                type="text"
                placeholder="Address line 2"
                required
              />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="mt-4">
          <p className="mb-2">About Doctor</p>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full px-4 pt-2 border rounded"
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 px-10 py-3 mt-6 text-white rounded-full"
        >
          Add Doctor
        </button>
      </div>
    </form>
  )
}

export default AddDoctor
