import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate } from 'react-router-dom'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { formatdate, status_color } from 'src/services/CommonFunctions'

const THEME_COLOR = '#00bfcc'

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

const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,.05)',
  overflow: 'hidden',
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

function InfoTile({ label, value }) {
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
      <div style={{ fontWeight: 600, color: '#1f2933' }}>{value || '-'}</div>
    </div>
  )
}

InfoTile.propTypes = {
  label: PropTypes.node,
  value: PropTypes.node,
}

const ShowPayment = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)

  const { get, response } = useFetch()

  useEffect(() => {
    loadPayment()
  }, [id])

  async function loadPayment() {
    setLoading(true)

    const result = await get(`/v1/admin/payments/${id}`)

    if (response.ok) {
      setPayment(result?.data || result)
    } else {
      toast.error('Unable to load payment details')
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" style={{ color: THEME_COLOR }} />
      </div>
    )
  }

  const allocations = payment?.allocations || []

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .payment-detail-table tbody tr { transition: background-color .15s ease; }
        .payment-detail-table tbody tr:hover { background-color: #f5fdfe; }
      `}</style>

      {/* Hero */}
      <div
        style={{
          ...cardStyle,
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div className="d-flex align-items-center" style={{ gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CIcon icon={freeSet.cilMoney} size="xl" />
          </div>
          <div>
            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
              <h4 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Payment #{payment?.id}
              </h4>
              <span style={statusBadgeStyle(payment?.status)}>{payment?.status || '-'}</span>
            </div>
            <div style={{ color: '#8a94a6', marginTop: '4px' }}>
              {payment?.amount ? `₹ ${payment.amount}` : '-'}
              {payment?.payment_type ? ` · ${payment.payment_type}` : ''}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/finance/payments')}
          className="btn d-flex align-items-center"
          style={{
            gap: '6px',
            background: '#f5f7fb',
            color: '#495057',
            border: 'none',
            borderRadius: '10px',
            height: '40px',
            fontWeight: 600,
          }}
        >
          <CIcon icon={freeSet.cilArrowLeft} size="sm" />
          Back
        </button>
      </div>

      {/* Details */}
      <div style={{ ...cardStyle, padding: '24px', marginTop: '16px' }}>
        <h6
          style={{
            fontWeight: 700,
            color: '#1f2933',
            marginBottom: '16px',
            borderLeft: `3px solid ${THEME_COLOR}`,
            paddingLeft: '10px',
          }}
        >
          Payment Information
        </h6>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
          }}
        >
          <InfoTile label="Payment ID" value={payment?.id} />
          <InfoTile label="Amount" value={payment?.amount ? `₹ ${payment.amount}` : '-'} />
          <InfoTile label="Status" value={payment?.status} />
          <InfoTile label="Type" value={payment?.payment_type} />
          <InfoTile
            label="Payment Date"
            value={payment?.payment_date ? formatdate(payment.payment_date) : '-'}
          />
          <InfoTile
            label="Received On"
            value={payment?.received_on ? formatdate(payment.received_on) : '-'}
          />
          <InfoTile
            label="Created At"
            value={payment?.created_at ? formatdate(payment.created_at) : '-'}
          />
          <InfoTile label="Created By" value={payment?.created_by?.name || payment?.created_by} />
        </div>
      </div>

      {/* Allocations */}
      <div style={{ ...cardStyle, marginTop: '16px' }}>
        <div style={{ padding: '20px 24px' }}>
          <h6
            className="mb-0"
            style={{
              fontWeight: 700,
              color: '#1f2933',
              borderLeft: `3px solid ${THEME_COLOR}`,
              paddingLeft: '10px',
            }}
          >
            Allocations
          </h6>
        </div>

        <div className="table-responsive">
          <table className="table payment-detail-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>#</th>
                <th style={headerCellStyle}>Invoice No</th>
                <th style={headerCellStyle}>Unit No</th>
                <th style={headerCellStyle}>Allocated Amount</th>
                <th style={headerCellStyle}>Invoice Date</th>
                <th style={headerCellStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((allocation, index) => (
                <tr key={allocation.id}>
                  <td style={bodyCellStyle}>{index + 1}</td>
                  <td style={bodyCellStyle}>{allocation.invoice?.number || '-'}</td>
                  <td style={bodyCellStyle}>
                    {allocation.invoice?.unit_contract?.unit?.unit_no || '-'}
                  </td>
                  <td style={bodyCellStyle}>{allocation.allocated_amount || '-'}</td>
                  <td style={bodyCellStyle}>
                    {allocation.invoice?.invoice_date
                      ? formatdate(allocation.invoice.invoice_date)
                      : '-'}
                  </td>
                  <td style={bodyCellStyle}>
                    <span style={statusBadgeStyle(allocation.invoice?.status)}>
                      {allocation.invoice?.status || '-'}
                    </span>
                  </td>
                </tr>
              ))}
              {allocations.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No allocations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ShowPayment
