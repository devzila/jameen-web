export function formatdate(isoDate) {
  {
    const date = new Date(isoDate)
    const options = { day: '2-digit', month: 'short', year: 'numeric' }

    const formatted_date = date.toLocaleDateString('en-US', options) || '-'

    return formatted_date
  }
}

export function status_color(status) {
  switch (status) {
    case 'pending':
      return 'rgb(255, 68, 51)'
    case 'vacant':
      return 'rgba(0, 120, 0,0.7)'
      break
    case 'occupied':
      return 'grey'
      break
    default:
      return 'white'
  }
}
