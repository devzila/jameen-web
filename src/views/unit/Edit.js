import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import useFetch from 'use-http'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function Editunit() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { unitId, role_id } = useParams()
  const { get, put, response, loading, error } = useFetch()
  const [unitData, setunitData] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    loadUnit()
  }, [unitId])

  async function loadUnit() {
    const api = await get(`/v1/admin/premises/properties/1/units`)
    if (response.ok) {
      setValue('name', api.data.unit.name)
      setValue('email', api.data.unit.email)
      setValue('mobile_number', api.data.unit.mobile_number)
      setValue('unitname', api.data.unit.unitname)
      setValue('role_id', api.data.unit.role_id)
    }
  }
  async function onSubmit(data) {
    const api = await put(`/v1/admin/premises/properties/1/units`, {
      unit: data,
    })
    if (response.ok) {
      navigate(`/properties/1/units`)
      toast('unit edited Successfully')
    } else {
      toast(response.data?.message)
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card>
            <Card.Header>
              <Row>
                <Col md="6">
                  <Card.Title as="h4">Edit Unit</Card.Title>
                </Col>
                <Col md="6" className="text-right"></Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>Unit-No</label>
                      <Form.Control
                        defaultValue={unitData.unit_no}
                        type="text"
                        {...register('unit_no')}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>Bedroom-No</label>
                      <Form.Control
                        defaultValue={unitData.bedrooms_number}
                        type="text"
                        {...register('bedrooms_number')}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>Phone Number</label>
                      <Form.Control
                        defaultValue={unitData.bathrooms_number}
                        type="text"
                        {...register('bathrooms_number')}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>Has-Parking</label>
                      <Form.Control
                        defaultValue={unitData.has_parking}
                        type="text"
                        {...register('has_parking')}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>year_built</label>
                      <Form.Control
                        defaultValue={unitData.year_built}
                        type="text"
                        {...register('year_built')}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>status</label>
                      <Form.Control
                        defaultValue={unitData.status}
                        type="text"
                        {...register('status')}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Button className="btn-fill pull-right" type="submit" variant="info">
                  Update unit
                </Button>
                <div className="clearfix"></div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Editunit
