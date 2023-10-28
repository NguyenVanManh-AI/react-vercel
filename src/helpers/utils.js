export function formatDateTime(inputString) {
   if (inputString) {
      const indexOfT = inputString.indexOf('T')
      if (indexOfT !== -1) {
         return inputString.substring(0, indexOfT)
      }
      //hàm này đơn gản là cắt chuỗi ngày tháng
      return inputString
   }
   return 'N/A'
}

export function pushSearchKeyToUrl(search, location) {
   const searchParams = new URLSearchParams(location.search)

   // Duyệt qua danh sách tham số mới và cập nhật hoặc thêm chúng vào URL
   for (const param in search) {
      if (search.hasOwnProperty(param)) {
         if (search[param] !== null) {
            searchParams.set(param, search[param])
         } else {
            searchParams.delete(param)
         }
      }
   }

   // Lấy pathname từ location và tạo URL mới với searchParams
   const newUrl = `${location.pathname}?${searchParams.toString()}`

   // Sử dụng window.history.replaceState để thay đổi URL mà không làm tải lại trang
   window.history.replaceState(null, '', newUrl)
}

export function formatGender(gender) {
   if (gender === 0) return 'Nam'
   else if (gender === 1) return 'Nữ'
   else return 'Khác'
}
