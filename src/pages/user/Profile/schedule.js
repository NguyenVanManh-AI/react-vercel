import { useLocation } from 'react-router-dom'
import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

import styles from './Schedule.module.scss'
import $ from 'jquery'
import React, { useEffect, useState, useRef } from 'react'
import http from '~/utils/httpUser'
import config from '~/router/config'
import ReactPaginate from 'react-paginate'
import LoadingTable from '~/components/Loading/LoadingTable'
import { formatDateTime, pushSearchKeyToUrl } from '~/helpers/utils'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingDot from '~/components/Loading/LoadingDot'

const cx = classNames.bind(styles)
function ScheduleProfile() {

	const location = useLocation()
	const [loadingTable, setLoadingTable] = useState(false)
	const [workSchedules, setWorkSchedules] = useState([])
	const [shouldReloadData, setShouldReloadData] = useState(false);
	const [avatar, setAvatar] = useState('/image/avatar_admin_default.png')
	const [avatarDoctor, setAvatarDoctor] = useState('/image/avata-default-doctor.jpg')
	const [avatarHospital, setAvatarHospital] = useState('/image/default-hospital-search.jpg')

	const healthCareUser = JSON.parse(localStorage.getItem('HealthCareUser'));
	const [loadingDot, setLoadingDot] = useState(false);

	const defaultSearchParams = {
		search: '',
		paginate: 5,
		page: 1,
		is_service: "",
		department_name: "",
		doctors_id: "",
		sortlatest: true,
		sortname: false,
		sortprice: false,
		sorttime: false,
		start_date: "",
		end_date: ""
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
	const [workScheduleDetail, setWorkScheduleDetail] = useState({
		work_schedule_id: null,
		work_schedule_price: null,
		time: {
			date: null,
			interval: [],
		},
		content: null,
		doctor_name: null,
		user_name: null,
		hospital_name: null,
		infor_user_date_of_birth: null,
		doctor_address: null,
		user_address: null,
		experience: null,
		hospital_address: null,
		doctor_avatar: null,
		user_avatar: null,
		hospital_avatar: null,
		doctor_email: null,
		user_email: null,
		hospital_email: null,
		doctor_phone: null,
		user_phone: null,
		hospital_phone: null,
		hospital_service_name: null,
		hospital_service_time_advise: null,
		hospital_service_price: null,
		department_name: null,
		department_thumbnail: null,
		hospital_department_price: null,
		hospital_department_time_advise: null,
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
			sortprice: searchParams.get('sortprice') === 'true',
			sorttime: searchParams.get('sorttime') === 'true',
			department_name: searchParams.get('department_name') || defaultSearchParams.department_name,
			doctors_id: searchParams.get('doctors_id') || defaultSearchParams.doctors_id,
			is_service: searchParams.get('is_service') || defaultSearchParams.is_service,
			start_date: searchParams.get('start_date') || defaultSearchParams.start_date,
			end_date: searchParams.get('end_date') || defaultSearchParams.end_date,

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
				const queryParams = `?search=${search.search}&page=${search.page}&paginate=${search.paginate}
				&department_name=${search.department_name}&is_service=${search.is_service}&doctors_id=${search.doctors_id}
				&sortname=${search.sortname}&sortlatest=${search.sortlatest}&sortprice=${search.sortprice}&sorttime=${search.sorttime}
            &start_date=${search.start_date}&end_date=${search.end_date}`

				const response = await http.get('work-schedule/user' + queryParams);
				setWorkSchedules(response.data.data.data);
				setPerPage(response.data.data.per_page);
				setTotal(response.data.data.total);
				resetDeleteMany();

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

	const setFalseParam = () => {
		updateSearchParams({
			sortname: false,
			sortlatest: false,
			sortprice: false,
			sorttime: false,
		})
	}

	const handleChangeSelectedName = (e) => {
		if (e.target.value === 'sortname') {
			setFalseParam();
			updateSearchParams({
				sortname: true,
			})
		}
		else if (e.target.value === 'sortlatest') {
			setFalseParam();
			updateSearchParams({
				sortlatest: true,
			})
		}
		else if (e.target.value === 'sortprice') {
			setFalseParam();
			updateSearchParams({
				sortprice: true,
			})
		}
		else if (e.target.value === 'sorttime') {
			setFalseParam();
			updateSearchParams({
				sorttime: true,
			})
		}
		else {
			setFalseParam();
			updateSearchParams({
				sortlatest: true,
				sortname: true,
			})
		}
	};

	const handleChangeSelectedDepartment = (e) => {
		updateSearchParams({
			department_name: e.target.value,
			doctors_id: "",
			page: 1,
		});
	};
	const handleChangeSelectedDoctor = (e) => {
		updateSearchParams({ doctors_id: e.target.value, page: 1 });
	};

	const handleChangeSelectedIsService = (e) => {
		updateSearchParams({ is_service: e.target.value, page: 1 });
	};

	const changeStartDate = (e) => {
		updateSearchParams({ start_date: e.target.value, page: 1 });
	};
	const changeEndDate = (e) => {
		updateSearchParams({ end_date: e.target.value, page: 1 });
	};




	// delete healthInsurace 
	const handleDeleteSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoadingDot(true);
			const response = await http.delete('work-schedule/user-cancel/' + workScheduleDetail.work_schedule_id);
			toast.success('Hủy lịch hẹn thành công !', toastOptions);
			$(modalDeleteRef.current).modal('hide');
			setShouldReloadData(!shouldReloadData);
		} catch (error) {
			toast.error('Lỗi khi hủy lịch hẹn !', toastOptions);
		} finally {
			setLoadingDot(false);
		}
	}
	// delete healthInsurace 

	const handleGetWorkSchedule = (index) => {
		setWorkScheduleDetail({
			...workSchedules[index],
			index: index,
		});
	};

	// delete Many 
	const checkboxesRefs = useRef([]);
	checkboxesRefs.current = workSchedules.map(workSchedule => React.createRef());
	const [selectAllChecked, setSelectAllChecked] = useState(false);

	const modalDeleteManyRef = useRef(null);
	const [selectedWorkSchedules, setSelectedWorkSchedules] = useState([]);
	const handleCheckboxChange = (workScheduleId) => {
		if (selectedWorkSchedules.includes(workScheduleId)) {
			const updatedArticles = selectedWorkSchedules.filter(id => id !== workScheduleId);
			setSelectedWorkSchedules(updatedArticles);
		} else {
			setSelectedWorkSchedules([...selectedWorkSchedules, workScheduleId]);
		}
	};

	const handleDeleteManyArticles = async (e) => {
		e.preventDefault();
		try {
			setLoadingDot(true);
			const response = await http.delete('work-schedule/user-cancel-many', {
				data: { list_id: selectedWorkSchedules }
			});
			toast.success(response.data.message, toastOptions);
			$(modalDeleteManyRef.current).modal('hide');
			setShouldReloadData(!shouldReloadData);
		} catch (error) {
			if (error.response.data.data) toast.error(error.response.data.data[0], toastOptions);
			else toast.error(error.response.data.message, toastOptions);
		} finally {
			setLoadingDot(false);
		}
	};

	const selectAll = () => {
		if (checkboxesRefs.current.length === workSchedules.length) {
			if (selectAllChecked) {
				setSelectedWorkSchedules([]);
			} else {
				const selectedIds = workSchedules
					.map(workSchedule => workSchedule.work_schedule_id);
				setSelectedWorkSchedules(selectedIds);
			}

			setSelectAllChecked(!selectAllChecked);

			// Kiểm tra hoặc bỏ kiểm tra tất cả các ô input
			checkboxesRefs.current.forEach(ref => {
				if (ref.current) {
					ref.current.checked = !selectAllChecked;
				}
			});
		}
	};
	const resetDeleteMany = () => {
		setSelectAllChecked(false);
		setSelectedWorkSchedules([]);
	}

	return (
		<>
			<ToastContainer />
			<TitleAdmin>Lịch hẹn tư vấn và dịch vụ của bạn</TitleAdmin>
			<div className={cx('card', 'shadow')}>
				{loadingDot && <LoadingDot />}
				<div className={cx('card_header')}>
					{selectedWorkSchedules.length > 0 ? (
					<div className={cx('add_box')}>
						<button data-toggle="modal" data-target="#deleteMany" type="button" className={`btn btn-danger ml-2 ${cx('fontz_14')}`} ><i className="fa-regular fa-rectangle-xmark"></i></button>
					</div>
					) : null}
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
					{/* <div className={cx('filter_box_department')}>
						<select
							name='doctors_id'
							value={search.doctors_id}
							onChange={handleChangeSelectedDoctor}
							className={cx('custom-select', 'fontz_14')}
						>
							<option value="">Tất cả Bác sĩ</option>
							{doctors.map((doctor, index) => (
								<option key={doctor.id_doctor} value={doctor.id_doctor}>{doctor.name_doctor}</option>
							))}
						</select>
					</div>
					<div className={cx('filter_box_department')}>
						<select
							value={search.department_name}
							name='department_name'
							onChange={handleChangeSelectedDepartment}
							className={cx('custom-select', 'fontz_14')}
						>
							<option value="">Tất cả Chuyên khoa</option>
							{departments.map((department, index) => (
								<option key={department.id_department} value={department.name}>{department.name}</option>
							))}
						</select>
					</div> */}
					<div className={cx('filter_box', 'custom-select-sort')}>
						<select
							defaultValue={
								search.sortlatest === true
									? 'sortlatest'
									: search.sortprice === true
										? 'sortprice'
										: search.sorttime === true
											? 'sorttime'
											: search.sortname === true
												? 'sortname'
												: 'un_sortlatest'
							}
							onChange={handleChangeSelectedName}
							className={cx('custom-select', 'fontz_14')}
						>
							<option value="sortlatest">Mới nhất</option>
							<option value="un_sortlatest">Cũ nhất</option>
							<option value="sortname">Theo tên</option>
							<option value="sortprice">Theo giá</option>
							<option value="sorttime">Khung giờ</option>
						</select>
					</div>
					<div className={cx('filter_box_is_service')}>
						<select
							value={search.is_service}
							name='is_service'
							onChange={handleChangeSelectedIsService}
							className={cx('custom-select', 'fontz_14')}
						>
							<option value="">Tất cả</option>
							<option value="advise">Lịch Tư vấn</option>
							<option value="service">Lịch Dịch vụ</option>
						</select>
					</div>
					<div className={cx('start_end_date')}>
						<Tippy content="Giới hạn dưới" >
							<div className={cx('filter_box_input',)}>
								<input
									defaultValue={search.start_date}
									onChange={changeStartDate}
									name="start_date"
									type="date"
									className={cx('form-control', 'fontz_14')}
									placeholder="Date of birth"
								/>
							</div>
						</Tippy>
						<Tippy content="Giới hạn trên">
							<div className={cx('filter_box_input')}>
								<input
									defaultValue={search.end_date}
									onChange={changeEndDate}
									name="end_date"
									type="date"
									className={cx('form-control', 'fontz_14')}
									placeholder="Date of birth"
								/>
							</div>
						</Tippy>
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
										<th><span className='ml-3'><input onClick={selectAll} className="form-check-input" type="checkbox" value="" /></span></th>
										<th>ID</th>
										{/* <th>Khách hàng</th> */}
										<th>Loại lịch</th>
										<th>Tên dịch vụ</th>
										<th>Chuyên khoa</th>
										<th>Bác sĩ thực hiện</th>
										<th>Khung giờ</th>
										<th>Giá (VNĐ)</th>
										<th>Ngày tạo</th>
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
									<th><span className='ml-3'><input onClick={selectAll} className="form-check-input" type="checkbox" value="" /></span></th>
									<th>ID</th>
									{/* <th>Khách hàng</th> */}
									<th>Loại lịch</th>
									<th>Tên dịch vụ</th>
									<th>Chuyên khoa</th>
									<th>Bác sĩ thực hiện</th>
									<th>Khung giờ</th>
									<th>Giá (VNĐ)</th>
									<th>Ngày tạo</th>
									<th>Thao tác</th>
								</tr>
							</thead>

							<tbody>
								{workSchedules.map((workSchedule, index) => (
									<tr key={index}>
										<td>
											<span className='ml-3'>
												<input
													ref={checkboxesRefs.current[index]}
													value={workSchedule.work_schedule_id}
													onChange={() => handleCheckboxChange(workSchedule.work_schedule_id)}
													className="form-check-input"
													type="checkbox"
													checked={selectedWorkSchedules.includes(workSchedule.work_schedule_id)}
												/>
											</span>
										</td>
										<td>{workSchedule.work_schedule_id}</td>
										{/* <td>
											<div className={cx('thumbnail-th')}>
												<img
													className={cx('thumbnail')}
													alt=""
													src={
														workSchedule.user_avatar
															? workSchedule.user_avatar.startsWith('http')
																? workSchedule.user_avatar
																: config.URL + workSchedule.user_avatar
															: avatar
													}
												/>
												{workSchedule.user_name}
											</div>
										</td> */}
										<td>{workSchedule.id_service == null ? 'Tư vấn' : 'Dịch vụ'}</td>
										<td>{workSchedule.hospital_service_name ? workSchedule.hospital_service_name : 'N/A'}</td>
										<td>{workSchedule.department_name}</td>
										<td>
											<div className={cx('thumbnail-th')}>
												<img
													className={cx('thumbnail')}
													alt=""
													src={
														workSchedule.doctor_avatar
															? config.URL + workSchedule.doctor_avatar
															: avatarDoctor
													}
												/>
												{workSchedule.doctor_name}
											</div>
										</td>
										<td className={`col-2 ${cx('color_time')}`}>
											{workSchedule.time.interval[0]} - {workSchedule.time.interval[1]} <br />
											{workSchedule.time.date}
										</td>
										<td className={` ${cx('color_price')}`}>{workSchedule.work_schedule_price.toLocaleString('en-US')}</td>
										<td>
											{workSchedule.created_at
												? formatDateTime(workSchedule.created_at)
												: 'N/A'}
										</td>
										<td>
											<div className='row pl-3 pr-3'>
												<div className='col-6 pl-0 pr-0 mx-0'>
													<div className='pl-0 pr-0 mx-0'>
														<Tippy content="Hủy Lịch">
															<button
																onClick={() => handleGetWorkSchedule(index)}
																data-toggle="modal" data-target="#modalDelete"
																className="btn btn-danger btn-sm mt-1"
															>
																<i className="fa-regular fa-rectangle-xmark"></i>
															</button>
														</Tippy>
														<br />
														<Tippy content="Xem chi tiết">
															<button
																onClick={() => handleGetWorkSchedule(index)}
																className="btn btn-info btn-sm sua mt-1"
																data-toggle="modal"
																data-target="#modalDetail"
															>
																<i className="mdi mdi-eye" />
															</button>
														</Tippy>
													</div>
												</div>
											</div>
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

					{/* Modal Delete  */}
					<div ref={modalDeleteRef} className={`modal fade ${cx('modal-color-bg')}`} id="modalDelete" tabIndex="-1" role="dialog" aria-labelledby="modalDelete" aria-hidden="true">
						<div className={`modal-dialog ${cx('modal-dialog-create')}`} role="document">
							<div className="modal-content">
								<div className="modal-header alert-warning modal-title m-0">
									<h5 id="exampleModalLabel"><i className="fa-solid fa-triangle-exclamation"></i> Warning !</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<form onSubmit={handleDeleteSubmit}>
									<div className="modal-body">
										Cảnh báo ! Bạn sẽ có chắc chắn là muốn hủy 

										<strong>{workScheduleDetail.id_service ? ' Lịch Dịch vụ : ' + workScheduleDetail.hospital_service_name + ' ' : ' Lịch Tư vấn '}</strong>
										

										khỏi hệ thống !
									</div>
									<div className="modal-body">
										<div className='row'>
											<div className='col-3'>
												<div className={cx('detail-user')}>
													<img
														alt=""
														src={
															workScheduleDetail.user_avatar
																? workScheduleDetail.user_avatar.startsWith('http')
																	? workScheduleDetail.user_avatar
																	: config.URL + workScheduleDetail.user_avatar
																: avatar
														}
													/>
													<p>{workScheduleDetail.user_name}</p>
												</div>
											</div>
											<div className='col-9'>
												<div className='row'>
													<div className='col-6'>
														<li className={` ${cx('li-detail')}`} ><strong>Tên khách hàng : </strong> {workScheduleDetail.user_name}</li>
														<li className={` ${cx('li-detail')}`} ><strong>Ngày sinh : </strong> {workScheduleDetail.infor_user_date_of_birth}</li>
														<li className={` ${cx('li-detail')}`} ><strong>Email : </strong> {workScheduleDetail.user_email}</li>
														<li className={` ${cx('li-detail')}`} ><strong>Số điện thoại : </strong> {workScheduleDetail.user_phone}</li>
														<li className={` ${cx('li-detail')}`} ><strong>Địa chỉ : </strong> {workScheduleDetail.user_address}</li>
														<li className={` ${cx('li-detail')}`} ><strong>Khung giờ : </strong> {workScheduleDetail.time.interval[0]} - {workScheduleDetail.time.interval[1]} . {workScheduleDetail.time.date}</li>
														<li className={` ${cx('li-detail')}`}>
															<strong>Giá : </strong>
															{workScheduleDetail.work_schedule_price
																? workScheduleDetail.work_schedule_price.toLocaleString('en-US') + ' VNĐ'
																: 'Giá không có sẵn'}
														</li>
														<li className={` ${cx('li-detail-after')}`} ><strong>Ngày tạo : </strong> {formatDateTime(workScheduleDetail.created_at)}</li>
													</div>
													<div className='col-6'>
														<li className={` ${cx('li-detail')}`} ><strong>{workScheduleDetail.id_service ? 'Tên dịch vụ : ' : 'Đây là lịch tư vấn'}</strong> {workScheduleDetail.id_service ? workScheduleDetail.hospital_service_name : ''}</li>
														<li className={` ${cx('li-detail')}`} ><strong>Chuyên khoa : </strong> {workScheduleDetail.department_name}</li>
														<li className={` ${cx('li-detail')}`} >
															<strong>Bác sĩ thực hiện : </strong>
															<div className={`mt-1 ${cx('thumbnail-th')}`}>
																<img
																	className={cx('thumbnail')}
																	alt=""
																	src={
																		workScheduleDetail.doctor_avatar
																			? config.URL + workScheduleDetail.doctor_avatar
																			: avatarDoctor
																	}
																/>
																{workScheduleDetail.doctor_name}
															</div>
														</li>
														<li className={` ${cx('li-detail')}`} ><strong>Số năm kinh nghiệm : </strong> {workScheduleDetail.experience}</li>
														<li className={` ${cx('li-detail')}`} ><strong>Email bác sĩ : </strong> {workScheduleDetail.doctor_email}</li>
														<li className={` ${cx('li-detail')}`} ><strong>Số điện thoại bác sĩ : </strong> {workScheduleDetail.doctor_phone}</li>
														<li className={` ${cx('li-detail')}`} ><strong>Địa chỉ bác sĩ : </strong> {workScheduleDetail.doctor_address}</li>
                                                        <li className={` ${cx('li-detail')}`} >
															<strong>Bác sĩ thực hiện : </strong>
															<div className={`mt-1 ${cx('thumbnail-th')}`}>
																<img
																	className={cx('thumbnail')}
																	alt=""
																	src={
																		workScheduleDetail.doctor_avatar
																			? config.URL + workScheduleDetail.doctor_avatar
																			: avatarDoctor
																	}
																/>
																{workScheduleDetail.doctor_name}
															</div>
														</li>
														<li className={` ${cx('li-detail')}`} ><strong>Tên bệnh viện : </strong> {workScheduleDetail.doctor_address}</li>
														<li className={` ${cx('li-detail')}`} ><strong>Email bệnh viện : </strong> {workScheduleDetail.doctor_address}</li>
														<li className={` ${cx('li-detail')}`} ><strong>Số điện thoại bệnh viện : </strong> {workScheduleDetail.doctor_address}</li>
														<li className={` ${cx('li-detail-after')}`} ><strong>Địa chỉ bệnh viện : </strong> {workScheduleDetail.doctor_address}</li>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="modal-footer">
										<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
										<button type="submit" className="btn btn-danger"><i className="fa-solid fa-trash"></i> Delete</button>
									</div>
								</form>
							</div>
						</div>
					</div>

					{/* delete Many */}
					<div ref={modalDeleteManyRef} className={`modal fade ${cx('modal-color-bg')}`} id="deleteMany" tabIndex="-1" role="dialog" aria-labelledby="modalDelete" aria-hidden="true">
						<div className={`modal-dialog ${cx('modal-dialog-create')}`} role="document">
							<div className="modal-content">
								<div className="modal-header alert-warning modal-title m-0">
									<h5 id="exampleModalLabel"><i className="fa-solid fa-triangle-exclamation"></i> Warning !</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<form onSubmit={handleDeleteManyArticles}>
									<div className="modal-body">
										Cảnh báo ! Bạn có chắc chắn là xóa những lịch có thời gian này khỏi hệ thống !
										{
											workSchedules.map(workSchedule => {
												if (selectedWorkSchedules.includes(workSchedule.work_schedule_id)) {
													return <li className={` ${cx('li-detail')}`} >
														<strong>Bác sĩ : </strong> {workSchedule.doctor_name +  ' . '} 
														<strong>Chuyên khoa : </strong> {workSchedule.department_name +  ' . '} 
														<strong>Bệnh viện : </strong> {workSchedule.hospital_name +  ' . '} 
														<strong>Khung giờ : </strong> {workSchedule.time.interval[0]} - {workSchedule.time.interval[1]} . {workSchedule.time.date}
														</li>;
												}
												return null;
											})}
									</div>
									<div className="modal-footer">
										<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
										<button type="submit" className="btn btn-danger"><i className="fa-solid fa-trash"></i> Delete</button>
									</div>
								</form>
							</div>
						</div>
					</div>

					{/* Model Detail */}
					<div className={`modal fade ${cx('modal-color-bg')}`} id="modalDetail" tabIndex="-1" role="dialog" aria-labelledby="modalDelete" aria-hidden="true">
						<div className={`modal-dialog ${cx('modal-dialog-create')}`} role="document">
							<div className="modal-content">
								<div className="modal-header alert-info modal-title m-0">
									<h5 className='text-center' id="exampleModalLabel">Thông tin về lịch {workScheduleDetail.id_service ? 'Dịch vụ' : 'Tư vấn'}</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div className="modal-body">
									<div className='row'>
										<div className='col-3'>
											<div className={cx('detail-user')}>
												<img
													alt=""
													src={
														workScheduleDetail.doctor_avatar
															? config.URL + workScheduleDetail.doctor_avatar
															: avatarDoctor
													}
												/>
												<p className='pt-4'><strong>{workScheduleDetail.doctor_name}</strong></p>
											</div>
										</div>
										<div className='col-9'>
											<div className='row'>
												<div className='col-6'>
                                                    <li className={` ${cx('li-detail')}`} >
														<strong>Khách hàng : </strong>
														<div className={`mt-1 ${cx('thumbnail-th')}`}>
															<img
																className={cx('thumbnail')}
																alt=""
                                                                src={
                                                                    workScheduleDetail.user_avatar
                                                                        ? workScheduleDetail.user_avatar.startsWith('http')
                                                                            ? workScheduleDetail.user_avatar
                                                                            : config.URL + workScheduleDetail.user_avatar
                                                                        : avatar
                                                                }
															/>
															{workScheduleDetail.user_name}
														</div>
													</li>
													<li className={` ${cx('li-detail')}`} ><strong>Ngày sinh : </strong> {workScheduleDetail.infor_user_date_of_birth}</li>
													<li className={` ${cx('li-detail')}`} ><strong>Email : </strong> {workScheduleDetail.user_email}</li>
													<li className={` ${cx('li-detail')}`} ><strong>Số điện thoại : </strong> {workScheduleDetail.user_phone}</li>
													<li className={` ${cx('li-detail')}`} ><strong>Địa chỉ : </strong> {workScheduleDetail.user_address}</li>
													<li className={` ${cx('li-detail')}`} ><strong>Khung giờ : </strong> {workScheduleDetail.time.interval[0]} - {workScheduleDetail.time.interval[1]} . {workScheduleDetail.time.date}</li>
													<li className={` ${cx('li-detail')}`}>
														<strong>Giá : </strong>
														{workScheduleDetail.work_schedule_price
															? workScheduleDetail.work_schedule_price.toLocaleString('en-US') + ' VNĐ'
															: 'Giá không có sẵn'}
													</li>
													<li className={` ${cx('li-detail-after')}`} ><strong>Ngày tạo : </strong> {formatDateTime(workScheduleDetail.created_at)}</li>
												</div>
												<div className='col-6'>
													<li className={` ${cx('li-detail')}`} ><strong>{workScheduleDetail.id_service ? 'Tên dịch vụ : ' : 'Đây là lịch tư vấn'}</strong> {workScheduleDetail.id_service ? workScheduleDetail.hospital_service_name : ''}</li>
													<li className={` ${cx('li-detail')}`} ><strong>Chuyên khoa : </strong> {workScheduleDetail.department_name}</li>
													<li className={` ${cx('li-detail')}`} >
														<strong>Bác sĩ thực hiện : </strong>
														<div className={`mt-1 ${cx('thumbnail-th')}`}>
															<img
																className={cx('thumbnail')}
																alt=""
																src={
																	workScheduleDetail.doctor_avatar
																		? config.URL + workScheduleDetail.doctor_avatar
																		: avatarDoctor
																}
															/>
															{workScheduleDetail.doctor_name}
														</div>
													</li>
													<li className={` ${cx('li-detail')}`} ><strong>Số năm kinh nghiệm : </strong> {workScheduleDetail.experience}</li>
													<li className={` ${cx('li-detail')}`} ><strong>Số điện thoại bác sĩ : </strong> {workScheduleDetail.doctor_phone}</li>
													<li className={` ${cx('li-detail')}`} ><strong>Email bác sĩ : </strong> {workScheduleDetail.doctor_email}</li>
													<li className={` ${cx('li-detail')}`} ><strong>Địa chỉ bác sĩ : </strong> {workScheduleDetail.doctor_address}</li>
                                                    <li className={` ${cx('li-detail')}`} >
														<strong>Bệnh viện : </strong>
														<div className={`mt-1 ${cx('thumbnail-th')}`}>
															<img
																className={cx('thumbnail')}
																alt=""
																src={
																	workScheduleDetail.hospital_avatar
																		? config.URL + workScheduleDetail.hospital_avatar
																		: avatarHospital
																}
															/>
															{workScheduleDetail.hospital_name}
														</div>
													</li>
													<li className={` ${cx('li-detail')}`} ><strong>Email bệnh viện : </strong> {workScheduleDetail.hospital_email}</li>
													<li className={` ${cx('li-detail')}`} ><strong>Số điện thoại bệnh viện : </strong> {workScheduleDetail.hospital_phone}</li>
													<li className={` ${cx('li-detail-after')}`} ><strong>Địa chỉ bệnh viện : </strong> {workScheduleDetail.hospital_address}</li>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)

}

export default ScheduleProfile
