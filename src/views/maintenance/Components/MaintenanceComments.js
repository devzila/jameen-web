import { CCol, CCard, CNavbar, CRow, CCardText, CCardBody, CButton } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Paginate from 'src/components/Pagination'
import PropTypes from 'prop-types'
import { formatdate } from 'src/services/CommonFunctions'
import CommentForms from './Comment/CommentForms'

export default function MaintenanceComments() {
  const [data, setData] = useState([])
  const { get, response } = useFetch()
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const [loading, setLoading] = useState(true)

  const { propertyId, maintenanceid } = useParams()

  useEffect(() => {
    loadComments()
  }, [currentPage])

  async function loadComments() {
    let endpoint = getApi()
    let api = await get(endpoint)

    console.log(api)

    if (response.ok) {
      setLoading(false)
      setData([...api.data, ...data])
      setPagination(api.pagination)
    } else {
      setLoading(false)
    }
  }

  function handlePageClick(e) {
    if (currentPage <= pagination.total_pages) {
      setCurrentPage(currentPage + 1)
    }
  }

  function getApi() {
    if (propertyId) {
      const api = `/v1/admin/premises/properties/${propertyId}/requests/${maintenanceid}/comments?page=${currentPage}`
      return api
    } else {
      const api = `/v1/admin/maintenance/requests/${maintenanceid}/comments?page=${currentPage}`
      return api
    }
  }

  return (
    <>
      <CCard className=" p-3 my-2 border-0 ">
        <div className="d-flex w-100 ">
          <CIcon icon={freeSet.cilCommentBubble} size="lg" className="me-2 theme_color" />
          <strong className="text-black">Comments</strong>
        </div>

        <hr className="text-secondary" />
        <CRow className="">
          <CCol className=" mt-0 fw-light comment-section ">
            {data.map((comment) => (
              <span key={comment.id}>
                <p className="m-0 p-0"> {comment.comment}</p>
                <small className="fst-italic text-secondary">
                  {formatdate(comment.created_at)}
                </small>
                <hr className="p-0 m-0 text-secondary" />
              </span>
            ))}
          </CCol>
        </CRow>
        <CRow>
          <CCol md="12">
            {currentPage < pagination?.total_pages && pagination?.total_pages > 1 ? (
              <button
                type="button"
                className="tooltip_button w-100"
                data-mdb-ripple-init
                onClick={handlePageClick}
              >
                Load More
              </button>
            ) : (
              <br />
            )}
          </CCol>
        </CRow>
        <CommentForms refresh_callback={loadComments} />
      </CCard>
    </>
  )
}
