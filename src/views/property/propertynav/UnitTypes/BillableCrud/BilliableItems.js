import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { useParams, NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  CNavbar,
  CContainer,
  CNavbarBrand,
  CCol,
  CCard,
  CListGroupItem,
  CRow,
  CCardText,
} from '@coreui/react'
import { freeSet } from '@coreui/icons'
import Loading from 'src/components/loading/loading'
import { Dropdown, Row, Col, Card } from 'react-bootstrap'
import Paginate from '../../../../../components/Pagination'
import CustomDivToggle from 'src/components/CustomDivToggle'
import AddBillable from './AddBillable'
import EditBillable from './EditBillable'
import CIcon from '@coreui/icons-react'
import { BsThreeDots } from 'react-icons/bs'

import { formatdate } from 'src/services/CommonFunctions'
import EditUnitTypes from '../EditUnitTypes'

export default function BillableItems() {
  const [billableItems, setBillableItems] = useState([])
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { get, response } = useFetch()
  const { propertyId, unittypeID } = useParams()
  const [unittype, setUnittype] = useState({})

  useEffect(() => {
    fetchBillableItems()
    fetchUnittype()
  }, [propertyId, unittypeID])

  async function fetchBillableItems() {
    try {
      const billableItemsData = await get(
        `/v1/admin/premises/properties/${propertyId}/unit_types/${unittypeID}/billable_items`,
      )
      console.log(response)
      if (response.ok) {
        setLoading(false)
        setBillableItems(billableItemsData.data)
      }
    } catch (error) {
      console.error('Error fetching billable items:', error)
    }
  }

  async function fetchUnittype() {
    const endpoint = await get(
      `/v1/admin/premises/properties/${propertyId}/unit_types/${unittypeID}`,
    )

    if (response.ok) {
      setUnittype(endpoint.data)
    }
  }
  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  function reload_callback() {
    fetchBillableItems()
  }

  return (
    <>
      <CCol>
        <CRow>
          <CCol md="12">
            <CCard className=" p-3 mt-2" style={{ border: '0px' }}>
              <CListGroupItem className="d-flex justify-content-between">
                <div>
                  <CIcon
                    icon={freeSet.cilLineStyle}
                    size="lg"
                    className="me-2"
                    style={{ color: '#00bfcc' }}
                  />
                  <strong>Unit Type</strong>
                </div>
                <div>
                  <EditUnitTypes id={unittypeID} />
                </div>
              </CListGroupItem>
              <CRow>
                <CCol className=" mt-0 fw-light" style={{ color: '#00bfcc' }}>
                  Name
                  <CCardText
                    className="fw-normal"
                    style={{ color: 'black', textTransform: 'capitalize' }}
                  >
                    {unittype?.name || '-'}
                  </CCardText>
                </CCol>
                <CCol className=" mt-0 fw-light" style={{ color: '#00bfcc' }}>
                  Use Type
                  <CCardText
                    className="fw-normal"
                    style={{ color: 'black', textTransform: 'capitalize' }}
                  >
                    {unittype?.use_type || '-'}
                  </CCardText>
                </CCol>

                <CCol className=" mt-0 fw-light" style={{ color: '#00bfcc' }}>
                  Area
                  <CCardText className="fw-normal" style={{ color: 'black' }}>
                    {unittype?.sqft + ' sqft.' || '-'}
                  </CCardText>
                </CCol>
                <CCol className=" mt-0 fw-light" style={{ color: '#00bfcc' }}>
                  Maintenace
                  <CCardText
                    className="fw-normal"
                    style={{ color: 'black', textTransform: 'capitalize' }}
                  >
                    {unittype?.monthly_maintenance_amount_per_sqft || '-'}
                  </CCardText>
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol
                  className="mt-0 fw-light col-sm-6 text-nowrap col-lg-3"
                  style={{ color: '#00bfcc' }}
                >
                  Description
                  <CCardText
                    className="fw-normal"
                    style={{ color: 'black', textTransform: 'capitalize' }}
                  >
                    {unittype?.description || '-'}
                  </CCardText>
                </CCol>
                <CCol
                  className=" mt-0 fw-light col-sm-6 text-nowrap col-lg-3"
                  style={{ color: '#00bfcc' }}
                >
                  Created At
                  <CCardText
                    className="fw-normal"
                    style={{ color: 'black', textTransform: 'capitalize' }}
                  >
                    {formatdate(unittype?.created_at) || '-'}
                  </CCardText>
                </CCol>
                <CCol
                  className=" mt-0 fw-light col-sm-6 text-nowrap col-lg-3"
                  style={{ color: '#00bfcc' }}
                >
                  Modified On
                  <CCardText
                    className="fw-normal"
                    style={{ color: 'black', textTransform: 'capitalize' }}
                  >
                    {formatdate(unittype?.updated_at) || '-'}
                  </CCardText>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
        <div>
          <Card className="border-0 mt-3 p-2 rounded-2">
            <div className="d-flex  ms-2 justify-content-between">
              <div className="fs-4 border-0">Billable Items</div>
              <div className=" me-4 border-0">
                <AddBillable after_submit={reload_callback} unittypeID={unittypeID} />
              </div>
            </div>
          </Card>
          <hr className="p-0 m-0 text-secondary" />

          {billableItems.length >= 1 ? (
            <div className="mask d-flex align-items-center h-100">
              <div className="w-100">
                <div className="row justify-content-center">
                  <div className="col-12">
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
                              <th
                                className="pt-3 border-0"
                                scope="row"
                                style={{ color: '#666666' }}
                              >
                                {billableItems.name}
                              </th>
                              <td className="pt-3 text-capitalize">{billableItems.description}</td>
                              <td className="pt-3 text-capitalize">
                                {billableItems.billable_type}
                              </td>
                              <td className="pt-3"> {billableItems.monthly_amount}</td>
                              <td>
                                {`${billableItems.vat_percent} ${
                                  billableItems?.billable_type === 'fixed' ? '' : '%'
                                }`}
                              </td>

                              <td>
                                <Dropdown key={billableItems.id}>
                                  <Dropdown.Toggle
                                    as={CustomDivToggle}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <BsThreeDots />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <EditBillable
                                      id={billableItems.id}
                                      after_submit={reload_callback}
                                    />
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {loading ?? <Loading />}
                      {errors ?? toast('Unable To Load data')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center fst-italic bg-white p-5">No Billable Items Found.</p>
          )}
        </div>
        <br></br>
        <CNavbar colorScheme="light" className="bg-light d-flex justify-content-center">
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
      </CCol>
    </>
  )
}

BillableItems.propTypes = {
  unittypeID: PropTypes.number,
  show: PropTypes.bool,
  row_data: PropTypes.string,
}
