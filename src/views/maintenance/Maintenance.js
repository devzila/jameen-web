import React, { useState, useEffect } from 'react'
import Pagination from 'src/components/Pagination'
import RoundedNavbar from '../shared/RoundedNavbar'
import { freeSet } from '@coreui/icons'
import TopCards from './Components/TopCards'
import MaintanceBody from './MaintanceBody'

const Maintenance = () => {
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
  }, [currentPage])

  return (
    <>
      <TopCards />
      <MaintanceBody />

      <Pagination current={currentPage} pageCount={totalPages} />
    </>
  )
}
export default Maintenance
