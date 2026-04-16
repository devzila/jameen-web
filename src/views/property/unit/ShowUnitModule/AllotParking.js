import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
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

export default function AllotParking({ unitId, after_submit }) {
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, control } = useForm()
  const { propertyId } = useParams()
  const { get, post, response } = useFetch()
  const [unalloted_array, setUnallotedArray] = useState([])
  useEffect(() => {
    getUnallotedParking()
  }, [])

  async function getUnallotedParking() {
    const api = await get(`/v1/admin/premises/properties/${propertyId}/parkings?unallotted=1`)

    if (response.ok) {
      trimUnallotedParking(api?.data)
    }
  }

  function trimUnallotedParking(item) {
    let parkingarray = []
    item?.map((e) => {
      parkingarray.push({ value: e.id, label: e.parking_number })
    })
    setUnallotedArray(parkingarray)
  }

  async function onSubmit(data) {
    const api = await post(
      `/v1/admin/premises/properties/${propertyId}/units/${unitId}/parkings/allot`,
      data,
    )
    if (response.ok) {
      toast.success('Parking Alloted Successfully')
      after_submit()
      getUnallotedParking()
      setVisible(false)
    } else {
      toast.error(response.data?.message || 'Unable to allot parking')
    }
  }

  function getDependency() {
    setVisible(!visible)
    getUnallotedParking()
  }

  return (
    <>
      <div>
        <button
          type="button"
          className="btn custom_theme_button"
          data-mdb-ripple-init
          onClick={() => getDependency()}
        >
          Allot Parking
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
            <CModalTitle id="StaticBackdropExampleLabel">Allot Parking</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Select Parking</label>
                      <Controller
                        name="parking_id"
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={unalloted_array}
                            value={unalloted_array.find((c) => c.value === field.value)}
                            onChange={(val) => field.onChange(val.value)}
                          />
                        )}
                        control={control}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row></Row>

                <div className="text-center">
                  <CModalFooter className="border-0">
                    <Button
                      data-mdb-ripple-init
                      type="submit"
                      className="btn btn-primary btn-block custom_theme_button"
                    >
                      Submit
                    </Button>
                    <CButton
                      className="custom_grey_button"
                      color="secondary"
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

AllotParking.propTypes = {
  unitId: PropTypes.string,
  after_submit: PropTypes.func,
}
