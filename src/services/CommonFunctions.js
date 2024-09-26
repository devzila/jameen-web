import { useFetch } from 'use-http'
export function formatdate(isoDate) {
  if (isoDate) {
    const date = new Date(isoDate)
    const options = { day: '2-digit', month: 'short', year: 'numeric' }

    const formatted_date = date.toLocaleDateString('en-US', options) || '-'

    return formatted_date
  } else {
    return null
  }
}

export function status_color(status) {
  const statusColors = {
    pending: 'red',
    requested: 'red',
    due: 'orange',
    vacant: 'orange',
    paid: 'green',
    unallotted: 'green',
    cancelled: 'gray',
    occupied: 'gray',
  }

  return statusColors[status] || 'gray'
}
export function format_react_select(data, key) {
  if (data) {
    return data.map((e) => ({
      value: e[key[0]],
      label: e[key[1]],
    }))
  } else {
    return []
  }
}
