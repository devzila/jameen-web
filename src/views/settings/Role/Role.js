import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import Paginate from '../../../components/Pagination'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from 'src/components/CustomDivToggle'
import { Dropdown } from 'react-bootstrap'
import { BsThreeDots } from 'react-icons/bs'
import AddRoles from './AddRoles'
import ShowRoles from './ShowRoles'
import EditRoles from './EditRoles'
import DeleteRoles from './DeleteRoles'
import { formatdate } from 'src/services/CommonFunctions'
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

export default function Role() {
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [roles, setRoles] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const { get, response } = useFetch()

  useEffect(() => {
    loadInitialroles()
  }, [currentPage, searchKeyword])

  async function loadInitialroles() {
    setLoading(true)
    let endpoint = `/v1/admin/roles?page=${currentPage}`

    if (searchKeyword?.trim()) {
      endpoint += `&q[name_cont]=${encodeURIComponent(searchKeyword.trim())}`
    }

    const initialroles = await get(endpoint)

    if (response.ok && initialroles?.data) {
      setRoles(initialroles.data)
      setPagination(initialroles.pagination)
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
    loadInitialroles()
  }

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .roles-table tbody tr { transition: background-color .15s ease; }
        .roles-table tbody tr:hover { background-color: #f5fdfe; }

        .roles-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .roles-pagination .btn {
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
        .roles-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .roles-pagination .custom_background_color,
        .roles-pagination .custom_background_color .btn {
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
              <CIcon icon={freeSet.cilPeople} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Roles
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_entries ?? roles.length} total
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
            <AddRoles after_submit={refresh_data} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table roles-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Name</th>
                <th style={headerCellStyle}>Description</th>
                <th style={headerCellStyle}>Created At</th>
                <th style={headerCellStyle}>Last Modified</th>
                <th style={{ ...headerCellStyle, textAlign: 'center', width: '60px' }} />
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td style={bodyCellStyle}>
                    <span className="fw-semibold" style={{ color: THEME_COLOR }}>
                      {role.name}
                    </span>
                  </td>
                  <td style={bodyCellStyle}>{role.description || '-'}</td>
                  <td style={bodyCellStyle}>{formatdate(role.created_at) || '-'}</td>
                  <td style={bodyCellStyle}>{formatdate(role.updated_at) || '-'}</td>
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
                            component={
                              <>
                                <EditRoles roleId={role.id} after_submit={refresh_data} />
                                <DeleteRoles roleId={role.id} after_submit={refresh_data} />
                              </>
                            }
                            keys={[]}
                          />
                          <ShowRoles roleId={role.id} />
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && roles.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No roles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && <Loading />}
        </div>

        {pagination?.total_pages > 1 ? (
          <div
            className="roles-pagination d-flex justify-content-center"
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
