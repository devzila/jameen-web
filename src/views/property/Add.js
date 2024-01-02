import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

import { Button, Card, Form, Container, Row, Col } from 'react-bootstrap'

function Add() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  const { propertyID } = useParams()
  const { post, response, api } = useFetch()
  const [unitData, setUnitData] = useState({})
  const navigate = useNavigate()

  useEffect(() => {}, [])

  async function onSubmit(data) {
    console.log(data)
    const api = await post(`/v1/admin/premises/properties/${propertyID}/units`, {
      unit: data,
    })
    if (api.ok) {
      setValue('Unit_No', api.data.unit.unit_number)
      setValue('Bed_No', api.data.unit.unit_bedrooms_number)
      setValue('Bath_No', api.data.unit.unit_bathrooms_number)
      setValue('Year_Built', api.data.unit.unit_year_built)
      setValue('Unit_Type_Id', api.data.unit.unit_type_id)
      setValue('Unit-Type Name', api.data.unit.unit_type_name)
      setValue('Descryption', api.data.unit.unit_type_descryption)
      setValue('Use-Type', api.data.unit.unit_type_use_type)
      navigate(`/properties/1/units`)
      toast('unit added Successfully')
    } else {
      toast(response.data?.message)
    }
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Row>
                  <Col md="6">
                    <Card.Title as="h4">Add unit</Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Unit_No</label>
                        <Form.Control
                          defaultValue={unitData.unit_no}
                          type="integer"
                          {...register('number')}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Bed_No</label>
                        <Form.Control
                          defaultValue={unitData.bedrooms_number}
                          type="integer"
                          {...register('number')}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>bathroom_number</label>
                        <Form.Control
                          defaultValue={unitData.bathrooms_number}
                          type="integer"
                          {...register('bath_number')}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Year-Built</label>
                        <Form.Control
                          defaultValue={unitData.year_built}
                          type="integer"
                          {...register('Year-Built')}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>UnitType-ID</label>
                        <Form.Control
                          defaultValue={unitData.unit_type_id}
                          type="integer"
                          {...register('Unit_Type_Id')}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>UnitType-Name</label>
                        <Form.Control
                          defaultValue={unitData.unit_type_name}
                          type="name"
                          {...register('name')}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Descryption</label>
                        <Form.Control
                          defaultValue={unitData.unit_type_descryption}
                          type="text"
                          {...register('descryption')}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Use-Type</label>
                        <Form.Control
                          defaultValue={unitData.unit_type_use_type}
                          type="text"
                          {...register('use_type')}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button className="btn-fill pull-right" type="submit" variant="info">
                    Update Profile
                  </Button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Add
