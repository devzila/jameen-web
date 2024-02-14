import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilSync, freeSet } from '@coreui/icons'

export default function FilterAccordion({ units_type, after_submit }) {
  console.log(units_type)

  const { watch } = useForm()

  const { control } = useForm()

  const unit_status = [
    { value: 'vacant', label: 'Vacant' },
    { value: 'allocated', label: 'Allocated' },
    { value: 'occupied', label: 'Occupied' },
  ]
  return (
    <div>
      <Dropdown data-bs-theme="light" className="d-flex" autoClose={false}>
        <Dropdown.Toggle
          id="dropdown-button-light-example1"
          variant="secondary"
          className="ms-2 text-start"
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
            onClick={after_submit}
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
                  value={unit_status.find((c) => c.value === field.value)}
                  onChange={(val) => field.onChange(val.value)}
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
                  className="basic-multi-select"
                  classNamePrefix="select"
                  {...field}
                  value={units_type.find((c) => c.value === field.value)}
                  onChange={(val) => field.onChange(val.value)}
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
  after_submit: PropTypes.func,
  units_type: PropTypes.array,
}
