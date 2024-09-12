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
  switch (status) {
    case ('pending', 'requested'):
      return 'rgb(255, 68, 51)'
    case 'due':
      return 'rgba(0, 120, 0,0.7)'

    case 'paid':
      return 'green'

    case 'cancelled':
      return 'grey'
    default:
      return 'white'
  }
}
