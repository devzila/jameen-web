import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
import PropTypes from 'prop-types'

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

export default function UpdateRequestStatus({ id, api_endpoint, refreshData }) {
  const { get, put, patch, response } = useFetch()
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, setValue, control } = useForm()

  const [data, setData] = useState({})

  const status_options = [
    { value: 'requested', label: 'Requested' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'reopen', label: 'Reopen' },
  ]

  useEffect(() => {
    getInitalData()
  }, [])

  async function getInitalData() {
    const api = await get(`/${api_endpoint}/${id}`)
    if (response.ok) {
      setData(api.data)
      setValue('status', api.data.status)
    }
  }

  async function onSubmit(data) {
    const api = await put(`/${api_endpoint}/${id}`, { request: data })
    if (response.ok) {
      setVisible(false)
      refreshData()
      toast.success('Status Updated')
    }
  }
  return (
    <>
      <button
        type="button"
        className="tooltip_button "
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Edit Status
      </button>
      <CModal
        alignment="center"
        size="lg"
        visible={visible}
        backdrop="static"
        className="p-4"
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Update Status</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-1 mt-1" md="6">
                  <Form.Group>
                    <label>Status</label>

                    <Controller
                      name="status"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={status_options}
                          value={status_options.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
                      control={control}
                      placeholder="Role"
                    />
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-1" md="6">
                  <Form.Group>
                    <label>Start Date</label>
                    <Form.Control
                      defaultValue={data.start_date}
                      placeholder="Start Date"
                      type="date"
                      {...register('start_date')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center">
                <CModalFooter>
                  <Button data-mdb-ripple-init type="submit" className="custom_theme_button">
                    Submit
                  </Button>
                  <CButton className="custom_grey_button" onClick={() => setVisible(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </div>
              <div className="clearfix"></div>
            </Form>
          </CContainer>
        </CModalBody>
      </CModal>
    </>
  )
}

UpdateRequestStatus.propTypes = {
  id: PropTypes.number,
  api_endpoint: PropTypes.string,
  refreshData: PropTypes.func,
}
