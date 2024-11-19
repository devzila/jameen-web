import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilSync, freeSet } from '@coreui/icons'
import { format_react_select } from 'src/services/CommonFunctions'
import { useFetch } from 'use-http'
import { Dropdown } from 'react-bootstrap'
export default function ResidentFIlters({ units_type, filter_callback }) {
  const [gender_query, setGenderQuery] = useState('')
  const [property_query, setPropertyQuery] = useState('')
  const [property_array, setPropertyArray] = useState('')

  const { get, response } = useFetch()

  const [visible_, setVisible_] = useState(true)

  useEffect(() => {
    queries_function()
    fetchProperties()
  }, [gender_query, property_query])

  const { control, watch, reset, setValue, register } = useForm()

  const gender_type = [
    { value: 0, label: 'Male' },
    { value: 1, label: 'Female' },
    { value: 2, label: 'Other' },
  ]

  const handle_reset = () => {
    setValue('gender_val', null)
    setValue('property_select', null)
    setGenderQuery(null)
    setPropertyQuery(null)
  }

  const handle_property = (val) => {
    setValue('property_val', watch('property_val')?.value)

    const query = `&q[property_id_eq]=${val.value}`
    setPropertyQuery(query)
  }

  const handle_gender = (val) => {
    setValue('gender_val', watch('gender_val')?.value)
    const query = `&q[gender_eq]=${val.value}`
    setGenderQuery(query)
  }

  const queries_function = () => {
    filter_callback(gender_query + property_query)
    setVisible_(false)
  }

  async function fetchProperties() {
    let endpoint = `/v1/admin/premises/properties?limit=-1`
    const initialProperties = await get(endpoint)
    if (response.ok) {
      setPropertyArray(format_react_select(initialProperties.data, ['id', 'name']))
    }
  }
  console.log(property_array)
  return (
    <div className="mx-1">
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
            <label>Gender</label>

            <Controller
              name="gender_val"
              render={({ field }) => (
                <Select
                  type="text"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  {...field}
                  onChange={(val) => handle_gender(val)}
                  options={gender_type}
                />
              )}
              control={control}
            />
          </Dropdown.Item>
          <Dropdown.Item className="btn btn-teritary" href="#/action-3">
            <label>Category</label>
            <Controller
              name="property_select"
              render={({ field }) => (
                <Select
                  type="text"
                  className="basic-single"
                  classNamePrefix="select"
                  {...field}
                  onChange={(val) => handle_property(val)}
                  options={property_array}
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
ResidentFIlters.propTypes = {
  filter_callback: PropTypes.func,
  units_type: PropTypes.array,
}
