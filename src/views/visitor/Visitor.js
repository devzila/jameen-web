import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { Modal, Form, Button } from 'react-bootstrap'

import { toast } from 'react-toastify'
import Paginate from '../../components/Pagination'

import Loading from 'src/components/loading/loading'

import AddVisitor from './AddVisitor'
import ShowVisitor from './ShowVisitor'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import CheckPermissions from 'src/permissions/CheckPermissions'

const THEME_COLOR = '#00bfcc'

function firstVisitorName(visit) {
  const first = Array.isArray(visit?.visitors) ? visit.visitors[0] : null
  if (first) {
    const fullName = [first.first_name, first.last_name].filter(Boolean).join(' ').trim()
    return first.name || fullName || '-'
  }
  return visit?.name || '-'
}

function unitLabel(visit) {
  const unitNo = visit?.unit_no ?? visit?.unit?.unit_no
  const buildingName = visit?.building_name ?? visit?.building?.name ?? visit?.unit?.building?.name
  if (unitNo && buildingName) return `${unitNo} (${buildingName})`
  return unitNo || buildingName || '-'
}

function formatDateTime(value) {
  if (!value) return '-'
  return String(value).replace('T', ' ').replace('Z', ' ').slice(0, 19)
}

function initials(name) {
  const parts = String(name).trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?'
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

const ROW_ACTIONS = [
  {
    key: 'checkin',
    label: 'Check In',
    icon: freeSet.cilCheckCircle,
    color: '#1a9e54',
    bg: '#e6f9ec',
  },
  {
    key: 'checkout',
    label: 'Check Out',
    icon: freeSet.cilExitToApp,
    color: '#1c7ed6',
    bg: '#e7f5ff',
  },
  {
    key: 'cancel',
    label: 'Cancel',
    icon: freeSet.cilXCircle,
    color: '#e03131',
    bg: '#fdeaea',
  },
]

function isActionApplicable(actionKey, status) {
  const s = String(status || '')
    .toLowerCase()
    .replace(/[\s-]/g, '_')

  switch (actionKey) {
    case 'checkin':
      // can check in only while the visit is still upcoming/approved
      return ['requested', 'approved', 'pending', 'expected'].includes(s)
    case 'checkout':
      // can check out only once the visitor has checked in
      return ['checked_in', 'checkedin', 'arrived', 'in'].includes(s)
    case 'cancel':
      // can cancel unless it is already finished or cancelled
      return !['cancelled', 'canceled', 'checked_out', 'checkedout', 'completed', 'left'].includes(
        s,
      )
    default:
      return true
  }
}

const headerCellStyle = {
  color: '#8a94a6',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  borderBottom: '1px solid #eef1f5',
  padding: '14px 16px',
  whiteSpace: 'nowrap',
}

const bodyCellStyle = {
  padding: '14px 16px',
  borderBottom: '1px solid #f2f4f7',
  color: '#1f2933',
  verticalAlign: 'middle',
}

export default function Visitor() {
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const [visitor, setVisitor] = useState([])

  const [searchKeyword, setSearchKeyword] = useState(null)

  const [cancelVisit, setCancelVisit] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  const { get, put, response } = useFetch()

  async function loadInitialVisitor() {
    let endpoint = `/v1/admin/visits?page=${currentPage}`

    if (searchKeyword) {
      endpoint += `&q[name_cont]=${searchKeyword}&q[or][email_cont]=${searchKeyword}&q[or][phone_number_cont]=${searchKeyword}`
    }
    let initialVisitor = await get(endpoint)

    if (response.ok) {
      if (initialVisitor.data) {
        setLoading(false)
        setVisitor(initialVisitor.data)
        setPagination(initialVisitor.pagination)
      }
    } else {
      toast('We are facing a technical issue at our end.')
      setLoading(false)
    }
  }
  useEffect(() => {
    loadInitialVisitor()
  }, [currentPage])

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  function handleRowAction(actionKey, visit) {
    if (actionKey === 'cancel') {
      setCancelVisit(visit)
      setCancelReason('')
      return
    }
    if (actionKey === 'checkin') {
      handleStatusChange(
        visit,
        2,
        'Visitor checked in successfully.',
        'Unable to check in the visitor. Please try again.',
      )
      return
    }
    if (actionKey === 'checkout') {
      handleStatusChange(
        visit,
        3,
        'Visitor checked out successfully.',
        'Unable to check out the visitor. Please try again.',
      )
      return
    }
    toast(`"${actionKey}" action for visit #${visit.id} will be available soon.`)
  }

  async function handleStatusChange(visit, status, successMsg, errorMsg) {
    await put(`/v1/admin/visits/${visit.id}`, {
      visit: {
        status,
      },
    })

    if (response.ok) {
      toast.success(successMsg)
      loadInitialVisitor()
    } else {
      toast.error(errorMsg)
    }
  }

  async function submitCancellation() {
    if (!cancelVisit) return
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation.')
      return
    }

    setCancelling(true)
    await put(`/v1/admin/visits/${cancelVisit.id}`, {
      visit: {
        status: 4,
        reason_of_cancellation: cancelReason.trim(),
      },
    })
    setCancelling(false)

    if (response.ok) {
      toast.success('Visit cancelled successfully.')
      setCancelVisit(null)
      setCancelReason('')
      loadInitialVisitor()
    } else {
      toast.error('Unable to cancel the visit. Please try again.')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .visitor-table tbody tr { transition: background-color .15s ease; }
        .visitor-table tbody tr:hover { background-color: #f5fdfe; }

        .action-pill { transition: filter .15s ease, transform .15s ease; cursor: pointer; }
        .action-pill:hover { filter: brightness(0.95); transform: translateY(-1px); }
        .action-pill:active { transform: translateY(0); }

        .visitor-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .visitor-pagination .btn {
          box-shadow: none !important;
          border: 1px solid #eef1f5 !important;
          border-radius: 8px !important;
          background: #fff;
          color: #495057;
          min-width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
          margin: 0 !important;
          transition: all .15s ease;
        }
        .visitor-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .visitor-pagination .custom_background_color,
        .visitor-pagination .custom_background_color .btn {
          background: ${THEME_COLOR} !important;
          border-color: ${THEME_COLOR} !important;
          color: #fff !important;
        }
      `}</style>

      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,.05)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
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
              <CIcon icon={freeSet.cilPeople} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Visits
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_entries ?? visitor.length} total
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center" style={{ gap: '10px' }}>
            <div
              className="d-flex align-items-center"
              style={{
                background: '#f5f7fb',
                borderRadius: '10px',
                padding: '2px 6px 2px 12px',
              }}
            >
              <input
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadInitialVisitor()}
                className="border-0"
                style={{ background: 'transparent', outline: 'none', minWidth: '180px' }}
                type="search"
                placeholder="Search by name, email, phone"
                aria-label="Search"
              />
              <button
                onClick={loadInitialVisitor}
                className="btn d-flex align-items-center justify-content-center"
                type="button"
                style={{
                  background: THEME_COLOR,
                  color: '#fff',
                  borderRadius: '8px',
                  width: '34px',
                  height: '34px',
                }}
              >
                <CIcon icon={freeSet.cilSearch} size="sm" />
              </button>
            </div>

            <CheckPermissions
              component={<AddVisitor after_submit={loadInitialVisitor} />}
              keys={['visitor', 'create']}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table visitor-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Visitor Name</th>
                <th style={headerCellStyle}>Unit No.</th>
                <th style={headerCellStyle}>Vehicle Number</th>
                <th style={headerCellStyle}>No. of Visitors</th>
                <th style={headerCellStyle}>Purpose</th>
                <th style={headerCellStyle}>Expected Arrival Time</th>
                <th style={headerCellStyle}>Status</th>
                <th style={{ ...headerCellStyle, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visitor?.map((visit) => {
                const name = firstVisitorName(visit)
                return (
                  <tr key={visit.id}>
                    <td style={bodyCellStyle}>
                      <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(0,191,204,0.15)',
                            color: THEME_COLOR,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '13px',
                            flexShrink: 0,
                          }}
                        >
                          {initials(name)}
                        </div>
                        <ShowVisitor visit={visit} label={name} />
                      </div>
                    </td>
                    <td style={bodyCellStyle}>{unitLabel(visit)}</td>
                    <td style={bodyCellStyle}>{visit.vehicle_number || '-'}</td>
                    <td style={bodyCellStyle}>{visit.no_of_visitors ?? '-'}</td>
                    <td style={bodyCellStyle}>{visit.purpose || '-'}</td>
                    <td style={bodyCellStyle}>{formatDateTime(visit.expected_arrival_time)}</td>
                    <td style={bodyCellStyle}>
                      <span style={statusBadgeStyle(visit.status)}>{visit.status || '-'}</span>
                    </td>
                    <td style={bodyCellStyle}>
                      {(() => {
                        const actions = ROW_ACTIONS.filter((action) =>
                          isActionApplicable(action.key, visit.status),
                        )
                        if (actions.length === 0) {
                          return <span style={{ color: '#b0b8c4' }}>-</span>
                        }
                        return (
                          <div className="d-flex justify-content-center" style={{ gap: '6px' }}>
                            {actions.map((action) => (
                              <button
                                key={action.key}
                                type="button"
                                title={action.label}
                                onClick={() => handleRowAction(action.key, visit)}
                                className="d-inline-flex align-items-center action-pill"
                                style={{
                                  gap: '5px',
                                  border: 'none',
                                  background: action.bg,
                                  color: action.color,
                                  borderRadius: '8px',
                                  padding: '6px 10px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <CIcon icon={action.icon} size="sm" />
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )
                      })()}
                    </td>
                  </tr>
                )
              })}
              {!loading && visitor?.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No visitors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && <Loading />}
        </div>

        {/* Pagination */}
        {pagination ? (
          <div
            className="visitor-pagination d-flex justify-content-center"
            style={{ padding: '16px', borderTop: '1px solid #f2f4f7' }}
          >
            <Paginate
              onPageChange={handlePageClick}
              pageRangeDisplayed={pagination.per_page}
              pageCount={pagination.total_pages}
              forcePage={currentPage - 1}
            />
          </div>
        ) : null}
      </div>

      <Modal
        show={!!cancelVisit}
        onHide={() => (cancelling ? null : setCancelVisit(null))}
        centered
        contentClassName="border-0 overflow-hidden rounded-4"
      >
        <div>
          <Modal.Header
            closeButton
            closeVariant="white"
            style={{
              background: `linear-gradient(135deg, #e03131 0%, #c92a2a 100%)`,
              border: 'none',
              padding: '18px 22px',
              borderTopLeftRadius: 'inherit',
              borderTopRightRadius: 'inherit',
            }}
          >
            <Modal.Title style={{ color: '#fff' }}>
              <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CIcon icon={freeSet.cilXCircle} size="lg" />
                </div>
                <div className="d-flex flex-column">
                  <span style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.2 }}>
                    Cancel Visit
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                    {firstVisitorName(cancelVisit || {})} · {unitLabel(cancelVisit || {})}
                  </span>
                </div>
              </div>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ padding: '22px' }}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 600, color: '#1f2933' }}>
                Reason of cancellation <span style={{ color: '#e03131' }}>*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Phone call"
                autoFocus
                style={{ borderRadius: '10px', resize: 'none' }}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer style={{ border: 'none', padding: '0 22px 22px' }}>
            <Button
              variant="light"
              onClick={() => setCancelVisit(null)}
              disabled={cancelling}
              style={{ borderRadius: '8px', fontWeight: 600 }}
            >
              Close
            </Button>
            <Button
              onClick={submitCancellation}
              disabled={cancelling}
              style={{
                background: '#e03131',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              {cancelling ? 'Cancelling…' : 'Confirm Cancellation'}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  )
}
