import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilX, freeSet } from '@coreui/icons'
import { formatdate } from 'src/services/CommonFunctions'

const THEME_COLOR = '#00bfcc'
const cardStyle = {
  background: '#f8fafc',
  border: '1px solid #eef1f5',
  borderRadius: '14px',
  padding: '18px',
}

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
      <div style={{ color: '#1f2933', fontWeight: 600, marginTop: '4px' }}>{value || '-'}</div>
    </div>
  )
}

InfoTile.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

function renderIcon(condition) {
  return condition ? (
    <CIcon icon={cilCheck} style={{ color: '#1a9e54' }} />
  ) : (
    <CIcon icon={cilX} style={{ color: '#e03131' }} />
  )
}

export default function ShowRoles({ roleId }) {
  const [visible, setVisible] = useState(false)
  const [role, setRole] = useState({})
  const [privileges_data, setPrivileges_data] = useState({})
  const { get, response } = useFetch()

  useEffect(() => {
    if (visible) {
      getUserData()
    }
  }, [visible])

  async function getUserData() {
    const api = await get(`/v1/admin/roles/${roleId}`)
    if (response.ok && api?.data) {
      setRole(api.data)
      setPrivileges_data(api.data.privileges || {})
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
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CIcon icon={freeSet.cilPeople} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  Role Details
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  {role?.name || 'View role information'}
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px', maxHeight: '70vh', overflowY: 'auto' }}>
          <div style={cardStyle}>
            <SectionTitle>Information</SectionTitle>
            <Row className="g-3">
              <Col md={6}>
                <InfoTile label="Name" value={role?.name} />
              </Col>
              <Col md={6}>
                <InfoTile label="Description" value={role?.description} />
              </Col>
              <Col md={6}>
                <InfoTile label="Created At" value={formatdate(role?.created_at)} />
              </Col>
              <Col md={6}>
                <InfoTile label="Last Modified" value={formatdate(role?.updated_at)} />
              </Col>
            </Row>
          </div>

          <div style={{ ...cardStyle, marginTop: '16px' }}>
            <SectionTitle>Privileges</SectionTitle>
            <Row>
              {Object.entries(privileges_data).map(([outer_keys, outer_values]) => (
                <Col md={6} key={outer_keys}>
                  <div
                    style={{
                      border: '1px solid #eef1f5',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(0,191,204,0.08)',
                        padding: '10px 14px',
                        textTransform: 'capitalize',
                        color: THEME_COLOR,
                        fontWeight: 700,
                        fontSize: '13px',
                      }}
                    >
                      {outer_keys}
                    </div>
                    {Object.entries(outer_values).map(([inner_keys, inner_values]) => (
                      <div
                        key={inner_keys}
                        className="d-flex align-items-center justify-content-between"
                        style={{
                          padding: '10px 14px',
                          borderTop: '1px solid #f2f4f7',
                          textTransform: 'capitalize',
                          fontSize: '13px',
                        }}
                      >
                        <span>{inner_keys.replace(/_/g, ' ')}</span>
                        {renderIcon(inner_values)}
                      </div>
                    ))}
                  </div>
                </Col>
              ))}
            </Row>
          </div>

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

ShowRoles.propTypes = {
  roleId: PropTypes.number,
}
