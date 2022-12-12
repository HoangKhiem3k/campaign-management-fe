import React from 'react'
import { useSelector } from 'react-redux';
import LoaderGif from '../../../assets/images/loader2.gif'
import './Loadding.css'
export default function Loading() {
  const isLoading = useSelector((state) => state.loader.isLoading);
  return (
    <div className={isLoading === true ? 'loader-container' : 'loader-container hide-loading'}>
      <div className='loader'>
        <img src={LoaderGif} alt="loading..." />
      </div>
    </div>
  )
}



