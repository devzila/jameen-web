import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import '../../../scss/_roles.scss'

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

export default function EditRoles({ roleId, after_submit }) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)
  const [privileges_data, setPrivileges_data] = useState({})

  const { register, handleSubmit, control, watch, reset, setValue } = useForm()
  const { get, put, response } = useFetch()

  async function loadInitialroles() {
    let endpoint = `/v1/admin/roles/${roleId}}`

    let initialroles = await get(endpoint)

    if (response.ok) {
      if (initialroles.data) {
        setLoading(false)
        setValue('name', initialroles.data.name)
        setValue('description', initialroles.data.description)
        setValue('privileges.users.create', initialroles.data.privileges.users.create)
        setValue('privileges.users.view', initialroles.data.privileges.users.view)
        setValue('privileges.users.delete', initialroles.data.privileges.users.delete)
        setValue('privileges.users.update', initialroles.data.privileges.users.update)
        setValue('privileges.users.add_notes', initialroles.data.privileges.users.add_notes)
        setValue('privileges.maintenance.view', initialroles.data.privileges.maintenance.view)
        setValue('privileges.maintenance.create', initialroles.data.privileges.maintenance.create)
        setValue('privileges.maintenance.delete', initialroles.data.privileges.maintenance.delete)
        setValue('privileges.settings.manage', initialroles.data.privileges.settings.manage)
        if (initialroles.data.privileges) {
          setPrivileges_data(initialroles.data.privileges)
        }
      }
    } else {
      setErrors(true)
      setLoading(false)
    }
  }
  useEffect(() => {
    loadInitialroles()
  }, [])

  async function onSubmit(data) {
    const api = await put(`/v1/admin/roles/${roleId}`, { role: data })
    if (response.ok) {
      toast('Roles Edited Successfully')
      after_submit()

      setVisible(!visible)
    } else {
      toast(response.data?.message)
    }
  }

  return (
    <div>
      <button
        type="button"
        className="tooltip_button"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Edit
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
          <CModalTitle style={{ color: '' }} id="StaticBackdropExampleLabel">
            Edit Roles
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col className="pr-1 mt-3" md="12">
                <Form.Group>
                  <label>Name</label>
                  <Form.Control placeholder="Name" type="text" {...register('name')}></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="pr-3 mt-3" md="12">
                <Form.Group>
                  <label>Description</label>
                  <Form.Control
                    required
                    placeholder="Description"
                    type="text"
                    {...register('description')}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <CModalTitle className="pr-1 my-3" id="StaticBackdropExampleLabel">
              Privileges
            </CModalTitle>

            <Row>
              {Object.entries(privileges_data).map(([outer_keys, outer_values]) => (
                <Col md="6" key={outer_keys}>
                  <div className="card mt-2" style={{ borderRadius: '0px', border: '0px' }}>
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
                          <li className="list-group-item" style={{ textTransform: 'capitalize' }}>
                            {inner_keys.replace(/_/g, ' ')}
                            <label className="checkbox">
                              <input
                                type="checkbox"
                                {...register(`privileges.${outer_keys}.${inner_keys}`)}
                              />
                              <span className="default"></span>
                            </label>
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
                <Button type="submit" className="btn s-3 custom_theme_button">
                  Submit
                </Button>
                <CButton className="custom_grey_button" onClick={() => setVisible(false)}>
                  Close
                </CButton>
              </CModalFooter>
            </div>
          </Form>
          <div className="clearfix"></div>
        </CModalBody>
      </CModal>
    </div>
  )
}

EditRoles.propTypes = {
  roleId: PropTypes.number,
  after_submit: PropTypes.func,
}
