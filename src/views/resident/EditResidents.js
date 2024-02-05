import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
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
import { toast } from 'react-toastify'

export default function EditResidents(props) {
  const [resident, setResident] = useState({})
  const [properties_data, setProperties_data] = useState([])
  const [visible, setVisible] = useState(false)
  const [imageView, setImageView] = useState('')

  const { register, handleSubmit, setValue, watch, control } = useForm()
  const { get, put, response } = useFetch()

  const { id } = props

  //base64
  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0]

    if (selectedFile) {
      const reader = new FileReader()

      reader.onload = function (e) {
        const base64Result = e.target.result
        setImageView(base64Result)
      }

      reader.readAsDataURL(selectedFile)
    }
  }

  const gender = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ]

  useEffect(() => {
    loadInitialProperties()
    loadResident()
  }, [])

  const loadInitialProperties = async () => {
    let endpoint = `/v1/admin/premises/properties`

    const initialProperties = await get(endpoint)
    if (response.ok) {
      setProperties_data(trimProperties(initialProperties.data))
    } else {
      toast("Can't load properties data")
    }
  }

  let properties_array = []
  function trimProperties(properties_obj) {
    properties_obj.forEach((element) => {
      properties_array.push({ value: element.id, label: element.name })
    })
    return properties_array
  }
  const loadResident = async () => {
    const endpoint = await get(`/v1/admin/members/${id}`)

    if (response.ok) {
      setResident(endpoint.data)
      console.log(resident)
      setValue('first_name', endpoint.data.first_name)
      setValue('last_name', endpoint.data.last_name)
      setValue('email', endpoint.data.email)
      setValue('phone_number', endpoint.data.phone_number)
      setValue('username', endpoint.data.username)
      setValue('password', endpoint.data.first_name)
      setValue('gender', endpoint.data.gender)
      setValue('dob', endpoint.data.dob)
      setValue('property_id', endpoint.data.property_id)
    } else {
      toast(response?.data.message)
    }
  }
  const onSubmit = async (data) => {
    const body = { ...data, avatar: { data: imageView } }
    const endpoint = await put(`/v1/admin/members/${id}`, { member: body })

    if (response.ok) {
      toast('Resident Data Edited Successfully')
      setVisible(false)
    } else {
      toast(response?.error)
    }
  }

  return (
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
          <CModalTitle id="StaticBackdropExampleLabel">Edit Resident</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Row>
              <div className="col text-center">
                <img
                  alt="Avatar Image"
                  style={{
                    width: '300px',
                    height: '300px',

                    marginTop: '2%',
                    marginLeft: '4%',
                    borderRadius: '50%',
                  }}
                  title="Avatar"
                  className="img-circle img-thumbnail isTooltip  "
                  src={
                    resident?.avatar
                      ? resident.avatar
                      : imageView
                      ? imageView
                      : 'https://bootdey.com/img/Content/avatar/avatar7.png'
                  }
                  data-original-title="Usuario"
                />
              </div>
            </Row>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Avatar Image</label>
                    <Form.Control
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      {...register('avatar')}
                      onChange={(e) => handleFileSelection(e)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>First Name</label>
                    <Form.Control
                      placeholder="First Name"
                      type="text"
                      {...register('first_name')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Last Name</label>
                    <Form.Control
                      placeholder="Last Name"
                      type="text"
                      {...register('last_name')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Email</label>
                    <Form.Control
                      placeholder="abc@example.com"
                      type="text"
                      {...register('email')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Phone No</label>
                    <Form.Control
                      placeholder="Phone Number"
                      type="text"
                      {...register('phone_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-3 mt-3" md="6">
                  <Form.Group>
                    <label>Username</label>
                    <Form.Control
                      placeholder="UserName"
                      type="text"
                      {...register('username')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Password</label>
                    <Form.Control
                      placeholder="Password"
                      type="password"
                      {...register('password')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Gender</label>
                    <Controller
                      name="gender"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={gender}
                          value={gender.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
                      control={control}
                      placeholder="Role"
                    />
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>D.O.B</label>
                    <Form.Control
                      placeholder="Date of Birth"
                      type="date"
                      {...register('dob')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Assigned Properties</label>

                    <Controller
                      name="property_id"
                      render={({ field }) => (
                        <Select
                          s
                          type="text"
                          className="basic-multi-select"
                          classNamePrefix="select"
                          {...field}
                          options={properties_data}
                          value={properties_data.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
                      control={control}
                      placeholder="Assigned Properties"
                    />
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
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}

EditResidents.propTypes = {
  id: PropTypes.number.isRequired,
}

// {
//   id: 45,
//   unit_no: '105-9',
//   bedrooms_number: 5,
//   bathrooms_number: 4,
//   year_built: 2007,
//   electricity_account_number: null,
//   water_account_number: null,
//   internal_extension_number: null,
//   last_status_changed_date: null,
//   status: 'vacant',
//   unit_type: {
//     id: 9,
//     name: '5 Bedroom Apt',
//     description: '5 Bed Room Apartment, 3600 sqr feet',
//     use_type: 'residential',
//     sqft: 3600,
//     monthly_maintenance_amount_per_sqft: '2.6',
//     created_at: '2024-02-04T15:05:45.716Z',
//     updated_at: '2024-02-04T15:05:45.716Z'
//   },
//   building: {
//     id: 5,
//     name: 'Tower 1',
//     description: 'Tower 1',
//     created_at: '2024-02-04T15:05:46.152Z',
//     updated_at: '2024-02-04T15:05:46.152Z'
//   },
//   running_contracts: [
//     {
//       start_date: '2002-12-12',
//       end_date: null,
//       contract_type: 'allotment',
//       notes: 'Urgent allocation ',
//       created_at: '2024-02-04T15:11:46.195Z',
//       contract_members: [
//         {
//           member_type: 'co_owner',
//           member: {
//             id: 46,
//             first_name: 'Barrie',
//             last_name: 'Beatty',
//             username: 'barrie_831',
//             avatar: null,
//             name: 'Barrie Beatty'
//           }
//         },
//         {
//           member_type: 'co_owner',
//           member: {
//             id: 47,
//             first_name: 'Alva',
//             last_name: 'Nicolas',
//             username: 'alva_931',
//             avatar: null,
//             name: 'Alva Nicolas'
//           }
//         }
//       ],
//       documents: [
//         {
//           id: 1,
//           documentable_id: 6,
//           documentable_type: 'Premises::UnitContract',
//           name: 'Agreement ',
//           description: 'Agreement document',
//           file:
//             'http://127.0.0.1:3000/rails/active_storage/disk/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9JYTJWNVNTSWhNV0p4ZERKNllXczBhemcyT0RKdU5YQXdabU16TUhwNWMzVmlOd1k2QmtWVU9oQmthWE53YjNOcGRHbHZia2tpUDJsdWJHbHVaVHNnWm1sc1pXNWhiV1U5SWpFM01EY3dOVGsxTURZaU95Qm1hV3hsYm1GdFpTbzlWVlJHTFRnbkp6RTNNRGN3TlRrMU1EWUdPd1pVT2hGamIyNTBaVzUwWDNSNWNHVkpJZzlwYldGblpTOXFjR1ZuQmpzR1ZEb1JjMlZ5ZG1salpWOXVZVzFsT2dwc2IyTmhiQT09IiwiZXhwIjoiMjAyNC0wMi0wNFQxNToxNjo1Mi4wNDlaIiwicHVyIjoiYmxvYl9rZXkifX0=--f5399db09f17827ff8cc20945372c43305593e79/1707059506',
//           created_at: '2024-02-04T15:11:46.203Z'
//         },
//         {
//           id: 2,
//           documentable_id: 6,
//           documentable_type: 'Premises::UnitContract',
//           name: 'Verification',
//           description: 'Police verification',
//           file:
//             'http://127.0.0.1:3000/rails/active_storage/disk/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9JYTJWNVNTSWhOSFJ0TTJwd2NYZDFjakEzT0hKa05HaDBhV2xpZW1VMWRteG9OQVk2QmtWVU9oQmthWE53YjNOcGRHbHZia2tpUDJsdWJHbHVaVHNnWm1sc1pXNWhiV1U5SWpFM01EY3dOVGsxTURZaU95Qm1hV3hsYm1GdFpTbzlWVlJHTFRnbkp6RTNNRGN3TlRrMU1EWUdPd1pVT2hGamIyNTBaVzUwWDNSNWNHVkpJZzlwYldGblpTOXFjR1ZuQmpzR1ZEb1JjMlZ5ZG1salpWOXVZVzFsT2dwc2IyTmhiQT09IiwiZXhwIjoiMjAyNC0wMi0wNFQxNToxNjo1Mi4wNTNaIiwicHVyIjoiYmxvYl9rZXkifX0=--d5c46a7282561f944159482acb62680a2d7c7118/1707059506',
//           created_at: '2024-02-04T15:11:46.217Z'
//         }
//       ]
//     }
//   ],
//   contract_history: [],
//   property: { id: 5, name: 'Urban Enclave Housing Society' }
// }
// }

// id: 44,
//       unit_no: '104-9',
//       bedrooms_number: 5,
//       bathrooms_number: 4,
//       year_built: 2007,
//       electricity_account_number: null,
//       water_account_number: null,
//       internal_extension_number: null,
//       last_status_changed_date: null,
//       status: 'vacant',
//       unit_type: {
//         id: 9,
//         name: '5 Bedroom Apt',
//         description: '5 Bed Room Apartment, 3600 sqr feet',
//         use_type: 'residential',
//         sqft: 3600,
//         monthly_maintenance_amount_per_sqft: '2.6',
//         created_at: '2024-02-04T15:05:45.716Z',
//         updated_at: '2024-02-04T15:05:45.716Z'
//       },
//       building: {
//         id: 5,
//         name: 'Tower 1',
//         description: 'Tower 1',
//         created_at: '2024-02-04T15:05:46.152Z',
//         updated_at: '2024-02-04T15:05:46.152Z'
//       },
//       running_contracts: [
//         {
//           start_date: '2002-12-12',
//           end_date: null,
//           contract_type: 'allotment',
//           notes: 'Notes  ...',
//           created_at: '2024-02-04T15:15:21.797Z',
//           contract_members: [
//             {
//               member_type: 'owner',
//               member: {
//                 id: 48,
//                 first_name: 'Pauline',
//                 last_name: 'Parisian',
//                 username: 'pauline_662',
//                 avatar: null,
//                 name: 'Pauline Parisian'
//               }
//             }
//           ],
//           documents: [
//             {
//               id: 3,
//               documentable_id: 7,
//               documentable_type: 'Premises::UnitContract',
//               name: 'Document 1 inf',
//               description: 'DOC 1 desp',
//               file:
//                 'http://127.0.0.1:3000/rails/active_storage/disk/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9JYTJWNVNTSWhibkEwYkdJMWMyMWliV0l4T1hoNlpHRTFlbTVyYTJaM1oyODFad1k2QmtWVU9oQmthWE53YjNOcGRHbHZia2tpUDJsdWJHbHVaVHNnWm1sc1pXNWhiV1U5SWpFM01EY3dOVGszTWpFaU95Qm1hV3hsYm1GdFpTbzlWVlJHTFRnbkp6RTNNRGN3TlRrM01qRUdPd1pVT2hGamIyNTBaVzUwWDNSNWNHVkpJZzlwYldGblpTOXFjR1ZuQmpzR1ZEb1JjMlZ5ZG1salpWOXVZVzFsT2dwc2IyTmhiQT09IiwiZXhwIjoiMjAyNC0wMi0wNFQxNToyMDo1Ni43NzFaIiwicHVyIjoiYmxvYl9rZXkifX0=--a7c280524ae530b671522a9a7230d5f0552b222e/1707059721',
//               created_at: '2024-02-04T15:15:21.825Z'
//             },
//             {
//               id: 4,
//               documentable_id: 7,
//               documentable_type: 'Premises::UnitContract',
//               name: 'DOc 22',
//               description: 'DOC 2 desc',
//               file:
//                 'http://127.0.0.1:3000/rails/active_storage/disk/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9JYTJWNVNTSWhkWEIwZHpkaWFYZ3dNVEJtTUdSb2RuZHhkV28zTTJOaGFXRnhhZ1k2QmtWVU9oQmthWE53YjNOcGRHbHZia2tpUDJsdWJHbHVaVHNnWm1sc1pXNWhiV1U5SWpFM01EY3dOVGszTWpFaU95Qm1hV3hsYm1GdFpTbzlWVlJHTFRnbkp6RTNNRGN3TlRrM01qRUdPd1pVT2hGamIyNTBaVzUwWDNSNWNHVkpJZzlwYldGblpTOXFjR1ZuQmpzR1ZEb1JjMlZ5ZG1salpWOXVZVzFsT2dwc2IyTmhiQT09IiwiZXhwIjoiMjAyNC0wMi0wNFQxNToyMDo1Ni43NzdaIiwicHVyIjoiYmxvYl9rZXkifX0=--849ca9523a6e51f5adbda9120b56d199d0dae276/1707059721',
//               created_at: '2024-02-04T15:15:21.848Z'
//             }
//           ]
//         }
//       ],
//       contract_history: [],
//       property: { id: 5, name: 'Urban Enclave Housing Society' }
//     }
//   }
