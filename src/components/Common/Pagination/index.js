import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import { LIMIT_NUM_CAMPAIGN } from '../../../config/settingSystem';
const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
// export default function Paginate({ itemsPerPage }) {
//   const [itemOffset, setItemOffset] = useState(0);
//   const endOffset = itemOffset + itemsPerPage;
//   console.log(`Loading items from ${itemOffset} to ${endOffset}`);
//   const currentItems = items.slice(itemOffset, endOffset);
//   const pageCount = Math.ceil(items.length / itemsPerPage);

//   const handlePageClick = (event) => {
//     const newOffset = (event.selected * itemsPerPage) % items.length;
//     console.log(
//       `User requested page number ${event.selected}, which is offset ${newOffset}`
//     );
//     setItemOffset(newOffset);
//   };

//   return (
//     <>
//       <Items currentItems={currentItems} />
//       <ReactPaginate
//         breakLabel="..."
//         nextLabel="next >"
//         onPageChange={handlePageClick}
//         pageRangeDisplayed={5}
//         pageCount={pageCount}
//         previousLabel="< previous"
//         renderOnZeroPageCount={null}
//       />
//     </>
//   )
// }
export default function Paginate() {
  
  const totalRecords = useSelector((state) => state.campaign.totalRecords)
  const pageCount = Math.ceil(totalRecords / LIMIT_NUM_CAMPAIGN);
  const handlePageClick = (event) => {
    console.log(
      `User requested page number ${event.selected + 1}`
    );
  };

  return (
    <div className='container'>
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
  )
}