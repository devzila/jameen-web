import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { Dropdown } from 'react-bootstrap'
import { useParams, NavLink } from 'react-router-dom'
import Paginate from 'src/components/Pagination'
import Loading from 'src/components/loading/loading'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import AllotPropertyParking from './AllotPropertyParking'
import { status_color } from 'src/services/CommonFunctions'

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

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'allotted', label: 'Allotted' },
  { value: 'unallotted', label: 'Unallotted' },
]

export default function ParkingLot() {
  const { propertyId } = useParams()
  const { get, response, error } = useFetch()

  const [parkingLot, setParkingLot] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    loadInitialParkingLot()
  }, [propertyId, currentPage, searchKeyword])

  async function loadInitialParkingLot() {
    setLoading(true)
    let endpoint = `/v1/admin/premises/properties/${propertyId}/parkings?page=${currentPage}`

    if (searchKeyword?.trim()) {
      endpoint += `&q[parking_number_cont]=${encodeURIComponent(searchKeyword.trim())}`
    }

    try {
      const initialParkingLot = await get(endpoint)

      if (response.ok && initialParkingLot?.data) {
        setParkingLot(initialParkingLot.data)
        setPagination(initialParkingLot.pagination)
        setErrors(false)
      } else {
        setErrors(true)
      }
    } catch (fetchError) {
      setErrors(true)
    } finally {
      setLoading(false)
    }
  }

  const filteredParkingLot = parkingLot.filter((parking) => {
    if (!statusFilter) return true
    return parking.unit?.status?.toLowerCase() === statusFilter
  })

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  function handleInputChange(event) {
    setCurrentPage(1)
    setSearchKeyword(event.target.value)
  }

  function refresh_data() {
    loadInitialParkingLot()
  }

  const statusLabel = STATUS_OPTIONS.find((option) => option.value === statusFilter)?.label || 'All'

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .parking-status-dropdown .dropdown-toggle::after { display: none; }

        .parking-table tbody tr { transition: background-color .15s ease; }
        .parking-table tbody tr:hover { background-color: #f5fdfe; }

        .parking-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .parking-pagination .btn {
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
        .parking-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .parking-pagination .custom_background_color,
        .parking-pagination .custom_background_color .btn {
          background: ${THEME_COLOR} !important;
          border-color: ${THEME_COLOR} !important;
          color: #fff !important;
        }
      `}</style>

      {error && error.Error}

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
              <CIcon icon={freeSet.cilCarAlt} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Parking Lot
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_entries ?? parkingLot.length} total
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center flex-nowrap" style={{ gap: '10px' }}>
            <div
              className="d-flex align-items-center flex-nowrap"
              style={{
                background: '#f5f7fb',
                borderRadius: '10px',
                padding: '2px 6px 2px 12px',
                flexShrink: 0,
              }}
            >
              <input
                value={searchKeyword}
                onChange={handleInputChange}
                className="border-0"
                style={{ background: 'transparent', outline: 'none', width: '160px' }}
                type="search"
                placeholder="Search by parking number"
                aria-label="Search"
              />
              <button
                onClick={loadInitialParkingLot}
                className="btn d-flex align-items-center justify-content-center"
                type="button"
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
            </div>

            <Dropdown align="end" className="parking-status-dropdown">
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
                  width: '112px',
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
                  minWidth: '112px',
                  padding: '6px',
                  border: '1px solid #eef1f5',
                  borderRadius: '10px',
                  boxShadow: '0 6px 24px rgba(0,0,0,.08)',
                }}
              >
                {STATUS_OPTIONS.map((option) => (
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

            <div style={{ flexShrink: 0 }}>
              <AllotPropertyParking after_submit={refresh_data} />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table parking-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Parking Number</th>
                <th style={headerCellStyle}>Unit Number</th>
                <th style={headerCellStyle}>Vehicle Number</th>
                <th style={headerCellStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredParkingLot.map((parking) => (
                <tr key={parking.id}>
                  <td style={bodyCellStyle}>
                    <span className="fw-semibold">{parking.parking_number}</span>
                  </td>
                  <td style={bodyCellStyle}>
                    {parking.unit?.id ? (
                      <NavLink
                        to={`/properties/${propertyId}/unit/${parking.unit.id}`}
                        style={{ color: THEME_COLOR, textDecoration: 'none', fontWeight: 600 }}
                      >
                        {parking.unit.unit_no}
                        {parking.unit.building?.name ? ` (${parking.unit.building.name})` : ''}
                      </NavLink>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td style={bodyCellStyle}>{parking.vehicle?.registration_no || '-'}</td>
                  <td style={bodyCellStyle}>
                    {parking.unit?.status ? (
                      <span style={statusBadgeStyle(parking.unit.status)}>
                        {parking.unit.status}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
              {!loading && filteredParkingLot.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No parking spots found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && <Loading />}
          {errors && (
            <p className="text-center small text-danger fst-italic py-3">
              {process.env.REACT_APP_ERROR_MESSAGE}
            </p>
          )}
        </div>

        {pagination?.total_pages > 1 ? (
          <div
            className="parking-pagination d-flex justify-content-center"
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
