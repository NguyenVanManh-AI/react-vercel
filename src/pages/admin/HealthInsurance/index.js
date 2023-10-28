import { useLocation } from 'react-router-dom'
import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

import styles from './HealthInsurance.module.scss'
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

// rick text 
import Editor from "~/components/EditorWithUseQuill";

const cx = classNames.bind(styles)
const AdminHealthInsurance = () => {
	const location = useLocation()
	const [loadingTable, setLoadingTable] = useState(false)
	const [healthInsuraces, setHealthInsuraces] = useState([])
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

	const [healthInsuraceDetail, setHealthInsuraceDetail] = useState({
		id: null,
		name: null,
		description: null,
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
				const response = await http.get('health-insurace' + queryParams)
				setHealthInsuraces(response.data.data.data)
				setPerPage(response.data.data.per_page)
				setTotal(response.data.data.total)
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

	// add healthInsurace 
	const [formData, setFormData] = useState({
		name: '',
		description: '',
	});
	const modalRef = useRef(null);
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
		formDataToSubmit.append('name', formData['name']);
		formDataToSubmit.append('description', content);
		try {
			setLoadingDot(true);
			const response = await http.post('health-insurace/add', formDataToSubmit);
			toast.success('Thêm bảo hiểm thành công !', toastOptions);
			// clear input 
			setFormData({
				name: '',
				description: '',
			});
			$(modalRef.current).modal('hide'); // close modal 
			setClearContent(clearContent+1);
			setShouldReloadData(!shouldReloadData);
		} catch (error) {
			if (error.response.data.data) toast.error(error.response.data.data[0], toastOptions);
			else toast.error(error.response.data.message, toastOptions);
		} finally {
			setLoadingDot(false);
		}
	};
	// submit form 
	// add healthInsurace 

	// delete healthInsurace 
	const handleDeleteSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoadingDot(true);
			const response = await http.delete('health-insurace/' + healthInsuraceDetail.id);
			toast.success('Xóa Bảo hiểm thành công !', toastOptions);
			$(modalDeleteRef.current).modal('hide');
			setShouldReloadData(!shouldReloadData);
		} catch (error) {
			toast.error('Lỗi khi xóa Bảo hiểm !', toastOptions);
		} finally {
			setLoadingDot(false);
		}
	}
	// delete healthInsurace 

	const handleGetHealthInsurace = (index) => {
		setHealthInsuraceDetail({
			...healthInsuraces[index],
			index: index,
		});
	};

	// edit healthInsurace 
	const modalEditRef = useRef(null);
	const handleInputEditChange = (e) => {
		const { name, value } = e.target;
		setHealthInsuraceDetail({
			...healthInsuraceDetail,
			[name]: value,
		});
	};
	const handleEditSubmit = async (e) => {
		e.preventDefault();
		const formDataToSubmit = new FormData();
		formDataToSubmit.append('name', healthInsuraceDetail['name']);
		formDataToSubmit.append('description', contentEdit);
		try {
			setLoadingDot(true);
			const response = await http.post('health-insurace/update/' + healthInsuraceDetail.id, formDataToSubmit);
			// healthInsuraces[healthInsuraceDetail.index] = response.data.data;  // không nên 
			const updatedHealthInsuraces = [...healthInsuraces];
			updatedHealthInsuraces[healthInsuraceDetail.index] = response.data.data; 
			setHealthInsuraces(updatedHealthInsuraces);

			toast.success('Chỉnh sửa Bảo hiểm thành công !', toastOptions);
			$(modalEditRef.current).modal('hide');
		} catch (error) {
			if (error.response.data.data) toast.error(error.response.data.data[0], toastOptions);
			else toast.error(error.response.data.message, toastOptions);
		} finally {
			setLoadingDot(false);
		}
	}

	// richtext editor add
	const [content, setContent] = useState('');
	const handleContentChange = (newContent) => {
		setContent(newContent);
	};
	const [clearContent, setClearContent] = useState(true);

	// richtext editor edit 
	const [contentEdit, setContentEdit] = useState(0);
	const handleContentChangeEdit = (newContentEdit) => {
		setContentEdit(newContentEdit);
	};

	return (
		<>
			<ToastContainer />
			<TitleAdmin>Bảo hiểm </TitleAdmin>
			<div className={cx('card', 'shadow')}>
				{loadingDot && <LoadingDot />}
				<div className={cx('card_header')}>
					<div className={cx('add_box')}>
						<button data-toggle="modal" data-target="#modalCreateHealthInsurace" type="button" className="btn btn-success ml-2"><i className="fa-solid fa-square-plus"></i></button>
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
										<th>Tên bảo hiểm</th>
										<th>Mô tả</th>
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
									<th>Tên bảo hiểm</th>
									<th>Mô tả</th>
									<th>Ngày tạo</th>
									<th>Ngày cập nhật</th>
									<th>Thao tác</th>
								</tr>
							</thead>

							<tbody>
								{healthInsuraces.map((healthInsurace, index) => (
									<tr key={index}>
										<td>{healthInsurace.id}</td>
										<td>{healthInsurace.name}</td>
										<td className={`${cx('content_html')}`}>
											<div dangerouslySetInnerHTML={{ __html: healthInsurace.description }} />
										</td>
										<td className='p-4'>
											{healthInsurace.created_at
												? formatDateTime(healthInsurace.created_at)
												: 'N/A'}
										</td>
										<td>
											{healthInsurace.updated_at
												? formatDateTime(healthInsurace.updated_at)
												: 'N/A'}
										</td>
										<td>
											<Tippy content="Chỉnh sửa">
												<button
													onClick={() => handleGetHealthInsurace(index)}
													className="btn btn-info btn-sm sua"
													data-toggle="modal"
													data-target="#modalEdit"
												>
													<i className="ti-pencil-alt" />
												</button>
											</Tippy>
											<br />
											<Tippy content="Xóa">
												<button
													onClick={() => handleGetHealthInsurace(index)}
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
					{/* Modal add HealthInsurance */}
					<div ref={modalRef} className={`modal fade ${cx('modal-color-healthinsurance')}`} id="modalCreateHealthInsurace" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
						<div className={`modal-dialog ${cx('modal-dialog-create')}`} role="document">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title" id="exampleModalLabel">Thêm mới Bảo hiểm</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<form onSubmit={handleSubmit}>
									<div className="modal-body">
										<div className="form-group row mb-0">
											<div className='col-12'>
												<label htmlFor="inputPassword" className="col-sm-12 col-form-label">Tên Bảo hiểm</label>
												<div className="col-sm-12">
													<input value={formData.name} onChange={handleInputChange} name='name' type="text" required className="form-control" id="inputPassword" placeholder="Tên Bảo hiểm" />
												</div>
											</div>
										</div>
										<div className="form-group row mt-0">
											<div className='col-12'>
												<label htmlFor="inputPassword" className="col-sm-12 col-form-label">Mô tả Bảo hiểm</label>
												<div className='col-sm-12'>
													<Editor onContentChange={handleContentChange} clearContent={clearContent} />
												</div>
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
					<div ref={modalDeleteRef} className={`modal fade ${cx('modal-color-healthinsurance')}`} id="modalDelete" tabIndex="-1" role="dialog" aria-labelledby="modalDelete" aria-hidden="true">
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
										Cảnh báo ! Bạn sẽ có chắc chắn là xóa Bảo hiểm <strong>{healthInsuraceDetail.name}</strong> khỏi hệ thống !
									</div>
									<div className="modal-footer">
										<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
										<button type="submit" className="btn btn-danger"><i className="fa-solid fa-trash"></i> Delete</button>
									</div>
								</form>
							</div>
						</div>
					</div>

					{/* Modal edit HealthInsurance */}
					<div ref={modalEditRef} className={`modal fade ${cx('modal-color-healthinsurance')}`} id="modalEdit" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
						<div className={`modal-dialog ${cx('modal-dialog-create')}`} role="document">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title" id="exampleModalLabel">Thêm Bảo hiểm</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<form onSubmit={handleEditSubmit}>
									<div className="modal-body">
										<div className="form-group row mb-0">
											<div className='col-12'>
												<label htmlFor="inputPassword" className="col-sm-12 col-form-label">Tên Bảo hiểm</label>
												<div className="col-sm-12">
													<input value={healthInsuraceDetail.name} onChange={handleInputEditChange} name='name' type="text" required className="form-control" id="inputPassword" placeholder="Tên Bảo hiểm" />
												</div>
											</div>
										</div>
										<div className="form-group row mt-0">
											<div className='col-12'>
												<label htmlFor="inputPassword" className="col-sm-12 col-form-label">Mô tả Bảo hiểm</label>
												<div className='col-sm-12'>
													<Editor onContentChangeEdit={handleContentChangeEdit} description={healthInsuraceDetail.description} />
													{/* <textarea value={healthInsuraceDetail.description} onChange={handleInputEditChange} name='description' required placeholder="Mô tả Bảo hiểm" className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea> */}
												</div>
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

export default AdminHealthInsurance
