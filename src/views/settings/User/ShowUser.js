import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { formatdate } from 'src/services/dateFormatter'

import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'

export default function ShowUser({ userId }) {
  const [visible, setVisible] = useState(false)
  const [user, setUser] = useState([])
  const { get, response } = useFetch()

  useEffect(() => {
    getUserData()
  }, [])
  async function getUserData() {
    let api = await get(`/v1/admin/users/${userId}`)
    setUser(api.data)

    if (response.ok) {
      setUser(api.data)
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
        backdrop="static"
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">User Information</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <div className="container bootstrap snippets bootdey ">
              <div className="panel-body inf-content">
                <div className="row">
                  <div className="col-md-4">
                    <img
                      alt="Avatar Image"
                      style={{
                        width: '300px',
                        height: '300px',

                        marginTop: '25%',
                        marginLeft: '4%',
                        borderRadius: '50%',
                      }}
                      title="Avatar"
                      className="img-circle img-thumbnail isTooltip  "
                      src={
                        user.avatar
                          ? user.avatar
                          : 'https://bootdey.com/img/Content/avatar/avatar7.png'
                      }
                      data-original-title="Usuario"
                    />

                    <ul title="Ratings" className="list-inline ratings text-center">
                      <li>
                        <span className="glyphicon glyphicon-star"></span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-7">
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
                            <td className="text-primary text-black-50">{user?.name}</td>
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
                                <p key={val.id}>{val.name}</p>
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
                            <td className="text-primary text-black-50">
                              {formatdate(user.created_at)}
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
                              {formatdate(user.updated_at)}
                            </td>
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

ShowUser.propTypes = {
  userId: PropTypes.number,
}
