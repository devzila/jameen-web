import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import Paginate from '../../../../components/Pagination'
import Loading from 'src/components/loading/loading'
import { NavLink, useParams } from 'react-router-dom'
import AddUnitTypes from './AddUnitTypes'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { formatdate } from 'src/services/CommonFunctions'

const THEME_COLOR = '#00bfcc'

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

const PropertyUnitType = () => {
  const { get, response } = useFetch()
  const { propertyId } = useParams()

  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [unit_type, setUnit_types] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    loadInitialUnitsTypes()
  }, [currentPage])

  useEffect(() => {
    if (searchKeyword === '') {
      loadInitialUnitsTypes()
    }
  }, [searchKeyword])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      loadInitialUnitsTypes()
    }
  }

  const handleInputChange = (event) => {
    setSearchKeyword(event.target.value)
  }

  async function loadInitialUnitsTypes() {
    setLoading(true)
    let endpoint = `/v1/admin/premises/properties/${propertyId}/unit_types?page=${currentPage}`
    if (searchKeyword) {
      endpoint += `&q[name_cont]=${searchKeyword}`
    }

    const initialUnitTypes = await get(endpoint)

    if (response.ok) {
      setUnit_types(initialUnitTypes.data || [])
      setPagination(initialUnitTypes.pagination)
      setErrors(false)
    } else {
      setErrors(true)
      toast.error('Unable to load unit types')
    }
    setLoading(false)
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .unit-type-table tbody tr { transition: background-color .15s ease; }
        .unit-type-table tbody tr:hover { background-color: #f5fdfe; }

        .unit-type-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .unit-type-pagination .btn {
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
        .unit-type-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .unit-type-pagination .custom_background_color,
        .unit-type-pagination .custom_background_color .btn {
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
              <CIcon icon={freeSet.cilLayers} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Unit Types
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_entries ?? unit_type.length} total
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
                value={searchKeyword}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                className="border-0"
                style={{ background: 'transparent', outline: 'none', minWidth: '160px' }}
                type="search"
                placeholder="Search by name"
                aria-label="Search"
              />
              <button
                onClick={loadInitialUnitsTypes}
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
            <AddUnitTypes after_submit={loadInitialUnitsTypes} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table unit-type-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Name</th>
                <th style={headerCellStyle}>Use Type</th>
                <th style={headerCellStyle}>Area</th>
                <th style={{ ...headerCellStyle, textAlign: 'center' }}>Maintenance/sqft</th>
                <th style={headerCellStyle}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {unit_type.map((item) => (
                <tr key={item.id}>
                  <td style={bodyCellStyle}>
                    <NavLink
                      to={`${item.id}/billableitems`}
                      className="fw-semibold"
                      style={{ color: THEME_COLOR, textDecoration: 'none' }}
                    >
                      {item.name}
                    </NavLink>
                  </td>
                  <td style={bodyCellStyle} className="text-capitalize">
                    {item.use_type || '-'}
                  </td>
                  <td style={bodyCellStyle}>{item.sqft ? `${item.sqft} sqft` : '-'}</td>
                  <td style={{ ...bodyCellStyle, textAlign: 'center' }}>
                    ₹{item.monthly_maintenance_amount_per_sqft ?? '-'}
                  </td>
                  <td style={bodyCellStyle}>{formatdate(item?.updated_at) || '-'}</td>
                </tr>
              ))}
              {!loading && unit_type.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No unit types found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && <Loading />}
          {errors ? toast('Unable to load data') : null}
        </div>

        {pagination?.total_pages > 1 ? (
          <div
            className="unit-type-pagination d-flex justify-content-center"
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

export default PropertyUnitType
