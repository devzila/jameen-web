import React, { useState, useEffect } from 'react'

import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { useParams, NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { BsThreeDots } from 'react-icons/bs'

import logo from '../../../../../assets/images/avatars/default.png'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import Loading from 'src/components/loading/loading'
import { Dropdown, Row, Col } from 'react-bootstrap'
import Paginate from '../../../../../components/Pagination'
import CustomDivToggle from 'src/components/CustomDivToggle'
import AddBillable from './AddBillable'
import EditBillable from './EditBillable'

export default function BillableItems({ unittypeID, show }) {
  console.log(show)
  const [billableItems, setBillableItems] = useState([])
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { get } = useFetch()
  const { propertyId } = useParams()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetchBillableItems()
  }, [propertyId, unittypeID])
  console.log('Unit Type ID:', propertyId)

  async function fetchBillableItems() {
    try {
      const billableItemsData = await get(
        `/v1/admin/premises/properties/${propertyId}/unit_types/${unittypeID}/billable_items`,
      )
      console.log(billableItemsData)
      if (billableItemsData && billableItemsData.data) {
        setLoading(false)
        setBillableItems(billableItemsData.data)
      }
    } catch (error) {
      console.error('Error fetching billable items:', error)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  function reload_callback() {
    fetchBillableItems()
    setSearchKeyword('')
  }

  return (
    <>
      <button
        style={{
          backgroundColor: 'white',
          marginLeft: '4px',
          width: '90%',
          border: 'none',
          color: '#00bfcc',
          float: 'right',
        }}
        type="button"
        className="btn btn-tertiary"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Billable Items
      </button>
      {visible ? (
        <tr role="row">
          <td colSpan={6}>
            <div>
              <CNavbar expand="lg" colorScheme="light" className="bg-light">
                <CContainer fluid>
                  <CNavbarBrand href="/billableItems">Billable Items</CNavbarBrand>
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
                        // onClick={loadInitialUnitsTypes}
                        className="btn btn-outline-success custom_search_button"
                        type="submit"
                      >
                        Search
                      </button>
                    </div>
                    <AddBillable after_submit={reload_callback} unittypeID={unittypeID} />
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
                                <th className="pt-3 pb-3 border-0">Description</th>
                                <th className="pt-3 pb-3 border-0">Billabale Type </th>
                                <th className="pt-3 pb-3 border-0">Monthly Amount</th>
                                <th className="pt-3 pb-3 border-0">VAT</th>
                              </tr>
                            </thead>

                            <tbody>
                              {billableItems.map((billableItems) => (
                                <tr key={billableItems.id}>
                                  <th className="pt-3" scope="row" style={{ color: '#666666' }}>
                                    <NavLink>{billableItems.name}</NavLink>
                                  </th>
                                  <td className="pt-3 text-capitalize">
                                    {billableItems.description}
                                  </td>
                                  <td className="pt-3 text-capitalize">
                                    {billableItems.billable_type}
                                  </td>
                                  <td className="pt-3"> {billableItems.monthly_amount}</td>
                                  <td>{billableItems.vat_percent}%</td>

                                  <td>
                                    <Dropdown key={billableItems.id}>
                                      <Dropdown.Toggle
                                        as={CustomDivToggle}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        <BsThreeDots />
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        {/* <EditResidents id={billableItems.id} /> */}
                                        <EditBillable
                                          id={billableItems.id}
                                          after_submit={reload_callback}
                                          unittypeID={unittypeID}
                                        />
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </td>
                                </tr>
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
          </td>
        </tr>
      ) : null}
    </>
  )
}

BillableItems.propTypes = {
  unittypeID: PropTypes.number,
  show: PropTypes.bool,
}
