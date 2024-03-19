import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { BsThreeDots } from 'react-icons/bs'
import Loading from 'src/components/loading/loading'
import { Row, Col, Dropdown, Button } from 'react-bootstrap'
import Paginate from 'src/components/Pagination'
import { useParams } from 'react-router-dom'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import EditMaintenance from './EditMaintenance'
import AddMaintenance from './AddMaintenance'
import ShowMaintenance from './ShowMaintenance.js'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

function Maintenances() {
  const { propertyId } = useParams()
  const { get, response, error } = useFetch()
  const [maintenanceCategories, setMaintenanceCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    fetchMaintenanceCategories()
  }, [currentPage, searchKeyword])

  const fetchMaintenanceCategories = async () => {
    try {
      const result = await get(
        `/v1/admin/premises/properties/${propertyId}/maintenance_categories?page=${currentPage}&q[name_cont]=${searchKeyword}`,
      )
      if (response.ok) {
        setMaintenanceCategories(result.data)
        setPagination(result.pagination)
        setLoading(false)
      } else {
        console.error('Failed to fetch maintenance categories:', error)
        setLoading(false)
      }
    } catch (error) {
      console.error('Failed to fetch maintenance categories:', error)
      setLoading(false)
    }
  }

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1)
  }

  const refreshData = () => {
    fetchMaintenanceCategories()
  }

  return (
    <>
      <div>
        <section className="w-100 p-0 mt-2">
          <div>
            <div className="mask d-flex align-items-center h-100">
              <div className="container">
                <CNavbar expand="lg" colorScheme="light" className="bg-white">
                  <CContainer fluid>
                    <CNavbarBrand href="#">Maintenance</CNavbarBrand>
                    <div className="d-flex justify-content-end bg-light">
                      <div className="d-flex  " role="search">
                        <input
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                          className="form-control me-0 custom_input  "
                          type="text"
                          placeholder="Search"
                          aria-label="Search"
                        />
                        <button
                          onClick={fetchMaintenanceCategories}
                          className="btn btn-outline-success custom_search_button "
                          type="submit"
                        >
                          <CIcon icon={freeSet.cilSearch} />
                        </button>
                      </div>
                      <AddMaintenance afterSubmit={refreshData} />
                    </div>
                  </CContainer>
                </CNavbar>
                <hr className="p-0 m-0 text-secondary" />
                <div className="row justify-content-center">
                  <div className="col-16">
                    {loading ? (
                      <Loading />
                    ) : (
                      <div>
                        <div className="table-responsive bg-white">
                          <table className="table mb-0">
                            <thead>
                              <tr>
                                <th className="border-0">Name</th>
                                <th className="border-0">Description</th>
                                <th className="border-0">Priority</th>
                                <th className="border-0">Is Default</th>
                                <th className="border-0">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {maintenanceCategories.map((category) => (
                                <tr key={category.id}>
                                  <td>{category.name}</td>
                                  <td>{category.description}</td>
                                  <td>{category.priority}</td>
                                  <td>{category.is_default ? 'Yes' : 'No'}</td>
                                  <td>
                                    <Dropdown>
                                      <Dropdown.Toggle
                                        variant="link"
                                        id="dropdown-basic"
                                        as={BsThreeDots}
                                      />
                                      <Dropdown.Menu>
                                        <EditMaintenance
                                          categoryId={category.id}
                                          isDefault={category.is_default}
                                          afterSubmit={refreshData}
                                        />
                                        {/* <ShowMaintenance categoryId={category.id} /> */}
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {maintenanceCategories.length === 0 && (
                          <p className="text-center">No maintenance categories found.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        </section>
      </div>
    </>
  )
}

export default Maintenances
