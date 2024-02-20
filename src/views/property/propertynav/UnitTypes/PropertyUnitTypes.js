import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'

import Paginate from '../../../../components/Pagination'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from 'src/components/CustomDivToggle'

import {
  CNavbar,
  CContainer,
  CNavbarBrand,
  CAccordionBody,
  CAccordion,
  CAccordionHeader,
} from '@coreui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Dropdown, Row, Col, Accordion } from 'react-bootstrap'
import { Link, NavLink, useParams } from 'react-router-dom'
import BillableItems from './BillableCrud/BilliableItems'

const PropertyUnitType = () => {
  const { get, response } = useFetch()
  const { propertyId } = useParams()

  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const [visible, setVisible] = useState(false)

  const [showBillable, setShowBillable] = useState(false)

  const [unit_type, setUnit_types] = useState([])
  const [searchKeyword, setSearchKeyword] = useState(null)

  useEffect(() => {
    loadInitialUnitsTypes()
  }, [currentPage])

  async function loadInitialUnitsTypes() {
    let endpoint = `/v1/admin/premises/properties/${propertyId}/unit_types?page=${currentPage}`
    if (searchKeyword) {
      endpoint += `&q[username_eq]=${searchKeyword}`
    }
    const initialUnitTypes = await get(endpoint)
    console.log(initialUnitTypes)

    if (response.ok) {
      if (initialUnitTypes.data) {
        setLoading(false)
        setUnit_types(initialUnitTypes.data)
        setPagination(initialUnitTypes.pagination)
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
          <CNavbarBrand href="/unit_type">Unit Types</CNavbarBrand>
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
                onClick={loadInitialUnitsTypes}
                className="btn btn-outline-success custom_search_button"
                type="submit"
              >
                Search
              </button>
            </div>
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
                        <th className="pt-3 pb-3 border-0">Use Type</th>
                        <th className="pt-3 pb-3 border-0">Area </th>
                        <th className="pt-3 pb-3 border-0">Maintenace/sqft</th>
                        <th className="pt-3 pb-3 border-0">Billabale Items</th>
                      </tr>
                    </thead>

                    <tbody>
                      {unit_type.map((unit_type) => (
                        <>
                          <tr key={unit_type.id}>
                            <th className="pt-3" scope="row" style={{ color: '#666666' }}>
                              <NavLink to={`${unit_type.id}/billableitems`}>
                                {unit_type.name}
                              </NavLink>
                            </th>
                            <td className="pt-3 text-capitalize">{unit_type.use_type}</td>
                            <td className="pt-3">{unit_type.sqft}</td>
                            <td className="pt-3">
                              {unit_type.monthly_maintenance_amount_per_sqft}
                            </td>
                            <td>
                              <button
                                style={{
                                  backgroundColor: 'white',
                                  marginLeft: '4px',
                                  width: '90%',
                                  border: 'none',
                                  color: '#00bfcc',
                                }}
                                type="button"
                                className="btn btn-tertiary"
                                data-mdb-ripple-init
                                onClick={() => setVisible(!visible)}
                              >
                                Billable Items
                              </button>
                            </td>

                            <td>
                              <Dropdown key={unit_type.id}>
                                <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                                  <BsThreeDots />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  {/* <EditResidents id={unit_type.id} /> */}
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                          <BillableItems unittypeID={unit_type.id} show={visible} />
                        </>
                      ))}
                    </tbody>
                  </table>
                  {loading && <Loading />}
                  {errors && toast('Unable To Load data')}
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
export default PropertyUnitType
