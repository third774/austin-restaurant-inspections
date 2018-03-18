import * as React from 'react'
import styled from 'styled-components'

import {Loader} from 'components/Loader'
import {AustinRestaurantInspectionsChart} from 'components/AustinRestaurantChart'
import Search, {SearchResult} from 'components/Search'

import api from './api'
import {AustinRestaurantInspectionsData} from './models'

const AppContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  font-size: 18px;
  text-align: center;
`

const GraphContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const SubHeader = styled.h4`
  position: fixed;
  width: 100%;
  bottom: 0;
  text-align: center;
  margin: 32px;
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
      <AppContainer className="App">
        <h1>Austin Restaurant Inspection Scores</h1>
        <Search onChange={this.handleSelection} />
        {dataPending ? (
          <Loader />
        ) : data ? (
          <GraphContainer>
            <AustinRestaurantInspectionsChart data={data} />
          </GraphContainer>
        ) : null}
        <SubHeader>
          Data from{' '}
          <a href="https://data.austintexas.gov/resource/nguv-n54k">
            data.austintexas.gov
          </a>
        </SubHeader>
      </AppContainer>
    )
  }
}

export default App
