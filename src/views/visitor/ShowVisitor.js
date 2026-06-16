import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col } from 'react-bootstrap'

const THEME_COLOR = '#00bfcc'

function formatDateTime(value) {
  if (!value) return '-'
  return String(value).replace('T', ' ').replace('Z', ' ').slice(0, 19)
}

function visitorFullName(v) {
  if (!v) return '-'
  const fullName = [v.first_name, v.last_name].filter(Boolean).join(' ').trim()
  return v.name || fullName || '-'
}

function unitLabel(visit) {
  const unitNo = visit?.unit_no ?? visit?.unit?.unit_no
  const buildingName = visit?.building_name ?? visit?.building?.name ?? visit?.unit?.building?.name
  if (unitNo && buildingName) return `${unitNo} (${buildingName})`
  return unitNo || buildingName || '-'
}

function statusBadgeStyle(status) {
  const palette = {
    approved: { bg: '#e6f9ec', color: '#1a9e54' },
    requested: { bg: '#e7f5ff', color: '#1c7ed6' },
    cancelled: { bg: '#fdeaea', color: '#e03131' },
  }
  const colors = palette[String(status).toLowerCase()] || { bg: '#eef1f5', color: '#495057' }
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

function initials(name) {
  const parts = String(name).trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?'
}

function renderInfo(label, value) {
  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #eef1f5',
        borderRadius: '12px',
        padding: '14px 16px',
        height: '100%',
      }}
    >
      <div
        style={{
          color: '#8a94a6',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      <div style={{ fontWeight: 600, color: '#1f2933' }}>{value}</div>
    </div>
  )
}

export default function ShowVisitor({ visit, label }) {
  const [visible, setVisible] = useState(false)

  if (!visit) return null

  const visitors = Array.isArray(visit.visitors) ? visit.visitors : []
  const primaryName = label || visitorFullName(visitors[0]) || visit.name || '-'

  return (
    <>
      <button
        type="button"
        className="theme_color border-0 p-0 fw-semibold"
        style={{ background: 'initial' }}
        onClick={() => setVisible(true)}
      >
        {primaryName}
      </button>

      <Modal
        show={visible}
        onHide={() => setVisible(false)}
        centered
        size="lg"
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
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.25)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                {initials(primaryName)}
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  {primaryName}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  Visit Details
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ background: '#ffffff', padding: '24px' }}>
          <Row className="g-3">
            <Col md={4}>{renderInfo('Unit', unitLabel(visit))}</Col>
            <Col md={4}>{renderInfo('Vehicle Number', visit.vehicle_number || '-')}</Col>
            <Col md={4}>
              {renderInfo('No. of Visitors', visit.no_of_visitors ?? visitors.length ?? '-')}
            </Col>
            <Col md={4}>{renderInfo('Purpose', visit.purpose || '-')}</Col>
            <Col md={4}>
              {renderInfo('Expected Arrival Time', formatDateTime(visit.expected_arrival_time))}
            </Col>
            <Col md={4}>
              {renderInfo(
                'Status',
                <span style={statusBadgeStyle(visit.status)}>{visit.status || '-'}</span>,
              )}
            </Col>
            {String(visit.status).toLowerCase() === 'cancelled' && (
              <Col md={12}>
                {renderInfo('Reason of Cancellation', visit.reason_of_cancellation || '-')}
              </Col>
            )}
          </Row>

          <div className="d-flex align-items-center mt-4 mb-3" style={{ gap: '8px' }}>
            <span
              style={{ width: '4px', height: '18px', background: THEME_COLOR, borderRadius: '2px' }}
            />
            <h6 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
              Visitors ({visitors.length})
            </h6>
          </div>

          {visitors.length > 0 ? (
            <div className="d-flex flex-column" style={{ gap: '10px' }}>
              {visitors.map((v, idx) => (
                <div
                  key={v.id ?? idx}
                  className="d-flex align-items-center"
                  style={{
                    gap: '12px',
                    padding: '12px 14px',
                    border: '1px solid #eef1f5',
                    borderRadius: '12px',
                    background: '#fff',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(0,191,204,0.15)',
                      color: THEME_COLOR,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {initials(visitorFullName(v))}
                  </div>
                  <div className="flex-grow-1">
                    <div style={{ fontWeight: 600, color: '#1f2933' }}>{visitorFullName(v)}</div>
                    <div style={{ fontSize: '13px', color: '#8a94a6' }}>
                      <span className="me-3">{v.phone_number || v.mobile_number || '-'}</span>
                      <span>{v.email || '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary fst-italic mb-0">No visitor details available.</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

ShowVisitor.propTypes = {
  visit: PropTypes.object,
  label: PropTypes.string,
}
