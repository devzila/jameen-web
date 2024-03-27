import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import '../../../scss/_custom.scss'
import { BsThreeDots } from 'react-icons/bs'
import Loading from 'src/components/loading/loading'
import { Row, Col, Dropdown } from 'react-bootstrap'
import Paginate from '../../../components/Pagination'
import { NavLink, useParams } from 'react-router-dom'

import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import CustomDivToggle from '../../../components/CustomDivToggle'
import Add from './AddUnit'
import Edit from './EditUnit'
import Delete from './DeleteUnit'
import PickOwner from './UnitFunctions/PickOwner'
import AllocateUnit from './AllocateUnit'
import FilterAccordion from './UnitFunctions/FilterAccordioan'
import MovingInUnit from './MovingInUnit'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

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
  const [unit_type, setUnit_type] = useState([])

  useEffect(() => {
    loadInitialUnits()
    loadUnitTypes()
  }, [currentPage])

  async function loadUnitTypes() {
    let endpoint = await get(`/v1/admin/premises/properties/${propertyId}/unit_types`)
    console.log(endpoint)

    if (response.ok) {
      const temp_unit = await endpoint.data.map((data) => ({
        label: data.name,
        value: data.id,
      }))
      setUnit_type(temp_unit)
    } else {
      setUnit_type([])
    }
  }

  async function loadInitialUnits(queries) {
    let endpoint = `/v1/admin/premises/properties/${propertyId}/units?page=${currentPage}`

    if (queries) {
      endpoint += queries
    }

    // /unit_types

    if (searchKeyword) {
      endpoint += `&q[unit_no_eq]=${searchKeyword}`
    }

    const initialUnits = await get(endpoint)
    console.log(initialUnits)

    if (response.ok) {
      setErrors(false)

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
  const refresh_data = () => {
    loadInitialUnits()
  }

  function status_color(status) {
    switch (status) {
      case 'unallotted':
        return 'rgb(0, 128, 0)'
        break
      case 'vacant':
        return 'rgba(0, 120, 0,0.7)'
        break
      case 'occupied':
        return 'grey'
        break
      default:
        return 'white'
    }
  }

  function filter_callback(queries) {
    loadInitialUnits(queries)
    setSearchKeyword('')
  }

  return (
    <>
      <div>
        <section className="w-100 p-0 mt-2">
          <div>
            <div className="mask d-flex align-items-center h-100">
              <div className="container-fluid">
                <CNavbar expand="lg" colorScheme="light" className="bg-white">
                  <CContainer fluid>
                    <CNavbarBrand href="#">Unit</CNavbarBrand>
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
                          onClick={loadInitialUnits}
                          className="btn btn-outline-success custom_search_button "
                          type="submit"
                        >
                          <CIcon icon={freeSet.cilSearch} />
                        </button>
                      </div>
                      <FilterAccordion filter_callback={filter_callback} units_type={unit_type} />
                      <Add after_submit={refresh_data} />
                    </div>
                  </CContainer>
                </CNavbar>
                <hr className="p-0 m-0 text-secondary" />

                <div className="row justify-content-center">
                  <div className="col-16">
                    <div className="table-responsive bg-white">
                      <table className="table  table-striped mb-0">
                        <thead
                          style={{
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overFlow: 'hidden',
                          }}
                        >
                          <tr>
                            <th className="pt-3 pb-3 border-0  ">Unit Number</th>
                            <th className="pt-3 pb-3 border-0  ">Bed/Bath </th>
                            <th className="pt-3 pb-3 border-0  ">Year Built</th>
                            <th className="pt-3 pb-3 border-0  ">Owner/Resident</th>
                            <th className="pt-3 pb-3 border-0  ">Status</th>
                            <th className="pt-3 pb-3 border-0 text-center ">Action </th>
                          </tr>
                        </thead>

                        <tbody>
                          {units.map((unit) => (
                            <tr key={unit.id}>
                              <td className="pt-3 pb-2">
                                <NavLink className="mx-2 p-0" to={`${unit.id}`}>
                                  {unit.unit_no}
                                </NavLink>
                              </td>

                              <td className="pt-3 pb-2 text-center">
                                {unit.bedrooms_number + '  /  ' + unit.bathrooms_number}
                              </td>
                              <td className="pt-3 pb-2">{unit.year_built}</td>
                              <td className="pt-3 pb-2">
                                {unit.running_contracts[0]?.contract_members
                                  ? PickOwner(unit.running_contracts[0]?.contract_members)
                                  : '-'}
                              </td>
                              <td className="pt-3 pb-2 ">
                                <button
                                  className="text-center"
                                  style={{
                                    backgroundColor: `${status_color(unit.status)}`,
                                    border: '0px',
                                    padding: '1px',
                                    borderRadius: '2px',
                                    color: 'white',
                                    cursor: 'default',
                                    width: '120px',
                                  }}
                                >
                                  {unit.status}
                                </button>
                              </td>

                              <td>
                                <Dropdown key={unit.id} className="text-center">
                                  <Dropdown.Toggle
                                    as={CustomDivToggle}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <BsThreeDots />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Edit unitId={unit.id} after_submit={refresh_data} />
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

                                    <Delete unitId={unit.id} after_submit={refresh_data} />

                                    {unit.status === 'unallotted' ? (
                                      <AllocateUnit
                                        unitId={unit.id}
                                        unitNo={unit.unit_no}
                                        after_submit={refresh_data}
                                      />
                                    ) : null}
                                    {unit.status === 'vacant' ? (
                                      <MovingInUnit
                                        unitId={unit.id}
                                        unitNo={unit.unit_no}
                                        after_submit={refresh_data}
                                      />
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

export default Unit
