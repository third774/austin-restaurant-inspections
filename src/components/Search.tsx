import React from 'react'
import Downshift from 'downshift'
import styled from 'styled-components'
import debounce from 'lodash.debounce'

import api from 'api'

const SearchInput = styled.input`
  font-size: 20px;
  width: 100%;
  border: none;
  border-bottom: 2px solid slategray;
  background-color: inherit;
  color: inherit;
  font-family: 'Lato', sans-serif;
  &:focus {
    outline: none;
  }
`

const SearchContainer = styled.div`
  max-width: 582px;
  margin: 0 auto 24px auto;
`

const DownshiftContainer = styled.div`
  margin: 14px;
`

const ResultsContainer = styled.div`
  border: 1px solid slategray;
  max-height: 300px;
  overflow-y: scroll;
  background-color: inherit;
  color: inherit;
`

interface SearchProps {
  onChange: any
}

interface SearchState {
  results: SearchResult[]
}

export interface SearchResult {
  restaurant_name: string
  facility_id: string
  address_address: string
}

class Search extends React.Component<SearchProps, SearchState> {
  state: SearchState = {
    results: [],
  }

  debouncedFetch = debounce((search: string) => {
    if (search.length > 0) {
      api.search(search).then((results) => {
        this.setState({results})
      })
    } else {
      this.setState({results: []})
    }
  }, 250)

  render() {
    const {onChange} = this.props
    const {results} = this.state
    return (
      <DownshiftContainer>
        <Downshift
          onChange={debounce(onChange, 500)}
          itemToString={(item) =>
            item ? `${item.restaurant_name} @ ${item.address_address}` : ''
          }
          render={({
            getInputProps,
            getItemProps,
            getRootProps,
            isOpen,
            inputValue,
            selectedItem,
            highlightedIndex,
          }) => (
            <SearchContainer {...getRootProps({refKey: 'innerRef'})}>
              <SearchInput
                {...getInputProps({
                  onChange: (e) => this.debouncedFetch(e.currentTarget.value),
                  placeholder: 'Search for Austin Restaurants',
                })}
              />
              {isOpen &&
                results.length > 0 && (
                  <ResultsContainer>
                    {results.map((item: SearchResult, index: number) => (
                      <div
                        {...getItemProps({item})}
                        key={item.facility_id}
                        style={{
                          backgroundColor:
                            highlightedIndex === index ? 'gray' : 'white',
                          fontWeight: selectedItem === item ? 'bold' : 'normal',
                        }}
                      >
                        {item.restaurant_name} @ {item.address_address}
                      </div>
                    ))}
                  </ResultsContainer>
                )}
            </SearchContainer>
          )}
        />
      </DownshiftContainer>
    )
  }
}

export default Search
