import React from 'react'
import ReactPaginate from 'react-paginate'
import PropTypes from 'prop-types'
export default function Paginate({ forcePage, pageCount, pageRangeDisplayed, onPageChange }) {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="Next >"
      breakClassName="page-item"
      breakLinkClassName="btn btn-outline-info mx-1 btn-floating"
      containerClassName="pagination justify-content-center"
      pageClassName="page-item"
      pageLinkClassName="btn btn-outline-info mx-1 btn-floating"
      previousClassName="page-item"
      previousLinkClassName="btn btn-outline-info mx-1 btn-floating"
      nextClassName="page-item"
      nextLinkClassName="btn btn-outline-info mx-1 btn-floating"
      activeClassName="active"
      onPageChange={onPageChange}
      pageRangeDisplayed={pageRangeDisplayed}
      pageCount={pageCount}
      previousLabel="< Prev"
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
