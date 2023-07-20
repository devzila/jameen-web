import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'
import PropTypes from 'prop-types'

const Pagination = ({ current, pageCount }) => {
  const accommodatableLimit = 10
  const trailItemsCount = 2
  let trailingLabel = ''
  return (
    <CPagination aria-label="Page navigation example">
      {current > 1 && (
        <CPaginationItem aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </CPaginationItem>
      )}
      {[...Array(Math.min(pageCount, accommodatableLimit))].map((x, i) => (
        <CPaginationItem key={i} {...(i + 1 == current ? { active: true } : {})}>
          {i + 1}
        </CPaginationItem>
      ))}
      {pageCount > accommodatableLimit &&
        [...Array(Math.min(pageCount - accommodatableLimit, trailItemsCount + 1))].map((x, i) => (
          <CPaginationItem
            key={pageCount - trailItemsCount + i}
            {...(pageCount - trailItemsCount + i == current ? { active: true } : {})}
          >
            {pageCount - trailItemsCount + i}
          </CPaginationItem>
        ))}
      {current < pageCount && (
        <CPaginationItem aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </CPaginationItem>
      )}
    </CPagination>
  )
}
Pagination.propTypes = {
  path: PropTypes.string,
  current: PropTypes.number,
  pageCount: PropTypes.number,
}
export default Pagination
