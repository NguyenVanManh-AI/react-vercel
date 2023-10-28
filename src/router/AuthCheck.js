// AuthCheck.js
import React from 'react'
import { Navigate } from 'react-router-dom'

const UserAuthCheck = ({ component: Component }) => {
   const user = JSON.parse(localStorage.getItem('HealthCareUser'))
   if (!user) {
      return <Navigate to="/user-login" />
   } else {
      if (user.role === 'hospital' || user.role === 'doctor') {
         return <Navigate to="/page-not-found" />
      } else {
         return <Component />
      }
   }
}

const AdminAuthCheck = ({ component: Component }) => {
   const admin = JSON.parse(localStorage.getItem('admin'))
   if (!admin) {
      return <Navigate to="/admin-login" />
   }
   return <Component />
}
const HospitalAuthCheck = ({ component: Component }) => {
   const hospital = JSON.parse(localStorage.getItem('HealthCareUser'))
   if (hospital) {
      if (hospital.role === 'user') {
         return <Navigate to="/page-not-found" />
      } else {
         return <Component />
      }
   } else {
      return <Navigate to="/user-login" />
   }
}

const DoctorAuthCheck = ({ component: Component }) => {
   const doctor = JSON.parse(localStorage.getItem('HealthCareUser'))
   if (doctor.role !== 'hospital') {
      return <Navigate to="/hospital/doctor-dashboard" />
   }
   return <Component />
}
export { UserAuthCheck, AdminAuthCheck, HospitalAuthCheck, DoctorAuthCheck }
