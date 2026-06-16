import React, { useState, useEffect } from 'react'
import { useFetch } from 'use-http'
import { toast } from 'react-toastify'
import Loading from 'src/components/loading/loading'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { Dropdown } from 'react-bootstrap'
import { formatdate, status_color } from 'src/services/CommonFunctions'
import PropTypes from 'prop-types'
import AddManualInvoice from './AddInvoice'
import ShowInvoicePopup from './ShowInvoicePopup'
import ShowInvoices from 'src/views/finance/ShowInvoices'
import CheckPermissions from 'src/permissions/CheckPermissions'

const THEME_COLOR = '#00bfcc'

const INVOICE_STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: '1', label: 'Pending' },
  { value: '2', label: 'Due' },
  { value: '3', label: 'Paid' },
  { value: '4', label: 'Partial paid' },
  { value: '5', label: 'Cancelled' },
]

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

function invoiceStatusBadgeStyle(status) {
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

function periodLabel(invoice) {
  const from = formatdate(invoice?.period_from)
  const to = formatdate(invoice?.period_to)
  if (from && to) return `${from} – ${to}`
  return from || to || '-'
}

function amountLabel(invoice) {
  if (!invoice) return '-'
  return `${invoice.total_amount} (${invoice.amount} + ${invoice.vat_amount})`
}

export default function Invoice({ contract }) {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)
  const { propertyId, contractId } = useParams()
  const [searchInput, setSearchInput] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { get, response } = useFetch()

  useEffect(() => {
    loadManualInvoices()
  }, [propertyId, contractId, searchKeyword, statusFilter])

  async function loadManualInvoices() {
    setLoading(true)
    let endpoint = `/v1/admin/premises/properties/${propertyId}/allotments/${contractId}/invoices`
    const params = []

    if (searchKeyword?.trim()) {
      params.push(`q[number_cont]=${encodeURIComponent(searchKeyword.trim())}`)
    }
    if (statusFilter !== '') {
      params.push(`q[status_eq]=${statusFilter}`)
    }
    if (params.length) {
      endpoint += `?${params.join('&')}`
    }

    const manual_invoices = await get(endpoint)

    if (response.ok && manual_invoices?.data) {
      setInvoices(manual_invoices.data)
    } else {
      toast.error('We are facing a technical issue at our end.')
    }
    setLoading(false)
  }

  function applySearch(e) {
    e?.preventDefault()
    setSearchKeyword(searchInput.trim())
  }

  function handleSearchInputChange(e) {
    const value = e.target.value
    setSearchInput(value)
    if (value === '') {
      setSearchKeyword('')
    }
  }

  const statusLabel =
    INVOICE_STATUS_OPTIONS.find((option) => option.value === statusFilter)?.label || 'All statuses'

  return (
    <div style={{ ...cardStyle, marginTop: '16px' }}>
      <style>{`
        .contract-invoice-status-dropdown .dropdown-toggle::after { display: none; }
        .contract-invoices-table tbody tr { transition: background-color .15s ease; }
        .contract-invoices-table tbody tr:hover { background-color: #f5fdfe; }
      `}</style>

      <div
        className="d-flex justify-content-between align-items-center flex-wrap"
        style={{
          gap: '12px',
          padding: '20px 24px',
          overflow: 'visible',
          position: 'relative',
          zIndex: 2,
        }}
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
            <CIcon icon={freeSet.cilMoney} size="lg" />
          </div>
          <div>
            <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
              Invoices
            </h5>
            <small style={{ color: '#8a94a6' }}>{invoices.length} total</small>
          </div>
        </div>

        <div className="d-flex align-items-center flex-nowrap" style={{ gap: '10px' }}>
          <form
            className="d-flex align-items-center flex-nowrap"
            role="search"
            onSubmit={applySearch}
            style={{
              background: '#f5f7fb',
              borderRadius: '10px',
              padding: '2px 6px 2px 12px',
              flexShrink: 0,
            }}
          >
            <input
              value={searchInput}
              onChange={handleSearchInputChange}
              className="border-0"
              style={{ background: 'transparent', outline: 'none', width: '160px' }}
              type="search"
              placeholder="Search by invoice no"
              aria-label="Search"
            />
            <button
              className="btn d-flex align-items-center justify-content-center"
              type="submit"
              style={{
                background: THEME_COLOR,
                color: '#fff',
                borderRadius: '8px',
                width: '34px',
                height: '34px',
                flexShrink: 0,
              }}
            >
              <CIcon icon={freeSet.cilSearch} size="sm" />
            </button>
          </form>

          <Dropdown align="end" className="contract-invoice-status-dropdown">
            <Dropdown.Toggle
              as="button"
              type="button"
              className="btn d-flex align-items-center justify-content-between"
              style={{
                gap: '6px',
                background: statusFilter ? 'rgba(0,191,204,0.12)' : '#f5f7fb',
                color: statusFilter ? THEME_COLOR : '#495057',
                border: '1px solid #eef1f5',
                borderRadius: '10px',
                height: '38px',
                width: '130px',
                padding: '0 10px',
                fontWeight: 600,
                fontSize: '13px',
                flexShrink: 0,
              }}
            >
              <span className="text-truncate">{statusLabel}</span>
              <CIcon icon={freeSet.cilChevronBottom} size="sm" style={{ flexShrink: 0 }} />
            </Dropdown.Toggle>

            <Dropdown.Menu
              renderOnMount
              popperConfig={{ strategy: 'fixed' }}
              style={{
                minWidth: '130px',
                padding: '6px',
                border: '1px solid #eef1f5',
                borderRadius: '10px',
                boxShadow: '0 6px 24px rgba(0,0,0,.08)',
              }}
            >
              {INVOICE_STATUS_OPTIONS.map((option) => (
                <Dropdown.Item
                  key={option.value || 'all'}
                  active={statusFilter === option.value}
                  onClick={() => setStatusFilter(option.value)}
                  style={{
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: statusFilter === option.value ? 600 : 500,
                    color: statusFilter === option.value ? THEME_COLOR : '#495057',
                  }}
                >
                  {option.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {contract?.contract_type === 'allotment' ? (
            <div style={{ flexShrink: 0 }}>
              <CheckPermissions
                component={<AddManualInvoice after_submit={loadManualInvoices} />}
                keys={['invoice', 'create']}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="table-responsive">
        <table
          className="table contract-invoices-table mb-0"
          style={{ borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th style={headerCellStyle}>Invoice No.</th>
              <th style={headerCellStyle}>Total Amount</th>
              <th style={headerCellStyle}>Invoice Date</th>
              <th style={headerCellStyle}>Period</th>
              <th style={headerCellStyle}>Due Date</th>
              <th style={headerCellStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td style={bodyCellStyle}>
                  <ShowInvoicePopup
                    data={[{ header: 'Invoice', size: 'lg' }]}
                    component={
                      <button
                        type="button"
                        className="border-0 p-0 fw-semibold"
                        style={{ background: 'initial', color: THEME_COLOR }}
                        onClick={() => setSelectedInvoiceId(invoice.id)}
                      >
                        {invoice.number}
                      </button>
                    }
                    visible={selectedInvoiceId === invoice.id}
                    body={<ShowInvoices invoice_id={invoice.id} embedded />}
                    handleClose={() => setSelectedInvoiceId(null)}
                  />
                </td>
                <td style={bodyCellStyle}>{amountLabel(invoice)}</td>
                <td style={bodyCellStyle}>{formatdate(invoice?.invoice_date) || '-'}</td>
                <td style={bodyCellStyle}>{periodLabel(invoice)}</td>
                <td style={bodyCellStyle}>{formatdate(invoice?.due_date) || '-'}</td>
                <td style={bodyCellStyle}>
                  <span style={invoiceStatusBadgeStyle(invoice?.status)}>{invoice.status}</span>
                </td>
              </tr>
            ))}
            {!loading && invoices.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-secondary fst-italic"
                  style={{ padding: '32px' }}
                >
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && <Loading />}
      </div>
    </div>
  )
}

Invoice.propTypes = {
  after_submit: PropTypes.func,
  contract: PropTypes.object,
}
