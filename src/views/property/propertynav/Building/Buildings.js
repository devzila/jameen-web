import React, { useState, useEffect } from 'react'
import { CCol, CCard, CListGroupItem, CCardImage, CRow, CCardText, CImage } from '@coreui/react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import Loading from 'src/components/loading/loading'
import { Dropdown, Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Paginate from '../../../../components/Pagination'

import { formatdate } from '../../../../services/CommonFunctions'

export default function Buildings() {
  const [buildings, setBuildings] = useState([])
  const [invoices, setInvoices] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)

  const { propertyId } = useParams()

  const [searchKeyword, setSearchKeyword] = useState(null)
  const { get, response } = useFetch()

  useEffect(() => {
    fetchBuildings()
  }, [propertyId])

  async function fetchBuildings() {
    try {
      const buildingsData = await get(`/v1/admin/premises/properties/${propertyId}/buildings`)
      console.log(buildingsData)
      if (buildingsData && buildingsData.data) {
        setBuildings(buildingsData.data)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching billable items:', error)
    }
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
                    <CNavbarBrand href="#"></CNavbarBrand>
                    <div className="d-flex justify-content-end">
                      <div className="d-flex" role="search">
                        <input
                          onChange={(e) => setSearchKeyword(e.target.value)}
                          className="form-control  custom_input"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                        />
                        <button
                          // onClick={loadInitialinvoices}
                          className="btn btn-outline-success custom_search_button"
                          type="submit"
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </CContainer>
                </CNavbar>
                <hr className="p-0 m-0 text-secondary" />
                <div className="row justify-content-center">
                  <div className="col-12">
                    <div className="table-responsive bg-white">
                      <table className="table mb-0">
                        <thead
                          style={{
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overFlow: 'hidden',
                          }}
                        >
                          <tr>
                            <th className="pt-3 pb-3 border-0">Name</th>
                            <th className="pt-3 pb-3 border-0">Description</th>
                            <th className="pt-3 pb-3 border-0">Created At </th>
                          </tr>
                        </thead>

                        <tbody>
                          {buildings.map((data) => (
                            <tr key={data.id}>
                              <td>{data.name}</td>
                              <td>{data.description}</td>
                              <td>{formatdate(data.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {loading && <Loading />}
                      {errors == true ? toast('We are facing a technical issue at our end.') : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br></br>
          <CNavbar
            colorScheme="light"
            className="bg-light d-flex justify-content-center"
            placement="fixed-bottom"
          >
            <Row>
              <Col md="12">
                {pagination ? (
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
