import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import '../../../scss/_custom.scss'
import { BsThreeDots } from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import Loading from 'src/components/loading/loading'
import { Row, Col, Dropdown } from 'react-bootstrap'
import Paginate from '../../../components/Pagination'
import { NavLink, Link } from 'react-router-dom'

import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import CustomDivToggle from '../../../components/CustomDivToggle'
import Add from './AddUnit'
import Edit from './EditUnit'
import Show from './ShowUnitModule/ShowUnit'
import Delete from './DeleteUnit'
import PickOwner from './PickOwner'
import AllocateUnit from './AllocateUnit'

function Unit() {
  const { get, response, error } = useFetch()

  useEffect(() => {}, [])

  const { propertyId } = useParams()
  const [units, setUnits] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInitialUnits()
  }, [currentPage, searchKeyword, refresh])

  async function loadInitialUnits() {
    let endpoint = `/v1/admin/premises/properties/${propertyId}/units?page=${currentPage}`

    if (searchKeyword) {
      endpoint += `&q[unit_no_eq]=${searchKeyword}`
    }

    const initialUnits = await get(endpoint)

    console.log(initialUnits)
    if (response.ok) {
      setLoading(false)
      setUnits(initialUnits.data)
      setPagination(initialUnits.pagination)
    } else {
      setErrors(true)
      setLoading(false)
    }
  }

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1)
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
                <div className="d-flex" role="search">
                  <input
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button
                    onClick={loadInitialUnits}
                    className="btn btn-outline-success"
                    type="submit"
                  >
                    Search
                  </button>
                </div>
                <Add />
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
                          <tr>
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
                              <th>
                                {console.log(unit)}
                                <NavLink
                                  style={{
                                    border: 'none',
                                    color: '#00bfcc',
                                    marginLeft: '35%',
                                    textDecorationLine: 'none',
                                  }}
                                  to={`/properties/${propertyId}/units/${unit.id}`}
                                >
                                  {unit.unit_no}
                                </NavLink>
                              </th>

                              <td className="pt-3">{unit.bedrooms_number}</td>
                              <td className="pt-3">{unit.bathrooms_number}</td>
                              <td className="pt-3">{unit.year_built}</td>
                              <td className="pt-3">{PickOwner(unit.members_units)}</td>
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
                                    <NavLink
                                      style={{
                                        border: 'none',
                                        color: '#00bfcc',
                                        marginLeft: '35%',
                                        textDecorationLine: 'none',
                                      }}
                                      to={`/properties/${propertyId}/units/${unit.id}`}
                                    >
                                      Show
                                    </NavLink>

                                    <Delete unitid={{ id: `${unit.id}` }} />
                                    {unit.status === 'unallotted' ? (
                                      <AllocateUnit unitId={unit.id} unitNo={unit.unit_no} />
                                    ) : null}
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
                          There is a technical issue at Backend
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
        </section>
      </div>
    </>
  )
}

export default Unit
