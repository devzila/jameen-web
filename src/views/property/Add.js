import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, Form, Container, Row, Col } from 'react-bootstrap'
import '../../scss/_add.scss'

function Add() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { propertyID } = useParams()
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
    const apiResponse = await post(`/v1/admin/premises/properties/${propertyID}/units`, {
      unit: data,
    })
    if (apiResponse.ok) {
      setValue('Unit_No', apiResponse.data.unit.unit_number)
      setValue('Bed_No', apiResponse.data.unit.unit_bedrooms_number)
      setValue('Bath_No', apiResponse.data.unit.unit_bathrooms_number)
      setValue('Year_Built', apiResponse.data.unit.unit_year_built)
      setValue('Unit_Type_Id', apiResponse.data.unit.unit_type_id)
      setValue('Unit-Type Name', apiResponse.data.unit.unit_type_name)
      setValue('Descryption', apiResponse.data.unit.unit_type_descryption)
      setValue('Use-Type', apiResponse.data.unit.unit_type_use_type)

      navigate(`/properties/${propertyID}/units`)
      toast('Unit added successfully')
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
                      <Form.Group className="form-group">
                        <Form.Control type="integer" {...register('number')} />
                        <label>Unit_No</label>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group className="form-group">
                        <Form.Control type="integer" {...register('number')} />
                        <label>Bed_No</label>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group className="form-group">
                        <Form.Control type="integer" {...register('bath_number')} />
                        <label>bathroom_number</label>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group className="form-group">
                        <Form.Control type="integer" {...register('Year-Built')} />
                        <label>Year-Built</label>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group className="form-group">
                        <Form.Control type="integer" {...register('Unit_Type_Id')} />
                        <label>UnitType-ID</label>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group className="form-group">
                        <Form.Control type="name" {...register('name')} />
                        <label>UnitType-Name</label>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group className="form-group">
                        <Form.Control type="text" {...register('descryption')} />
                        <label>Descryption</label>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group className="form-group">
                        <Form.Control type="text" {...register('use_type')} />
                        <label>Use-Type</label>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button className="btn-fill float-right mt-3" type="submit" variant="info">
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
