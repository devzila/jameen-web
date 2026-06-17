import React, { useState, useEffect } from 'react'
import { useFetch } from 'use-http'
import { toast } from 'react-toastify'
import Paginate from '../../../components/Pagination'
import Loading from 'src/components/loading/loading'
import { Dropdown } from 'react-bootstrap'
import { NavLink, useParams } from 'react-router-dom'
import PickOwner from '../unit/UnitFunctions/PickOwner'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { formatdate, status_color } from 'src/services/CommonFunctions'

const THEME_COLOR = '#00bfcc'

const INVOICE_STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: '1', label: 'Pending' },
  { value: '2', label: 'Due' },
  { value: '3', label: 'Paid' },
  { value: '4', label: 'Partial paid' },
  { value: '5', label: 'Cancelled' },
]

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

export default function PropertyInvoices() {
  const [invoices, setInvoices] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)

  const { propertyId } = useParams()

  const [searchInput, setSearchInput] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { get, response } = useFetch()

  useEffect(() => {
    loadInitialinvoices()
  }, [currentPage, searchKeyword, statusFilter, propertyId])

  async function loadInitialinvoices() {
    setLoading(true)
    let endpoint = `/v1/admin/premises/properties/${propertyId}/invoices?page=${currentPage}`

    if (searchKeyword?.trim()) {
      endpoint += `&q[number_cont]=${encodeURIComponent(searchKeyword.trim())}`
    }
    if (statusFilter !== '') {
      endpoint += `&q[status_eq]=${statusFilter}`
    }

    const initial_invoices = await get(endpoint)

    if (response.ok && initial_invoices?.data) {
      setInvoices(initial_invoices.data)
      setPagination(initial_invoices.pagination)
      setErrors(false)
    } else {
      setErrors(true)
      toast.error('We are facing a technical issue at our end.')
    }
    setLoading(false)
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  function applySearch(e) {
    e?.preventDefault()
    setCurrentPage(1)
    setSearchKeyword(searchInput.trim())
  }

  function handleSearchInputChange(e) {
    const value = e.target.value
    setSearchInput(value)
    if (value === '') {
      setCurrentPage(1)
      setSearchKeyword('')
    }
  }

  function handleStatusFilterChange(value) {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const statusLabel =
    INVOICE_STATUS_OPTIONS.find((option) => option.value === statusFilter)?.label || 'All statuses'

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .property-invoice-status-dropdown .dropdown-toggle::after { display: none; }

        .property-invoice-table tbody tr { transition: background-color .15s ease; }
        .property-invoice-table tbody tr:hover { background-color: #f5fdfe; }

        .property-invoice-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .property-invoice-pagination .btn {
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
        .property-invoice-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .property-invoice-pagination .custom_background_color,
        .property-invoice-pagination .custom_background_color .btn {
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
              <CIcon icon={freeSet.cilDescription} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Invoices
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_entries ?? invoices.length} total
              </small>
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

            <Dropdown align="end" className="property-invoice-status-dropdown">
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
                    onClick={() => handleStatusFilterChange(option.value)}
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
          </div>
        </div>

        <div className="table-responsive">
          <table
            className="table property-invoice-table mb-0"
            style={{ borderCollapse: 'collapse' }}
          >
            <thead>
              <tr>
                <th style={headerCellStyle}>Invoice No.</th>
                <th style={headerCellStyle}>Unit No.</th>
                <th style={headerCellStyle}>Total Amount</th>
                <th style={headerCellStyle}>Owner/Resident</th>
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
                    <NavLink
                      to={`${invoice.id}`}
                      className="fw-semibold"
                      style={{ color: THEME_COLOR, textDecoration: 'none' }}
                    >
                      {invoice.number}
                    </NavLink>
                  </td>
                  <td style={bodyCellStyle}>
                    {invoice?.unit_contract?.unit?.unit_no || '-'}
                    {invoice?.unit_contract?.unit?.building?.name
                      ? ` (${invoice.unit_contract.unit.building.name})`
                      : ''}
                  </td>
                  <td style={bodyCellStyle}>{invoice?.total_amount || '-'}</td>
                  <td style={bodyCellStyle}>
                    {PickOwner(invoice?.unit_contract?.contract_members) || '-'}
                  </td>
                  <td style={bodyCellStyle}>{formatdate(invoice?.invoice_date) || '-'}</td>
                  <td style={bodyCellStyle}>{periodLabel(invoice)}</td>
                  <td style={bodyCellStyle}>{formatdate(invoice?.due_date) || '-'}</td>
                  <td style={bodyCellStyle}>
                    <span style={invoiceStatusBadgeStyle(invoice?.status)}>
                      {invoice?.status || '-'}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && invoices.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
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

        {pagination?.total_pages > 1 ? (
          <div
            className="property-invoice-pagination d-flex justify-content-center"
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
    </div>
  )
}
