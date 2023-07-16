import React from 'react'
import Pagination from 'src/components/Pagination'
const Finance = () => {
  return (
    <>
      <h1>Finance</h1>
      <Pagination path="/maintenance/requests" current="2" pageCount="20" />
    </>
  )
}
export default Finance
