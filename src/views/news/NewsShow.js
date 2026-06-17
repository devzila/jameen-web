import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatdate, status_color } from 'src/services/CommonFunctions'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import { Col, Row } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import ShowLeftBar from './show/ShowLeftBar'
import EditNews from './EditNews'
import ConfirmationPopup from '../shared/ConfirmationPopup'
import CheckPermissions from 'src/permissions/CheckPermissions'

const THEME_COLOR = '#00bfcc'

const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,.05)',
  overflow: 'hidden',
}

function statusBadgeStyle(status) {
  const palette = {
    red: { bg: '#fdeaea', color: '#e03131' },
    orange: { bg: '#fff4e6', color: '#e8590c' },
    green: { bg: '#e6f9ec', color: '#1a9e54' },
    gray: { bg: '#eef1f5', color: '#495057' },
  }
  const colors = palette[status_color(String(status).toLowerCase())] || palette.gray
  return {
    background: colors.bg,
    color: colors.color,
    padding: '4px 14px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'capitalize',
    display: 'inline-block',
  }
}

const actionBtnStyle = {
  borderRadius: '10px',
  height: '38px',
  fontWeight: 600,
  border: 'none',
  padding: '0 16px',
}

const heroHeaderRowStyle = { gap: '12px' }

export default function NewsShow() {
  const { postId } = useParams()
  const [data, setData] = useState({})
  const [edit, setEdit] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const navigate = useNavigate()
  const { get, put, del, response } = useFetch()

  useEffect(() => {
    fetchPost()
  }, [postId])

  async function fetchPost() {
    const endpoint = await get(`/v1/admin/posts/${postId}`)
    if (response.ok && endpoint?.data) {
      setData(endpoint.data)
    }
  }

  async function deletePost() {
    await del(`/v1/admin/posts/${postId}`)
    if (response.ok) {
      toast.success('Post deleted successfully')
      navigate('/news')
    } else {
      toast.error('Error occurred while deleting post')
    }
  }

  async function publishUnpublishPost(type) {
    await put(`/v1/admin/posts/${postId}/${type}`)
    if (response.ok) {
      toast.success('Post status updated')
      fetchPost()
    }
  }

  function callPublishUnpublish() {
    const request = data.status === 'draft' ? 'publish' : 'unpublish'
    publishUnpublishPost(request)
  }

  function handleEditToggle() {
    setEdit(!edit)
    if (edit) {
      fetchPost()
    }
  }

  async function handleDeleteComment(id) {
    await del(`/v1/admin/posts/${postId}/comments/${id}`)
    if (response.ok) {
      toast.success('Comment deleted successfully')
      fetchPost()
    }
  }

  const heroStatusStyle = {
    ...statusBadgeStyle(data?.status),
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
  }

  return (
    <div style={{ padding: '20px' }}>
      <div
        className="d-flex justify-content-end flex-wrap"
        style={{ gap: '10px', marginBottom: '16px' }}
      >
        {!edit && (
          <CheckPermissions
            component={
              <button
                type="button"
                className="btn d-flex align-items-center"
                onClick={handleEditToggle}
                style={{ ...actionBtnStyle, background: THEME_COLOR, color: '#fff', gap: '6px' }}
              >
                <CIcon icon={freeSet.cilPencil} size="sm" />
                Edit
              </button>
            }
            keys={['posts', 'edit']}
          />
        )}
        {!edit && (
          <CheckPermissions
            component={
              <button
                type="button"
                className="btn"
                onClick={callPublishUnpublish}
                style={{
                  ...actionBtnStyle,
                  background: 'rgba(0,191,204,0.12)',
                  color: THEME_COLOR,
                }}
              >
                {data.status === 'draft' ? 'Publish' : 'Unpublish'}
              </button>
            }
            keys={['posts', 'edit']}
          />
        )}
        <ConfirmationPopup
          sure_callback={deletePost}
          message={{
            header: 'Delete',
            body: 'Are you sure you want to delete this post?',
            button_name: 'Delete',
          }}
          button={
            <button
              type="button"
              className="btn"
              onClick={() => setDeleteVisible(true)}
              style={{ ...actionBtnStyle, background: '#e03131', color: '#fff' }}
            >
              Delete
            </button>
          }
          visible={deleteVisible}
          hide_show={() => setDeleteVisible(!deleteVisible)}
        />
      </div>

      <Row>
        <ShowLeftBar data={data} delete_comment={handleDeleteComment} />

        <Col md={9}>
          {edit ? (
            <CheckPermissions
              component={<EditNews data={data} callback={handleEditToggle} />}
              keys={['posts', 'edit']}
            />
          ) : (
            <div style={cardStyle}>
              <div
                style={{
                  background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
                  padding: '24px',
                  color: '#fff',
                }}
              >
                <div
                  className="d-flex justify-content-between align-items-start flex-wrap"
                  style={heroHeaderRowStyle}
                >
                  <div>
                    <h4 className="mb-2" style={{ fontWeight: 700 }}>
                      {data.title || 'News Post'}
                    </h4>
                    <small style={{ opacity: 0.9 }}>
                      {formatdate(data?.content?.created_at) || '-'}
                    </small>
                  </div>
                  <span style={heroStatusStyle}>{data?.status || '-'}</span>
                </div>
              </div>
              <div style={{ padding: '24px', minHeight: '50vh' }}>
                <p style={{ color: '#1f2933', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {data?.content?.body || '-'}
                </p>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  )
}
