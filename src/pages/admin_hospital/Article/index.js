import { useLocation } from 'react-router-dom'
import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

import styles from './Article.module.scss'
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

// rick text 
import Editor from "~/components/EditorWithUseQuill";

const cx = classNames.bind(styles)
function HospitalArticlePage() {

   const location = useLocation()
	const [loadingTable, setLoadingTable] = useState(false)
	const [articles, setArticles] = useState([])
	const [shouldReloadData, setShouldReloadData] = useState(false);
	const [loadingDot, setLoadingDot] = useState(false);

	const defaultSearchParams = {
		search: '',
		paginate: 5,
		page: 1,
		role: "",
		is_show: 'both',
		name_category: "",
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
	const [articleDetail, setArticleDetail] = useState({
		id: null,
		id_user: null,
		id_category: null,
		name_category: null,
		name_user: null,
		title: null,
		content: null,
		thumbnail: null,
		is_accept: null,
		is_show: null,
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
			role: searchParams.get('role') || defaultSearchParams.role,
			name_category: searchParams.get('name_category') || defaultSearchParams.name_category,
			is_show: searchParams.get('is_show') || defaultSearchParams.is_show,
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

	const [categories, setCategories] = useState([])
	useEffect(() => {
		const getCategory = async () => {
			try {
				const response = await http.get('category')
				setCategories(response.data.data)
			} catch (error) {
				toast.error('Lỗi kết nối đến API !', toastOptions);
			} 
		}
		getCategory()
	}, []); // thêm [] nếu không nó sẽ lắng nghe tất cả useEffect dẫn đến việc thực hiện hàm này nhiều lần 

	useEffect(() => {
		const getUser = async () => {
			try {
				setLoadingTable(true)
				const queryParams = `?search=${search.search}&page=${search.page}&paginate=${search.paginate}
				&sortname=${search.sortname}&sortlatest=${search.sortlatest}
				&name_category=${search.name_category}&role=${search.role}&is_show=${search.is_show}`
				const response = await http.get('article/hospital' + queryParams);
				setArticles(response.data.data.data);
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

	const handleChangeSelectedName = (e) => {
		if (e.target.value === 'sortlatest') {
			updateSearchParams({ sortlatest: true, sortname: false })
		} else if (e.target.value === 'un_sortlatest') {
			updateSearchParams({ sortlatest: false })
		} else {
			updateSearchParams({ sortname: true })
		}
	};

	const handleChangeSelectedCategory = (e) => {
		updateSearchParams({ name_category: e.target.value, page: 1});
	};
	const handleChangeSelectedIsShow = (e) => {
		updateSearchParams({ is_show: e.target.value, page: 1});
	};
	const handleChangeSelectedRole = (e) => {
		updateSearchParams({ role: e.target.value, page: 1});
	};

	// add healthInsurace 
	const [formData, setFormData] = useState({
		title: '',
		content: '',
		thumbnail: null,
		id_category: null,
	});
	const modalRef = useRef(null);
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleChangeSelectCategory = (e) => {
		setFormData({
			...formData,
			['id_category']: e.target.value,
		});
	};
	
	// submit form 
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formDataToSubmit = new FormData();
		for (const key in formData) {
			formDataToSubmit.append(key, formData[key]);
		}
		formDataToSubmit.append('content', content);
		try {
			setLoadingDot(true);
			const response = await http.post('article/add', formDataToSubmit);
			toast.success('Thêm Bài viết thành công !', toastOptions);
			// clear input 
			setFormData({
				title: '',
				content: '',
				thumbnail: null,
				id_category: null,
			});
			$(modalRef.current).modal('hide'); 
			setSelectedImage(null);
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
	const [selectedImage, setSelectedImage] = useState(null);
	const handleCancelClick = () => {
		setSelectedImage(null);
	};
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
	// add healthInsurace 

	// delete healthInsurace 
	const handleDeleteSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoadingDot(true);
			const response = await http.delete('article/delete/' + articleDetail.id_article);
			toast.success('Xóa Bài viết thành công !', toastOptions);
			$(modalDeleteRef.current).modal('hide');
			setShouldReloadData(!shouldReloadData);
		} catch (error) {
			toast.error('Lỗi khi xóa Bài viết !', toastOptions);
		} finally {
			setLoadingDot(false);
		}
	}
	// delete healthInsurace 

	const handleGetArticle = (index) => {
		setSelectedEditImage(config.URL + articles[index].thumbnail_article);
		setArticleDetail({
			...articles[index],
			index: index,
		});
	};

	// edit healthInsurace 
	const modalEditRef = useRef(null);
	const handleInputEditChange = (e) => {
		const { name, value } = e.target;
		setArticleDetail({
			...articleDetail,
			[name]: value,
		});
	};
	const handleChangeSelectEditCategory = (e) => {
		setArticleDetail({
			...articleDetail,
			['id_category']: e.target.value,
		});
	};
	
	const handleEditSubmit = async (e) => {
		e.preventDefault();

		const formDataToSubmit = new FormData();
		formDataToSubmit.append('title', articleDetail.title);
		formDataToSubmit.append('id_category', articleDetail.id_category);
		formDataToSubmit.append('content', contentEdit);
		if (articleDetail.thumbnail instanceof Object) formDataToSubmit.append('thumbnail', articleDetail.thumbnail);
		
		try {
			setLoadingDot(true);
			const response = await http.post('article/update/' + articleDetail.id_article, formDataToSubmit);
			const updatedArticles = [...articles];
			updatedArticles[articleDetail.index] = response.data.data; 
			setArticles(updatedArticles);
			setSelectedEditImage(null);
			toast.success('Chỉnh sửa Bài viết thành công !', toastOptions);
			$(modalEditRef.current).modal('hide');
		} catch (error) {
			console.log(error);
			if (error.response.data.data) toast.error(error.response.data.data[0], toastOptions);
			else toast.error(error.response.data.message, toastOptions);
		} finally {
			setLoadingDot(false);
		}
	}
	const [selectedEditImage, setSelectedEditImage] = useState(null);
	const handleCancelEditClick = () => {
		setSelectedEditImage(null);
	};
	const handleImageEidtChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => setSelectedEditImage(e.target.result);
			reader.readAsDataURL(file);
			setArticleDetail({
				...articleDetail,
				thumbnail: file,
			});

		}
	};
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

	// hideShow 
	const handleHideShow = async (index, id, value) => {
		try {
			const data = { is_show: value }
			const response = await http.post('article/hide-show/' + id, data)

			const updatedArticles = [...articles];
			updatedArticles[index].is_show = value; 
			setArticles(updatedArticles);

			toast.success(response.data.message, toastOptions);
		} catch (error) {
			if (error.response.data.data) toast.error(error.response.data.data[0], toastOptions);
			else toast.error(error.response.data.message, toastOptions);
		}
	} 

	// delete Many 
	const checkboxesRefs = useRef([]); 
	checkboxesRefs.current = articles.map(article => React.createRef());
	const [selectAllChecked, setSelectAllChecked] = useState(false);

	const modalDeleteManyRef = useRef(null);
	const [selectedArticles, setSelectedArticles] = useState([]);
	const handleCheckboxChange = (articleId) => {
		if (selectedArticles.includes(articleId)) {
		  const updatedArticles = selectedArticles.filter(id => id !== articleId);
		  setSelectedArticles(updatedArticles);
		} else {
		  setSelectedArticles([...selectedArticles, articleId]);
		}
	};

	const handleDeleteManyArticles = async (e) => {
		e.preventDefault();
		try {
			setLoadingDot(true);
			const response = await http.delete('article/deletes', {
				data: { list_id: selectedArticles }
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
		if (checkboxesRefs.current.length === articles.length) {
		  if (selectAllChecked) {
			setSelectedArticles([]);
		  } else {
			const selectedIds = articles
			  .filter(article => article.role_user === 'hospital')
			  .map(article => article.id_article);
			setSelectedArticles(selectedIds);
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
		setSelectedArticles([]);
	}

   return (
		<>
			<ToastContainer />
			<TitleAdmin>Bài viết bệnh viện</TitleAdmin>
			<div className={cx('card', 'shadow')}>
				{loadingDot && <LoadingDot />}
				<div className={cx('card_header')}>
					{selectedArticles.length > 0 ? (
					<div className={cx('add_box')}>
						<button data-toggle="modal" data-target="#deleteMany" type="button" className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button>
					</div>
					) : null}
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
					<div className={cx('filter_box_category')}>
						<select 
							value={search.name_category}  // chú ý muốn bind từ URL xuống được select này thì dùng 
							// value thay vì defaultValue
							name='name_category'
							onChange={handleChangeSelectedCategory}
							className={cx('custom-select', 'fontz_14')}
							>
							<option value="">Tất cả</option> 
							{categories.map((category, index) => (
								<option key={category.id} value={category.name}>{category.name}</option>
							))}
						</select>
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
					<div className={cx('filter_box_is_show')}>
						<select 
							defaultValue={search.is_show}
							name='is_show'
							onChange={handleChangeSelectedIsShow}
							className={cx('custom-select', 'fontz_14')}
							>
							<option value="both">Tất cả</option> 
							<option value="0">Ẩn</option> 
							<option value="1">Hiện</option> 
						</select>
					</div>
					<div className={cx('filter_box_role')}>
						<select 
							defaultValue={search.role}
							name='role'
							onChange={handleChangeSelectedRole}
							className={cx('custom-select', 'fontz_14')}
							>
							<option value="">Tất cả</option> 
							<option value="hospital">Hospital</option> 
							<option value="doctor">Doctor</option> 
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
										<th><span className='ml-3'><input onClick={selectAll} className="form-check-input" type="checkbox" value="" /></span></th>
										<th>ID</th>
										<th>Tiêu đề</th>
										<th>Thumbnail</th>
										<th>Tác giả</th>
										<th>Lượt tìm đọc</th>
										<th>Danh mục</th>
										<th>Ngày tạo</th>
										<th>Ngày cập nhật</th>
										<th>Thao tác</th>
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
								<th>Tiêu đề</th>
								<th>Thumbnail</th>
								<th>Tác giả</th>
								<th>Lượt tìm đọc</th>
								<th>Danh mục</th>
								{/* <th>Ngày tạo</th> */}
								<th>Ngày cập nhật</th>
								<th>Thao tác</th>
								</tr>
							</thead>

							<tbody>
								{articles.map((article, index) => (
									<tr key={index}>
										<td>
											{
											article.role_user === 'hospital' ? 
											<span className='ml-3'>
												<input 
													ref={checkboxesRefs.current[index]}
													value={article.id_article}
													onChange={() => handleCheckboxChange(article.id_article)}
													className="form-check-input" 
													type="checkbox" 
													checked={selectedArticles.includes(article.id_article)}
												/>
												</span> 
											: ''
										}
										</td>
										<td>{article.id_article}</td>
										<td>{article.title}</td>
										<td>
											<div className={cx('thumbnail-th')}>
												<img
												className={cx('thumbnail')}
												alt=""
												src={
													article.thumbnail_article && config.URL + article.thumbnail_article
												}
												/>
											</div>
										</td>
										<td>
                                 <span>
												{ article.role_user == 'doctor' 
                                       ? <span className='mr-2'><i className="fa-solid fa-user-doctor"></i></span>
                                       : <span className='mr-2'><i className="fa-solid fa-hospital"></i></span>
												}
												{article.name_user} 
											</span> 
                              </td>
										<td>{article.search_number_article}</td>
										<td>{article.name ? article.name : 'N/A'}</td>
										{/* <td className='p-4'>
											{article.created_at_article
												? formatDateTime(article.created_at_article)
												: 'N/A'}
										</td> */}
										<td>
											{article.updated_at_article
												? formatDateTime(article.updated_at_article)
												: 'N/A'}
										</td>
										<td>
											<div className='row pl-3 pr-3'>
												<div className='col-6 pl-0 pr-0 mx-0'>
													<>
														{article.role_user === 'hospital' && (
															<div className='pl-0 pr-0 mx-0'>
															<Tippy content="Chỉnh sửa">
																<button
																onClick={() => handleGetArticle(index)}
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
																onClick={() => handleGetArticle(index)}
																data-toggle="modal" data-target="#modalDelete"
																className="btn btn-danger btn-sm mt-1"
																>
																<i className="ti-trash" />
																</button>
															</Tippy>
															</div>
														)}
													</>
												</div>
												<div className='col-6 pl-0 pr-0 mx-0'>
													<div className='pl-0 pr-0 mx-0'>
														{
															article.is_show == 1 
															? <Tippy content="Ẩn">
																<button
																	onClick={() => handleHideShow(index, article.id_article, 0)}
																	className="ml-1 btn btn-info btn-sm sua"
																>
																	<i className="fa-solid fa-eye-slash"></i>
																</button>
															</Tippy>
															: <Tippy content="Hiện">
																<button
																	onClick={() => handleHideShow(index, article.id_article, 1)}
																	className="ml-1 btn btn-info btn-sm sua"
																>
																	<i className="fa-regular fa-eye"></i>
																</button>
															</Tippy>
														}
														<Tippy content="Xem chi tiết">
															<button
																onClick={() => handleGetArticle(index)}
																className="ml-1 btn btn-info btn-sm sua mt-1"
																data-toggle="modal"
																data-target="#modalDetail"
															>
																<i className="fa-solid fa-circle-info"></i>
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
					{/* Modal add HealthInsurance */}
					<div ref={modalRef} className={`modal fade ${cx('modal-color-bg')}`} id="modalCreateHealthInsurace" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
						<div className={`modal-dialog ${cx('modal-dialog-create')}`} role="document">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title" id="exampleModalLabel">Thêm mới Bài viết</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<form onSubmit={handleSubmit}>
									<div className="modal-body">
										<div className="form-group row mb-0">
											<div className='col-5'>
												<label htmlFor="inputPassword" className="col-sm-12 col-form-label">Tiêu đề</label>
												<div className="col-sm-12">
													<input value={formData.title} onChange={handleInputChange} name='title' type="text" required className="form-control" id="inputPassword" placeholder="Tiêu đề" />
												</div>
											</div>
											<div className='col-4'>
												<label htmlFor="inputPassword" className="col-sm-12 col-form-label">Danh mục bài viết</label>
												<div className="col-sm-12">
													<select 
														name='id_category'
														onChange={handleChangeSelectCategory}
														className={cx('custom-select', 'fontz_14')}
														>
														<option value="">Để trống</option>
														{categories.map((category, index) => (
															<option key={category.id} value={category.id}>{category.name}</option>
														))}
													</select>
												</div>
											</div>
											<div className='col-3'>
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
										<div className="form-group row mt-0">
											<div className='col-12'>
												<label htmlFor="inputPassword" className="col-sm-12 col-form-label">Mô tả Bài viết</label>
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
					<div ref={modalDeleteRef} className={`modal fade ${cx('modal-color-bg')}`} id="modalDelete" tabIndex="-1" role="dialog" aria-labelledby="modalDelete" aria-hidden="true">
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
										Cảnh báo ! Bạn sẽ có chắc chắn là xóa Bài viết <strong>{articleDetail.title}</strong> khỏi hệ thống !
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
						<div className={`modal-dialog ${cx('modal-dialog-delete-many')}`} role="document">
							<div className="modal-content">
								<div className="modal-header alert-warning modal-title m-0">
									<h5 id="exampleModalLabel"><i className="fa-solid fa-triangle-exclamation"></i> Warning !</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<form onSubmit={handleDeleteManyArticles}>
									<div className="modal-body">
										Cảnh báo ! Bạn có chắc chắn là xóa những bài viết này khỏi hệ thống !
										{
											articles.map(article => {
											if (selectedArticles.includes(article.id_article)) {
												return <li key={article.id_article}>{article.title}</li>;
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
									<h5 className='text-center' id="exampleModalLabel">{articleDetail.title}</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<h6 className='mt-2 ml-2'><i className="fa-solid fa-tags"></i> {articleDetail.name_category} 
									<span className='ml-3'><i className="fa-solid fa-user-pen"></i> {articleDetail.name_user}</span>
								</h6>
								<div className={` ${cx('view-detail')}`} dangerouslySetInnerHTML={{ __html: articleDetail.content }} />  
							</div>
						</div>
					</div>

					{/* Modal edit HealthInsurance */}
					<div ref={modalEditRef} className={`modal fade ${cx('modal-color-bg')}`} id="modalEdit" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
						<div className={`modal-dialog ${cx('modal-dialog-create')}`} role="document">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title" id="exampleModalLabel">Chỉnh sửa Bài viết</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<form onSubmit={handleEditSubmit}>
									<div className="modal-body">
										<div className="form-group row mb-0">
											<div className='col-5'>
												<label htmlFor="inputPassword" className="col-sm-12 col-form-label">Tiêu đề</label>
												<div className="col-sm-12">
													<input value={articleDetail.title} onChange={handleInputEditChange} name='title' type="text" required className="form-control" id="inputPassword" placeholder="Tiêu đề" />
												</div>
											</div>
											<div className='col-4'>
												<label htmlFor="inputPassword" className="col-sm-12 col-form-label">Danh mục bài viết</label>
												<div className="col-sm-12">
													<select 
														name='id_category'
														onChange={handleChangeSelectEditCategory}
														className={cx('custom-select', 'fontz_14')}
														value={articleDetail.id_category || ''}
														>
														<option value="">Để trống</option>
														{categories.map((category, index) => (
															<option key={category.id} value={category.id}>{category.name}</option>
														))}
													</select>
												</div>
											</div>
											<div className='col-3'>
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
										<div className="form-group row mt-0">
											<div className='col-12'>
												<label htmlFor="inputPassword" className="col-sm-12 col-form-label">Mô tả Bài viết</label>
												<div className='col-sm-12'>
													<Editor onContentChangeEdit={handleContentChangeEdit} description={articleDetail.content} />
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

export default HospitalArticlePage
