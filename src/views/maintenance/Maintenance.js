import React, { useState } from 'react'
import MaintenanceList from './MaitenanceList'

const Maintenance = () => {
  // const apiPath = '/v1/admin/maintenances'
  const [listData, setListData] = useState([{ a: 'a' }, { a: 'b' }])
  // const [loading, setLoading] = useState(true)
  // const [currentPage, setCurrentPage] = useState(1)
  // const getCurrentPage = () => {
  //   return `apiPath/?page=${1}`
  // }

  return (
    <>
      <h1>Maintenance</h1>
      <MaintenanceList listData={listData} />
    </>
  )
}
export default Maintenance
