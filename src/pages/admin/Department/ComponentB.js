//file này để test useContext
import React, { useEffect } from 'react'
import { useAppContext } from '../../../contexts/AppContext'
// notify
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function ComponentB() {
   const { inputValue, otherValue } = useAppContext()

   useEffect(() => {
      toast.success('Change value from A', {
         position: 'top-right',
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: 'colored',
      })
   }, [inputValue])

   return (
      <div>
         <h2>Component B</h2>
         <p>Giá trị từ Component A: {inputValue}</p>
         <p>Giá trị khác từ Component A: {otherValue}</p>{' '}
         {/* Hiển thị giá trị khác */}
      </div>
   )
}

export default ComponentB
