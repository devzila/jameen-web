import React, { useState } from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'

const News = () => {
  const [currentPage, setActivePage] = useState(2)

  return (
    <div className={'mt-2'}>
      <h1>Pagination example on News screen</h1>
      <CPagination
        activePage={currentPage}
        pages={20}
        onActivePageChange={(i) => setActivePage(i)}
      ></CPagination>
    </div>
  )
}
export default News
