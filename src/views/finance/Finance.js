import React, { useState, useEffect } from 'react'
import { useFetch } from 'use-http'
import { toast } from 'react-toastify'
import Paginate from '../../components/Pagination'
import Loading from 'src/components/loading/loading'
import { Form, Dropdown } from 'react-bootstrap'
import { status_color } from 'src/services/CommonFunctions'
import PickOwner from '../property/unit/UnitFunctions/PickOwner'
import CIcon from '@coreui/icons-react'
import { cilSync } from '@coreui/icons'
import { freeSet } from '@coreui/icons'
import { formatdate } from 'src/services/CommonFunctions'
import { NavLink } from 'react-router-dom'

const THEME_COLOR = '#00bfcc'

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
  if (from && to) return `${from} - ${to}`
  return from || to || '-'
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

const Finance = () => {
  const [invoices, setInvoices] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)

  const [searchInput, setSearchInput] = useState('')
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

  useEffect(() => {
    loadInitialinvoices()
  }, [currentPage, searchKeyword, statusFilter, propertyFilter, contractFilter])

  useEffect(() => {
    loadProperties()
  }, [])

  async function loadProperties() {
    const result = await get('/v1/admin/premises/properties')

    if (response.ok) {
      setProperties(result?.data || result)
    }
  }

  async function handlePropertyChange(e) {
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
    } else {
      setContracts([])
    }
  }

  async function loadInitialinvoices() {
    setLoading(true)
    let endpoint = `/v1/admin/invoices?page=${currentPage}`
    if (searchKeyword?.trim()) {
      endpoint += `&q[number_cont]=${encodeURIComponent(searchKeyword.trim())}`
    }
    if (statusFilter !== '') {
      endpoint += `&q[status_eq]=${statusFilter}`
    }
    if (propertyFilter) {
      endpoint += `&q[property_id_eq]=${propertyFilter}`
    }

    if (contractFilter) {
      endpoint += `&q[unit_contract_id_eq]=${contractFilter}`
    }
    const initial_invoices = await get(endpoint)

    if (response.ok) {
      if (initial_invoices.data) {
        setInvoices(initial_invoices.data)
        setPagination(initial_invoices.pagination)
        setErrors(false)
      }
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

  const activeFilterCount = [statusFilter, propertyFilter, contractFilter].filter(Boolean).length

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .invoice-table tbody tr { transition: background-color .15s ease; }
        .invoice-table tbody tr:hover { background-color: #f5fdfe; }

        .invoice-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .invoice-pagination .btn {
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
        .invoice-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .invoice-pagination .custom_background_color,
        .invoice-pagination .custom_background_color .btn {
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

            <form
              className="d-flex align-items-center"
              role="search"
              onSubmit={applySearch}
              style={{
                background: '#f5f7fb',
                borderRadius: '10px',
                padding: '2px 6px 2px 12px',
              }}
            >
              <input
                value={searchInput}
                onChange={handleSearchInputChange}
                className="border-0"
                style={{ background: 'transparent', outline: 'none', minWidth: '180px' }}
                type="search"
                placeholder="Search by invoice no."
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
                }}
              >
                <CIcon icon={freeSet.cilSearch} size="sm" />
              </button>
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table invoice-table mb-0" style={{ borderCollapse: 'collapse' }}>
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
              {invoices?.map((invoice) => (
                <tr key={invoice.id}>
                  <td style={bodyCellStyle}>
                    <NavLink
                      to={`/finance/invoices/${invoice.id}`}
                      className="fw-semibold"
                      style={{ color: THEME_COLOR, textDecoration: 'none' }}
                    >
                      {invoice.number}
                    </NavLink>
                  </td>
                  <td style={bodyCellStyle}>{invoice?.unit_contract?.unit?.unit_no || '-'}</td>
                  <td style={bodyCellStyle}>{invoice.total_amount || '-'}</td>
                  <td style={bodyCellStyle}>
                    {PickOwner(invoice?.unit_contract?.contract_members || '-')}
                  </td>
                  <td style={bodyCellStyle}>{formatdate(invoice?.invoice_date) || '-'}</td>
                  <td style={bodyCellStyle}>{periodLabel(invoice)}</td>
                  <td style={bodyCellStyle}>{invoice?.due_date || '-'}</td>
                  <td style={bodyCellStyle}>
                    <span style={invoiceStatusBadgeStyle(invoice?.status)}>
                      {invoice?.status || '-'}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && invoices?.length === 0 && (
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
          {errors === true ? toast('We are facing a technical issue at our end.') : null}
        </div>

        {/* Pagination */}
        {pagination?.total_pages > 1 ? (
          <div
            className="invoice-pagination d-flex justify-content-center"
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
export default Finance
