import React, { useState, useEffect } from 'react'
import Pagination from 'src/components/Pagination'
import MaintenanceList from './MaitenanceList'
import apiClient from './../../api/client'

const Maintenance = () => {
  //const [listData, setListData] = useState([{ a: 'a' }, { a: 'b' }])
  const [listData, setListData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const setData = (data) => {
    setListData(data.requests)
    setTotalPages(data.pagination.total_pages)
    setCurrentPage(data.pagination.current_page)
  }

  useEffect(() => {
    setLoading(true)
    apiClient
      .get(`/v1/admin/maintenance/requests/?page=${currentPage}`)
      .then((response) => {
        Array.isArray(response.data.data.requests)
          ? setData(response.data.data)
          : setError('Invalid API response')
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [currentPage])

  return (
    <>
      <h1>Maintenance</h1>
      {loading && <p>Maintenance are loading!</p>}
      <MaintenanceList listData={listData} />
      <Pagination current={currentPage} pageCount={totalPages} />
    </>
  )
}
export default Maintenance
