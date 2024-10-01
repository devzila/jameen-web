import { CCol, CCard, CNavbar, CRow, CCardText, CCardBody, CButton } from '@coreui/react'
import React, { useState, useEffect, useId } from 'react'
import useFetch from 'use-http'

import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Paginate from 'src/components/Pagination'
import PropTypes from 'prop-types'
import { formatdate } from 'src/services/CommonFunctions'
import CommentForms from './Comment/CommentForms'

import { toast } from 'react-toastify'

export default function MaintenanceComments() {
  const [data, setData] = useState([])
  const { get, response, del } = useFetch()
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [editing, setEditing] = useState(null)

  const [loading, setLoading] = useState(true)

  const { propertyId, maintenanceid } = useParams()

  useEffect(() => {
    loadComments()
  }, [])

  const handleEdit = (id) => {
    setEditing(id)
  }

  async function loadComments() {
    let endpoint = getApi()
    let api = await get(endpoint)
    console.log(api)

    if (response.ok) {
      setLoading(false)
      setData([...api.data])
      setPagination(api.pagination)
    } else {
      setLoading(false)
    }
  }
  async function handleDelete(id) {
    const api = await del(`/v1/admin/maintenance/requests/${maintenanceid}/comments/${id}`, {})
    if (response.ok) {
      toast.success('Comment deleted succesfully.')
      handleRefreshCallback()
    }
  }
  const handleRefreshCallback = () => {
    setData([])
    loadComments()
    setCurrentPage(1)
  }

  function handlePageClick(e) {
    if (currentPage <= pagination.total_pages) {
      setCurrentPage(currentPage + 1)
      setData([])
      loadComments()
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
          <CCol className=" mt-0  comment-section ">
            {data.map((comment) =>
              editing == comment.id ? (
                <span key={comment.id + 'edit'}>
                  <CommentForms
                    refresh_callback={handleRefreshCallback}
                    id={comment.id}
                    close_edit_callback={() => handleEdit(null)}
                  />
                </span>
              ) : (
                <span key={comment.id + 'index'}>
                  <p className="m-0 p-0"> {comment.comment}</p>
                  <div className="d-flex text-secondary align-items-center">
                    <small className="fst-italic text-secondary">
                      {formatdate(comment.created_at)}
                    </small>
                    <span className="px-1">⦁︎</span>
                    <p className="p-0 m-0 cursor-pointer" onClick={() => handleEdit(comment.id)}>
                      Edit
                    </p>
                    <span className="px-1">⦁︎</span>
                    <p className="p-0 m-0 cursor-pointer" onClick={() => handleDelete(comment.id)}>
                      Delete
                    </p>
                    <span className="px-1">⦁︎</span>
                  </div>

                  <hr className="p-0 m-0 text-secondary" />
                </span>
              ),
            )}
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
        <CommentForms refresh_callback={handleRefreshCallback} />
      </CCard>
    </>
  )
}
