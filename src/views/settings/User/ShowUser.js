import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { formatdate } from 'src/services/CommonFunctions'

const THEME_COLOR = '#00bfcc'
const cardStyle = {
  background: '#f8fafc',
  border: '1px solid #eef1f5',
  borderRadius: '14px',
  padding: '18px',
}
const DEFAULT_AVATAR = 'https://bootdey.com/img/Content/avatar/avatar7.png'

function SectionTitle({ children }) {
  return (
    <div className="d-flex align-items-center mb-3" style={{ gap: '8px' }}>
      <span
        style={{ width: '4px', height: '18px', background: THEME_COLOR, borderRadius: '2px' }}
      />
      <h6 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
        {children}
      </h6>
    </div>
  )
}

SectionTitle.propTypes = {
  children: PropTypes.node,
}

function InfoTile({ label, value }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #eef1f5',
        borderRadius: '12px',
        padding: '14px 16px',
      }}
    >
      <small
        style={{
          color: '#8a94a6',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </small>
      <div style={{ color: '#1f2933', fontWeight: 600, marginTop: '4px' }}>{value ?? '-'}</div>
    </div>
  )
}

InfoTile.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

function statusBadgeStyle(active) {
  return {
    background: active ? '#e6f9ec' : '#fdeaea',
    color: active ? '#1a9e54' : '#e03131',
    padding: '4px 14px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    display: 'inline-block',
  }
}

export default function ShowUser({ userId }) {
  const [visible, setVisible] = useState(false)
  const [user, setUser] = useState({})
  const { get, response } = useFetch()

  useEffect(() => {
    if (visible) {
      getUserData()
    }
  }, [visible])

  async function getUserData() {
    const api = await get(`/v1/admin/users/${userId}`)
    if (response.ok && api?.data) {
      setUser(api.data)
    }
  }

  return (
    <>
      <button type="button" className="tooltip_button" onClick={() => setVisible(true)}>
        Show
      </button>

      <Modal
        show={visible}
        onHide={() => setVisible(false)}
        centered
        size="xl"
        backdrop="static"
        contentClassName="border-0 overflow-hidden rounded-4"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          style={{
            background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
            border: 'none',
            padding: '20px 24px',
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
          }}
        >
          <Modal.Title style={{ color: '#fff' }}>
            <div className="d-flex align-items-center" style={{ gap: '14px' }}>
              <img
                alt={user.name || 'User'}
                src={user.avatar || DEFAULT_AVATAR}
                style={{
                  width: '52px',
                  height: '52px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.4)',
                }}
              />
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  {user?.name || 'User Details'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  {user?.email || 'View user information'}
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px', maxHeight: '75vh', overflowY: 'auto' }}>
          <div style={cardStyle}>
            <SectionTitle>Account</SectionTitle>
            <Row className="g-3">
              <Col md={6}>
                <InfoTile label="Full Name" value={user?.name} />
              </Col>
              <Col md={6}>
                <InfoTile label="Email" value={user?.email} />
              </Col>
              <Col md={6}>
                <InfoTile label="Mobile Number" value={user?.mobile_number} />
              </Col>
              <Col md={6}>
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid #eef1f5',
                    borderRadius: '12px',
                    padding: '14px 16px',
                  }}
                >
                  <small
                    style={{
                      color: '#8a94a6',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Active Status
                  </small>
                  <div style={{ marginTop: '6px' }}>
                    <span style={statusBadgeStyle(user?.active)}>
                      {user?.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <InfoTile label="Role" value={user?.role?.name} />
              </Col>
              <Col md={6}>
                <InfoTile label="Created At" value={formatdate(user?.created_at)} />
              </Col>
              <Col md={6}>
                <InfoTile label="Last Modified" value={formatdate(user?.updated_at)} />
              </Col>
            </Row>
          </div>

          {user?.properties?.length > 0 && (
            <div style={{ ...cardStyle, marginTop: '16px' }}>
              <SectionTitle>Assigned Properties</SectionTitle>
              <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
                {user.properties.map((property) => (
                  <span
                    key={property.id}
                    style={{
                      background: 'rgba(0,191,204,0.12)',
                      color: THEME_COLOR,
                      padding: '6px 14px',
                      borderRadius: '999px',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {property.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Modal.Footer style={{ border: 'none', padding: '16px 0 0' }}>
            <Button
              variant="light"
              onClick={() => setVisible(false)}
              style={{ borderRadius: '8px', fontWeight: 600 }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

ShowUser.propTypes = {
  userId: PropTypes.number,
}
