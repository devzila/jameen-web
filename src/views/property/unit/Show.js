import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'

import { Form, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Edit from './Edit'

export default function Showunit(propsd) {
  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const [unit, setUnit] = useState([])
  const { get, response } = useFetch()

  const id = propsd.unitid.id
  useEffect(() => {
    getUnitData()
  }, [])
  async function getUnitData() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${id}`)
    setUnit(api.data)

    if (response.ok) {
      setUnit(api.data)
    }
  }

  return (
    <div>
      <button
        style={{
          color: '#00bfcc',
          backgroundColor: 'white',
          marginLeft: '4px',
          width: '90%',
          border: 'none',
        }}
        type="button"
        className="btn btn-tertiary "
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Show
      </button>
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Unit Data</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <div className="container bootstrap snippets bootdey">
              <div className="panel-body inf-content">
                <div className="row">
                  <div className="col-md-4">
                    <img
                      alt=""
                      style={{ width: '600px', marginTop: '20%', marginLeft: '4%' }}
                      title=""
                      className="img-circle img-thumbnail isTooltip  "
                      src={unit.avatar || 'https://bootdey.com/img/Content/avatar/avatar7.png'}
                      data-original-title="Usuario"
                    />
                    <ul title="Ratings" className="list-inline ratings text-center">
                      <li>
                        <span className="glyphicon glyphicon-star">
                          <small>
                            <i>{unit.name}</i>
                          </small>
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <strong>Information for unit No {unit.unit_no}</strong>
                    <hr></hr>
                    <br />
                    <div className="table-responsive">
                      <table className="table table-unit-information">
                        <tbody>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-asterisk text-primary"></span>
                                Bedroom Number
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{unit.bedrooms_number}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-unit  text-primary"></span>
                                Bathroom Number
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{unit.bathrooms_number}</td>
                          </tr>

                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-unit  text-primary"></span>
                                Year Built
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{unit.year_built}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-cloud text-primary"></span>
                                Electricity No
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">
                              {unit.electricity_account_number}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-cloud text-primary"></span>
                                Water Acc No
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">
                              {unit.water_account_number}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-eye-open text-primary"></span>
                                Status
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{unit.status}</td>
                          </tr>

                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-calendar text-primary"></span>
                                Created At
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{unit.created_at}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-calendar text-primary"></span>
                                Modified
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{unit.updated_at}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </div>
              </div>
            </div>

            <div className="clearfix"></div>
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}
