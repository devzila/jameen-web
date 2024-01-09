import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { BsThreeDots } from 'react-icons/bs'
import { Row, Button, Col, Card, Table, Modal } from 'react-bootstrap'
import Paginate from '../../../components/Pagination'
import { Dropdown } from 'react-bootstrap'
import CustomDivToggle from '../../../components/CustomDivToggle'
import '../../../scss/_custom.scss'
import { CForm, CButton, CFormInput, CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import Add from './Add'
import Edit from './Edit'
import Show from './Show'
import Delete from './Delete'

function Unit() {
  const { get, response, error } = useFetch()

  useEffect(() => {}, [])

  const { propertyId } = useParams()
  const [units, setUnits] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    loadInitialUnits()
  }, [currentPage, searchKeyword, refresh])

  async function loadInitialUnits() {
    let endpoint = `/v1/admin/premises/properties/${propertyId}/units?page=${currentPage}`

    if (searchKeyword) {
      endpoint += `&q[unit_no_eq]=${searchKeyword}`
    }

    const initialUnits = await get(endpoint)

    if (response.ok) {
      setUnits(initialUnits.data.units)
      setPagination(initialUnits.data.pagination)
    }
  }

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1)
  }

  const handleSearch = (searchTerm) => {
    setSearchKeyword(searchTerm)
  }

  const refreshHandler = () => {
    setRefresh(!refresh)
  }

  return (
    <>
      <div>
        {error && error.Error}
        <section style={{ width: '100%', padding: '0px' }}>
          <CNavbar expand="lg" colorScheme="light" className="bg-light">
            <CContainer fluid>
              <CNavbarBrand href="#">Unit</CNavbarBrand>

              <div className="d-flex justify-content-end">
                <CForm onSubmit={(e) => e.preventDefault()} className="input-group  d-flex ">
                  <CFormInput
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    type="search"
                    className="me-0"
                    placeholder="Search"
                  />
                  <CButton
                    onClick={loadInitialUnits}
                    variant="outline"
                    className="btn btn-outline-success my-2 my-sm-0 "
                  >
                    Search
                  </CButton>
                  <br></br>
                  <Add />
                </CForm>
              </div>
            </CContainer>
          </CNavbar>
          <div>
            <div className="mask d-flex align-items-center h-100">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-16">
                    <div className="table-responsive bg-white">
                      <table className="table mb-0">
                        <thead
                          style={{
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overFlow: 'hidden',
                          }}
                        >
                          <tr style={{ color: 'pink' }}>
                            <th className="pt-3 pb-3 border-0">Unit Number</th>
                            <th className="pt-3 pb-3 border-0">BedRoom Number</th>
                            <th className="pt-3 pb-3 border-0">BathRoom Number</th>
                            <th className="pt-3 pb-3 border-0">Year Built</th>
                            <th className="pt-3 pb-3 border-0">Owner/Resident</th>
                            <th className="pt-3 pb-3 border-0">Status</th>
                            <th className="pt-3 pb-3 border-0">Action </th>
                          </tr>
                        </thead>

                        <tbody>
                          {units.map((unit) => (
                            <tr key={unit.id}>
                              <th className="pt-3" scope="row" style={{ color: '#666666' }}>
                                {unit.unit_no}
                              </th>
                              <td className="pt-3">{unit.bedrooms_number}</td>
                              <td className="pt-3">{unit.bathrooms_number}</td>
                              <td className="pt-3">{unit.year_built}</td>
                              <td className="pt-3">
                                {unit.resident_units[0]?.resident.first_name +
                                  ' ' +
                                  unit.resident_units[0]?.resident.last_name}
                              </td>
                              <td className="pt-3">{unit.status}</td>

                              <td>
                                <Dropdown key={unit.id}>
                                  <Dropdown.Toggle
                                    as={CustomDivToggle}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <BsThreeDots />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Edit unitid={{ id: `${unit.id}` }} />
                                    <Show unitid={{ id: `${unit.id}` }} />
                                    <Delete unitid={{ id: `${unit.id}` }} />
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

export default Unit
