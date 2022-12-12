import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import 'react-18-image-lightbox/style.css';
import { toast } from 'react-toastify'
import {  fetchAllCampaignPaginationAction} from '../../store/actions/campaignAction';
import {  BACKEND_DOMAIN_IMAGE, LIMIT_NUM_CAMPAIGN } from '../../config/settingSystem';
import ReactPaginate from 'react-paginate';
export default function Dashboard() {
  const [searchInfo, setSearchInfo] = useState({
    key_word: '',
    page_number: 1,
    start_time: '',
    end_time: '',
  })
  const typingTimeoutRef = useRef(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const listCampaign = useSelector((state) => state.campaign.listCampaign)
  const totalRecords = useSelector((state) => state.campaign.totalRecords)
  useEffect(() => {
    dispatch(fetchAllCampaignPaginationAction('', 1, '', '', navigate))
  }, [])
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
  
  const pageCount = Math.ceil(totalRecords / LIMIT_NUM_CAMPAIGN);
  const handlePageClick = (event) => {
    setSearchInfo({ ...searchInfo, page_number: event.selected + 1})
  };
  return (
    <>
      <div className="block">
        <div className="left">
          <div className="search-bar-dashboard">
            <input type="search" placeholder="Search" onInput={(e) => handleChangeSearchByKeyWord(e)} />
          </div>
        </div>
        <div className="right">
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
          pageCount={pageCount}  
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}  
          renderOnZeroPageCount={null}
          containerClassName={'pagination justify-content-center'} 
          pageClassName={'page-item'} 
          pageLinkClassName={'page-link'}  
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
          activeClassName={'active'}
        />
      </div>
    </>
  )
}



