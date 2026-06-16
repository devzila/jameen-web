import React, { useEffect, useState } from 'react'
import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import useFetch from 'use-http'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

const STATS = [
  {
    idx: 5,
    filter: 5,
    last30Filter: '',
    label: 'All Issues',
    key: 'total',
    icon: freeSet.cilLayers,
    color: '#00bfcc',
    bg: 'rgba(0,191,204,0.12)',
  },
  {
    idx: 0,
    filter: '0',
    last30Filter: '0',
    label: 'Pending Issues',
    key: 'requested',
    icon: freeSet.cilClock,
    color: '#e8590c',
    bg: '#fff4e6',
  },
  {
    idx: 1,
    filter: '1',
    last30Filter: '1',
    label: 'In Progress',
    key: 'in_progress',
    icon: freeSet.cilReload,
    color: '#1c7ed6',
    bg: '#e7f5ff',
  },
  {
    idx: 3,
    filter: '3',
    last30Filter: '3',
    label: 'Closed Issues',
    key: 'resolved',
    icon: freeSet.cilCheckCircle,
    color: '#1a9e54',
    bg: '#e6f9ec',
  },
  {
    idx: 4,
    filter: '4',
    last30Filter: '4',
    label: 'Re-open',
    key: 'reopen',
    icon: freeSet.cilActionUndo,
    color: '#7048e8',
    bg: '#f3f0ff',
  },
  {
    idx: 2,
    filter: '2',
    last30Filter: '2',
    label: 'Cancelled',
    key: 'cancelled',
    icon: freeSet.cilXCircle,
    color: '#e03131',
    bg: '#fdeaea',
  },
]

export default function TopCards({ refresh, filter_callback }) {
  const { get, response } = useFetch()
  const [allData, setAllData] = useState({})
  const [last30Days, setlast30Days] = useState({})

  const [active, setActive] = useState([false, false, false, false, false, true])

  const { propertyId } = useParams()

  useEffect(() => {
    getStatsData()
  }, [refresh])

  const getStatsData = async () => {
    const endpoint = propertyId
      ? `/v1/admin/premises/properties/${propertyId}/maintenance_request_stats`
      : `/v1/admin/maintenance/stats`

    const api = await get(endpoint)
    if (response.ok) {
      setAllData(addAllCount(api.all))
      setlast30Days(addAllCount(api.last_30days))
    }
  }

  function addAllCount(data) {
    const sum = data.requested + data.in_progress + data.cancelled + data.resolved + data.reopen
    return { ...data, total: sum }
  }

  const applyFilters = (type, date = false) => {
    let query = '&q[status_eq]='
    if (type != 5) {
      query += type
    }

    if (date) {
      const current_date = new Date()
      const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(current_date)
      query += `&q[created_at_gteq]=${formattedDate.toString()}`
    }
    const active_data = [false, false, false, false, false, false]
    active_data[type] = true
    setActive(active_data)
    filter_callback(query)
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
      }}
    >
      {STATS.map((stat) => {
        const isActive = !!active[stat.idx]
        return (
          <div
            key={stat.label}
            onClick={() => applyFilters(stat.filter)}
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '18px',
              cursor: 'pointer',
              border: isActive ? `1.5px solid ${stat.color}` : '1px solid #eef1f5',
              boxShadow: isActive ? `0 6px 18px ${stat.bg}` : '0 2px 10px rgba(0,0,0,.04)',
              transition: 'transform .15s ease, box-shadow .15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div
                  style={{
                    color: '#8a94a6',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: '30px',
                    fontWeight: 700,
                    color: '#1f2933',
                    marginTop: '6px',
                    lineHeight: 1.1,
                  }}
                >
                  {allData[stat.key] || 0}
                </div>
              </div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: stat.bg,
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CIcon icon={stat.icon} size="xl" />
              </div>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                applyFilters(stat.last30Filter, true)
              }}
              className="d-flex align-items-center justify-content-between"
              style={{
                marginTop: '14px',
                paddingTop: '10px',
                borderTop: '1px solid #f2f4f7',
              }}
            >
              <span style={{ color: '#8a94a6', fontSize: '12px' }}>Last 30 days</span>
              <span
                style={{
                  background: stat.bg,
                  color: stat.color,
                  borderRadius: '999px',
                  padding: '2px 10px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {last30Days[stat.key] || 0}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

TopCards.propTypes = {
  refresh: PropTypes.bool,
  filter_callback: PropTypes.func,
}
