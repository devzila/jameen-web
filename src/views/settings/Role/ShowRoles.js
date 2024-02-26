import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { Button, Form, Row, Col } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilX } from '@coreui/icons'
import logo from '../../../assets/images/jameen-logo.png'
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
export default function ShowRoles({ roleId }) {
  const [visible, setVisible] = useState(false)
  const [role, setRole] = useState([])
  const { get, response } = useFetch()
  const [privileges_data, setPrivileges_data] = useState({})

  const renderIcon = (condition) =>
    condition ? <CIcon icon={cilCheck} size="xl" /> : <CIcon icon={cilX} size="xl" />

  useEffect(() => {
    getUserData()
  }, [visible])
  async function getUserData() {
    let api = await get(`/v1/admin/roles/${roleId}`)
    setRole(api.data)

    if (response.ok) {
      setRole(api.data)
      setPrivileges_data(api.data.privileges)
    }
  }
  function handleclose() {
    setVisible(!visible)
  }

  return (
    <div>
      <button
        type="button"
        className="tooltip_button "
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
          <div className="container bootstrap snippets bootdey">
            <div className="panel-body inf-content">
              <div className="row">
                <div className="col">
                  <br />
                  <div className="table-responsive">
                    <table className="mt-4 table table-user-information">
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
                          <td className="text-primary text-black-50">{role.description || '-'}</td>
                        </tr>

                        <tr>
                          <td>
                            <strong>
                              <span className="glyphicon glyphicon-calendar text-primary"></span>
                              Created At
                            </strong>
                          </td>
                          <td className="text-primary text-black-50">
                            {formatdate(role.created_at)}
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
                            {formatdate(role.updated_at)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <CModalTitle className="pr-1 mt-3" id="StaticBackdropExampleLabel">
                Privileges
              </CModalTitle>

              <Row>
                {Object.entries(privileges_data).map(([outer_keys, outer_values]) => (
                  <Col md="6" key={outer_keys}>
                    <div className="card mt-1 rounded-0 border-0">
                      <div
                        className="card-header"
                        style={{
                          backgroundColor: '#f3fbff',
                          textTransform: 'capitalize',
                          color: '#00bfcc',
                        }}
                      >
                        {outer_keys}
                      </div>
                      {Object.entries(outer_values).map(([inner_keys, inner_values]) => (
                        <div key={inner_keys} className="card-body p-1">
                          <ul className="list-group list-group-flush">
                            <li className="list-group-item text-capitalize">
                              {inner_keys.replace(/_/g, ' ')}

                              <p className="checkbox">{renderIcon(inner_values)}</p>
                            </li>
                          </ul>
                        </div>
                      ))}
                    </div>
                  </Col>
                ))}
              </Row>

              <div className="text-center">
                <CModalFooter>
                  <CButton className="custom_grey_button" onClick={() => setVisible(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </div>
            </div>
          </div>

          <div className="clearfix"></div>
        </CModalBody>
      </CModal>
    </div>
  )
}

ShowRoles.propTypes = {
  roleId: PropTypes.number,
}
