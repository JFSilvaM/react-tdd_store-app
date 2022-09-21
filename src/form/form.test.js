import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import React from 'react'
import {CREATED_STATUS, ERROR_SERVER_STATUS} from '../consts/httpStatus'
import {Form} from './form'

const server = setupServer(
  rest.post('/products', (req, res, ctx) => {
    const {name, size, type} = req.body

    if (name && size && type) {
      return res(ctx.status(CREATED_STATUS))
    }

    return res(ctx.status(ERROR_SERVER_STATUS))
  }),
)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

beforeEach(() => render(<Form />))

describe('when the form is mounted', () => {
  test('there must be a create product from page', () => {
    expect(
      screen.getByRole('heading', {name: /create product/i}),
    ).toBeInTheDocument()
  })

  test('should exists the fields: name, size, type (electronic, furniture, clothing)', () => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()

    expect(screen.getByLabelText(/size/i)).toBeInTheDocument()

    expect(screen.getByLabelText(/type/i)).toBeInTheDocument()

    expect(screen.queryByText(/electronic/i)).toBeInTheDocument()

    expect(screen.queryByText(/furniture/i)).toBeInTheDocument()

    expect(screen.queryByText(/clothing/i)).toBeInTheDocument()
  })

  test('should exists the submit button', () => {
    expect(screen.getByRole('button', {name: /submit/i})).toBeInTheDocument()
  })
})

describe('when the user submits the form without values', () => {
  test('should display validation messages', async () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()

    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()

    expect(screen.queryByText(/the type is required/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {name: /submit/i}))

    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()

    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()

    expect(screen.queryByText(/the type is required/i)).toBeInTheDocument()

    await waitFor(() =>
      expect(screen.getByRole('button', {name: /submit/i})).not.toBeDisabled(),
    )
  })
})

describe('when the user blurs an empty field', () => {
  test('should display a validation error message for the input name', () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()

    fireEvent.blur(screen.getByLabelText(/name/i), {
      target: {name: 'name', value: ''},
    })

    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
  })

  test('should display a validation error message for the input size', () => {
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()

    fireEvent.blur(screen.getByLabelText(/size/i), {
      target: {name: 'size', value: ''},
    })

    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
  })
})

describe('when the user submits the form', () => {
  test('should the submit button be disabled until the request is done', async () => {
    const submitBtn = screen.getByRole('button', {name: /submit/i})

    expect(submitBtn).not.toBeDisabled()

    fireEvent.click(submitBtn)

    expect(submitBtn).toBeDisabled()

    await waitFor(() => expect(submitBtn).not.toBeDisabled())
  })

  test('the form page must display the success message “Product stored” and clean the fields values', async () => {
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: {name: 'name', value: 'my product'},
    })

    fireEvent.change(screen.getByLabelText(/size/i), {
      target: {name: 'size', value: '10'},
    })

    fireEvent.change(screen.getByLabelText(/type/i), {
      target: {name: 'type', value: 'electronic'},
    })

    fireEvent.click(screen.getByRole('button', {name: /submit/i}))

    await waitFor(() =>
      expect(screen.getByText(/product stored/i)).toBeInTheDocument(),
    )
  })
})
