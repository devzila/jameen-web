import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
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

export default function EditRoles({ roleId }) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)

  const { register, handleSubmit, control, watch, reset, setValue } = useForm()
  const { get, put, response } = useFetch()

  const meta_data = localStorage.getItem('meta')
  const parsed_meta_data = JSON.parse(meta_data)

  const roles_data = parsed_meta_data.role_user_type

  const rolesarray = Object.entries(roles_data).map((element) => ({
    label: element[0]?.charAt(0).toUpperCase() + element[0].slice(1).replace(/_/g, ' '),
    value: element[1],
  }))

  const roles_selected = (data) => {
    if (data) {
      const sliced_data = data?.charAt(0).toUpperCase() + data?.slice(1).replace('_', ' ')
      const role = rolesarray.find((role) => role.label === sliced_data)
      return role ? role.value : null
    }
  }

  async function loadInitialroles() {
    let endpoint = `/v1/admin/roles/${roleId}}`

    let initialroles = await get(endpoint)

    if (response.ok) {
      if (initialroles.data) {
        setLoading(false)
        setValue('name', initialroles.data.name)
        setValue('description', initialroles.data.description)
        setValue('user_type', roles_selected(initialroles.data?.user_type))
        setValue('privileges.users.create', initialroles.data.privileges.users.create)
        setValue('privileges.users.view', initialroles.data.privileges.users.view)
        setValue('privileges.users.delete', initialroles.data.privileges.users.delete)
        setValue('privileges.users.update', initialroles.data.privileges.users.update)
        setValue('privileges.users.add_notes', initialroles.data.privileges.users.add_notes)
        setValue('privileges.maintenance.view', initialroles.data.privileges.maintenance.view)
        setValue('privileges.maintenance.create', initialroles.data.privileges.maintenance.create)
        setValue('privileges.maintenance.delete', initialroles.data.privileges.maintenance.delete)
        setValue('privileges.settings.manage', initialroles.data.privileges.settings.manage)
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
    console.log(data)
    const api = await put(`/v1/admin/roles/${roleId}`, { role: data })
    if (response.ok) {
      toast('Roles Edited Successfully')
      reset()

      setVisible(!visible)
    } else {
      toast(response.data?.message)
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
          <CContainer>
            <p className="text-center display-6" style={{ color: '#00bfcc' }}>
              JAMEEN
            </p>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Name</label>
                    <Form.Control
                      placeholder="Name"
                      type="text"
                      {...register('name')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>User Type</label>
                    <Controller
                      name="user_type"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={rolesarray}
                          value={rolesarray.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
                      control={control}
                      placeholder="Role"
                    />
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
              <CModalTitle className="pr-1 mt-3" id="StaticBackdropExampleLabel">
                Privileges
              </CModalTitle>

              <Row>
                <Col className="pr-3 mt-1" md="12">
                  <div className="card" style={{ margin: '20px ' }}>
                    <div className="card-header p-3">User</div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item ">
                          View
                          <label className="checkbox">
                            <input type="checkbox" {...register('privileges.users.view')} />
                            <span className="default"></span>
                          </label>
                        </li>
                        <li className="list-group-item">
                          Create
                          <label className="checkbox">
                            <input type="checkbox" {...register('privileges.users.create')} />
                            <span className="primary"></span>
                          </label>
                        </li>
                        <li className="list-group-item">
                          Delete
                          <label className="checkbox">
                            <input type="checkbox" {...register('privileges.users.delete')} />
                            <span className="success"></span>
                          </label>
                        </li>
                        <li className="list-group-item">
                          Update
                          <label className="checkbox">
                            <input type="checkbox" {...register('privileges.users.update')} />
                            <span className="info"></span>
                          </label>
                        </li>
                        <li className="list-group-item">
                          Add Notes
                          <label className="checkbox">
                            <input type="checkbox" {...register('privileges.users.add_notes')} />
                            <span className="warning"></span>
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="card" style={{ margin: '20px ' }}>
                    <div className="card-header p-3">Maintenance</div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                          View
                          <label className="checkbox">
                            <input type="checkbox" {...register('privileges.maintenance.view')} />
                            <span className="default"></span>
                          </label>
                        </li>
                        <li className="list-group-item">
                          Create
                          <label className="checkbox">
                            <input type="checkbox" {...register('privileges.maintenance.create')} />
                            <span className="primary"></span>
                          </label>
                        </li>
                        <li className="list-group-item">
                          Delete
                          <label className="checkbox">
                            <input type="checkbox" {...register('privileges.maintenance.delete')} />
                            <span className="success"></span>
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="card" style={{ margin: '20px ' }}>
                    <div className="card-header p-3">Setting</div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                          Manage
                          <label className="checkbox">
                            <input type="checkbox" {...register('privileges.settings.manage')} />
                            <span className="default"></span>
                          </label>
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
              </Row>

              <div className="text-center">
                <CModalFooter>
                  <Button
                    data-mdb-ripple-init
                    type="submit"
                    className="btn  btn-primary btn-block"
                    style={{
                      marginTop: '5px',
                      color: 'white',
                      backgroundColor: '#00bfcc',
                      border: '0px',
                    }}
                  >
                    Submit
                  </Button>
                  <CButton
                    color="secondary"
                    style={{ border: '0px', color: 'white' }}
                    onClick={() => setVisible(false)}
                  >
                    Close
                  </CButton>
                </CModalFooter>
              </div>
            </Form>
            <div className="clearfix"></div>
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}

EditRoles.propTypes = {
  roleId: PropTypes.number,
}
