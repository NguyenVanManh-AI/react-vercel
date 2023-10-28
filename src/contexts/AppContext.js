import React, { createContext, useContext, useState } from 'react'
const AppContext = createContext()

export function AppProvider({ children }) {
   const [inputValue, setInputValue] = useState('')
   const [otherValue, setOtherValue] = useState(0)
   const [toastRegisterSuccess, setToastRegisterSuccess] = useState(false)
   const handleInputChange = (newValue) => {
      setInputValue(newValue)
   }

   const handleButtonClick = () => {
      setOtherValue((prevValue) => prevValue + 1)
   }

   const handleToastRegisterSuccessTrue = () => {
      setToastRegisterSuccess(true)
   }
   const handleToastRegisterSuccessFalse = () => {
      setToastRegisterSuccess(false)
   }

   return (
      <AppContext.Provider
         value={{
            inputValue,
            handleInputChange,
            otherValue,
            handleButtonClick,
            toastRegisterSuccess,
            handleToastRegisterSuccessTrue,
            handleToastRegisterSuccessFalse,
         }}
      >
         {children}
      </AppContext.Provider>
   )
}

export function useAppContext() {
   return useContext(AppContext)
}
