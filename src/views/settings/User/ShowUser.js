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

export default function ShowUser(propsd) {
  const [visible, setVisible] = useState(false)
  const [user, setUser] = useState([])
  const { get, response } = useFetch()

  const id = propsd.userid.id
  useEffect(() => {
    getUserData()
  }, [])
  async function getUserData() {
    let api = await get(`/v1/admin/users/${id}`)
    console.log(api)
    setUser(api.data)

    if (response.ok) {
      setUser(api.data)
      console.log(user)
    }
  }
  console.log(user)

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
        Show User
      </button>
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">User Data</CModalTitle>
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
                      src={user.avatar || 'https://bootdey.com/img/Content/avatar/avatar7.png'}
                      data-original-title="Usuario"
                    />
                    <ul title="Ratings" className="list-inline ratings text-center">
                      <li>
                        <span className="glyphicon glyphicon-star">
                          <small>
                            <i>{user.name}</i>
                          </small>
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <strong>Information for User ID {user.id}</strong>
                    <hr></hr>
                    <br />
                    <div className="table-responsive">
                      <table className="table table-user-information">
                        <tbody>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-asterisk text-primary"></span>
                                Full Name
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{user.name}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-user  text-primary"></span>
                                Username
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{user.username}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-bookmark text-primary"></span>
                                Active Status
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">
                              {user.active ? 'True' : 'False'}
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-user  text-primary"></span>
                                Email
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{user.email}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-cloud text-primary"></span>
                                Role
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{user.role?.name}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-eye-open text-primary"></span>
                                Mobile Number
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{user.mobile_number}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-bookmark text-primary"></span>
                                Assigned Properties
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">
                              {user.properties?.map((val) => (
                                <td key={val.id}>{val?.name}</td>
                              ))}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-calendar text-primary"></span>
                                Created At
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{user.created_at}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-calendar text-primary"></span>
                                Modified
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{user.updated_at}</td>
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

// <CModalTitle className="pr-1 mt-4" id="StaticBackdropExampleLabel">
// Assigned Properties{' '}
// </CModalTitle>
// <Row>
// <Col className="pr-1 mt-4" md="6">
//   <Form.Group>
//     {user.properties?.map((val) => (
//       <Form.Control
//         key={val.id}
//         defaultValue={val.name}
//         type="text"
//         disabled
//       ></Form.Control>
//     ))}
//   </Form.Group>
// </Col>
// </Row>

// <Row>
// <Col className="pr-1 mt-4" md="6">
//   <Form.Group>
//     <label>Role </label>
//     <Form.Control defaultValue={user.role?.name} type="text" disabled></Form.Control>
//   </Form.Group>
// </Col>
// <Col className="pr-1 mt-4" md="6">
//   <Form.Group>
//     <label>Created At</label>
//     <Form.Control defaultValue={user.created_at} type="text" disabled></Form.Control>
//   </Form.Group>
// </Col>
// </Row>
