import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import AddUser from './AddUser'
import ShowUser from './ShowUser'
import EditUser from './EditUser'
import { toast } from 'react-toastify'
import Paginate from '../../../components/Pagination'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from 'src/components/CustomDivToggle'
import { Dropdown } from 'react-bootstrap'
import { BsThreeDots } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
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

function roleBadgeStyle() {
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

export default function User() {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const { get, response } = useFetch()

  useEffect(() => {
    loadInitialusers()
  }, [currentPage, searchKeyword])

  async function loadInitialusers() {
    setLoading(true)
    let endpoint = `/v1/admin/users?page=${currentPage}`

    if (searchKeyword?.trim()) {
      endpoint += `&q[name_cont]=${encodeURIComponent(searchKeyword.trim())}`
    }

    const initialusers = await get(endpoint)

    if (response.ok && initialusers?.data) {
      setUsers(initialusers.data)
      setPagination(initialusers.pagination)
    } else {
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

  const refresh_data = () => {
    loadInitialusers()
  }

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .users-table tbody tr { transition: background-color .15s ease; }
        .users-table tbody tr:hover { background-color: #f5fdfe; }

        .users-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .users-pagination .btn {
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
        .users-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .users-pagination .custom_background_color,
        .users-pagination .custom_background_color .btn {
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
              <CIcon icon={freeSet.cilUser} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Users
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_entries ?? users.length} total
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
                placeholder="Search by name"
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
              component={<AddUser after_submit={refresh_data} />}
              keys={['user', 'create']}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table users-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Name</th>
                <th style={headerCellStyle}>Email</th>
                <th style={headerCellStyle}>Phone Number</th>
                <th style={headerCellStyle}>Role</th>
                <th style={{ ...headerCellStyle, textAlign: 'center', width: '60px' }} />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={bodyCellStyle}>
                    <span className="fw-semibold" style={{ color: THEME_COLOR }}>
                      {user.name}
                    </span>
                  </td>
                  <td style={bodyCellStyle}>{user.email || '-'}</td>
                  <td style={bodyCellStyle}>{user.mobile_number || '-'}</td>
                  <td style={bodyCellStyle}>
                    <span style={roleBadgeStyle()}>{user.role?.name || '-'}</span>
                  </td>
                  <td style={bodyCellStyle}>
                    <div className="d-flex justify-content-center">
                      <Dropdown>
                        <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                          <BsThreeDots />
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                          renderOnMount
                          popperConfig={{ strategy: 'fixed' }}
                          style={{
                            border: '1px solid #eef1f5',
                            borderRadius: '10px',
                            boxShadow: '0 6px 24px rgba(0,0,0,.08)',
                            padding: '6px',
                          }}
                        >
                          <CheckPermissions
                            component={<EditUser userId={user.id} after_submit={refresh_data} />}
                            keys={['user', 'edit']}
                          />
                          <CheckPermissions
                            component={<ShowUser userId={user.id} />}
                            keys={['user', 'view']}
                          />
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && <Loading />}
        </div>

        {pagination?.total_pages > 1 ? (
          <div
            className="users-pagination d-flex justify-content-center"
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
