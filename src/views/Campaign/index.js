import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import './Campaign.css';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';
import { toast } from 'react-toastify'
import { createCampaignAction, fetchAllCampaignPaginationAction, moveDataUpdateToStoreAction, moveData, softDeleteCampaignAction } from '../../store/actions/campaignAction';
import { BACKEND_DOMAIN, BACKEND_DOMAIN_IMAGE, LIMIT_NUM_CAMPAIGN } from '../../config/settingSystem';
import ModalDefault from '../../components/Common/ModalEditCampaign';
import axios from 'axios';
import { turnOffLoader, turnOnLoader } from '../../store/actions/loaderAction';
import Paginate from '../../components/Common/Pagination';
import ReactPaginate from 'react-paginate';
const FileDownload = require('js-file-download');
export default function Campaign() {
  const [searchInfo, setSearchInfo] = useState({
    key_word: '',
    page_number: 1,
    start_time: '',
    end_time: '',
  })
  const typingTimeoutRef = useRef(null);
  const [isOpenModalEdit, setOpenModalEdit] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.auth?.currentUser)
  const listCampaign = useSelector((state) => state.campaign.listCampaign)
  const totalRecords = useSelector((state) => state.campaign.totalRecords)
  const [show, setShow] = useState(false);
  const [previewBanner, setPreviewBanner] = useState('');
  const [isOpenLightBox, setIsOpenLightBox] = useState(false)
  const handleClose = () => {
    setShow(false)
  };
  const handleShow = () => setShow(true);
  const formik = useFormik({
    initialValues: {
      name: '',
      status: '',
      start_time: '',
      end_time: '',
      budget: '',
      bid_amount: '',
      title: '',
      description: '',
      banner: '',
      final_url: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter campaign's name").min(2, "Name must have at least 2 characters").max(255, "Exceed the number of characters"),
      start_time: Yup.date().required("Required!"),
      end_time: Yup.date().required("Required!").when("start_time",
        (start_time, yup) => start_time && yup.min(start_time, "End time cannot be before start time")),
      budget: Yup.number().typeError('Budget must be a number').required("Please enter campaign's budget").positive("Must be more than 0").integer('Budget must be a integer').max(Number.MAX_SAFE_INTEGER, "Budget must be less than or equal to 9007199254740991"),
      bid_amount: Yup.number().typeError('Bid amount must be a number').required("Please enter campaign's bid amount").positive("Must be more than 0").integer('Bid amount must be a integer').max(Number.MAX_SAFE_INTEGER, "Bid amount must be less than or equal to 9007199254740991"),
      title: Yup.string().min(2, "Title must have at least 2 characters").max(255, "Exceed the number of characters"),
      description: Yup.string().min(2, "Description must have at least 2 characters"),
      banner: Yup.mixed().required("Please choose a campaign's banner").test("FILE_TYPE", "Invalid type! Please choose another file", (value) => value && ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg'].includes(value.type)).test('Fichier taille',
      'Please choose a size less than 1 mb', (value) => !value || (value && value.size <= 1024 * 1024)),
      final_url: Yup.string().min(2, "URL must have at least 2 characters").max(255, "Exceed the number of characters"),
    }),
    onSubmit: async (values) => {
      if (values.status === '') {
        values.status = '1'
      }
      let formData = new FormData();
      formData.append('name', values.name)
      formData.append('status', values.status)
      formData.append('start_time', values.start_time.replace('T', ' '))
      formData.append('end_time', values.end_time.replace('T', ' '))
      formData.append('budget', values.budget)
      formData.append('bid_amount', values.bid_amount)
      formData.append('title', values.title)
      formData.append('description', values.description)
      formData.append('banner', values.banner)
      formData.append('final_url', values.final_url)
      formData.append('user_id', currentUser.userProfile.id)
      dispatch(createCampaignAction(formData, dispatch, navigate))
      formik.resetForm();
      setShow(false)
      setPreviewBanner('')
    },
  });
  useEffect(() => {
    dispatch(fetchAllCampaignPaginationAction('', 1, '', '', navigate))
  }, [])
  const handleSoftDelete = (campaignId) => {
    let notification = "Are you sure you want to delete?"
    if (window.confirm(notification) === true) {
      let dataDelete = {
        campaign_id: campaignId, user_id: currentUser.userProfile.id
      }
      dispatch(softDeleteCampaignAction(dataDelete, dispatch, navigate))
      setSearchInfo({ ...searchInfo, page_number: 1 })
    } else {
      return;
    }
  }
  const handleUpdateCampaign = (campaignItem,) => {
    const bannerURL = `${BACKEND_DOMAIN_IMAGE}uploads/banner/${campaignItem.banner}`
    const getUrlExtension = (url) => {
      return url
        ?.split(/[#?]/)[0]
        ?.split(".")
        .pop()
        .trim();
    }
    const onImageEdit = async (bannerURL) => {
      var imgExt = getUrlExtension(bannerURL);
      const response = await fetch(bannerURL, { mode: 'no-cors' });
      const blob = await response.blob();
      const file = new File([blob], "bannerUpdate." + imgExt, {
        type: blob.type,
      });
      campaignItem.banner = file
    }
    onImageEdit(bannerURL)
    setOpenModalEdit(!isOpenModalEdit)
    dispatch(moveData(campaignItem))
  }
  const handleChangeSearchByKeyWord = (e) => {
    const value = e.target.value
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setSearchInfo({ ...searchInfo, key_word: value })
    }, 600)
  }
  const handleChangeSearchByStartTime = (e) => {
    if (searchInfo.end_time !== '' && searchInfo.end_time < e.target.value.replace('T', ' ')) {
      toast.error("End time cannot be before start time")
    } else {
      setSearchInfo({ ...searchInfo, start_time: e.target.value.replace('T', ' ') })
    }
  }
  const handleChangeSearchByEndTime = (e) => {
    if (searchInfo.start_time !== '' && searchInfo.start_time > e.target.value.replace('T', ' ')) {
      toast.error("End time cannot be before start time")
    } else {
      setSearchInfo({ ...searchInfo, end_time: e.target.value.replace('T', ' ') })
    }
  }
  useEffect(() => {
    dispatch(fetchAllCampaignPaginationAction(searchInfo.key_word, searchInfo.page_number, searchInfo.start_time, searchInfo.end_time, navigate))
  }, [searchInfo])
  const handleExportData = () => {
    dispatch(turnOnLoader())
    axios({
      url: `${BACKEND_DOMAIN}/campaigns/export`,
      method: 'GET',
      responseType: 'blob',
    }).then((res) => {
      dispatch(turnOffLoader())
      FileDownload(res.data, 'campaigns.csv');
    }).catch((res) => {
      dispatch(turnOffLoader())
    })
  }
  const pageCount = Math.ceil(totalRecords / LIMIT_NUM_CAMPAIGN);
  const handlePageClick = (event) => {
    console.log(
      `User requested page number ${event.selected + 1}`
    );
    setSearchInfo({ ...searchInfo, page_number: event.selected + 1})
  };
  return (
    <>
      <div className="block">
        <div className="left">
          <div className="search-bar">
            <input type="search" placeholder="Search" onInput={(e) => handleChangeSearchByKeyWord(e)} />
          </div>
          <div className="datetime">
            <div className="form-datetime">
              <span>Start Time: </span>
              <input type="datetime-local" className="start-time" id="time_start" onChange={(e) => handleChangeSearchByStartTime(e)}></input>
            </div>
            <div className="form-datetime">
              <span>End Time: </span>
              <input type="datetime-local" className="end-time" id="end_start" onChange={(e) => handleChangeSearchByEndTime(e)}></input>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="two-button">
            <div className="Export-csv-btn">
              <button onClick={handleExportData} className="export">Export CSV</button>
            </div>
            <div className="Campaign-btn">
              <Button variant="primary" onClick={handleShow}>
                Create Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="table-main">
        <div className="table-content">
          <table className="table-campaign">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Status</th>
                <th>Used Amount</th>
                <th>Usage Rate</th>
                <th>Budget</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listCampaign && listCampaign.length > 0 && listCampaign.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div className='campaign-name'>
                        <img className='small-image' src={item.banner ? `${BACKEND_DOMAIN_IMAGE}uploads/banner/${item.banner}` : require('../../assets/images/default-banner.jpg')} alt="Banner"></img>
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td>
                      <i className={item.status === 1 ? "green far fa-circle" : "red far fa-circle"}></i>
                    </td>
                    <td>¥10</td>
                    <td>0.5%</td>
                    <td>¥{item.budget}</td>
                    <td>{item.start_time.slice(0, 16)}</td>
                    <td>{item.end_time.slice(0, 16)}</td>
                    <td>
                      <div className="action">
                        <div className="update">
                          <button onClick={() => {
                            handleUpdateCampaign(item)
                          }}>Update</button>

                        </div>
                        <div className="delete">
                          <button onClick={() => handleSoftDelete(item.id)}>Delete</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })
              }
            </tbody>
          </table>
        </div>
      </div>
      <div className="page-navigation">
        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          pageCount={pageCount}   // totalRecord from be
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}  // hien thi page trong dau ...
          renderOnZeroPageCount={null}
          containerClassName={'pagination justify-content-center'}  // className bootstrap
          pageClassName={'page-item'} // className bootstrap
          pageLinkClassName={'page-link'}  // className bootstrap
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
          activeClassName={'active'}
        />
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="Campaign-Model">
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Create Campaign</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <p>Details</p>
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul className="menu-list">
                      <li className="menu-item">
                        <div className="Shared input-name">
                          <div>
                            <span>Name:</span>
                          </div>
                          <div className="vali-form">
                            <input
                              type="text"
                              name="name"
                              placeholder="Name"
                              value={formik.values.name}
                              onChange={formik.handleChange}
                            />
                            {formik.errors.name && (
                              <p style={{ color: 'red' }}>
                                {formik.errors.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                      <li className="menu-item">
                        <div className="Shared drop-userstatus">
                          <span>User status:</span>
                          <div className="dropdown-active">
                            <select name='status' onChange={formik.handleChange}>
                              <option value='1' selected>Active</option>
                              <option value='0'>In-active</option>
                            </select>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Schedule</Accordion.Header>
                  <Accordion.Body>
                    <div className="datetime">
                      <div className="schedule">
                        <p>Schedule:</p>
                      </div>
                      <div className="sche-datetime">
                        <div className="form-modal-datetime">
                          <span>Start Time: </span>
                          <input type="datetime-local" name='start_time' className="start-time" id="time_start" onChange={formik.handleChange} ></input>
                          {formik.errors.start_time && (
                            <p style={{ color: 'red' }}>
                              {formik.errors.start_time}
                            </p>
                          )}
                        </div>
                        <div className="form-modal-datetime">
                          <span>End Time: </span>
                          <input type="datetime-local" className="end-time" name='end_time' id="end_start" onChange={formik.handleChange} ></input>
                          {formik.errors.end_time && (
                            <p style={{ color: 'red' }}>
                              {formik.errors.end_time}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Budget</Accordion.Header>
                  <Accordion.Body>
                    <ul className="menu-list">
                      <li className="menu-item">
                        <div className="Shared budget-name">
                          <span>Budget:</span>
                          <div className="vali-form">
                            <input type="text" name='budget' value={formik.values.budget} placeholder="Budget" onChange={formik.handleChange} />
                            {formik.errors.budget && (
                              <p style={{ color: 'red' }}>
                                {formik.errors.budget}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>Bidding</Accordion.Header>
                  <Accordion.Body>
                    <ul className="menu-list">
                      <li className="menu-item">
                        <div className="Shared bidamount-name">
                          <span>Bid Amount:</span>
                          <div className="vali-form">
                            <input type="text" name='bid_amount' value={formik.values.bid_amount} placeholder="Bid amount" onChange={formik.handleChange} />
                            {formik.errors.bid_amount && (
                              <p style={{ color: 'red' }}>
                                {formik.errors.bid_amount}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>Create</Accordion.Header>
                  <Accordion.Body>
                    <ul className="menu-list">
                      <li className="menu-item">
                        <div className="Shared title-name">
                          <span>Title:</span>
                          <div className="vali-form">
                            <input type="text" placeholder="Title" value={formik.values.title} onChange={formik.handleChange} name='title' />
                            {formik.errors.title && (
                              <p style={{ color: 'red' }}>
                                {formik.errors.title}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                      <li className="menu-item">
                        <div className="Shared description-name">
                          <span>Description:</span>
                          <div className="vali-form">
                            <input type="text" placeholder="Description" value={formik.values.description} onChange={formik.handleChange} name='description' />
                            {formik.errors.description && (
                              <p style={{ color: 'red' }}>
                                {formik.errors.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                      <li className="menu-item">
                        <div className="Shared creative-name">
                          <span>Create preview:</span>
                          <div className="onchange-file">
                            <input accept="image/*" type="file" name="banner" onChange={e => {
                              let data = e.target.files;
                              let file = data[0];
                              if (file) {
                                let objectURL = URL.createObjectURL(file)
                                setPreviewBanner(objectURL)
                              }
                              formik.setFieldValue("banner", e.target.files[0])
                            }} id="file-input" />
                            {previewBanner ?
                              <div className='preview-banner' style={{ backgroundImage: `url(${previewBanner})` }} onClick={() => {
                                if (!previewBanner) return;
                                setIsOpenLightBox(true)
                              }}></div>
                              : <></>
                            }
                            {formik.errors.banner && (
                              <p style={{ color: 'red', zIndex: 10 }}>
                                {formik.errors.banner}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                      <li className="menu-item">
                        <div className="Shared final-url">
                          <span>Final URL:</span>
                          <div className="vali-form">
                            <input type="text" placeholder="Final URL" value={formik.values.final_url} onChange={formik.handleChange} name='final_url' />
                            {formik.errors.final_url && (
                              <p style={{ color: 'red' }}>
                                {formik.errors.final_url}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Modal.Body>
            <Modal.Footer>
              <div className="cancel-btn">
                <Button className="cancel" variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
              <div className="save-btn">
                <Button variant="primary" type='Submit' onClick={formik.handleSubmit}>
                  Save
                </Button>
              </div>
            </Modal.Footer>
          </Modal>
        </div>

      </form>
      {isOpenLightBox === true &&
        <Lightbox
          mainSrc={previewBanner}
          onCloseRequest={() => setIsOpenLightBox(false)}
        />}
      {isOpenModalEdit === true ? <ModalDefault currentPage={searchInfo.page_number} isOpenModalEdit={isOpenModalEdit} setOpenModalEdit={setOpenModalEdit} /> : <></>}
    </>
  )
}



