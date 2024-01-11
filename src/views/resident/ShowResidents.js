import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'

export default function ShowResidents(props) {
  const [resident_data, setResident_data] = useState({})
  const [visible, setVisible] = useState(false)
  const { register, setValue, control } = useForm()
  const { get, response } = useFetch()

  console.log(props)

  const resident_id = props.residentid.id

  const gender = [
    { value: 'male', label: 'male' },
    { value: 'female', label: 'female' },
  ]

  useEffect(() => {
    loadResident()
  }, [])
  const loadResident = async () => {
    const endpoint = await get(`/v1/admin/residents/${resident_id}`)
    console.log(endpoint)
    if (response.ok) {
      console.log(endpoint)
      setResident_data(endpoint.data)
      setValue('first_name', endpoint.data.first_name)
      setValue('last_name', endpoint.data.last_name)
      setValue('email', endpoint.data.email)
      setValue('phone_number', endpoint.data.phone_number)
      setValue('username', endpoint.data.username)
      setValue('password', endpoint.data.first_name)
      setValue('gender', endpoint.data.gender)
      setValue('dob', endpoint.data.dob)
      setValue('property_id', endpoint.data.property_id)
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
                      alt=""
                      style={{ width: '600px;', marginTop: '20%', marginLeft: '4%' }}
                      title=""
                      className="img-circle img-thumbnail isTooltip  "
                      src="https://bootdey.com/img/Content/avatar/avatar7.png"
                      data-original-title="Usuario"
                    />
                    <ul title="Ratings" className="list-inline ratings text-center">
                      <li>
                        <span className="glyphicon glyphicon-star"></span>
                      </li>
                      <li>
                        <span className="glyphicon glyphicon-star"></span>
                      </li>
                      <li>
                        <span className="glyphicon glyphicon-star"></span>
                      </li>
                      <li>
                        <span className="glyphicon glyphicon-star"></span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <strong>Information for resident ID {resident_data.id}</strong>
                    <hr></hr>
                    <br />
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
                                <span className="glyphicon glyphicon-user  text-primary"></span>
                                D.O.B
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{resident_data.dob}</td>
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
                                <span className="glyphicon glyphicon-bookmark text-primary"></span>
                                Gender
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{resident_data.gender}</td>
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
                              {resident_data.created_at}
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
                              {resident_data.updated_at}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <hr></hr>
              </div>
            </div>
            <div className="clearfix"></div>
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}
