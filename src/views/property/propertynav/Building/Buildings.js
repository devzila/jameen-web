import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { NavLink, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Loading from 'src/components/loading/loading'
import { toast } from 'react-toastify'
import Paginate from '../../../../components/Pagination'
import { formatdate } from '../../../../services/CommonFunctions'
import AddBuilding from './AddBuilding'

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

export default function Buildings() {
  const [buildings, setBuildings] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const { propertyId } = useParams()
  const [searchKeyword, setSearchKeyword] = useState('')
  const { get, response } = useFetch()

  useEffect(() => {
    fetchBuildings()
  }, [propertyId, currentPage, searchKeyword])

  async function fetchBuildings() {
    setLoading(true)

    let endpoint = `/v1/admin/premises/properties/${propertyId}/buildings?page=${currentPage}`

    if (searchKeyword?.trim()) {
      endpoint += `&q[name_cont]=${encodeURIComponent(searchKeyword.trim())}`
    }

    try {
      const buildingsData = await get(endpoint)

      if (response.ok && buildingsData?.data) {
        setBuildings(buildingsData.data)
        setPagination(buildingsData.pagination)
        setErrors(false)
      } else {
        setErrors(true)
      }
    } catch (error) {
      setErrors(true)
    } finally {
      setLoading(false)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  const handleInputChange = (event) => {
    setCurrentPage(1)
    setSearchKeyword(event.target.value)
  }

  function refresh_data() {
    fetchBuildings()
  }

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .building-table tbody tr { transition: background-color .15s ease; }
        .building-table tbody tr:hover { background-color: #f5fdfe; }

        .building-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .building-pagination .btn {
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
        .building-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .building-pagination .custom_background_color,
        .building-pagination .custom_background_color .btn {
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
              <CIcon icon={freeSet.cilBuilding} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Buildings
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_entries ?? buildings.length} total
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
                onChange={handleInputChange}
                className="border-0"
                style={{ background: 'transparent', outline: 'none', minWidth: '160px' }}
                type="search"
                placeholder="Search by name"
                aria-label="Search"
              />
              <button
                onClick={fetchBuildings}
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
            <AddBuilding after_submit={refresh_data} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table building-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Name</th>
                <th style={headerCellStyle}>Description</th>
                <th style={headerCellStyle}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((data) => (
                <tr key={data.id}>
                  <td style={bodyCellStyle}>
                    <NavLink
                      to={`${data.id}`}
                      className="fw-semibold"
                      style={{ color: THEME_COLOR, textDecoration: 'none' }}
                    >
                      {data.name}
                    </NavLink>
                  </td>
                  <td style={bodyCellStyle}>{data.description || '-'}</td>
                  <td style={bodyCellStyle}>{formatdate(data.created_at) || '-'}</td>
                </tr>
              ))}
              {!loading && buildings.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No buildings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && <Loading />}
          {errors && toast('We are facing a technical issue at our end.')}
        </div>

        {pagination?.total_pages > 1 ? (
          <div
            className="building-pagination d-flex justify-content-center"
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
