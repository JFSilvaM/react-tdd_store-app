import React from 'react'
import {screen, render} from '@testing-library/react'
import {Form} from './form'

describe('when the form is mounted', () => {
  test('there must be a create product from page', () => {
    render(<Form />)

    expect(
      screen.getByRole('heading', {name: /create product/i}),
    ).toBeInTheDocument()
  })
})
