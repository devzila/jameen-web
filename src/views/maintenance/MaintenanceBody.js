import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import Loader from 'src/components/loading/loading'
import Paginate from 'src/components/Pagination'
import TopCards from 'src/views/maintenance/Components/TopCards'

import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

import MaintenanceTable from './Components/MaintenanceTable'
import MaintenanceCard from './Components/MaintenanceCard'
import AddEditMaintenance from './Components/AddEditMaintenance'
import MaintenanceaFilter from './Components/MaintenanceaFilter'
import MaintenanceSort from './Components/MaintenanceSort'
import PropTypes from 'prop-types'
import CheckPermissions from 'src/permissions/CheckPermissions'

const THEME_COLOR = '#00bfcc'

export default function MaintanceBody({ api_endpoint }) {
  const { get, response } = useFetch()
  const [maintenance, setMaintenance] = useState([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(true)

  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [table_view, setTableView] = useState(true)
  useEffect(() => {
    loaddMaintenanceRequests()
  }, [currentPage, searchKeyword])

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  async function loaddMaintenanceRequests(query) {
    let api = api_endpoint + `?page=${currentPage}`
    if (searchKeyword) {
      api += `&q[title_cont]=${searchKeyword}`
    }
    if (typeof query === 'string') {
      api += query
    }

    let endpoint = await get(api)
    if (response.ok) {
      setRefresh(!refresh)
      setLoading(false)
      setMaintenance(endpoint.data)
      setPagination(endpoint.pagination)
    }
  }

  function applyFilters(query) {
    setSearchKeyword('')
    loaddMaintenanceRequests(query)
  }

  const viewToggleStyle = (active) => ({
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    background: active ? 'rgba(0,191,204,0.12)' : 'transparent',
    color: active ? THEME_COLOR : '#8a94a6',
  })

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ padding: '20px' }}>
          <style>{`
            .maintenance-pagination ul { margin: 0; align-items: center; gap: 4px; }
            .maintenance-pagination .btn {
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
            .maintenance-pagination .btn:hover {
              border-color: ${THEME_COLOR} !important;
              color: ${THEME_COLOR};
            }
            .maintenance-pagination .custom_background_color,
            .maintenance-pagination .custom_background_color .btn {
              background: ${THEME_COLOR} !important;
              border-color: ${THEME_COLOR} !important;
              color: #fff !important;
            }
          `}</style>

          <TopCards refresh={refresh} filter_callback={applyFilters} />

          <div style={{ marginTop: '16px' }}>
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
                    <CIcon icon={freeSet.cilTask} size="lg" />
                  </div>
                  <div>
                    <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                      Maintenance Requests
                    </h5>
                    <small style={{ color: '#8a94a6' }}>
                      {pagination?.total_count ?? maintenance.length} total
                    </small>
                  </div>

                  <div
                    className="d-flex align-items-center ms-2"
                    style={{
                      gap: '4px',
                      background: '#f5f7fb',
                      borderRadius: '10px',
                      padding: '3px',
                    }}
                  >
                    <div
                      onClick={() => setTableView(true)}
                      title="Table View"
                      style={viewToggleStyle(table_view)}
                    >
                      <CIcon icon={freeSet.cilList} />
                    </div>
                    <div
                      onClick={() => setTableView(false)}
                      title="Card View"
                      style={viewToggleStyle(!table_view)}
                    >
                      <CIcon icon={freeSet.cilGrid} />
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center flex-wrap" style={{ gap: '10px' }}>
                  <MaintenanceaFilter filter_callback={loaddMaintenanceRequests} />
                  <MaintenanceSort filter_callback={loaddMaintenanceRequests} />
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
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="border-0"
                      style={{ background: 'transparent', outline: 'none', minWidth: '160px' }}
                      type="text"
                      placeholder="Search by title"
                      aria-label="Search"
                    />
                    <button
                      onClick={() => loaddMaintenanceRequests()}
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
                  <CheckPermissions
                    component={
                      <AddEditMaintenance
                        type="add"
                        id={0}
                        refreshData={loaddMaintenanceRequests}
                        api_endpoint={api_endpoint}
                      />
                    }
                    keys={['maintenance_requests', 'create']}
                  />
                </div>
              </div>

              {/* Body */}
              <div>
                {table_view ? (
                  <MaintenanceTable
                    data={maintenance}
                    refreshData={loaddMaintenanceRequests}
                    api_endpoint={api_endpoint}
                  />
                ) : (
                  <div style={{ padding: '0 16px 16px' }}>
                    <MaintenanceCard data={maintenance} />
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination?.total_pages > 1 ? (
                <div
                  className="maintenance-pagination d-flex justify-content-center"
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
        </div>
      )}
    </>
  )
}

MaintanceBody.propTypes = {
  api_endpoint: PropTypes.string,
}
