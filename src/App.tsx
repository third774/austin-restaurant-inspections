import * as React from 'react'
import styled from 'styled-components'

import {Loader} from 'components/Loader'
import {AustinRestaurantInspectionsChart} from 'components/AustinRestaurantChart'
import Search, {SearchResult} from 'components/Search'

import api from './api'
import {AustinRestaurantInspectionsData} from './models'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

const Header = styled.h1`
  text-align: center;
`

const Footer = styled.footer`
  margin-top: auto;
  margin-bottom: 6px;
  font-size: 12px;
  text-align: center;
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
        <Header>Austin Restaurant Inspection Scores</Header>
        <Search onChange={this.handleSelection} />
        {dataPending ? (
          <Loader />
        ) : data ? (
          <AustinRestaurantInspectionsChart data={data} />
        ) : null}
        <Footer>
          Data from{' '}
          <a href="https://data.austintexas.gov/resource/nguv-n54k">
            data.austintexas.gov
          </a>
        </Footer>
      </AppContainer>
    )
  }
}

export default App
