import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, Form, Container, Row, Col } from 'react-bootstrap'
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

function Add() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const [visible, setVisible] = useState(false)
  const { property } = useParams()
  const { post, response, api } = useFetch()
  const [unitData, setUnitData] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const inputs = document.querySelectorAll('.form-group input')
    inputs.forEach((input) => {
      input.addEventListener('focus', () => {
        input.classList.add('active')
      })
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.classList.remove('active')
        }
      })
    })
  }, [])

  async function onSubmit(data) {
    console.log(data)
    const apiResponse = await post(`/v1/admin/premises/properties/1/units`, {
      unit: data,
    })
    if (apiResponse.ok) {
      navigate(`/properties/${property.id}/units`)
      toast('Unit added successfully')
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
        className="btn  s-3"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Add Unit
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
          <CModalTitle id="StaticBackdropExampleLabel">Add Unit Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Unit-Number</label>
                    <Form.Control
                      defaultValue={unitData.no}
                      type="integer"
                      {...register('unit_no')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>BedRoom-No</label>

                    <Form.Control
                      defaultValue={unitData.bedrooms_number}
                      type="integer"
                      {...register('bedrooms_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>BathRoom-Number</label>
                    <Form.Control
                      defaultValue={unitData.bathrooms_number}
                      type="integer"
                      {...register('bathrooms_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Year Built</label>

                    <Form.Control
                      defaultValue={unitData.year_built}
                      type="integer"
                      {...register('year_built')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>UnitType ID</label>
                    <Form.Control
                      defaultValue={unitData.id}
                      type="integer"
                      {...register('unit_type_id')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Electricity Account-No</label>

                    <Form.Control
                      defaultValue={unitData.electricity_account_number}
                      type="string"
                      {...register('electricity_account_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Water Account-No</label>
                    <Form.Control
                      defaultValue={unitData.water_account_number}
                      type="string"
                      {...register('water_account_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Internal Extension number</label>
                    <Form.Control
                      defaultValue={unitData.internal_extension_number}
                      type="string"
                      {...register('internal_extension_number')}
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

export default Add
