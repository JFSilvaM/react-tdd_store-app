import {InputLabel, Select, TextField, Button} from '@mui/material'
import React, {useState} from 'react'

export const Form = () => {
  const [formErrors, setFormErrors] = useState({
    name: '',
    size: '',
    type: '',
  })

  const handleSubmit = e => {
    e.preventDefault()

    const {name, size, type} = e.target.elements

    !name.value &&
      setFormErrors(prevState => ({...prevState, name: 'The name is required'}))

    !size.value &&
      setFormErrors(prevState => ({...prevState, size: 'The size is required'}))

    !type.value &&
      setFormErrors(prevState => ({...prevState, type: 'The type is required'}))
  }

  const handleBlur = e => {
    const {name, value} = e.target

    setFormErrors({
      ...formErrors,
      [name]: value.length ? '' : `The ${name} is required`,
    })
  }

  return (
    <>
      <h1>Create product</h1>

      <form onSubmit={handleSubmit}>
        <TextField
          label="name"
          id="name"
          name="name"
          helperText={formErrors.name}
          onBlur={handleBlur}
        />

        <TextField
          label="size"
          id="size"
          name="size"
          helperText={formErrors.size}
          onBlur={handleBlur}
        />

        <InputLabel htmlFor="type">Type</InputLabel>

        <Select
          native
          value=""
          inputProps={{
            name: 'type',
            id: 'type',
          }}
        >
          <option aria-label="None" value="" />
          <option value="electronic">Electronic</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
        </Select>

        {formErrors.type.length && <p>{formErrors.type}</p>}

        <Button type="submit">Submit</Button>
      </form>
    </>
  )
}

export default Form
