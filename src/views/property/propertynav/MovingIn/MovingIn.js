import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { NavLink, useParams } from 'react-router-dom'
import Paginate from 'src/components/Pagination'
import Loading from 'src/components/loading/loading'
import { formatdate } from '../../../../services/CommonFunctions'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import PickOwner from '../../unit/UnitFunctions/PickOwner'
import MovingInUnit from '../../unit/MovingInUnit'

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

function contractTypeBadgeStyle() {
  return {
    background: 'rgba(0,191,204,0.12)',
    color: THEME_COLOR,
    padding: '4px 14px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'capitalize',
    display: 'inline-block',
  }
}

export default function MovingIn() {
  const { get, response } = useFetch()
  const { propertyId } = useParams()

  const [runningContracts, setRunningContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    loadInitialMovingInContracts()
  }, [propertyId, currentPage, searchKeyword])

  async function loadInitialMovingInContracts() {
    setLoading(true)
    let endpoint = `/v1/admin/premises/properties/${propertyId}/moving_in?page=${currentPage}`

    if (searchKeyword?.trim()) {
      endpoint += `&q[unit_unit_no_cont]=${encodeURIComponent(searchKeyword.trim())}`
    }

    try {
      const initialRunningContracts = await get(endpoint)

      if (response.ok && initialRunningContracts?.data) {
        setRunningContracts(initialRunningContracts.data)
        setPagination(initialRunningContracts.pagination)
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

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  function handleInputChange(e) {
    setCurrentPage(1)
    setSearchKeyword(e.target.value)
  }

  function refreshData() {
    setSearchKeyword('')
    loadInitialMovingInContracts()
  }

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .moving-in-table tbody tr { transition: background-color .15s ease; }
        .moving-in-table tbody tr:hover { background-color: #f5fdfe; }

        .moving-in-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .moving-in-pagination .btn {
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
        .moving-in-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .moving-in-pagination .custom_background_color,
        .moving-in-pagination .custom_background_color .btn {
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
              <CIcon icon={freeSet.cilHome} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Moving In
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_entries ?? runningContracts.length} total
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
                placeholder="Search by unit no"
                aria-label="Search"
              />
              <button
                onClick={loadInitialMovingInContracts}
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

            <div style={{ flexShrink: 0 }}>
              <MovingInUnit after_submit={refreshData} />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table moving-in-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Unit No</th>
                <th style={headerCellStyle}>Period</th>
                <th style={headerCellStyle}>Contract Type</th>
                <th style={headerCellStyle}>Member</th>
              </tr>
            </thead>
            <tbody>
              {runningContracts.map((running_contracts) => (
                <tr key={running_contracts.id}>
                  <td style={bodyCellStyle}>
                    <NavLink
                      to={`${running_contracts.id}`}
                      className="fw-semibold"
                      style={{ color: THEME_COLOR, textDecoration: 'none' }}
                    >
                      {running_contracts.unit?.unit_no || '-'}
                      {running_contracts.unit?.building?.name
                        ? ` (${running_contracts.unit.building.name})`
                        : ''}
                    </NavLink>
                  </td>
                  <td style={bodyCellStyle}>
                    {formatdate(running_contracts.start_date) || '-'} –{' '}
                    {formatdate(running_contracts.end_date) || 'Present'}
                  </td>
                  <td style={bodyCellStyle}>
                    {running_contracts.contract_type ? (
                      <span style={contractTypeBadgeStyle()}>
                        {running_contracts.contract_type.replace(/_/g, ' ')}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td style={bodyCellStyle}>
                    {PickOwner(running_contracts.contract_members, 'residents') || '-'}
                  </td>
                </tr>
              ))}
              {!loading && runningContracts.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No moving-in records found
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
            className="moving-in-pagination d-flex justify-content-center"
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
