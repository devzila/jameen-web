import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import AddResidents from './AddResidents'
import Paginate from '../../components/Pagination'
import Loading from 'src/components/loading/loading'
import defaultAvatar from 'src/assets/images/avatars/default.png'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import ResidentUnitPicker from './ResidentNav/ResidentUnitPicker'
import ResidentFIlters from './ResidentFIlters'
import CheckPermissions from 'src/permissions/CheckPermissions'

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

function resolveMemberAvatarSrc(avatar) {
  if (typeof avatar === 'string' && avatar.trim() !== '') {
    return avatar.trim()
  }
  return defaultAvatar
}

function primaryBadgeStyle() {
  return {
    background: 'rgba(0,191,204,0.12)',
    color: THEME_COLOR,
    padding: '2px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 600,
  }
}

export default function Residents() {
  const { get, response } = useFetch()
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [residents, setResidents] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterQuery, setFilterQuery] = useState('')

  useEffect(() => {
    loadInitialResidents()
  }, [currentPage, searchKeyword, filterQuery])

  async function loadInitialResidents() {
    setLoading(true)
    let endpoint = `/v1/admin/members?page=${currentPage}`

    if (searchKeyword?.trim()) {
      endpoint += `&q[first_name_or_last_name_or_email_cont]=${encodeURIComponent(
        searchKeyword.trim(),
      )}`
    }

    if (filterQuery) {
      endpoint += filterQuery
    }

    const initialResidents = await get(endpoint)

    if (response.ok && initialResidents?.data) {
      setResidents(initialResidents.data)
      setPagination(initialResidents.pagination)
    } else {
      toast.error('Unable to load residents')
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

  function handleFilter(query) {
    setCurrentPage(1)
    setFilterQuery(query || '')
  }

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .residents-table tbody tr { transition: background-color .15s ease; }
        .residents-table tbody tr:hover { background-color: #f5fdfe; }

        .residents-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .residents-pagination .btn {
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
        .residents-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .residents-pagination .custom_background_color,
        .residents-pagination .custom_background_color .btn {
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
              <CIcon icon={freeSet.cilPeople} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Residents
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_entries ?? residents.length} total
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center flex-nowrap" style={{ gap: '10px' }}>
            <ResidentFIlters filter_callback={handleFilter} />

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
                placeholder="Search residents"
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

            <CheckPermissions
              component={<AddResidents after_submit={loadInitialResidents} />}
              keys={['resident', 'create']}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table residents-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Name</th>
                <th style={headerCellStyle}>Gender</th>
                <th style={headerCellStyle}>Unit(s)</th>
              </tr>
            </thead>
            <tbody>
              {residents.map((resident) => (
                <tr key={resident.id}>
                  <td style={bodyCellStyle}>
                    <NavLink
                      to={`/resident/${resident.id}/overview`}
                      className="d-flex align-items-center text-decoration-none"
                      style={{ gap: '10px' }}
                    >
                      <img
                        src={resolveMemberAvatarSrc(resident.avatar)}
                        alt={`${resident.first_name} ${resident.last_name}`}
                        width="36"
                        height="36"
                        className="rounded-circle"
                        style={{ objectFit: 'cover', border: '2px solid #eef1f5' }}
                      />
                      <div className="d-flex align-items-center flex-wrap" style={{ gap: '8px' }}>
                        <span className="fw-semibold" style={{ color: THEME_COLOR }}>
                          {resident.first_name} {resident.last_name}
                        </span>
                        {resident.membership?.some(
                          (member) => member.member_type === 'primary_resident',
                        ) && <span style={primaryBadgeStyle()}>Primary</span>}
                      </div>
                    </NavLink>
                  </td>
                  <td style={bodyCellStyle} className="text-capitalize">
                    {resident.gender || '-'}
                  </td>
                  <td style={bodyCellStyle}>{ResidentUnitPicker(resident)}</td>
                </tr>
              ))}
              {!loading && residents.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No residents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && <Loading />}
        </div>

        {pagination?.total_pages > 1 ? (
          <div
            className="residents-pagination d-flex justify-content-center"
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
