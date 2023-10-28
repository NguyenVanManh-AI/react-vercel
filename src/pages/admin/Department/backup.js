import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './AdminDepartment.css'

import ReactPaginate from 'react-paginate'
import config from '~/router/config'

const AdminDepartment = () => {
   const [departments, setDepartments] = useState([])
   const [searchParams, setSearchParams] = useState({
      search: '',
      page: 1,
      paginate: true,
   })
   const [perPage, setPerPage] = useState(6)
   const [total, setTotal] = useState(0)

   const updateSearchParams = (newSearchParams) => {
      setSearchParams({
         ...searchParams,
         ...newSearchParams,
      })
   }

   // Paginate

   const itemsPerPage = perPage

   const pageCount = Math.ceil(total / itemsPerPage)

   useEffect(() => {
      const queryParams = `?search=${searchParams.search}&page=${searchParams.page}&paginate=${searchParams.paginate}`
      axios
         .get(config.URL + 'api/department' + queryParams)
         .then((response) => {
            setDepartments(response.data.department.data)
            setPerPage(response.data.department.per_page)
            setTotal(response.data.department.total)
            console.log(response.data.department.data)
         })
         .catch((error) => {
            console.error('Lỗi khi gọi API:', error)
         })
   }, [searchParams])

   // Sửa hàm handlePageClick để tính toán newOffset
   const handlePageClick = (event) => {
      const selectedPage = event.selected + 1
      updateSearchParams({ page: selectedPage })
   }

   const handleChangeInput = (e) => {
      const newSearchValue = e.target.value
      updateSearchParams({ search: newSearchValue })
   }

   return (
      <div className="col-12" id="content-department">
         <div className="row">
            <p className="col-12 text-center" id="title_department">
               Department Management
            </p>
         </div>
         <div className="row d-flex align-items-center justify-content-center ml-2">
            <span className="mr-2">Search </span>
            <input
               type="text"
               value={searchParams.search}
               onChange={handleChangeInput}
               className="form-control col-9"
               id="exampleInputPassword1"
               placeholder="Password"
            ></input>
            <button type="button" className="ml-2 btn btn-primary">
               <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <button
               data-toggle="modal"
               data-target="#addDepartmentModal"
               type="button"
               className="ml-2 btn btn-outline-primary"
            >
               <i className="fa-solid fa-plus"></i> Add
            </button>
         </div>

         <div
            className="modal fade"
            id="addDepartmentModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="addDepartmentModal"
            aria-hidden="true"
         >
            <div className="modal-dialog" role="document">
               <div className="modal-content">
                  <div className="modal-header">
                     <h5 className="modal-title" id="addDepartmentModalLabel">
                        Modal title
                     </h5>
                     <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                     >
                        <span aria-hidden="true">&times;</span>
                     </button>
                  </div>
                  <div className="modal-body">...</div>
                  <div className="modal-footer">
                     <button
                        type="button"
                        className="btn btn-secondary"
                        data-dismiss="modal"
                     >
                        Close
                     </button>
                     <button type="button" className="btn btn-primary">
                        Save changes
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Hiển thị danh sách phòng ban trong bảng */}
         <div className="mt-4 pl-4 pr-4">
            <table className="table">
               <thead>
                  <tr>
                     <th>#</th>
                     <th>Name</th>
                     <th>Description</th>
                     <th>Thumbnail</th>
                     <th colSpan="2">Features</th>
                  </tr>
               </thead>
               <tbody>
                  {departments.map((department, index) => (
                     <tr key={index}>
                        <td>{(searchParams.page - 1) * perPage + index + 1}</td>
                        <td>{department.name}</td>
                        <td>{department.description}</td>
                        <td className="img_department">
                           <div>
                              <img
                                 src={config.URL + department.thumbnail}
                                 alt={department.name}
                              />
                           </div>
                        </td>
                        <td>
                           <button type="button" className="btn btn-primary">
                              <i className="fa-solid fa-pen-to-square"></i>
                           </button>
                        </td>
                        <td>
                           <button type="button" className="btn btn-danger">
                              <i className="fa-solid fa-trash"></i>
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="paginate_department ml-4">
            <ReactPaginate
               breakLabel="..."
               nextLabel="Next >"
               onPageChange={handlePageClick}
               pageRangeDisplayed={4}
               pageCount={pageCount}
               previousLabel="< Previous"
               renderOnZeroPageCount={null}
            />
         </div>
      </div>
   )
}

export default AdminDepartment
