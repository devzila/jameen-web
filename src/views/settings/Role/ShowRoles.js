import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'

import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'
export default function ShowRoles({ roleId }) {
  const [visible, setVisible] = useState(false)
  const [role, setRole] = useState([])
  const { get, response } = useFetch()

  useEffect(() => {
    getUserData()
  }, [])
  async function getUserData() {
    let api = await get(`/v1/admin/roles/${roleId}`)
    console.log(api)
    setRole(api.data)

    if (response.ok) {
      setRole(api.data)
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
          <CModalTitle id="StaticBackdropExampleLabel"> Information</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <div className="container bootstrap snippets bootdey">
              <div className="panel-body inf-content">
                <div className="row">
                  <div className="col-md-4">
                    <div className="col text-center">
                      <img
                        alt="Avatar Image"
                        style={{
                          width: '300px',
                          height: '300px',

                          marginTop: '2%',
                          marginLeft: '4%',
                          borderRadius: '50%',
                        }}
                        title="Avatar"
                        className="img-circle img-thumbnail isTooltip  "
                        src={'https://bootdey.com/img/Content/avatar/avatar7.png'}
                        data-original-title="Usuario"
                      />
                    </div>
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
                                Name
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{role?.name}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-user  text-primary"></span>
                                Description
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">
                              {role.description || '-'}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-bookmark text-primary"></span>
                                Privileges
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">{role.privileges || '-'}</td>
                          </tr>

                          <tr>
                            <td>
                              <strong>
                                <span className="glyphicon glyphicon-user  text-primary"></span>
                                User Type
                              </strong>
                            </td>
                            <td className="text-primary text-black-50">
                              {role.user_type?.charAt(0).toUpperCase() +
                                role.user_type?.slice(1).replace(/_/g, ' ')}
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
                              {role.created_at?.replace('T', ' ').replace('Z', ' ').slice(0, 19)}
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
                              {role.updated_at?.replace('T', ' ').replace('Z', ' ').slice(0, 19)}
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

ShowRoles.propTypes = {
  roleId: PropTypes.number,
}
