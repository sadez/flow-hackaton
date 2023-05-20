import { render } from '@testing-library/react'

import TableHeader from './TableHeader'
import { Table } from '@chakra-ui/react'

describe("TableHeader", () => {
  const content = "HIGHESTPRICEOFTHEDAY"
  test("can render content", () => {
    render(<Table><TableHeader /></Table>)


    const firstLine = document.querySelector('th')
    expect(firstLine?.innerText.toUpperCase()).toBe(content)
    
  })
})