import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { useParams } from 'react-router-dom'

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
import { BsTerminal } from 'react-icons/bs'

export default function AllocateUnit({ unitId, unitNo }) {
  const { register, handleSubmit, control, reset } = useForm()
  const { post, get, response } = useFetch()

  const [residents, setResidents] = useState([])
  const [visible, setVisible] = useState(false)

  const { propertyId } = useParams()

  async function loadInitialResidents() {
    let endpoint = `/v1/admin/residents?limit=-1`

    const initialResidents = await get(endpoint)

    if (response.ok) {
      if (initialResidents.data) {
        setResidents(trimResidents(initialResidents.data))
      }
    } else {
      toast('Unable to load residents')
    }
  }
  useEffect(() => {
    loadInitialResidents()
  }, [])

  let resident_array = []
  function trimResidents(obj) {
    obj.forEach((element) => {
      resident_array.push({
        value: element.id,
        label: element.first_name + ' ' + element.last_name,
      })
    })
    return resident_array
  }

  async function onSubmit(data) {
    const assigned_resident_data =
      data?.resident_ids?.length > 0 ? data.resident_ids.map((element) => element.value) : []

    const body = { ...data, resident_ids: assigned_resident_data }

    await post(`/v1/admin/premises/properties/${propertyId}/units/${unitId}/allotment`, {
      allotment: body,
    })
    if (response.ok) {
      toast('Unit Alloted : Operation Successful')
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
        Allocate
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
          <CModalTitle id="StaticBackdropExampleLabel">Unit Allocation </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <div className="col text-center">
                  <p className="text-center display-6" style={{ color: '#00bfcc' }}>
                    JAMEEN
                  </p>
                </div>
              </Row>

              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>
                      <b>Unit No: </b>
                      {unitNo}
                    </label>
                    <Form.Control
                      hidden
                      placeholder="Name"
                      defaultValue={unitNo}
                      type="text"
                      {...register('unit', { required: true })}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Assigned Properties</label>

                    <Controller
                      name="resident_ids"
                      render={({ field }) => (
                        <Select
                          isMulti
                          type="text"
                          className="basic-multi-select"
                          classNamePrefix="select"
                          {...field}
                          options={residents}
                        />
                      )}
                      control={control}
                      placeholder="Assigned Properties"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-3 mt-3" md="12">
                  <Form.Group>
                    <label>Allocation Date</label>
                    <Form.Control
                      required
                      placeholder="Description"
                      type="date"
                      {...register('allotment_date')}
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
AllocateUnit.propTypes = {
  unitId: PropTypes.number,
  unitNo: PropTypes.number,
}
