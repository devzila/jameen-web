import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React from 'react'
import PropTypes from 'prop-types'
import { Col } from 'react-bootstrap'
import { formatdate, formatNumberCount } from 'src/services/CommonFunctions'

const THEME_COLOR = '#00bfcc'
const commentRowStyle = { gap: '8px' }

const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,.05)',
  padding: '18px',
  marginBottom: '16px',
}

function SectionHeader({ icon, title }) {
  return (
    <div className="d-flex align-items-center mb-3" style={{ gap: '10px' }}>
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '10px',
          background: 'rgba(0,191,204,0.12)',
          color: THEME_COLOR,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CIcon icon={icon} size="sm" />
      </div>
      <h6 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
        {title}
      </h6>
    </div>
  )
}

SectionHeader.propTypes = {
  icon: PropTypes.array,
  title: PropTypes.string,
}

export default function ShowLeftBar({ data, delete_comment }) {
  return (
    <Col md={3}>
      <div style={cardStyle}>
        <SectionHeader icon={freeSet.cilGraph} title="Stats" />
        <div className="d-flex align-items-center justify-content-around">
          <div className="text-center">
            <CIcon icon={freeSet.cilChart} style={{ color: THEME_COLOR }} />
            <div style={{ fontWeight: 700, color: '#1f2933', marginTop: '4px' }}>
              {formatNumberCount(data?.view_count) || 0}
            </div>
            <small style={{ color: '#8a94a6' }}>Views</small>
          </div>
          <div className="text-center">
            <CIcon icon={freeSet.cilHeart} style={{ color: THEME_COLOR }} />
            <div style={{ fontWeight: 700, color: '#1f2933', marginTop: '4px' }}>
              {formatNumberCount(data?.likes_count) || 0}
            </div>
            <small style={{ color: '#8a94a6' }}>Likes</small>
          </div>
          <div className="text-center">
            <CIcon icon={freeSet.cilCommentSquare} style={{ color: THEME_COLOR }} />
            <div style={{ fontWeight: 700, color: '#1f2933', marginTop: '4px' }}>
              {formatNumberCount(data?.comments?.length) || 0}
            </div>
            <small style={{ color: '#8a94a6' }}>Comments</small>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <SectionHeader icon={freeSet.cilTags} title="Tags" />
        <small className="text-secondary fst-italic">No tags found.</small>
      </div>

      <div style={cardStyle}>
        <SectionHeader icon={freeSet.cilLineStyle} title="Properties Tagged" />
        {data?.properties?.length > 0 ? (
          <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
            {data.properties.map((property) => (
              <span
                key={property.id}
                title={property?.name}
                style={{
                  background: 'rgba(0,191,204,0.12)',
                  color: THEME_COLOR,
                  padding: '6px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <CIcon icon={freeSet.cilBuilding} size="sm" className="me-1" />
                {property?.name?.slice(0, 40) || '-'}
              </span>
            ))}
          </div>
        ) : (
          <small className="text-secondary fst-italic">No properties tagged.</small>
        )}
      </div>

      <div style={cardStyle}>
        <SectionHeader icon={freeSet.cilCommentSquare} title="Comments" />
        <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
          {data?.comments?.length > 0 ? (
            data.comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  padding: '12px 0',
                  borderBottom: '1px solid #f2f4f7',
                }}
              >
                <div
                  className="d-flex justify-content-between align-items-start"
                  style={commentRowStyle}
                >
                  <p className="mb-1" style={{ color: '#1f2933', fontSize: '14px' }}>
                    {comment?.description || '-'}
                  </p>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-danger"
                    title="Delete comment"
                    onClick={() => delete_comment(comment.id)}
                  >
                    <CIcon icon={freeSet.cilTrash} size="sm" />
                  </button>
                </div>
                <small className="text-secondary fst-italic">
                  {[comment?.member?.first_name, comment?.member?.last_name]
                    .filter(Boolean)
                    .join(' ')}{' '}
                  • {formatdate(comment?.created_at)}
                </small>
              </div>
            ))
          ) : (
            <small className="text-secondary fst-italic">No comments found.</small>
          )}
        </div>
      </div>
    </Col>
  )
}

ShowLeftBar.propTypes = {
  data: PropTypes.object,
  delete_comment: PropTypes.func,
}
