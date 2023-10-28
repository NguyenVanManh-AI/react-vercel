import { useLocation } from 'react-router-dom'
import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

import styles from './Category.module.scss'
import $ from 'jquery'
import { useEffect, useState, useRef } from 'react'
import http from '~/utils/http'
import config from '~/router/config'
import ReactPaginate from 'react-paginate'
import LoadingTable from '~/components/Loading/LoadingTable'
import { formatDateTime, pushSearchKeyToUrl } from '~/helpers/utils'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingDot from '~/components/Loading/LoadingDot'

const cx = classNames.bind(styles)
const AdminCategory = () => {
	const location = useLocation()
	const [loadingTable, setLoadingTable] = useState(false)
	const [categories, setCategories] = useState([])
	const [shouldReloadData, setShouldReloadData] = useState(false);
   const [loadingDot, setLoadingDot] = useState(false);

    const defaultSearchParams = {
        search: '',
        paginate: 5,
        page: 1,
        sortlatest: true,
        sortname: false,
     }

	const [perPage, setPerPage] = useState(6)
	const [total, setTotal] = useState(0)

	const itemsPerPage = perPage
	const pageCount = Math.ceil(total / itemsPerPage)

	const toastOptions = {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	};

	const modalDeleteRef = useRef(null);

	const [categoryDetail, setCategoryDetail] = useState({
		id: null,
		name: null,
		thumbnail: null,
		search_number: null,
		created_at: null,
		updated_at: null,
		index: null,
	});

    // paramURL to DOM 
    const parseSearchParams = () => {
        const searchParams = new URLSearchParams(location.search)

        if (searchParams.get('paginate') === null) {
            return defaultSearchParams
        }
        return {
            search: searchParams.get('search') || defaultSearchParams.search,
            paginate:
                parseInt(searchParams.get('paginate')) ||
                defaultSearchParams.paginate,
            page: parseInt(searchParams.get('page')) || defaultSearchParams.page,
            sortlatest: searchParams.get('sortlatest') === 'true',
            sortname: searchParams.get('sortname') === 'true',
        }
    }
    const [search, setSearch] = useState(parseSearchParams());
    useEffect(() => {
        setSearch(parseSearchParams())
    }, [location.search]);

	useEffect(() => {
		pushSearchKeyToUrl(search, location)
	}, [search, location]);

	const updateSearchParams = (newSearchParams) => {
		setSearch((prevSearch) => ({
			...prevSearch,
			...newSearchParams,
		}))
	};

	useEffect(() => {
		const getUser = async () => {
			try {
				setLoadingTable(true)
				const queryParams = `?search=${search.search}&page=${search.page}&paginate=${search.paginate}&sortname=${search.sortname}&sortlatest=${search.sortlatest}`
				const response = await http.get('category' + queryParams)
            setCategories(response.data.data.data)
            setPerPage(response.data.data.per_page)
            setTotal(response.data.data.total)
            console.log('Gọi API lấy users thành công')
			} catch (error) {
				toast.error('Lỗi kết nối đến API !', toastOptions);
			} finally {
				setLoadingTable(false)
			}
		}
		getUser()
	}, [search, shouldReloadData]);

	const handlePageClick = (event) => {
		const selectedPage = event.selected + 1
		updateSearchParams({ page: selectedPage })
	};

   const handleChangeSelectedPaginate = (e) => {
      updateSearchParams({ page: 1, paginate: e.target.value })
   };

	const handleChangeInput = (e) => {
		const newSearchValue = e.target.value
		updateSearchParams({ search: newSearchValue, page: 1 })
	};

	const handleChangeSelectedName = (e) => {
		if (e.target.value === 'sortlatest') {
			updateSearchParams({ sortlatest: true, sortname: false })
		} else if (e.target.value === 'un_sortlatest') {
			updateSearchParams({ sortlatest: false })
		} else {
			updateSearchParams({ sortname: true })
		}
	};

	// add category 
	const [formData, setFormData] = useState({
		name: '',
		thumbnail: null,
	});
	const [selectedImage, setSelectedImage] = useState(null);
	const modalRef = useRef(null);
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => setSelectedImage(e.target.result);
			reader.readAsDataURL(file);

			setFormData({
				...formData,
				thumbnail: file,
			});

		}
	};
	const handleCancelClick = () => {
		setSelectedImage(null);
	};
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	// submit form 
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formDataToSubmit = new FormData();
		for (const key in formData) {
			formDataToSubmit.append(key, formData[key]);
		}
		try {
         setLoadingDot(true);
			const response = await http.post('category/add', formDataToSubmit);
			toast.success('Thêm danh mục thành công !', toastOptions);
			// clear input 
			setFormData({
				name: '',
				thumbnail: null,
			});
			// clear image  
			setSelectedImage(null);
			$(modalRef.current).modal('hide'); // close modal 
			// const newData = response.data.data;
			setShouldReloadData(!shouldReloadData);
			// setCategories((prevCategories) => [newData, ...prevCategories]); // thêm vào đầu mảng 
		} catch (error) {
			if (error.response.data.data) toast.error(error.response.data.data[0], toastOptions);
			else toast.error(error.response.data.message, toastOptions);
		} finally {
         setLoadingDot(false);
      }
	};
	// submit form 
	// add category 

	// delete category 
	const handleDeleteSubmit = async (e) => {
		e.preventDefault();
		try {
         setLoadingDot(true);
			const response = await http.delete('category/delete/' + categoryDetail.id);
			toast.success('Xóa danh mục thành công !', toastOptions);
			$(modalDeleteRef.current).modal('hide');
			setShouldReloadData(!shouldReloadData);
		} catch (error) {
			toast.error('Lỗi khi xóa danh mục !', toastOptions);
		} finally {
         setLoadingDot(false);
      }
	}
	// delete category 

	const handleGetCategory = (index) => {
		setSelectedEditImage(config.URL + categories[index].thumbnail);
		setCategoryDetail({
		  ...categories[index],
		  index: index,
		});
	  };

	// edit category 
	const [selectedEditImage, setSelectedEditImage] = useState(null);
	const modalEditRef = useRef(null);
	const handleCancelEditClick = () => {
		setSelectedEditImage(null);
	};
	const handleImageEidtChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => setSelectedEditImage(e.target.result);
			reader.readAsDataURL(file);
			setCategoryDetail({
				...categoryDetail,
				thumbnail: file,
			});

		}
	};
	const handleInputEditChange = (e) => {
		const { name, value } = e.target;
		setCategoryDetail({
			...categoryDetail,
			[name]: value,
		});
	};
	const handleEditSubmit = async (e) => {
		e.preventDefault();
		const formDataToSubmit = new FormData();
		formDataToSubmit.append('name', categoryDetail['name']);
		if (categoryDetail.thumbnail instanceof Object) formDataToSubmit.append('thumbnail', categoryDetail['thumbnail']);
		try {
         setLoadingDot(true)
			const response = await http.post('category/update/' + categoryDetail.id, formDataToSubmit);
			toast.success('Chỉnh sửa danh mục thành công !', toastOptions);
			setSelectedEditImage(null);
			categories[categoryDetail.index] = response.data.data;
			$(modalEditRef.current).modal('hide');
		} catch (error) {
			if (error.response.data.data) toast.error(error.response.data.data[0], toastOptions);
			else toast.error(error.response.data.message, toastOptions);
		} finally {
         setLoadingDot(false)
      }
	}

   return (
      <>
         <ToastContainer />
         <TitleAdmin>Danh mục </TitleAdmin>
         <div className={cx('card', 'shadow')}>
            {loadingDot && <LoadingDot />}
            <div className={cx('card_header')}>
               <div className={cx('add_box')}>
                  <button data-toggle="modal" data-target="#modalCreateCategory" type="button" className="btn btn-success ml-2"><i className="fa-solid fa-square-plus"></i></button>
               </div>
               <div className={cx('search_box')}>
                  <div className={cx('input-group', 'fontz_14')}>
                     <span className="input-group-prepend">
                        <button type="button" className="btn btn-primary">
                           <i className="fa fa-search"></i>
                        </button>
                     </span>
                     <input
                        defaultValue={search.search}
                        onChange={handleChangeInput}
                        type="text"
                        id="example-input1-group2"
                        className="form-control"
                        placeholder="Search"
                     />
                  </div>
               </div>
               <div className={cx('filter_box')}>
                    <select
                        defaultValue={
                            search.sortlatest === false
                            ? 'un_sortlatest'
                            : search.sortname === true
                            ? 'sortname'
                            : 'sortlatest'
                        }
                        onChange={handleChangeSelectedName}
                        className={cx('custom-select', 'fontz_14')}
                    >
                        <option value="sortlatest">Mới nhất</option>
                        <option value="un_sortlatest">Cũ nhất</option>
                        <option value="sortname">Theo tên</option>
                    </select>
               </div>
               <div className={cx('box_left')}>
                  <select
                        defaultValue={search.paginate}
                     onChange={handleChangeSelectedPaginate}
                     className={cx('custom-select', 'fontz_14')}
                  >
                     <option value="5">5</option>
                     <option value="10">10</option>
                     <option value="15">15</option>
                     <option value="20">20</option>
                  </select>
               </div>
            </div>
            <div className={cx('card_body')}>
               {loadingTable ? (
                  <>
                     <table className={cx('table', 'table_bordered')}>
                        <thead>
                           <tr>
                              <th>ID</th>
                              <th>Tên danh mục</th>
                              <th>Thumbnail</th>
                              <th>Lượt tìm kiếm</th>
                              <th>Ngày tạo</th>
                              <th>Ngày cập nhật</th>
                              <th>Thao tác</th>
                           </tr>
                        </thead>
                     </table>
                     <LoadingTable row={search.paginate} />
                  </>
               ) : (
                  <table className={cx('table', 'table_bordered')}>
                     <thead>
                        <tr>
                           <th>ID</th>
                           <th>Tên danh mục</th>
                           <th>Thumbnail</th>
                           <th colSpan={1}>Lượt tìm kiếm</th>
                           <th>Ngày tạo</th>
                           <th>Ngày cập nhật</th>
                           <th>Thao tác</th>
                        </tr>
                     </thead>

                     <tbody>
                        {categories.map((category, index) => (
                           <tr key={index}>
                              <td>{category.id}</td>
                              <td>{category.name}</td>
                              <td>
                                 <div className={cx('thumbnail-th')}>
                                    <img
                                       className={cx('thumbnail')}
                                       alt=""
                                       src={
                                          category.thumbnail && config.URL + category.thumbnail
                                       }
                                    />
                                 </div>
                              </td>
                              <td colSpan={1}>{category.search_number}</td>
                              <td>
                                 {category.created_at
                                    ? formatDateTime(category.created_at)
                                    : 'N/A'}
                              </td>
                              <td>
                                 {category.updated_at
                                    ? formatDateTime(category.updated_at)
                                    : 'N/A'}
                              </td>
                              <td>
                                 <Tippy content="Chỉnh sửa">
                                    <button
                                       onClick={() => handleGetCategory(index)}
                                       className="btn btn-info btn-sm sua"
                                       data-toggle="modal"
                                       data-target="#modalEdit"
                                    >
                                       <i className="ti-pencil-alt" />
                                    </button>
                                 </Tippy>
                                 <br/>
                                 <Tippy content="Xóa">
                                    <button 
                                    onClick={() => handleGetCategory(index)}
                                    data-toggle="modal" data-target="#modalDelete" className="btn btn-danger btn-sm mt-1">
                                       <i className="ti-trash" />
                                    </button>
                                 </Tippy>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               )}
               <div className={cx('paginate_department')}>
                  <ReactPaginate
                     breakLabel="..."
                     nextLabel="Next >"
                     onPageChange={handlePageClick}
                     pageRangeDisplayed={4}
                     pageCount={pageCount}
                     previousLabel="< Previous"
                     renderOnZeroPageCount={null}
                     forcePage={search.page - 1}
                  />
               </div>
               {/* Modal add Category */}
               <div ref={modalRef} className={`modal fade ${cx('modal-color-category')}`} id="modalCreateCategory" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className={`modal-dialog ${cx('modal-dialog-create')}`} role="document">
                     <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Thêm mới Danh mục</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                           <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                           <div className="modal-body">
                              <div className="form-group row">
                                 <div className='col-8'>
                                    <label htmlFor="inputPassword" className="col-sm-12 col-form-label">Tên Danh mục</label>
                                    <div className="col-sm-12">
                                       <input value={formData.name} onChange={handleInputChange} name='name' type="text" required className="form-control" id="inputPassword" placeholder="Tên Danh mục"/>
                                    </div>
                                 </div>
                                 <div className='col-4'>
                                    {/* preview file */}
                                    <div className="col-12 pb-2 ">
                                       <label htmlFor="inputPassword" className="col-sm-12 p-0 pb-2 col-form-label">Thumbnail</label>
                                       <div className={`${cx('dropbox')}`}>
                                       {selectedImage ? (
                                          <div>
                                             <img className={`${cx('cancel-btn')}`} src="/user/image/icon/error.png" alt="Cancel" onClick={handleCancelClick} />
                                             <img className={`${cx('image-preview')}`} src={selectedImage} alt="Preview" />
                                          </div>
                                       ) : (
                                          <>
                                             <input value={selectedImage} type="file" name="thumbnail" className={`${cx('image')}`} accept="image/*" onChange={handleImageChange} required />
                                             <p><img className={`${cx('upload_img')}`} src="/user/image/icon/upload-file.png" alt="Upload" /></p>
                                          </>
                                       )}
                                       </div>
                                    </div>
                                    {/* preview file */}
                                 </div>
                              </div>
                           </div>
                           <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                              <button type="submit" className="btn btn-primary"><i className="fa-solid fa-plus"></i> Add</button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>

               {/* Modal Delete  */}
               <div ref={modalDeleteRef} className={`modal fade ${cx('modal-color-category')}`} id="modalDelete" tabIndex="-1" role="dialog" aria-labelledby="modalDelete" aria-hidden="true">
                  <div className="modal-dialog" role="document">
                     <div className="modal-content">
                        <div className="modal-header alert-warning modal-title m-0">
                           <h5 id="exampleModalLabel"><i className="fa-solid fa-triangle-exclamation"></i> Warning !</h5>
                           <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                           </button>
                        </div>
                        <form onSubmit={handleDeleteSubmit}>
                           <div className="modal-body">
                              Cảnh báo ! Bạn sẽ có chắc chắn là xóa danh mục <strong>{categoryDetail.name}</strong> khỏi hệ thống !
                           </div>
                           <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                              <button type="submit" className="btn btn-danger"><i className="fa-solid fa-trash"></i> Delete</button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>

               {/* Modal edit Category */}
               <div ref={modalEditRef} className={`modal fade ${cx('modal-color-category')}`} id="modalEdit" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className={`modal-dialog ${cx('modal-dialog-create')}`} role="document">
                     <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Chỉnh sửa Danh mục</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                           <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                           <div className="modal-body">
                              <div className="form-group row">
                                 <div className='col-8'>
                                    <label htmlFor="inputPassword" className="col-sm-12 col-form-label">Tên Danh mục</label>
                                    <div className="col-sm-12">
                                       <input value={categoryDetail.name} onChange={handleInputEditChange} name='name' type="text" required className="form-control" id="inputPassword" placeholder="Tên Danh mục"/>
                                    </div>
                                 </div>
                                 <div className='col-4'>
                                    {/* preview file */}
                                    <div className="col-12 pb-2 ">
                                       <label htmlFor="inputPassword" className="col-sm-12 p-0 pb-2 col-form-label">Thumbnail</label>
                                       <div className={`${cx('dropbox')}`}>
                                       {selectedEditImage ? (
                                          <div>
                                             <img className={`${cx('cancel-btn')}`} src="/user/image/icon/error.png" alt="Cancel" onClick={handleCancelEditClick} />
                                             <img className={`${cx('image-preview')}`} src={selectedEditImage} alt="Preview" />
                                          </div>
                                       ) : (
                                          <>
                                             <input value={selectedEditImage} type="file" name="thumbnail" className={`${cx('image')}`} accept="image/*" onChange={handleImageEidtChange} required />
                                             <p><img className={`${cx('upload_img')}`} src="/user/image/icon/upload-file.png" alt="Upload" /></p>
                                          </>
                                       )}
                                       </div>
                                    </div>
                                    {/* preview file */}
                                 </div>
                              </div>
                           </div>
                           <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                              <button type="submit" className="btn btn-success"><i className="fa-solid fa-floppy-disk"></i> Save</button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default AdminCategory
