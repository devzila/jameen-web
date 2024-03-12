import React from 'react'
import ReactPaginate from 'react-paginate'
import PropTypes from 'prop-types'
export default function Paginate({ forcePage, pageCount, pageRangeDisplayed, onPageChange }) {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      breakClassName="btn"
      breakLinkClassName="btn mx-1 "
      containerClassName="d-flex list-unstyled "
      pageClassName=" mx-1 "
      pageLinkClassName="btn mx-1 text-dark rounded-1 shadow-lg border-0 "
      previousClassName="  border-0"
      previousLinkClassName="btn text-dark border-0 "
      nextClassName=""
      nextLinkClassName="btn border-0  text-dark "
      activeClassName=" custom_background_color rounded-1 text-white border-0"
      onPageChange={onPageChange}
      pageRangeDisplayed={pageRangeDisplayed}
      pageCount={pageCount}
      previousLabel="<"
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
