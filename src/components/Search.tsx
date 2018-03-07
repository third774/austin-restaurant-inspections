import React from 'react'
import Downshift from 'downshift'
import styled from 'styled-components'
import debounce from 'lodash.debounce'

const SearchInput = styled.input`
  font-size: 20px;
  height: 26px;
  width: 100%;
  max-width: 600px;
`

function BasicAutocomplete({items, onChange}: any) {
  console.log(items)
  const keys = Object.keys(items)
  return (
    <Downshift
      onChange={debounce(onChange, 500)}
      render={({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex,
      }) => (
        <div>
          <SearchInput
            {...getInputProps({
              placeholder: 'What restaurant do you want to be disappointed in?',
            })}
          />
          {isOpen ? (
            <div style={{border: '1px solid #ccc'}}>
              {keys
                .filter(
                  (i) =>
                    !inputValue ||
                    i.toLowerCase().includes(inputValue.toLowerCase()),
                )
                .map((item: any, index: any) => (
                  <div
                    {...getItemProps({item})}
                    key={item}
                    style={{
                      backgroundColor:
                        highlightedIndex === index ? 'gray' : 'white',
                      fontWeight: selectedItem === item ? 'bold' : 'normal',
                    }}
                  >
                    {console.log(item) || item}
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      )}
    />
  )
}

export default BasicAutocomplete
