import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { formatdate, status_color } from 'src/services/CommonFunctions'
import CustomDivToggle from 'src/components/CustomDivToggle'
import { Dropdown } from 'react-bootstrap'
import { BsThreeDots } from 'react-icons/bs'
import AddEditMaintenance from './AddEditMaintenance'
import dafaultAvatar from 'src/assets/images/avatars/default.png'
import UpdateRequestStatus from './UpdateRequestStatus'
import CheckPermissions from 'src/permissions/CheckPermissions'

const THEME_COLOR = '#00bfcc'

function statusBadgeStyle(status) {
  const palette = {
    red: { bg: '#fdeaea', color: '#e03131' },
    orange: { bg: '#fff4e6', color: '#e8590c' },
    green: { bg: '#e6f9ec', color: '#1a9e54' },
    gray: { bg: '#eef1f5', color: '#495057' },
  }
  const colors = palette[status_color(String(status).toLowerCase())] || palette.gray
  return {
    background: colors.bg,
    color: colors.color,
    padding: '4px 14px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'capitalize',
    display: 'inline-block',
  }
}

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

export default function MaintenanceTable({ data, refreshData, api_endpoint }) {
  return (
    <div className="table-responsive">
      <style>{`
        .maintenance-table tbody tr { transition: background-color .15s ease; }
        .maintenance-table tbody tr:hover { background-color: #f5fdfe; }
      `}</style>
      <table className="table maintenance-table mb-0" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={headerCellStyle}>Title</th>
            <th style={headerCellStyle}>Category</th>
            <th style={headerCellStyle}>Priority</th>
            <th style={headerCellStyle}>Assignee</th>
            <th style={headerCellStyle}>Status</th>
            <th style={headerCellStyle}>Created At</th>
            <th style={headerCellStyle}>Expected Handover Date</th>
            <th style={{ ...headerCellStyle, textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr key={item.id}>
              <td style={bodyCellStyle}>
                <NavLink
                  to={`${item.id}`}
                  className="fw-semibold"
                  style={{ color: THEME_COLOR, textDecoration: 'none' }}
                >
                  {item.title || '-'}
                </NavLink>
              </td>
              <td style={bodyCellStyle}>{item.category?.name || '-'}</td>
              <td style={bodyCellStyle} className="text-capitalize">
                {item.category?.priority || '-'}
              </td>
              <td style={bodyCellStyle}>
                <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                  {item?.assigned_user?.name ? (
                    <img
                      width="24px"
                      height="24px"
                      src={dafaultAvatar}
                      style={{ borderRadius: '50%' }}
                      alt=""
                    />
                  ) : null}
                  <span style={{ color: item?.assigned_user?.name ? '#1f2933' : '#8a94a6' }}>
                    {item?.assigned_user?.name || 'Unassigned'}
                  </span>
                </div>
              </td>
              <td style={bodyCellStyle}>
                <span style={statusBadgeStyle(item?.status)}>
                  {item.status ? item.status.replace('_', ' ') : '-'}
                </span>
              </td>
              <td style={bodyCellStyle}>{formatdate(item.created_at) || '-'}</td>
              <td style={bodyCellStyle}>{item.completion_date || '-'}</td>
              <td style={bodyCellStyle}>
                <div className="d-flex justify-content-center">
                  <Dropdown key={item.id}>
                    <Dropdown.Toggle as={CustomDivToggle} className="cursor-pointer">
                      <BsThreeDots />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <CheckPermissions
                        component={
                          <AddEditMaintenance
                            type="edit"
                            api_endpoint={api_endpoint}
                            id={item.id}
                            refreshData={refreshData}
                          />
                        }
                        keys={['maintenance_requests', 'edit']}
                      />
                      <CheckPermissions
                        component={
                          <UpdateRequestStatus
                            id={item.id}
                            api_endpoint={api_endpoint}
                            refreshData={refreshData}
                          />
                        }
                        keys={['maintenance_requests', 'cancel']}
                      />
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </td>
            </tr>
          ))}
          {data?.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="text-center text-secondary fst-italic"
                style={{ padding: '32px' }}
              >
                No maintenance requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

MaintenanceTable.propTypes = {
  data: PropTypes.array,
  refreshData: PropTypes.func,
  api_endpoint: PropTypes.string,
}
