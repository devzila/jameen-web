import React, { Suspense, useEffect, useState } from 'react'
import useFetch from 'use-http'
import AddProperty from './AddProperty'
import { Dropdown } from 'react-bootstrap'
import { NavLink, Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { BsThreeDots, BsList, BsGrid3X3Gap } from 'react-icons/bs' // Import BsList icon for property list view
import Loading from 'src/components/loading/loading'
import CustomDivToggle from '../../components/CustomDivToggle'
import { CNavbar, CContainer, CNavbarBrand, CForm, CFormInput, CButton } from '@coreui/react'
import ShowProperty from './ShowProperty'
import EditProperty from './EditProperty'
import OverviewContent from './propertynav/OverviewContent'
import PropertyCardView from './PropertyCardView'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import loading from 'src/components/loading/loading'

function Property() {
  const { get, response, error } = useFetch()

  useEffect(() => {}, [])

  const [properties, setProperties] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [refresh, setRefresh] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isCardView, setIsCardView] = useState(true)

  const loadInitialProperties = async () => {
    let endpoint = `/v1/admin/premises/properties?search=${searchKeyword}`

    const initialProperties = await get(endpoint)
    console.log(initialProperties)

    if (response.ok) {
      setLoading(false)
      setProperties(initialProperties.data)
    } else {
      setErrors(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInitialProperties()
  }, [currentPage, searchKeyword])

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1)
  }
  const refresh_data = () => {
    loadInitialProperties()

    setSearchKeyword('')
  }

  const handleIconClick = () => {
    setIsCardView(!isCardView)
  }

  return (
    <>
      <div>
        {error && error.Error}
        <section style={{ width: '100%', padding: '0px' }}>
          <div>
            <div className="mask d-flex align-items-center h-100">
              <div className="container-fluid">
                <CNavbar expand="lg" colorScheme="light" className="bg-white">
                  <CContainer fluid>
                    <CNavbarBrand href="#">Property</CNavbarBrand>

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
                          onClick={loadInitialProperties}
                          className="btn btn-outline-success custom_search_button"
                          type="submit"
                        >
                          <CIcon icon={freeSet.cilSearch} />
                        </button>
                      </div>
                      <br></br>
                      <AddProperty after_submit={refresh_data} />
                      {!isCardView ? (
                        <BsGrid3X3Gap
                          onClick={handleIconClick}
                          style={{ fontSize: '2.5rem' }}
                          className="mx-2 theme_color"
                        />
                      ) : (
                        <BsList
                          onClick={handleIconClick}
                          style={{ fontSize: '2.5rem' }}
                          className="mx-2 theme_color"
                        />
                      )}
                    </div>
                  </CContainer>
                </CNavbar>
                <hr className="p-0 m-0 text-secondary" />

                <Suspense fallback={<Loading />}>
                  <div className="row justify-content-center">
                    <div className="col-16">
                      {isCardView ? (
                        <PropertyCardView property={properties} />
                      ) : (
                        <div className="table-responsive bg-white">
                          <table className="table table-striped mb-0">
                            <thead
                              style={{
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overFlow: 'hidden',
                              }}
                            >
                              <tr>
                                <th className="border-0">NAME</th>
                                <th className="border-0">CITY</th>
                                <th className="border-0">USE TYPE</th>
                                <th className="border-0">UNIT COUNT</th>
                                <th className="border-0">PAYMENT TERM</th>
                                <th className="border-0">ACTIONS</th>
                              </tr>
                            </thead>

                            <tbody>
                              {properties.map((property) => (
                                <tr key={property.id}>
                                  <td style={{ textTransform: 'capitalize' }}>
                                    <NavLink to={`/properties/${property.id}/overview`}>
                                      {property.name}
                                    </NavLink>
                                  </td>
                                  <td>{property.city}</td>
                                  <td style={{ textTransform: 'uppercase' }}>
                                    {property.use_type}
                                  </td>
                                  <td align="center">
                                    <NavLink to={`/properties/${property.id}/units`}>
                                      {property.units_count}
                                    </NavLink>
                                  </td>
                                  <td style={{ textTransform: 'capitalize' }}>
                                    {property.payment_term?.replace(/_/g, ' ')}
                                  </td>
                                  <td>
                                    <Dropdown key={property.id}>
                                      <Dropdown.Toggle
                                        as={CustomDivToggle}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        <Dropdown.Menu>
                                          <EditProperty
                                            propertyId={property.id}
                                            after_submit={refresh_data}
                                          />
                                          <ShowProperty propertyId={property.id} />
                                        </Dropdown.Menu>
                                        <BsThreeDots />
                                      </Dropdown.Toggle>
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
                      )}
                    </div>
                  </div>
                </Suspense>
              </div>
            </div>
          </div>
          <br></br>
        </section>
      </div>
    </>
  )
}

export default Property
