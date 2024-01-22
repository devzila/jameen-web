import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
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
export default function AddRoles() {
  const [visible, setVisible] = useState(false)

  const { register, handleSubmit, control, watch, reset, setValue } = useForm()
  const { get, post, response } = useFetch()

  const meta_data = localStorage.getItem('meta')
  const parsed_meta_data = JSON.parse(meta_data)

  const roles_data = parsed_meta_data.role_user_type

  const rolesarray = Object.entries(roles_data).map((element) => ({
    label: element[0].charAt(0).toUpperCase() + element[0].slice(1).replace(/_/g, ' '),
    value: element[1],
  }))

  async function onSubmit(data) {
    const api = await post(`/v1/admin/roles`, { role: data })
    if (response.ok) {
      toast('user added Successfully')
      reset()

      setVisible(!visible)
    } else {
      toast(response.data?.message)
    }
  }

  return (
    <div>
      <button
        style={{ backgroundColor: '#00bfcc', color: 'white', marginLeft: '4px' }}
        color="#00bfcc"
        type="button"
        className="btn flex s-3"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Add Role
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
          <CModalTitle id="StaticBackdropExampleLabel">Add Role </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
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
              </Row>

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
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <Form.Control
                      placeholder="xxxxx"
                      className="form-check-input"
                      type="checkbox"
                      role="checkbox"
                      {...register('privileges')}
                    ></Form.Control>
                  </Form.Group>
                </Col>

                <Col className="pr-1 mt-3" md="2">
                  <Form.Group className="mt-4 form-check form-switch">
                    <label>Active</label>

                    <Form.Control
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      defaultChecked={true}
                      {...register('active')}
                    ></Form.Control>
                  </Form.Group>
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
