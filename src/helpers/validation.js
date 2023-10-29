function validateForm(formData, rules) {
   const errors = {}

   for (const fieldName in rules) {
      const fieldRules = rules[fieldName]

      for (const ruleName in fieldRules) {
         if (ruleName === 'required' && !formData[fieldName]) {
            errors[fieldName] = 'Không được để trống'
         }

         if (ruleName === 'email' && formData[fieldName]) {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
            if (!emailRegex.test(formData[fieldName])) {
               errors[fieldName] = 'Email không hợp lệ.'
            }
         }

         if (ruleName === 'password' && formData[fieldName].length < 6) {
            errors[fieldName] = 'Mật khẩu phải ít nhất 6 ký tự'
         }

         if (ruleName === 'password_confirmation' && formData[fieldName]) {
            if (formData['password'] !== formData[fieldName])
               errors[fieldName] = 'Mật khẩu phải giống nhau'
         }

         if (ruleName === 'phone' && formData[fieldName]) {
            const phoneNumberPattern = /^[0-9]{10,11}$/
            if (!phoneNumberPattern.test(formData[fieldName]))
               errors[fieldName] = 'Số điện thoại không hợp lệ'
         }

         if (ruleName === 'location') {
            if (!formData[fieldName].length) {
               errors[fieldName] = 'Vui lòng chọn vị trí'
            }
         }
         // Thêm các quy tắc kiểm tra khác tại đây
         if (ruleName === 'date_of_birth' && formData[fieldName]) {
            const birthDate = new Date(formData[fieldName])
            const eighteenYearsAgo = new Date()
            eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)

            if (birthDate > eighteenYearsAgo) {
               errors[fieldName] = 'Không hợp lệ,Chưa đủ 18 tuổi'
            }
         }

         if (ruleName === 'name') {
            if (formData[fieldName].length < 6) {
               errors[fieldName] = 'Trường tên tối thiểu 6 ký tự'
            }
         }
         if (ruleName === 'new_password_confirmation' && formData[fieldName]) {
            if (formData['new_password'] !== formData[fieldName])
               errors[fieldName] = 'Mật khẩu phải giống nhau'
         }
         if (ruleName === 'new_password' && formData[fieldName]) {
            if (formData['current_password'] === formData[fieldName])
               errors[fieldName] = 'Mật khẩu mới phải khác mật khẩu cũ'
         }
      }
   }

   return errors
}

export default validateForm
