import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { BsThreeDots } from 'react-icons/bs'
import Loading from 'src/components/loading/loading'
import { Row, Col, Dropdown } from 'react-bootstrap'
import Paginate from 'src/components/Pagination'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import EditMaintenance from './EditMaintenance'
import AddMaintenance from './AddMaintenance'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

function Maintenances() {
  const { get } = useFetch()

  const [maintenanceCategories, setMaintenanceCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')

  // FETCH DATA
  const fetchMaintenanceCategories = async () => {
    try {
      setLoading(true)

      // API URL
      const url = `/v1/admin/maintenance/categories?page=${currentPage}`

      console.log('API URL:', url)

      const result = await get(url)

      console.log('API RESULT:', result)

      // ALL DATA
      const allData = result?.data || []

      // FRONTEND SEARCH FILTER
      const filteredData = allData.filter((item) =>
        item.name?.toLowerCase().includes(searchKeyword.toLowerCase()),
      )

      setMaintenanceCategories(filteredData)

      setPagination(
        result?.pagination || {
          total_pages: 1,
          per_page: 10,
        },
      )
    } catch (err) {
      console.error('ERROR:', err)
    } finally {
      setLoading(false)
    }
  }

  // LOAD DATA
  useEffect(() => {
    fetchMaintenanceCategories()
  }, [currentPage, searchKeyword])

  // PAGINATION
  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1)
  }

  // REFRESH
  const refreshData = () => {
    fetchMaintenanceCategories()
  }

  return (
    <div>
      <section className="w-100 p-0 mt-2">
        {/* NAVBAR */}
        <CNavbar expand="lg" colorScheme="light" className="bg-white">
          <CContainer fluid>
            <CNavbarBrand href="#">Categories</CNavbarBrand>

            <div className="d-flex justify-content-end bg-light">
              {/* SEARCH */}
              <div className="d-flex" role="search">
                <input
                  value={searchKeyword}
                  onChange={(e) => {
                    setCurrentPage(1)
                    setSearchKeyword(e.target.value)
                  }}
                  className="form-control me-0 custom_input"
                  type="text"
                  placeholder="Search by name"
                />

                <button className="btn btn-outline-success custom_search_button" type="button">
                  <CIcon icon={freeSet.cilSearch} />
                </button>
              </div>

              {/* ADD BUTTON */}
              <AddMaintenance afterSubmit={refreshData} />
            </div>
          </CContainer>
        </CNavbar>

        <hr className="p-0 m-0 text-secondary" />

        {/* TABLE */}
        <div className="row justify-content-center">
          <div className="col-12">
            {loading ? (
              <Loading />
            ) : (
              <div>
                <div className="table-responsive bg-white">
                  <table className="table table-striped mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Is Default</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {maintenanceCategories.length > 0 ? (
                        maintenanceCategories.map((category) => (
                          <tr key={category.id}>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>{category.priority}</td>
                            <td>{category.is_default ? 'Yes' : 'No'}</td>

                            <td>
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="link"
                                  id={`dropdown-${category.id}`}
                                  as={BsThreeDots}
                                />

                                <Dropdown.Menu>
                                  <EditMaintenance
                                    categoryId={category.id}
                                    isDefault={category.is_default}
                                    afterSubmit={refreshData}
                                  />
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No maintenance categories found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                <CNavbar colorScheme="light" className="bg-light d-flex justify-content-center">
                  <Row>
                    <Col md="12">
                      {pagination?.total_pages > 1 ? (
                        <Paginate
                          onPageChange={handlePageClick}
                          pageRangeDisplayed={pagination.per_page}
                          pageCount={pagination.total_pages}
                          forcePage={currentPage - 1}
                        />
                      ) : (
                        <br />
                      )}
                    </Col>
                  </Row>
                </CNavbar>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Maintenances
