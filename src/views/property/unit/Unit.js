import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import '../../../scss/_custom.scss'
import Loading from 'src/components/loading/loading'
import { Row, Col } from 'react-bootstrap'
import Paginate from '../../../components/Pagination'
import { NavLink, useParams } from 'react-router-dom'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import Add from './AddUnit'
import PickOwner from './UnitFunctions/PickOwner'
import FilterAccordion from './UnitFunctions/FilterAccordioan'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { status_color } from 'src/services/CommonFunctions'

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

  function filter_callback(queries) {
    loadInitialUnits(queries)
    setSearchKeyword('')
  }

  return (
    <>
      <section className="w-100 p-0 mt-2">
        <div>
          <div className="mask d-flex align-items-center h-100">
            <div className="w-100">
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
                          <th className="pt-3 pb-3 border-0  "> Type </th>
                          <th className="pt-3 pb-3 border-0  ">Bed/Bath </th>
                          <th className="pt-3 pb-3 border-0  ">Year Built</th>
                          <th className="pt-3 pb-3 border-0  ">Owner/Resident</th>
                          <th className="pt-3 pb-3 border-0  ">Open Invoices</th>
                          <th className="pt-3 pb-3 border-0  ">Status</th>
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
                            <td className="pt-3 pb-2">{unit?.unit_type?.name || '-'}</td>

                            <td className="pt-3 pb-2 text-start">
                              {unit.bedrooms_number + '  /  ' + unit.bathrooms_number}
                            </td>
                            <td className="pt-3 pb-2">{unit.year_built}</td>
                            <td className="pt-3 pb-2">
                              {unit.running_contracts[0]?.contract_members
                                ? PickOwner(unit.running_contracts[0]?.contract_members)
                                : '-'}
                            </td>
                            <td className="pt-3 pb-2">-</td>
                            <td className="pt-3 pb-2 ">
                              <button className={`request-${status_color(unit?.status)}`}>
                                {unit.status}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {loading && <Loading />}
                    {errors && (
                      <p className="text-center small text-danger fst-italic">
                        {process.env.REACT_APP_ERROR_MESSAGE}
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
    </>
  )
}

export default Unit
