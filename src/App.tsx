import * as React from 'react'
import styled from 'styled-components'

import './App.css'
import {Loader} from 'components/Loader'
import {AustinRestaurantInspectionsChart} from 'components/AustinRestaurantChart'
import Search, {SearchResult} from 'components/Search'

import api from './api'
import {AustinRestaurantInspectionsData} from './models'

const GraphContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

interface AppState {
  data: AustinRestaurantInspectionsData[] | null
  dataPending: boolean
  selectedLocation: string
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    data: null,
    dataPending: false,
    selectedLocation: '',
  }

  handleSelection = (selectedLocation: SearchResult) => {
    this.setState({dataPending: true})
    api.fetchByFacilityId(selectedLocation.facility_id).then((data) => {
      this.setState({data, dataPending: false})
    })
  }

  render() {
    const {data, dataPending} = this.state
    return (
      <div className="App">
        <Search onChange={this.handleSelection} />
        {dataPending ? (
          <Loader />
        ) : data ? (
          <GraphContainer>
            <AustinRestaurantInspectionsChart data={data} />
          </GraphContainer>
        ) : null}
      </div>
    )
  }
}

export default App
