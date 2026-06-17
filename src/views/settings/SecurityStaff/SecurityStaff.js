import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Loading from 'src/components/loading/loading'
import { Dropdown } from 'react-bootstrap'
import CustomDivToggle from 'src/components/CustomDivToggle'
import AddSecurityStaff from './AddSecurityStaff'
import EditSecurityStaff from './EditSecurityStaff'
import { BsThreeDots } from 'react-icons/bs'

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

function statusBadgeStyle(active) {
  return {
    background: active ? '#e6f9ec' : '#fdeaea',
    color: active ? '#1a9e54' : '#e03131',
    padding: '4px 14px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    display: 'inline-block',
  }
}

export default function SecurityStaff() {
  const [securityStaff, setSecurityStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const { get, response } = useFetch()

  useEffect(() => {
    fetchSecurityStaff()
  }, [])

  async function fetchSecurityStaff() {
    setLoading(true)
    const api = await get(`/v1/admin/security_staffs`)

    if (response.ok && api?.data) {
      setSecurityStaff(api.data)
    } else {
      toast.error('Unable to load security staff')
    }
    setLoading(false)
  }

  function applySearch(e) {
    e?.preventDefault()
    setSearchKeyword(searchInput.trim())
  }

  function handleSearchInputChange(e) {
    const value = e.target.value
    setSearchInput(value)
    if (value === '') {
      setSearchKeyword('')
    }
  }

  function reload_callback() {
    fetchSecurityStaff()
  }

  const filteredSecurityStaff = securityStaff.filter((staff) => {
    if (!searchKeyword) return true
    const term = searchKeyword.toLowerCase()
    return (
      staff.name?.toLowerCase().includes(term) ||
      staff.email?.toLowerCase().includes(term) ||
      staff.mobile_number?.toLowerCase().includes(term)
    )
  })

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .security-staff-table tbody tr { transition: background-color .15s ease; }
        .security-staff-table tbody tr:hover { background-color: #f5fdfe; }
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
              <CIcon icon={freeSet.cilLockLocked} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Security Staff
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {searchKeyword ? filteredSecurityStaff.length : securityStaff.length} total
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
            <AddSecurityStaff after_submit={reload_callback} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table security-staff-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Name</th>
                <th style={headerCellStyle}>Status</th>
                <th style={headerCellStyle}>Email</th>
                <th style={headerCellStyle}>Mobile No.</th>
                <th style={{ ...headerCellStyle, textAlign: 'center', width: '60px' }} />
              </tr>
            </thead>
            <tbody>
              {filteredSecurityStaff.map((staff) => (
                <tr key={staff.id}>
                  <td style={bodyCellStyle}>
                    <span className="fw-semibold" style={{ color: THEME_COLOR }}>
                      {staff.name}
                    </span>
                  </td>
                  <td style={bodyCellStyle}>
                    <span style={statusBadgeStyle(staff.active)}>
                      {staff.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={bodyCellStyle}>{staff.email || '-'}</td>
                  <td style={bodyCellStyle}>{staff.mobile_number || '-'}</td>
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
                          <EditSecurityStaff id={staff.id} after_submit={reload_callback} />
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredSecurityStaff.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No security staff found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && <Loading />}
        </div>
      </div>
    </div>
  )
}
