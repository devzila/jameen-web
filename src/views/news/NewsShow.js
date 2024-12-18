import { CCard, CRow, CCol } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatdate } from 'src/services/CommonFunctions'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import ShowLeftBar from './show/ShowLeftBar'
import EditNews from './EditNews'
import ConfirmationPopup from '../shared/ConfirmationPopup'

function NewsShow() {
  const { postId } = useParams()
  const [data, setData] = useState({})
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    fetchPost()
  }, [])
  const { get, put, post, del, response } = useFetch()

  const fetchPost = async () => {
    const endpoint = await get(`v1/admin/posts/${postId}`)

    if (response.ok) {
      setData(endpoint.data)
    }
  }
  const deletePost = async () => {
    const endpoint = await del(`v1/admin/posts/${postId}`)
    if (response.ok) {
      toast.success('Post is deleted.')
      navigate('/news')
    } else {
      toast.success('Error occured while deleting post.')
    }
  }

  const publishUnpublishPost = async (type) => {
    const endpoint = await put(`v1/admin/posts/${postId}/${type}`)

    if (response.ok) {
      toast.success('Post status updated.')
      fetchPost()
    }
  }

  const callPublishUnpublish = (type) => {
    const request = type == 'draft' ? 'publish' : 'unpublish'
    publishUnpublishPost(request)
  }

  const handleEditSavePost = async (type) => {
    setEdit(!edit)
    fetchPost()
  }

  async function handleDeleteComment(id) {
    await del(`/v1/admin/posts/${postId}/comments/${id}`, {})
    if (response.ok) {
      toast.success('Comment deleted succesfully.')
      fetchPost()
    }
  }

  return (
    <>
      <div className="d-flex justify-content-end" style={{ overflow: 'hidden' }}>
        {edit ? (
          ''
        ) : (
          <button className="btn custom_theme_button" onClick={handleEditSavePost}>
            Edit
          </button>
        )}
        {edit ? (
          ''
        ) : (
          <button
            className="btn custom_theme_button"
            onClick={() => callPublishUnpublish(data.status)}
          >
            {data.status == 'draft' ? 'Publish' : 'Unpublish'}
          </button>
        )}
        <ConfirmationPopup
          sure_callback={deletePost}
          message={{
            header: 'Delete',
            body: 'Are you sure want to delete this post?',
            button_name: 'Delete',
          }}
          button={
            <button className="btn custom_red_button" onClick={() => setDeleteVisible(true)}>
              Delete
            </button>
          }
          visible={deleteVisible}
          hide_show={() => setDeleteVisible(!deleteVisible)}
        />
      </div>
      <CRow>
        <ShowLeftBar data={data} delete_comment={handleDeleteComment} />

        <CCol md="9">
          {edit ? (
            <EditNews data={data} callback={handleEditSavePost} />
          ) : (
            <CCard className="my-3 rounded-0 bg-white border-0 p-3">
              <div>
                <div>
                  <h3 className="theme_color p-0 m-0">{data.title}</h3>
                  <div className="d-flex justify-content-end">
                    <small className="fst-italic text-secondary">
                      {formatdate(data?.content?.created_at)}
                    </small>
                  </div>
                </div>
                <hr className="text-seocndary" />
                <div style={{ minHeight: '60vh' }}>
                  <p>{data?.content?.body}</p>
                </div>
              </div>
            </CCard>
          )}
        </CCol>
      </CRow>
    </>
  )
}
export default NewsShow
