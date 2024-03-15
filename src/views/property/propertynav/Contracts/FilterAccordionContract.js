import React, { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { cilSync } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

function FilterAccordionContract({ filterCallback }) {
  const { control, watch, setValue } = useForm()
  const [selectedContractType, setSelectedContractType] = useState(null)

  const contractTypes = [
    { value: 'moving_in', label: 'Moving In' },
    { value: 'allotment', label: 'Allotment' },
  ]
  const handleReset = () => {
    setValue('contractType', null)
    setSelectedContractType(null)
    filterCallback(null)
  }

  const handleContractTypeChange = (value) => {
    setValue('contractType', value?.value || null)
    setSelectedContractType(value)
    filterCallback(value?.value || null)
  }

  return (
    <div>
      <Dropdown data-bs-theme="light" className="d-flex" autoClose="outside">
        <Dropdown.Toggle
          id="contractTypeDropdown"
          variant="secondary"
          className="ms-2 text-start h-100 w-100"
          style={{
            backgroundColor: 'white',
            width: '15vw',
            border: '1px solid #00bfcc',
            borderRadius: '2px',
          }}
        >
          <CIcon icon={cilSync} />
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
          <button
            style={{
              border: '0px',
              float: 'left',
              background: 'initial',
            }}
            onClick={handleReset}
          >
            <CIcon icon={cilSync} /> Reset Filter
          </button>
          <Dropdown.Item className="btn btn-teritary" href="#/action-3">
            <label>Contract Type</label>
            <Controller
              name="contractType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={contractTypes}
                  value={selectedContractType}
                  onChange={(value) => handleContractTypeChange(value)}
                  className="basic-single"
                  classNamePrefix="select"
                  isClearable
                />
              )}
            />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

FilterAccordionContract.propTypes = {
  filterCallback: PropTypes.func.isRequired,
}

export default FilterAccordionContract
