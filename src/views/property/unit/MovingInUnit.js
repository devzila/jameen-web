import React, { useEffect, useState } from 'react'
import PropTypes, { element } from 'prop-types'
import useFetch from 'use-http'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { useParams } from 'react-router-dom'
import Loading from 'src/components/loading/loading'

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

import { cilDelete, cilNoteAdd } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

export default function MovingInUnit({ unitNo, unitId }) {
  const { register, handleSubmit, setValue, control, watch, reset } = useForm()
  const { post, get, response } = useFetch()
  const [temp_base64, setTemp_base64] = useState([])

  const [residents, setResidents] = useState([])

  const [visible, setVisible] = useState(false)
  const [submitLoader, setSubmitLoader] = useState(false)

  const { propertyId } = useParams()

  //dynamic form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'documents_attributes',
  })

  //resident api call

  async function loadInitialResidents() {
    let endpoint = `/v1/admin/premises/properties/${propertyId}/residents?limit=-1`

    const initialResidents = await get(endpoint)

    if (response.ok) {
      if (initialResidents.data) {
        setResidents(trimResidents(initialResidents.data))
      }
    } else {
      toast('Unable to load residents')
    }
  }

  //useEffext
  useEffect(() => {
    loadInitialResidents()
  }, [])

  //resident dropdown
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

  //base64
  //base64
  const handleFileSelection = (e, index) => {
    console.log(e)
    console.log(index)
    const selectedFile = e.target.files[0]

    if (selectedFile) {
      const reader = new FileReader()

      reader.onload = function (e) {
        const temp_array64 = Array.from(temp_base64)
        const base64Result = e.target.result
        temp_array64[index] = base64Result
        setTemp_base64(temp_array64)
        console.log(temp_base64[0])

        // setValue(`documents_attributes.${index}.file.data`, base64Result)
      }

      reader.readAsDataURL(selectedFile)
    }
  }

  //initially append
  useEffect(() => {
    setValue('documents_attributes', [{ name: '', description: '', file: { data: '' } }])
  }, [setValue])

  //primary_resident

  const primary_resident_array = watch('resident_ids')
  if (primary_resident_array) {
    // setValue('primary_resident_ids', primary_resident_array?.[0]?.id)
  }

  //submit function

  async function onSubmit(data) {
    console.log(data)
    //resident array
    setSubmitLoader(true)
    const assigned_resident_data =
      data?.resident_ids?.length > 0 ? data.resident_ids.map((element) => element.value) : []
    console.log(assigned_resident_data)

    //filestobase64
    console.log(temp_base64.length)
    temp_base64.map((x, index) => setValue(`documents_attributes.${index}.file.data`, x))

    data.documents_attributes.map((element, index) => (element.file.data = temp_base64[index]))
    console.log(data)

    const body = { ...data, resident_ids: assigned_resident_data }
    console.log(body)

    await post(`/v1/admin/premises/properties/${propertyId}/units/${unitId}/movingIn`, {
      allotment: body,
    })
    if (response.ok) {
      toast('Moved In : Operation Successful')
      reset()
      after_submit()
      setSubmitLoader(false)
      setVisible(false)
      setTemp_base64([])
    } else {
      setSubmitLoader(false)
      toast(response.data?.message)
    }
  }
  function handlClose() {
    setVisible(false)
    setTemp_base64([])
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
        onClick={() => setVisible(true)}
      >
        Moving In
      </button>
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        backdrop="static"
        onClose={handlClose}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Moving In </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-1 mt-3" md="10">
                  <label>
                    <b>Unit No: </b>
                    {unitNo}
                  </label>
                </Col>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>
                      Resident <small className="text-danger"> *</small>
                    </label>

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

                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>
                      Primary Resident <small className="text-danger"> *</small>
                    </label>

                    <Controller
                      name="primary_resident_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={primary_resident_array}
                          value={primary_resident_array?.find((c) => c.value === field.value)}
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
                    <label>Moving In Date</label>
                    <Form.Control
                      required
                      type="date"
                      {...register('moving_in_date')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Col className="pr-1 mt-3" md="12">
                <Form.Group>
                  <label>Notes</label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Notes"
                    {...register('notes')}
                  ></Form.Control>
                </Form.Group>
              </Col>

              {fields.map((field, index) => (
                <Row key={field.id}>
                  <b className="mt-4"> </b>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <b>Document Name</b>
                      <Form.Control
                        required
                        placeholder=" Name"
                        type="text"
                        {...register(`documents_attributes.${index}.name`)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>

                  <Col className="pr-1 mt-3 mb-2" md="6">
                    <Form.Group>
                      <label>
                        <b>Document</b>
                      </label>
                      <Form.Control
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        {...register(`documents_attributes.${index}.file.data`)}
                        onChange={(e) => handleFileSelection(e, index)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Description</label>
                      <Form.Control
                        placeholder="Description"
                        type="text"
                        {...register(`documents_attributes.${index}.description`)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    {fields.length > 1 && (
                      <Col className="justify-content-center mt-2" md="4">
                        <CIcon
                          className="mt-3"
                          onClick={() => remove(index)}
                          icon={cilDelete}
                          size="xl"
                          style={{ '--ci-primary-color': 'red' }}
                        />
                      </Col>
                    )}
                  </Col>
                </Row>
              ))}
              <Col className="m-3 d-flex justify-content-center">
                <CButton
                  style={{
                    border: '0px',
                    color: '#00bfcc',
                    backgroundColor: 'white',
                    boxShadow: '5px  5px 20px ',
                    borderRadius: '26px',
                  }}
                  onClick={() => append({ name: '', description: '', file: { data: '' } })}
                >
                  <CIcon className="mt-1" icon={cilNoteAdd} />
                  ADD More
                </CButton>
              </Col>
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
                    onClick={handlClose}
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
MovingInUnit.propTypes = {
  unitId: PropTypes.number,
  unitNo: PropTypes.number,
  after_submit: PropTypes.func,
}
