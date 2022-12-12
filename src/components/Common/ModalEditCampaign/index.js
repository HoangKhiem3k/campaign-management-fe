import React, {  useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './ModalEditCampaign.css';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';
import { BACKEND_DOMAIN_IMAGE } from '../../../config/settingSystem';
import { updateCampaignAction } from '../../../store/actions/campaignAction';
import { useNavigate } from 'react-router-dom';

function ModalDefault({isOpenModalEdit,setOpenModalEdit,currentPage}) {
  const campaignUpdate = useSelector((state) => state.campaign?.campaignUpdate)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.auth?.currentUser)
  const [show, setShow] = useState(false);
  const [previewBanner, setPreviewBanner] = useState(`${BACKEND_DOMAIN_IMAGE}uploads/banner/${campaignUpdate.banner}`);
  const [isOpenLightBox, setIsOpenLightBox] = useState(false)
  const handleClose = () => {
    setOpenModalEdit(false);
  };
  
  const formik = useFormik({
    initialValues: {
      name: campaignUpdate.name,
      status: campaignUpdate.status,
      start_time: campaignUpdate.start_time,
      end_time: campaignUpdate.end_time,
      budget: campaignUpdate.budget,
      bid_amount: campaignUpdate.bid_amount,
      title: campaignUpdate.title ? campaignUpdate.title : '',
      description: campaignUpdate.description ? campaignUpdate.description : '',
      banner: '',
      final_url: campaignUpdate.final_url ? campaignUpdate.final_url : '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter campaign's name").min(2, "Name must have at least 2 characters").max(255, "Exceed the number of characters"),
      start_time: Yup.date().required("Required!"),
      end_time: Yup.date().required("Required!").when("start_time",
        (start_time, yup) => start_time && yup.min(start_time, "End time cannot be before start time")),
      budget: Yup.number().typeError('Budget must be a number').required("Please enter campaign's budget").positive("Must be more than 0").integer('Budget must be a integer').max(Number.MAX_SAFE_INTEGER,"Budget must be less than or equal to 9007199254740991"),
      bid_amount: Yup.number().typeError('Bid amount must be a number').required("Please enter campaign's bid amount").positive("Must be more than 0").integer('Bid amount must be a integer').max(Number.MAX_SAFE_INTEGER,"Bid amount must be less than or equal to 9007199254740991"),
    }),
    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append('campaign_id', campaignUpdate.id)
      formData.append('name', values.name)
      formData.append('status', values.status)
      formData.append('start_time', values.start_time.replace('T', ' '))
      formData.append('end_time', values.end_time.replace('T', ' '))
      formData.append('budget', values.budget)
      formData.append('bid_amount', values.bid_amount)
      formData.append('title', values.title)
      formData.append('description', values.description)
      if(values.banner === ''){
        formData.append('banner', formik.initialValues.banner)
      }else{
        formData.append('banner', values.banner)
      }
      formData.append('final_url', values.final_url)
      formData.append('user_id', currentUser.userProfile.id)
      dispatch(updateCampaignAction(formData,currentPage,dispatch,navigate))
      setOpenModalEdit(false);
    },
  });
  useEffect(()=>{
    setShow(isOpenModalEdit)
  },[])
  return (
    <form onSubmit={formik.handleSubmit}>
        <div className="Campaign-Model">
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Update Campaign</Modal.Title>
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
                              defaultValue={formik.initialValues.name}
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
                          <span>Status:</span>
                          <div className="dropdown-active">
                            <select defaultValue={formik.initialValues.status} name='status' onChange={formik.handleChange}>
                              <option value='1'>Active</option>
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
                          <input type="datetime-local" name='start_time' className="start-time" id="time_start" defaultValue={formik.initialValues.start_time} onChange={formik.handleChange}></input>
                          {formik.errors.start_time && (
                            <p style={{ color: 'red' }}>
                              {formik.errors.start_time}
                            </p>
                          )}
                        </div>
                        <div className="form-modal-datetime">
                          <span>End Time: </span>
                          <input type="datetime-local" className="end-time" defaultValue={formik.initialValues.end_time}name='end_time' id="end_start" onChange={formik.handleChange} ></input>
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
                          <input type="text" name='budget' defaultValue={formik.initialValues.budget} placeholder="Budget" onChange={formik.handleChange} />
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
                          <input type="text" name='bid_amount' defaultValue={formik.initialValues.bid_amount} placeholder="Bid amount" onChange={formik.handleChange} />
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
                          <input type="text" placeholder="Title" defaultValue={formik.initialValues.title} onChange={formik.handleChange} name='title' />
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
                          <input type="text" placeholder="Description" defaultValue={formik.initialValues.description} onChange={formik.handleChange} name='description' />
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
                            <input accept="image/*" type="file" name="banner" 
                            onChange={e => {
                              let data = e.target.files;
                              let file = data[0];
                              if (file) {
                                let objectURL = URL.createObjectURL(file)
                                setPreviewBanner(objectURL)
                              }
                              
                              formik.setFieldValue("banner", e.target.files[0])
                            }} id="file-input" />
                            <div className='preview-banner' style={{ backgroundImage: `url(${previewBanner})` }} onClick={() => {
                              if (!previewBanner) return;
                              setIsOpenLightBox(true)
                            }}></div>
                            {formik.errors.banner && (
                              <p style={{ color: 'red'}}>
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
                          <input type="text" placeholder="Final URL" defaultValue={formik.initialValues.final_url} onChange={formik.handleChange} name='final_url' />
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
        {isOpenLightBox === true &&
          <Lightbox
            mainSrc={previewBanner}
            onCloseRequest={() => setIsOpenLightBox(false)}
          />}
      </form>
  );
}

export default ModalDefault


