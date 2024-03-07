import React from 'react'
import ReactPaginate from 'react-paginate'
import PropTypes from 'prop-types'
export default function Paginate({ forcePage, pageCount, pageRangeDisplayed, onPageChange }) {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">>>"
      breakClassName="page-item "
      breakLinkClassName="btn mx-1 "
      containerClassName=" d-flex align-items-end list-unstyled text-light  "
      pageClassName=" text-light custom_grey_button mx-1 "
      pageLinkClassName="btn mx-1 text-light  shadow-lg border-0 "
      previousClassName="page-item border-0"
      previousLinkClassName="btn text-dark border-0 "
      nextClassName="page-item  "
      nextLinkClassName="btn border-0  text-dark  "
      activeClassName=" custom_background_color text-light border-0"
      onPageChange={onPageChange}
      pageRangeDisplayed={pageRangeDisplayed}
      pageCount={pageCount}
      previousLabel="<<<"
      renderOnZeroPageCount={null}
      forcePage={forcePage}
    />
  )
}

Paginate.propTypes = {
  forcePage: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  pageRangeDisplayed: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}
// pageLinkClassName="page-link"
