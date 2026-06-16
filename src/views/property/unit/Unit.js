import React, { useState, useEffect, useRef } from 'react'
import useFetch from 'use-http'
import '../../../scss/_custom.scss'
import Loading from 'src/components/loading/loading'
import Paginate from '../../../components/Pagination'
import { NavLink, useParams, useLocation } from 'react-router-dom'
import Add from './AddUnit'
import PickOwner from './UnitFunctions/PickOwner'
import FilterAccordion from './UnitFunctions/FilterAccordioan'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { status_color } from 'src/services/CommonFunctions'
import CheckPermissions from 'src/permissions/CheckPermissions'

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

function Unit() {
  const { get, response } = useFetch()
  const location = useLocation()
  const previousLocationRef = useRef(null)
  const { propertyId } = useParams()
  const [units, setUnits] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [unit_type, setUnit_type] = useState([])

  // Refresh data when returning from detail/nested routes
  useEffect(() => {
    const pathSegments = location.pathname.split('/')
    // Check if the URL contains a numeric unit ID (detail page) or not (list page)
    const hasUnitId = pathSegments.some((seg) => /^\d+$/.test(seg))

    if (!hasUnitId && previousLocationRef.current) {
      // We're on the list page and previously were on a detail page, refresh data
      const previousSegments = previousLocationRef.current.split('/')
      const hadUnitId = previousSegments.some((seg) => /^\d+$/.test(seg))
      if (hadUnitId) {
        loadInitialUnits()
      }
    }
    previousLocationRef.current = location.pathname
  }, [location.pathname, propertyId, currentPage])

  useEffect(() => {
    if (searchKeyword.trim() === '') {
      loadInitialUnits()
    }
  }, [searchKeyword, propertyId, currentPage])
  useEffect(() => {
    loadInitialUnits()
    loadUnitTypes()
  }, [currentPage, propertyId, get, response])

  async function loadUnitTypes() {
    let endpoint = await get(`/v1/admin/premises/properties/${propertyId}/unit_types`)

    if (response.ok) {
      const temp_unit = await endpoint.data.map((data) => ({
        label: data.name,
        value: data.id,
      }))
      setUnit_type(temp_unit)
    } else {
      setUnit_type([])
    }
  }

  async function loadInitialUnits(queries) {
    let endpoint = `/v1/admin/premises/properties/${propertyId}/units?=${currentPage}`

    if (queries) {
      endpoint += queries
    }

    // /unit_types

    if (searchKeyword) {
      endpoint += `&q[unit_no_eq]=${searchKeyword}`
    }

    const initialUnits = await get(endpoint)

    if (response.ok) {
      setErrors(false)

      setLoading(false)
      setUnits(initialUnits.data)

      setPagination(initialUnits.pagination)
    } else {
      setErrors(true)
      setLoading(false)
    }
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      loadInitialUnits(1, event.target.value)
    }
  }
  const handleInputChange = (event) => {
    const value = event.target.value
    setSearchKeyword(value)
  }

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1)
  }
  const refresh_data = () => {
    loadInitialUnits()
  }

  function filter_callback(queries) {
    loadInitialUnits(queries)
    setSearchKeyword('')
  }

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .unit-table tbody tr { transition: background-color .15s ease; }
        .unit-table tbody tr:hover { background-color: #f5fdfe; }

        .unit-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .unit-pagination .btn {
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
        .unit-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .unit-pagination .custom_background_color,
        .unit-pagination .custom_background_color .btn {
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
              <CIcon icon={freeSet.cilHome} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Units
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_count ?? units.length} total
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center flex-wrap" style={{ gap: '10px' }}>
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
                style={{ background: 'transparent', outline: 'none', minWidth: '160px' }}
                type="text"
                placeholder="Search by unit no."
                aria-label="Search"
              />
              <button
                onClick={() => loadInitialUnits()}
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

            <FilterAccordion filter_callback={filter_callback} units_type={unit_type} />

            <CheckPermissions
              component={<Add after_submit={refresh_data} />}
              keys={['unit', 'create']}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table unit-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Unit Number (Building)</th>
                <th style={headerCellStyle}>Type</th>
                <th style={headerCellStyle}>Bed/Bath</th>
                <th style={headerCellStyle}>Year Built</th>
                <th style={headerCellStyle}>Owner/Resident</th>
                <th style={headerCellStyle}>Open Invoices</th>
                <th style={headerCellStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id}>
                  <td style={bodyCellStyle}>
                    <NavLink
                      to={`${unit.id}`}
                      className="fw-semibold"
                      style={{ color: THEME_COLOR, textDecoration: 'none' }}
                    >
                      {unit.unit_no}
                      {unit?.building?.name && ` (${unit.building.name})`}
                    </NavLink>
                  </td>
                  <td style={bodyCellStyle}>{unit?.unit_type?.name || '-'}</td>
                  <td style={bodyCellStyle}>
                    {unit.bedrooms_number} / {unit.bathrooms_number}
                  </td>
                  <td style={bodyCellStyle}>{unit.year_built || '-'}</td>
                  <td style={bodyCellStyle}>
                    {unit.running_contracts[0]?.contract_members
                      ? PickOwner(unit.running_contracts[0]?.contract_members)
                      : '-'}
                  </td>
                  <td style={bodyCellStyle}>-</td>
                  <td style={bodyCellStyle}>
                    <span style={statusBadgeStyle(unit?.status)}>{unit.status || '-'}</span>
                  </td>
                </tr>
              ))}
              {!loading && units.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No matching units found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && <Loading />}
          {errors && (
            <p className="text-center small text-danger fst-italic">
              {process.env.REACT_APP_ERROR_MESSAGE}
            </p>
          )}
        </div>

        {/* Pagination */}
        {pagination?.total_pages > 1 ? (
          <div
            className="unit-pagination d-flex justify-content-center"
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

export default Unit
