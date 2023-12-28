import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, Form, Container, Row, Col } from 'react-bootstrap'

function Add() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { propertyId } = useParams()
  const { post, get, response } = useFetch()
  const [unitTypes, setUnitTypes] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchUnitTypes() {
      try {
        const api = await get(`/v1/admin/premises/properties/1/unit_types`)
        if (response.ok) {
          setUnitTypes(api.data.unit_types || [])
        } else {
          console.error('Error fetching unit types:', response.data)
        }
      } catch (error) {
        console.error('Error fetching unit types:', error)
      }
    }

    fetchUnitTypes()
  }, [get, response])

  async function onSubmit(data) {
    const selectedUnitTypeId = data.Unit_Type_Id

    const payload = {
      unit: {
        ...data,
        unit_type_id: selectedUnitTypeId,
      },
    }

    const api = await post(`/v1/admin/premises/properties/1/units`, payload)

    if (response.ok) {
      setValue('Unit_No', api.data.unit.unit_number)
      setValue('Bed_No', api.data.unit.bedrooms_number)
      setValue('Bath_No', api.data.unit.bathrooms_number)
      setValue('Year_Built', api.data.unit.year_built)
      setValue('Unit_type_id', api.data.unit_type_id)
      setValue('Unit-Type Name', api.data.unit_type_name)
      setValue('Descryption', api.data.unit_type_descryption)
      setValue('Use-Type', api.data.unit_type_use_type)

      toast('Unit added successfully')
      navigate(`/properties/${propertyId}/units`)
    } else {
      toast(response.data?.message)
      console.error('Request:', `/v1/admin/premises/properties/1/units`)
      console.error('Response:', response)
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
                          placeholder="Number"
                          type="integer"
                          {...register('Unit_No')}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Bed_No</label>
                        <Form.Control
                          placeholder="Number"
                          type="integer"
                          {...register('Bed_No')}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Bath_No</label>
                        <Form.Control
                          placeholder="Number"
                          type="integer"
                          {...register('Bath_No')}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Year_Built</label>
                        <Form.Control
                          placeholder="Number"
                          type="integer"
                          {...register('Year_Built')}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>UnitType-ID</label>
                        <Form.Control as="select" {...register('Unit_Type_Id')}>
                          {unitTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.id}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>UnitType-Name</label>
                        <Form.Control as="select" {...register('Unit_Type_name')}>
                          {unitTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>unit_type_descryption</label>
                        <Form.Control
                          placeholder="description"
                          type="string"
                          {...register('unit_type_description')}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>UnitType-USE TYPE</label>
                        <Form.Control as="select" {...register('Unit_Type_use_type')}>
                          {unitTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.use_type}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button className="btn-fill pull-right" type="submit" variant="info">
                    Add Unit
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
