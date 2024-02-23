import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { formatdate } from 'src/services/CommonFunctions'

import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'

export default function ShowResidents(props) {
  const [resident_data, setResident_data] = useState({})
  const [visible, setVisible] = useState(false)

  const { get, response } = useFetch()

  const { id } = props

  useEffect(() => {
    loadResident()
  }, [])
  const loadResident = async () => {
    const endpoint = await get(`/v1/admin/members/${id}`)
    console.log(endpoint)
    if (response.ok) {
      setResident_data(endpoint.data)
    } else {
      toast(response?.data.message)
    }
  }

  return (
    <div>
      <button
        style={{
          backgroundColor: 'white',
          marginLeft: '4px',
          width: '90%',
          border: 'none',
          color: '#00bfcc',
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
        backdrop="static"
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel"> Resident Information</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <div className="container bootstrap snippets bootdey">
              <div className="panel-body inf-content">
                <div className="row">
                  <div className="col-md-4">
                    <img
                      alt="Avatar Image"
                      style={{
                        width: '300px',
                        height: '300px',

                        marginTop: '15%',
                        marginLeft: '4%',
                        borderRadius: '50%',
                      }}
                      title="Avatar"
                      className="img-circle img-thumbnail isTooltip  "
                      src={
                        resident_data.avatar || 'https://bootdey.com/img/Content/avatar/avatar7.png'
                      }
                      data-original-title="Usuario"
                    />

                    <ul title="Ratings" className="list-inline ratings text-center">
                      <li>
                        <span className="glyphicon glyphicon-star"></span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <div className="table-responsive">
                      <table className="table table-user-information">
                        <tbody>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-asterisk text-primary"></span>
                                First Name
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">
                              {resident_data.first_name}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-user  text-primary"></span>
                                Last Name
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">
                              {resident_data.last_name}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-bookmark text-primary"></span>
                                Gender
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{resident_data.gender}</td>
                          </tr>

                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-cloud text-primary"></span>
                                Username
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{resident_data.username}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-user  text-primary"></span>
                                D.O.B
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{resident_data.dob}</td>
                          </tr>

                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-eye-open text-primary"></span>
                                Mobile Number
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">
                              {resident_data.phone_number}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-bookmark text-primary"></span>
                                Email ID
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{resident_data.email}</td>
                          </tr>

                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-bookmark text-primary"></span>
                                Assigned Properties
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">
                              {resident_data.property?.name}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-calendar text-primary"></span>
                                Created At
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">
                              {formatdate(resident_data.created_at)}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-calendar text-primary"></span>
                                Modified
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">
                              {formatdate(resident_data.updated_at)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <CModalFooter>
                    <CButton
                      color="secondary "
                      className="custom_grey_button"
                      onClick={() => setVisible(false)}
                    >
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

ShowResidents.propTypes = {
  id: PropTypes.number.isRequired,
}
