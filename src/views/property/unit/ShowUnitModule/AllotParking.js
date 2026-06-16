import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { Modal, Button, Form } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

const THEME_COLOR = '#00bfcc'

export default function AllotParking({ unitId, after_submit }) {
  const [visible, setVisible] = useState(false)
  const { handleSubmit, control, reset } = useForm()
  const { propertyId } = useParams()
  const { get, post, response } = useFetch()
  const [unalloted_array, setUnallotedArray] = useState([])

  useEffect(() => {
    if (visible) {
      getUnallotedParking()
    }
  }, [visible])

  async function getUnallotedParking() {
    const api = await get(`/v1/admin/premises/properties/${propertyId}/parkings?unallotted=1`)

    if (response.ok) {
      trimUnallotedParking(api?.data)
    }
  }

  function trimUnallotedParking(item) {
    const parkingarray = item?.map((e) => ({ value: e.id, label: e.parking_number })) || []
    setUnallotedArray(parkingarray)
  }

  async function onSubmit(data) {
    await post(`/v1/admin/premises/properties/${propertyId}/units/${unitId}/parkings/allot`, data)

    if (response.ok) {
      toast.success('Parking Alloted Successfully')
      after_submit()
      reset()
      setVisible(false)
    } else {
      toast.error(response.data?.message || 'Unable to allot parking')
    }
  }

  function openModal() {
    setVisible(true)
  }

  function closeModal() {
    setVisible(false)
    reset()
  }

  return (
    <>
      <button
        type="button"
        className="btn d-flex align-items-center"
        onClick={openModal}
        style={{
          gap: '6px',
          background: THEME_COLOR,
          color: '#fff',
          borderRadius: '10px',
          height: '38px',
          fontWeight: 600,
          border: 'none',
        }}
      >
        <CIcon icon={freeSet.cilPlus} size="sm" />
        Allot Parking
      </button>

      <Modal
        show={visible}
        onHide={closeModal}
        centered
        backdrop="static"
        contentClassName="border-0 overflow-hidden rounded-4"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          style={{
            background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
            border: 'none',
            padding: '20px 24px',
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
          }}
        >
          <Modal.Title style={{ color: '#fff' }}>
            <div className="d-flex align-items-center" style={{ gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CIcon icon={freeSet.cilCarAlt} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  Allot Parking
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  Assign an available parking spot to this unit
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px' }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #eef1f5',
                borderRadius: '14px',
                padding: '18px',
              }}
            >
              <div className="d-flex align-items-center mb-3" style={{ gap: '8px' }}>
                <span
                  style={{
                    width: '4px',
                    height: '18px',
                    background: THEME_COLOR,
                    borderRadius: '2px',
                  }}
                />
                <h6 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                  Parking Details
                </h6>
              </div>

              <Form.Group>
                <Form.Label style={{ fontWeight: 600, color: '#1f2933' }}>
                  Select Parking <span style={{ color: '#e03131' }}>*</span>
                </Form.Label>
                <Controller
                  name="parking_id"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={unalloted_array}
                      value={unalloted_array.find((c) => c.value === field.value) || null}
                      onChange={(val) => field.onChange(val?.value)}
                      placeholder="Select an unallotted parking spot"
                      isClearable
                    />
                  )}
                  control={control}
                />
              </Form.Group>
            </div>

            <Modal.Footer style={{ border: 'none', padding: '16px 0 0' }}>
              <Button
                variant="light"
                onClick={closeModal}
                style={{ borderRadius: '8px', fontWeight: 600 }}
              >
                Close
              </Button>
              <Button
                type="submit"
                style={{
                  background: THEME_COLOR,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

AllotParking.propTypes = {
  unitId: PropTypes.string,
  after_submit: PropTypes.func,
}
