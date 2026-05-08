import React, { Suspense, useEffect, useState } from 'react'
import useFetch from 'use-http'
import AddProperty from './AddProperty'
import { NavLink } from 'react-router-dom'
import { BsList, BsGrid3X3Gap } from 'react-icons/bs'
import Loading from 'src/components/loading/loading'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'

import PropertyCardView from './PropertyCardView'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

function Property() {
  const { get, response, error } = useFetch()

  const [properties, setProperties] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)
  const [isCardView, setIsCardView] = useState(true)

  // ✅ FIX: clean broken API text
  const formatText = (value) => {
    if (!value) return '-'
    return value
      .toString()
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim()
  }

  const loadInitialProperties = async () => {
    setLoading(true)

    const endpoint = `/v1/admin/premises/properties?search=${searchKeyword}`

    const data = await get(endpoint)

    if (response.ok) {
      setProperties(data?.data || [])
      setErrors(false)
    } else {
      setErrors(true)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadInitialProperties()
  }, [currentPage, searchKeyword])

  const refresh_data = () => {
    setSearchKeyword('')
    loadInitialProperties()
  }

  return (
    <div className="property-page">
      <style>{`
        .property-page {
          padding: 20px;
          background: #f4f6f9;
          min-height: 100vh;
        }

        .top-bar {
          background: #fff;
          padding: 16px;
          border-radius: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          flex-wrap: wrap;
          gap: 10px;
        }

        .search-box {
          display: flex;
        }

        .search-box input {
          height: 40px;
          border-radius: 8px 0 0 8px;
          border: 1px solid #ddd;
          padding: 0 10px;
          outline: none;
        }

        .search-box button {
          height: 40px;
          border-radius: 0 8px 8px 0;
          border: none;
          background: #6366f1;
          color: #fff;
          padding: 0 14px;
        }

        .table-wrapper {
          margin-top: 20px;
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }

        table {
          width: 100%;
        }

        th {
          background: #f8fafc;
          padding: 14px;
          text-align: left;
          font-size: 13px;
        }

        td {
          padding: 14px;
          border-top: 1px solid #eee;
          font-size: 14px;
        }

        tr:hover {
          background: #f9fafb;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          text-transform: capitalize;
        }

        .residential { background: #e0f2fe; }
        .commercial { background: #dcfce7; }
        .mixed { background: #fef9c3; }

        .view-icon {
          font-size: 24px;
          cursor: pointer;
          color: #6366f1;
        }
      `}</style>

      {/* TOP BAR */}
      <div className="top-bar">
        <h3>Properties</h3>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="search-box">
            <input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search Property"
            />
            <button onClick={loadInitialProperties}>
              <CIcon icon={freeSet.cilSearch} />
            </button>
          </div>

          <AddProperty after_submit={refresh_data} />

          {isCardView ? (
            <BsList className="view-icon" onClick={() => setIsCardView(false)} />
          ) : (
            <BsGrid3X3Gap className="view-icon" onClick={() => setIsCardView(true)} />
          )}
        </div>
      </div>

      {/* CONTENT */}
      <Suspense fallback={<Loading />}>
        {isCardView ? (
          <PropertyCardView property={properties} />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Pincode</th>
                  <th>Type</th>
                  <th>Units</th>
                  <th>Payment</th>
                </tr>
              </thead>

              <tbody>
                {properties?.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <NavLink to={`/properties/${p.id}/overview`}>{formatText(p.name)}</NavLink>
                    </td>
                    <td>{formatText(p.city)}</td>

                    {/* ✅ STATE (safe fallback included) */}
                    <td>{formatText(p.state || p.state_name || p.region || '-')}</td>

                    {/* ✅ PINCODE (safe fallback included) */}
                    <td>{formatText(p.pincode || p.pin_code || p.postal_code || '-')}</td>
                    <td>
                      <span className={`badge ${p.use_type}`}>{formatText(p.use_type)}</span>
                    </td>

                    <td>{p.units_count || 0}</td>

                    <td>{formatText(p.payment_term)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <Loading />}
            {errors && <div className="text-center text-danger">Something went wrong</div>}
          </div>
        )}
      </Suspense>
    </div>
  )
}
export default Property
