import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { Button, Form, Row, Col } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilX } from '@coreui/icons'
import logo from '../../../assets/images/jameen-logo.png'
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
export default function ShowRoles({ roleId }) {
  const [visible, setVisible] = useState(false)
  const [role, setRole] = useState([])
  const { get, response } = useFetch()

  const renderIcon = (condition) =>
    condition ? <CIcon icon={cilCheck} size="xl" /> : <CIcon icon={cilX} size="xl" />

  useEffect(() => {
    getUserData()
  }, [])
  async function getUserData() {
    let api = await get(`/v1/admin/roles/${roleId}`)
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
            <p className="text-center display-6" style={{ color: '#00bfcc' }}>
              JAMEEN
            </p>
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
                            <td className="text-primary text-black-50">
                              {role.description || '-'}
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
                <Row>
                  <CModalTitle className="pr-1 mt-3" id="StaticBackdropExampleLabel">
                    Privileges
                  </CModalTitle>

                  <Col className="pr-3 mt-1" md="6">
                    <div className="card" style={{ margin: '20px ' }}>
                      <div className="card-header p-3">User</div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item ">
                            View
                            <p className="checkbox">{renderIcon(role?.privileges?.users?.view)}</p>
                          </li>
                          <li className="list-group-item">
                            Create
                            <p className="checkbox">
                              {renderIcon(role?.privileges?.users?.create)}
                            </p>
                          </li>
                          <li className="list-group-item">
                            Delete
                            <p className="checkbox">
                              {renderIcon(role?.privileges?.users?.delete)}
                            </p>
                          </li>
                          <li className="list-group-item">
                            Update
                            <p className="checkbox">
                              {renderIcon(role?.privileges?.users?.update)}
                            </p>
                          </li>
                          <li className="list-group-item">
                            Add Notes
                            <p className="checkbox">
                              {renderIcon(role?.privileges?.users?.add_notes)}
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                  <Col md="6" className="mt-1">
                    <div className="card" style={{ margin: '20px ' }}>
                      <div className="card-header p-3">Maintenance</div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            View
                            <p className="checkbox">
                              {renderIcon(role?.privileges?.maintenance?.view)}
                            </p>
                          </li>
                          <li className="list-group-item">
                            Create
                            <p className="checkbox">
                              {renderIcon(role?.privileges?.maintenance?.create)}
                            </p>
                          </li>
                          <li className="list-group-item">
                            Delete
                            <p className="checkbox">
                              {renderIcon(role?.privileges?.maintenance?.delete)}
                            </p>
                          </li>
                          <div className="m-4 list-group-item">
                            <label>
                              <span className=" default"></span>
                            </label>
                          </div>
                        </ul>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div className="card" style={{ margin: '20px ' }}>
                      <div className="card-header p-3">Settings</div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            Manage
                            <p className="checkbox">
                              {renderIcon(role?.privileges?.settings?.manage)}
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                </Row>
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
