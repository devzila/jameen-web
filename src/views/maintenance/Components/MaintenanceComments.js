import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { formatdate } from 'src/services/CommonFunctions'
import CommentForms from './Comment/CommentForms'
import { toast } from 'react-toastify'
import Loading from 'src/components/loading/loading'
import defaultAvatar from 'src/assets/images/avatars/default.png'
import { AuthContext } from 'src/contexts/AuthContext'

const THEME_COLOR = '#00bfcc'
const ACTOR_COLOR = '#6366f1'

const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,.05)',
  overflow: 'hidden',
}

function getCommenterName(comment) {
  const user = comment?.userable
  if (!user) return 'Unknown'
  if (user.name) return user.name
  return [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || 'Unknown'
}

function getCommenterAvatarSrc(comment) {
  const user = comment?.userable
  if (!user) return defaultAvatar
  const src = comment.userable_type === 'Actor' ? user.avatar_url : user.avatar
  if (typeof src === 'string' && src.trim() !== '') return src.trim()
  return defaultAvatar
}

function getCommenterInitials(name) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return (parts[0]?.[0] || '?').toUpperCase()
}

function isActorComment(comment) {
  return comment?.userable_type === 'Actor'
}

function canModifyComment(comment, loggedInUserId) {
  if (!comment || loggedInUserId == null) return false
  if (comment.userable_type !== 'Member') return false
  return Number(comment.userable?.id) === Number(loggedInUserId)
}

function commenterTypeStyle(isActor) {
  if (isActor) {
    return {
      label: 'Staff',
      color: ACTOR_COLOR,
      background: 'rgba(99,102,241,0.12)',
      avatarBorder: `2px solid ${ACTOR_COLOR}`,
      avatarRadius: '10px',
      avatarShadow: '0 0 0 3px rgba(99,102,241,0.15)',
      fallbackBg: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
    }
  }
  return {
    label: 'Member',
    color: THEME_COLOR,
    background: 'rgba(0,191,204,0.12)',
    avatarBorder: `2px solid ${THEME_COLOR}`,
    avatarRadius: '50%',
    avatarShadow: '0 0 0 3px rgba(0,191,204,0.15)',
    fallbackBg: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
  }
}

function CommentAuthorAvatar({ comment }) {
  const isActor = isActorComment(comment)
  const typeStyle = commenterTypeStyle(isActor)
  const name = getCommenterName(comment)
  const avatarSrc = getCommenterAvatarSrc(comment)
  const hasCustomAvatar = avatarSrc !== defaultAvatar

  return (
    <div className="flex-shrink-0" style={{ position: 'relative' }}>
      {hasCustomAvatar ? (
        <img
          src={avatarSrc}
          alt={name}
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'cover',
            borderRadius: typeStyle.avatarRadius,
            border: typeStyle.avatarBorder,
            boxShadow: typeStyle.avatarShadow,
          }}
        />
      ) : (
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: typeStyle.avatarRadius,
            border: typeStyle.avatarBorder,
            boxShadow: typeStyle.avatarShadow,
            background: typeStyle.fallbackBg,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          {getCommenterInitials(name)}
        </div>
      )}
      <span
        style={{
          position: 'absolute',
          bottom: '-4px',
          right: '-4px',
          width: '14px',
          height: '14px',
          borderRadius: isActor ? '4px' : '50%',
          background: typeStyle.color,
          border: '2px solid #fff',
        }}
        title={typeStyle.label}
      />
    </div>
  )
}

CommentAuthorAvatar.propTypes = {
  comment: PropTypes.shape({
    userable_type: PropTypes.string,
    userable: PropTypes.object,
  }),
}

