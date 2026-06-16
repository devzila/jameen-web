import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import { Dropdown, Form } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { cilSync } from '@coreui/icons'
import { freeSet } from '@coreui/icons'
import Paginate from '../../components/Pagination'
import Loading from 'src/components/loading/loading'
import { formatdate, status_color } from 'src/services/CommonFunctions'
import { NavLink } from 'react-router-dom'

const THEME_COLOR = '#00bfcc'

function paymentStatusBadgeStyle(status) {
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

function allotmentLabel(payment) {
  const unit = payment?.allocations?.[0]?.invoice?.unit_contract?.unit
  const unitNo = unit?.unit_no
  const buildingName = unit?.building?.name
  if (unitNo && buildingName) return `${unitNo} (${buildingName})`
  return unitNo || buildingName || '-'
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

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [propertyFilter, setPropertyFilter] = useState('')
  const [contractFilter, setContractFilter] = useState('')
  const [properties, setProperties] = useState([])
  const [contracts, setContracts] = useState([])

  const { get, response } = useFetch()

  const resetFilters = () => {
    setStatusFilter('')
    setPropertyFilter('')
    setContractFilter('')
    setContracts([])
    setCurrentPage(1)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      loadPayments()
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPayments()
    }, 300)

    return () => clearTimeout(timer)
  }, [currentPage, statusFilter, propertyFilter, contractFilter, searchKeyword])

  useEffect(() => {
    loadProperties()
  }, [])

  const handleInputChange = (event) => {
    setSearchKeyword(event.target.value)
    setCurrentPage(1)
  }

  async function loadProperties() {
    const result = await get('/v1/admin/premises/properties')

    if (response.ok) {
      setProperties(result?.data || result || [])
    }
  }

  async function loadPayments() {
    setLoading(true)

    let endpoint = `/v1/admin/payments?page=${currentPage}`

    if (searchKeyword) {
      endpoint += `&q[id_eq]=${searchKeyword}`
    }

    if (statusFilter) {
      endpoint += `&q[status_eq]=${statusFilter}`
    }

    if (propertyFilter) {
      endpoint += `&q[allocations_invoice_property_id_eq]=${propertyFilter}`
    }

    if (contractFilter) {
      endpoint += `&contract_id=${contractFilter}`
    }

    const result = await get(endpoint)

    if (response.ok) {
      setPayments(result?.data || [])
      setPagination(result?.pagination)
      setErrors(false)
    } else {
      setErrors(true)
      toast.error('We are facing a technical issue at our end.')
    }

    setLoading(false)
  }

  const handlePropertyChange = async (e) => {
    const propertyId = e.target.value

    setPropertyFilter(propertyId)
    setContractFilter('')
    setCurrentPage(1)

    if (!propertyId) {
      setContracts([])
      return
    }

    const result = await get(`/v1/admin/premises/properties/${propertyId}/allotments`)

    if (response.ok) {
      setContracts(result?.data || result)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  const activeFilterCount = [statusFilter, propertyFilter, contractFilter].filter(Boolean).length

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .payment-table tbody tr { transition: background-color .15s ease; }
        .payment-table tbody tr:hover { background-color: #f5fdfe; }

        .payment-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .payment-pagination .btn {
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
        .payment-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .payment-pagination .custom_background_color,
        .payment-pagination .custom_background_color .btn {
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
              <CIcon icon={freeSet.cilMoney} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Payments
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_count ?? payments.length} total
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center" style={{ gap: '10px' }}>
            <Dropdown autoClose="outside">
              <Dropdown.Toggle
                as="button"
                type="button"
                className="btn d-flex align-items-center"
                style={{
                  gap: '8px',
                  background: activeFilterCount ? 'rgba(0,191,204,0.12)' : '#f5f7fb',
                  color: activeFilterCount ? THEME_COLOR : '#495057',
                  border: 'none',
                  borderRadius: '10px',
                  height: '38px',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                <CIcon icon={freeSet.cilFilter} size="sm" />
                Filters
                {activeFilterCount ? (
                  <span
                    style={{
                      background: THEME_COLOR,
                      color: '#fff',
                      borderRadius: '999px',
                      fontSize: '11px',
                      padding: '0 7px',
                      lineHeight: '18px',
                    }}
                  >
                    {activeFilterCount}
                  </span>
                ) : null}
              </Dropdown.Toggle>
              <Dropdown.Menu
                renderOnMount
                popperConfig={{ strategy: 'fixed' }}
                style={{
                  minWidth: '300px',
                  padding: '16px',
                  border: '1px solid #eef1f5',
                  borderRadius: '12px',
                  boxShadow: '0 6px 24px rgba(0,0,0,.08)',
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span style={{ fontWeight: 700, color: '#1f2933' }}>Filters</span>
                  <button
                    type="button"
                    className="d-inline-flex align-items-center border-0"
                    style={{
                      gap: '5px',
                      background: 'initial',
                      color: THEME_COLOR,
                      fontWeight: 600,
                    }}
                    onClick={resetFilters}
                  >
                    <CIcon icon={cilSync} size="sm" /> Reset
                  </button>
                </div>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '12px', color: '#8a94a6', fontWeight: 600 }}>
                    Status
                  </Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  >
                    <option value="">All Status</option>
                    <option value="1">Pending</option>
                    <option value="2">Due</option>
                    <option value="3">Paid</option>
                    <option value="4">Partial Paid</option>
                    <option value="5">Cancelled</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '12px', color: '#8a94a6', fontWeight: 600 }}>
                    Property
                  </Form.Label>
                  <Form.Select value={propertyFilter} onChange={handlePropertyChange}>
                    <option value="">All Properties</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label style={{ fontSize: '12px', color: '#8a94a6', fontWeight: 600 }}>
                    Contract
                  </Form.Label>
                  <Form.Select
                    value={contractFilter}
                    onChange={(e) => {
                      setContractFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  >
                    <option value="">All Contracts</option>
                    {contracts.map((contract) => (
                      <option key={contract.id} value={contract.id}>
                        {contract.unit?.unit_no} - {contract.unit?.building?.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Dropdown.Menu>
            </Dropdown>

            <div
              className="d-flex align-items-center"
              style={{
                background: '#f5f7fb',
                borderRadius: '10px',
                padding: '2px 6px 2px 12px',
              }}
            >
              <input
                value={searchKeyword}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="border-0"
                style={{ background: 'transparent', outline: 'none', minWidth: '180px' }}
                type="search"
                placeholder="Search by Payment ID"
                aria-label="Search"
              />
              <button
                onClick={loadPayments}
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
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table payment-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>ID</th>
                <th style={headerCellStyle}>Allotment</th>
                <th style={headerCellStyle}>Amount</th>
                <th style={headerCellStyle}>Payment Date</th>
                <th style={headerCellStyle}>Created At</th>
                <th style={headerCellStyle}>Created By</th>
                <th style={headerCellStyle}>Type</th>
                <th style={headerCellStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map((payment) => (
                <tr key={payment.id}>
                  <td style={bodyCellStyle}>
                    <NavLink
                      to={`/finance/payments/${payment.id}`}
                      className="fw-semibold"
                      style={{ color: THEME_COLOR, textDecoration: 'none' }}
                    >
                      {payment.id}
                    </NavLink>
                  </td>
                  <td style={bodyCellStyle}>{allotmentLabel(payment)}</td>
                  <td style={bodyCellStyle}>{payment.amount || '-'}</td>
                  <td style={bodyCellStyle}>
                    {payment.payment_date ? formatdate(payment.payment_date) : '-'}
                  </td>
                  <td style={bodyCellStyle}>
                    {payment.created_at ? formatdate(payment.created_at) : '-'}
                  </td>
                  <td style={bodyCellStyle}>{payment.created_by?.name || '-'}</td>
                  <td style={bodyCellStyle} className="text-capitalize">
                    {payment.payment_type || '-'}
                  </td>
                  <td style={bodyCellStyle}>
                    <span style={paymentStatusBadgeStyle(payment.status)}>
                      {payment.status || '-'}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && payments?.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && <Loading />}
          {errors ? toast('We are facing a technical issue at our end.') : null}
        </div>

        {/* Pagination */}
        {pagination?.total_pages > 1 ? (
          <div
            className="payment-pagination d-flex justify-content-center"
            style={{ padding: '16px', borderTop: '1px solid #f2f4f7' }}
          >
            <Paginate
              onPageChange={handlePageClick}
              pageRangeDisplayed={pagination?.per_page}
              pageCount={pagination?.total_pages}
              forcePage={currentPage - 1}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Payments
