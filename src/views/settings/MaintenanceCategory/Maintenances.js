import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import { BsThreeDots } from 'react-icons/bs'
import Loading from 'src/components/loading/loading'
import { Dropdown } from 'react-bootstrap'
import Paginate from 'src/components/Pagination'
import CustomDivToggle from 'src/components/CustomDivToggle'
import EditMaintenance from './EditMaintenance'
import AddMaintenance from './AddMaintenance'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

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

function priorityBadgeStyle(priority) {
  const isHigh = String(priority).toLowerCase() === 'high'
  return {
    background: isHigh ? '#fff4e6' : '#e7f5ff',
    color: isHigh ? '#e8590c' : '#1c7ed6',
    padding: '4px 14px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'capitalize',
    display: 'inline-block',
  }
}

function defaultBadgeStyle(isDefault) {
  return {
    background: isDefault ? '#e6f9ec' : '#eef1f5',
    color: isDefault ? '#1a9e54' : '#495057',
    padding: '4px 14px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    display: 'inline-block',
  }
}

export default function Maintenances() {
  const { get, response } = useFetch()
  const [maintenanceCategories, setMaintenanceCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    fetchMaintenanceCategories()
  }, [currentPage, searchKeyword])

  async function fetchMaintenanceCategories() {
    setLoading(true)
    let url = `/v1/admin/maintenance/categories?page=${currentPage}`

    if (searchKeyword?.trim()) {
      url += `&q[name_cont]=${encodeURIComponent(searchKeyword.trim())}`
    }

    const result = await get(url)

    if (response.ok && result?.data) {
      setMaintenanceCategories(result.data)
      setPagination(result.pagination)
    } else {
      toast.error('Unable to load maintenance categories')
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

  const refreshData = () => {
    fetchMaintenanceCategories()
  }

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .maintenance-categories-table tbody tr { transition: background-color .15s ease; }
        .maintenance-categories-table tbody tr:hover { background-color: #f5fdfe; }

        .maintenance-categories-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .maintenance-categories-pagination .btn {
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
        .maintenance-categories-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .maintenance-categories-pagination .custom_background_color,
        .maintenance-categories-pagination .custom_background_color .btn {
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
                Maintenance Categories
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_entries ?? maintenanceCategories.length} total
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
            <AddMaintenance afterSubmit={refreshData} />
          </div>
        </div>

        <div className="table-responsive">
          <table
            className="table maintenance-categories-table mb-0"
            style={{ borderCollapse: 'collapse' }}
          >
            <thead>
              <tr>
                <th style={headerCellStyle}>Name</th>
                <th style={headerCellStyle}>Description</th>
                <th style={headerCellStyle}>Priority</th>
                <th style={headerCellStyle}>Is Default</th>
                <th style={{ ...headerCellStyle, textAlign: 'center', width: '60px' }} />
              </tr>
            </thead>
            <tbody>
              {maintenanceCategories.map((category) => (
                <tr key={category.id}>
                  <td style={bodyCellStyle}>
                    <span className="fw-semibold" style={{ color: THEME_COLOR }}>
                      {category.name}
                    </span>
                  </td>
                  <td style={bodyCellStyle}>{category.description || '-'}</td>
                  <td style={bodyCellStyle}>
                    <span style={priorityBadgeStyle(category.priority)}>
                      {category.priority || '-'}
                    </span>
                  </td>
                  <td style={bodyCellStyle}>
                    <span style={defaultBadgeStyle(category.is_default)}>
                      {category.is_default ? 'Yes' : 'No'}
                    </span>
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
                          <EditMaintenance
                            categoryId={category.id}
                            isDefault={category.is_default}
                            afterSubmit={refreshData}
                          />
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && maintenanceCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No maintenance categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && <Loading />}
        </div>

        {pagination?.total_pages > 1 ? (
          <div
            className="maintenance-categories-pagination d-flex justify-content-center"
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
