import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
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

export default function Edit(propsdata) {
  const [units, setUnits] = useState([])
  const { propertyId } = useParams()
  const { get, put, response } = useFetch()

  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, setValue, watch } = useForm()

  const [unitData, setunitData] = useState({})

  const id = propsdata.unitid.id
  useEffect(() => {
    getUnitData()
  }, [])
  async function getUnitData() {
    try {
      let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${id}`)
      console.log(api)

      if (response.ok) {
        if (api.data && api.data.unit) {
          setValue('unit_no', api.data.unit.unit_no || '')
          setValue('bedrooms_number', api.data.unit.bedrooms_number || '')
          setValue('bathrooms_number', api.data.unit.bathrooms_number || '')
          setValue('year_built', api.data.unit.year_built || '')
          setValue('status', api.data.unit.status || '')

          setunitData(api.data.unit)
        } else {
          console.error('api.data.unit is undefined')
        }
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function onSubmit(data) {
    const api = await put(`/v1/admin/premises/properties/${propertyId}/units/${id}`, { unit: data })
    if (response.ok) {
      toast('unit Data Edited Successfully')
      setVisible(!visible)
    } else {
      toast(response.data?.message)
    }
  }
  return (
    <>
      <div>
        <button
          style={{
            backgroundColor: 'white',
            marginLeft: '4px',
            width: '90%',
            border: 'none',
            color: '#00bfcc',
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
            <CModalTitle id="StaticBackdropExampleLabel">Edit unit</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col className="pr-1 mt-1" md="6">
                    <Form.Group>
                      <label>Unit Number</label>
                      <Form.Control
                        defaultValue={unitData.unit_no}
                        type="integer"
                        {...register('unit_no')}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1 mt-4" md="4">
                    <Form.Group>
                      <label>Bedroom Number</label>
                      <Form.Control
                        type="integer"
                        defaultValue={unitData.bedrooms_number}
                        {...register('bedrooms_number')}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>BathRoom Number</label>
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
                      <label>Unit-Type-Id</label>
                      <Form.Control
                        defaultValue={unitData.id}
                        type="integer"
                        {...register('unit_type_id')}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  {/* <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Electricity-Account-No</label>
                      <Form.Control
                        defaultValue={unitData.electricity_account_number}
                        type="text"
                        {...register('electricity_account_number')}
                      ></Form.Control>
                    </Form.Group>
                  </Col> */}
                </Row>
                {/* <Row>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Water-Account-No</label>
                      <Form.Control
                        defaultValue={unitData.water_account_number}
                        type="text"
                        {...register('water_account_number')}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Internal-Extension-No</label>
                      <Form.Control
                        defaultValue={unitData.internal_extension_number}
                        type="text"
                        {...register('internal_extension_number')}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row> */}
                {/* Modal part 2 role */}
                <div className="text-center">
                  <CModalFooter>
                    <Button
                      data-mdb-ripple-init
                      type="submit"
                      className="btn  btn-primary btn-block"
                      style={{ marginTop: '5px', backgroundColor: '#00bfcc', border: 'none' }}
                    >
                      Submit
                    </Button>
                    <CButton
                      style={{ color: 'white', backgroundColor: 'gray', border: 'none' }}
                      onClick={() => setVisible(false)}
                    >
                      Close
                    </CButton>
                  </CModalFooter>
                </div>
                <div className="clearfix"></div>
              </Form>
            </CContainer>
          </CModalBody>
        </CModal>
      </div>
    </>
  )
}
