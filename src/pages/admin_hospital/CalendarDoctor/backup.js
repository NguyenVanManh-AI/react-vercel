import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'

import styles from '~/pages/admin_hospital/Calendar/HospitalCalendar.module.scss'

const cx = classNames.bind(styles)
function HospitalCalendarDoctorPage() {
   return (
      <>
         <TitleAdmin>Lịch hoạt động bác sĩ </TitleAdmin>
         <div className={cx('card', 'shadow')}>
            <div className={cx('card_header')}>
               <div className={cx('search_box')}>
                  <div className={cx('input-group', 'fontz_14')}>
                     <span className="input-group-prepend">
                        <button type="button" className="btn btn-primary">
                           <i className="fa fa-search"></i>
                        </button>
                     </span>
                     <input
                        // defaultValue={search.search}
                        // onChange={handleChangeInput}
                        type="text"
                        id="example-input1-group2"
                        className="form-control"
                        placeholder="Search"
                     />
                  </div>
               </div>
               <div className={cx('filter_box')}>
                  <select
                     // value={search.name_category}
                     name="name_category"
                     // onChange={handleChangeSelectedCategory}
                     className={cx('custom-select', 'fontz_14')}
                  >
                     <option value="">Bác sĩ</option>
                     {/* {categories.map((category, index) => (
								<option key={category.id} value={category.name}>{category.name}</option>
							))} */}
                  </select>
               </div>
            </div>
            <div className={cx('card_body', 'center')}>
               <div className={cx('container', 'up_width_1000')}>
                  <div className={cx('row', 'text_center')}>
                     <div className="col-12">
                        <div className="btn-group" role="group">
                           <button type="button" className="btn btn-secondary">
                              Monday
                           </button>
                           <button type="button" className="btn btn-secondary">
                              Tuesday
                           </button>
                           <button type="button" className="btn btn-secondary">
                              Wednesday
                           </button>
                           <button type="button" className="btn btn-secondary">
                              Thursday
                           </button>
                           <button type="button" className="btn btn-secondary">
                              Friday
                           </button>
                           <button type="button" className="btn btn-secondary">
                              Saturday
                           </button>
                           <button type="button" className="btn btn-secondary">
                              Sunday
                           </button>
                        </div>
                     </div>
                  </div>
                  <div className="row mt-3">
                     <div className="col-4">
                        <h6 className={cx('text_center')}>Sáng</h6>
                        <div className={cx('time-slot')}>[07:30-08:00]</div>
                        <div className={cx('time-slot')}>[08:00-08:30]</div>
                        <div className={cx('time-slot')}>[08:30-09:00]</div>
                     </div>
                     <div className="col-4">
                        <h6 className={cx('text_center')}>Chiều</h6>
                        <div className={cx('time-slot')}>[12:00-12:30]</div>
                        <div className={cx('time-slot')}>[12:30-13:00]</div>
                        <div className={cx('time-slot')}>[13:00-13:30]</div>
                     </div>
                     <div className="col-4">
                        <h6 className={cx('text_center')}>Tối</h6>
                        <div className={cx('time-slot')}>[18:00-18:30]</div>
                        <div className={cx('time-slot')}>[18:30-19:00]</div>
                        <div className={cx('time-slot')}>[19:00-19:30]</div>
                     </div>
                  </div>
                  <div className={cx('mt-3', 'float-right')}>
                     <ul className={cx('note_ul')}>
                        <li>
                           <span className={cx('note_block_off')} />
                           Bác sĩ nghỉ
                        </li>
                        <li>
                           <span className={cx('note_block_have')} />
                           Bác sĩ bận
                        </li>
                        <li>
                           <span className={cx('note_block_none')} />
                           Trống
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default HospitalCalendarDoctorPage