function CommentItem({ comment, onEdit, onDelete, canModify }) {
  const isActor = isActorComment(comment)
  const typeStyle = commenterTypeStyle(isActor)
  const name = getCommenterName(comment)

  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #eef1f5',
        borderRadius: '12px',
        padding: '14px 16px',
      }}
    >
      <div className="d-flex" style={{ gap: '12px' }}>
        <CommentAuthorAvatar comment={comment} />
        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          <div
            className="d-flex align-items-center flex-wrap"
            style={{ gap: '8px', marginBottom: '6px' }}
          >
            <span style={{ fontWeight: 700, color: '#1f2933' }}>{name}</span>
            <span
              style={{
                background: typeStyle.background,
                color: typeStyle.color,
                padding: '2px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {typeStyle.label}
            </span>
            <small className="text-secondary fst-italic">{formatdate(comment.created_at)}</small>
          </div>
          <p className="mb-2" style={{ color: '#1f2933', lineHeight: 1.6 }}>
            {comment.comment}
          </p>
          {canModify ? (
            <div className="d-flex align-items-center flex-wrap" style={{ gap: '8px' }}>
              <button
                type="button"
                className="btn btn-link p-0"
                style={{ color: THEME_COLOR, fontWeight: 600, fontSize: '13px' }}
                onClick={() => onEdit(comment)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-link p-0"
                style={{ color: '#e03131', fontWeight: 600, fontSize: '13px' }}
                onClick={() => onDelete(comment.id)}
              >
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number,
    comment: PropTypes.string,
    created_at: PropTypes.string,
    userable_type: PropTypes.string,
    userable: PropTypes.object,
  }),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  canModify: PropTypes.bool,
}

export default function MaintenanceComments() {
  const { state } = useContext(AuthContext)
  const loggedInUserId = state?.user?.id

  const [data, setData] = useState([])
  const { get, response, del } = useFetch()
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const { propertyId, maintenanceid } = useParams()

  useEffect(() => {
    loadComments()
  }, [currentPage, maintenanceid])

  function handleEdit(comment) {
    if (!canModifyComment(comment, loggedInUserId)) return
    setEditing(comment.id)
  }

  async function loadComments() {
    setLoading(true)
    const endpoint = getApi()
    const api = await get(endpoint)

    if (response.ok) {
      setData(api.data || [])
      setPagination(api.pagination)
    }
    setLoading(false)
  }

  async function handleDelete(id) {
    const comment = data.find((item) => item.id === id)
    if (!canModifyComment(comment, loggedInUserId)) return

    await del(`/v1/admin/maintenance/requests/${maintenanceid}/comments/${id}`, {})
    if (response.ok) {
      toast.success('Comment deleted successfully.')
      handleRefreshCallback()
    }
  }

  function handleRefreshCallback() {
    setEditing(null)
    setCurrentPage(1)
    loadComments()
  }

  function handlePageClick() {
    if (currentPage < pagination?.total_pages) {
      setCurrentPage(currentPage + 1)
    }
  }

  function getApi() {
    if (propertyId) {
      return `/v1/admin/premises/properties/${propertyId}/requests/${maintenanceid}/comments?page=${currentPage}`
    }
    return `/v1/admin/maintenance/requests/${maintenanceid}/comments?page=${currentPage}`
  }

  return (
    <div style={{ ...cardStyle, marginTop: '16px' }}>
      <div
        className="d-flex justify-content-between align-items-center flex-wrap"
        style={{ gap: '12px', padding: '20px 24px' }}
      >
        <div className="d-flex align-items-center" style={{ gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(0,191,204,0.12)',
              color: THEME_COLOR,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CIcon icon={freeSet.cilCommentBubble} size="lg" />
          </div>
          <div>
            <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
              Comments
            </h5>
            <small style={{ color: '#8a94a6' }}>{data.length} total</small>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {loading && data.length === 0 ? (
          <Loading />
        ) : data.length > 0 ? (
          <div className="d-flex flex-column" style={{ gap: '12px' }}>
            {data.map((comment) => {
              const canModify = canModifyComment(comment, loggedInUserId)

              if (editing === comment.id && canModify) {
                return (
                  <div
                    key={`${comment.id}-edit`}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #eef1f5',
                      borderRadius: '12px',
                      padding: '14px',
                    }}
                  >
                    <CommentForms
                      refresh_callback={handleRefreshCallback}
                      id={comment.id}
                      close_edit_callback={() => setEditing(null)}
                    />
                  </div>
                )
              }

              return (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canModify={canModify}
                />
              )
            })}
          </div>
        ) : (
          <p className="text-center text-secondary fst-italic mb-0" style={{ padding: '24px' }}>
            No comments yet
          </p>
        )}

        {currentPage < pagination?.total_pages && pagination?.total_pages > 1 ? (
          <button
            type="button"
            className="btn w-100 mt-3"
            onClick={handlePageClick}
            style={{
              background: '#f5f7fb',
              color: '#495057',
              borderRadius: '10px',
              height: '40px',
              fontWeight: 600,
              border: '1px solid #eef1f5',
            }}
          >
            Load More
          </button>
        ) : null}

        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #f2f4f7',
          }}
        >
          <CommentForms refresh_callback={handleRefreshCallback} />
        </div>
      </div>
    </div>
  )
}
