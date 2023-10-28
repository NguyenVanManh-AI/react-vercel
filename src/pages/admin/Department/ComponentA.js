//file này để test useContext
import React from 'react'
import { useAppContext } from '../../../contexts/AppContext'

function ComponentA() {
   const { inputValue, handleInputChange, handleButtonClick } = useAppContext()

   return (
      <div>
         <h2>Component A</h2>
         <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
         />
         <button onClick={handleButtonClick}>Click me</button>
      </div>
   )
}

export default ComponentA
