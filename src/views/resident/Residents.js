import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import AddResidents from './AddResidents'
import EditResidents from './EditResidents'
import ShowResidents from './ShowResidents'
import Paginate from '../../components/Pagination'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from 'src/components/CustomDivToggle'

import { CForm, CButton, CFormInput, CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Dropdown, Row, Col } from 'react-bootstrap'

const Residents = () => {
  const { get, response } = useFetch()

  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const [residents, setResidents] = useState([])
  const [searchKeyword, setSearchKeyword] = useState(null)

  useEffect(() => {
    loadInitialResidents()
  }, [])

  async function loadInitialResidents() {
    let endpoint = `/v1/admin/residents?page=${currentPage}`
    if (searchKeyword) {
      endpoint += `&q[username_eq]=${searchKeyword}`
    }
    let initialResidents = await get(endpoint)

    console.log(initialResidents)

    if (response.ok) {
      if (initialResidents.data) {
        setLoading(false)
        setResidents(initialResidents.data)
        setPagination(initialResidents.pagination)
      }
    } else {
      setErrors(true)
      setLoading(false)
    }
  }
  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  return (
    <div>
      <CNavbar expand="lg" colorScheme="light" className="bg-light">
        <CContainer fluid>
          <CNavbarBrand href="/residents">Residents</CNavbarBrand>
          <div className="d-flex justify-content-end">
            <div className="d-flex" role="search">
              <input
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                onClick={loadInitialResidents}
                className="btn btn-outline-success"
                type="submit"
              >
                Search
              </button>
            </div>
            <AddResidents />
          </div>
        </CContainer>
      </CNavbar>
      <div>
        <div className="mask d-flex align-items-center h-100">
          <div className="container">
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
                        <th className="pt-3 pb-3 border-0">DOB</th>
                        <th className="pt-3 pb-3 border-0">Username </th>
                        <th className="pt-3 pb-3 border-0">Gender</th>
                        <th className="pt-3 pb-3 border-0">Email</th>
                        <th className="pt-3 pb-3 border-0">Mobile Number </th>
                      </tr>
                    </thead>

                    <tbody>
                      {residents.map((residents) => (
                        <tr key={residents.id}>
                          <th className="pt-3" scope="row" style={{ color: '#666666' }}>
                            {residents.first_name + ' ' + residents.last_name}
                          </th>
                          <td className="pt-3">{residents.dob}</td>
                          <td className="pt-3">{residents.username}</td>
                          <td className="pt-3">
                            {residents.gender.charAt(0).toUpperCase() + residents.gender.slice(1)}
                          </td>
                          <td className="pt-3">{residents.email}</td>
                          <td className="pt-3">{residents.phone_number}</td>

                          <td>
                            <Dropdown key={residents.id}>
                              <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                                <BsThreeDots />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <EditResidents residentid={{ id: `${residents.id}` }} />
                                <ShowResidents residentid={{ id: `${residents.id}` }} />
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {loading && <Loading />}
                  {errors && (
                    <p
                      className="d-flex justify-content-cente"
                      style={{ color: 'red', fontSize: 'x-large', marginLeft: '30%' }}
                    >
                      We are facing a technical issue at our end.
                    </p>
                  )}
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
    </div>
  )
}
export default Residents
