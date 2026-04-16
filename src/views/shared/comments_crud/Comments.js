import { CCol, CCard, CRow } from '@coreui/react'
import React, { useState, useEffect, useId } from 'react'
import useFetch from 'use-http'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import PropTypes from 'prop-types'
import { formatdate } from 'src/services/CommonFunctions'
import { toast } from 'react-toastify'
import CommentForm from './CommentForm'

export default function Comments({ api }) {
  const [data, setData] = useState([])
  const { get, response, del } = useFetch()
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [editing, setEditing] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadComments()
  }, [currentPage])

  const handleEdit = (id) => {
    setEditing(id)
  }

  async function loadComments() {
    let res = await get(api)

    if (response.ok) {
      setLoading(false)
      setData(res.data)
      setPagination(res.pagination)
    } else {
      setLoading(false)
    }
  }
  async function handleDelete(id) {
    await del(api, {})
    if (response.ok) {
      toast.success('Comment deleted succesfully.')
      handleRefreshCallback()
    }
  }
  const handleRefreshCallback = () => {
    setData([])
    setCurrentPage(1)
    loadComments()
  }

  function handlePageClick(e) {
    if (currentPage <= pagination.total_pages) {
      setCurrentPage(currentPage + 1)
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
                  <CommentForm
                    refresh_callback={handleRefreshCallback}
                    id={comment.id}
                    close_edit_callback={() => handleEdit(null)}
                    api={api}
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
        <CommentForm refresh_callback={handleRefreshCallback} api={api} id={null} />
      </CCard>
    </>
  )
}

Comments.propTypes = {
  api: PropTypes.string,
}
