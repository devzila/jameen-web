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
    published: 'green',
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

export function cleanAvatar(payload) {
  if (payload.avatar && (payload.avatar.data === '' || payload.avatar.data === undefined)) {
    delete payload.avatar
  }
  return payload
}

export function removeEmptyDocuments(payload) {
  console.log(payload)
  const documents = payload.documents_attributes
  console.log(documents)
  payload.documents_attributes = documents.filter((doc) => {
    return doc.name !== '' || doc.description !== '' || doc.file.data != undefined
  })

  return payload
}

export function formatNumberCount(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'm'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  } else {
    return num
  }
}
