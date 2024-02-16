import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilSync, freeSet } from '@coreui/icons'

export default function FilterAccordion({ units_type, filter_callback }) {
  const [status_query, setStatus_query] = useState('')
  const [unit_query, setUnit_query] = useState('')

  const [visible_, setVisible_] = useState(true)

  useEffect(() => {
    queries_function()
  }, [status_query, unit_query])

  const { control, watch, reset, setValue } = useForm()
  const unit_status = [
    { value: 1, label: 'Vacant' },
    { value: 2, label: 'Occupied' },
    { value: 0, label: 'Unallotted' },
  ]

  const handle_reset = () => {
    setValue('unit_status', null)
    setValue('unit_type_id', null)
    setUnit_query(null)
    setStatus_query(null)
  }

  const handleunit_status = (val) => {
    setValue('unit_status', watch('unit_status')?.value)

    const query = `&q[status_eq]=${val.value}`
    setStatus_query(query)
  }

  const handleunit_type = (val) => {
    setValue('unit_type_id', watch('unit_type_id')?.value)

    const query = `&q[unit_type_id_eq]=${val.value}`
    setUnit_query(query)
  }

  const queries_function = () => {
    filter_callback(unit_query + status_query)
    setVisible_(false)
  }

  return (
    <div>
      <Dropdown data-bs-theme="light" className="d-flex" autoClose="outside">
        <Dropdown.Toggle
          id=" d-inline mx-2"
          variant="secondary"
          className="ms-2 text-start h-100 w-100"
          style={{
            backgroundColor: 'white',
            width: '15vw',
            border: '1px solid #00bfcc',
            borderRadius: '2px',
          }}
        >
          <CIcon icon={freeSet.cilFilter} />
          Filter
        </Dropdown.Toggle>

        <Dropdown.Menu
          className="p-2 border-0 rounded-0"
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 12px',
            width: '20vw',
          }}
          variant="success"
        >
          {/* <Dropdown.Item className="btn btn-teritary"> */}
          <button
            style={{
              border: '0px',
              float: 'left',
              background: 'initial',
            }}
            onClick={handle_reset}
          >
            <CIcon icon={cilSync} /> Reset Filter
          </button>
          {/* </Dropdown.Item> */}
          <Dropdown.Item className="btn btn-teritary mt-2" href="#/action-3">
            <label>Unit Status</label>

            <Controller
              name="unit_status"
              render={({ field }) => (
                <Select
                  type="text"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  {...field}
                  onChange={(val) => handleunit_status(val)}
                  options={unit_status}
                />
              )}
              control={control}
            />
          </Dropdown.Item>
          <Dropdown.Item className="btn btn-teritary" href="#/action-3">
            <label>Unit Type</label>
            <Controller
              name="unit_type_id"
              render={({ field }) => (
                <Select
                  type="text"
                  className="basic-single"
                  classNamePrefix="select"
                  {...field}
                  onChange={(val) => handleunit_type(val)}
                  options={units_type}
                />
              )}
              control={control}
            />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

FilterAccordion.propTypes = {
  filter_callback: PropTypes.func,
  units_type: PropTypes.array,
}
