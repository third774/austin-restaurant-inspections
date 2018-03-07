import * as React from 'react'
import styled from 'styled-components'
import {csv} from 'd3'

import './App.css'
import {Loader} from 'components/Loader'
import {
  AustinRestaurantInspectionsChart,
  AustinRestaurantInspectionsData,
} from 'components/AustinRestaurantChart'
import Search from 'components/Search'

const GraphContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

interface AppState {
  data: {
    [key: string]: AustinRestaurantInspectionsData[]
  } | null
  selectedLocation: string
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    data: null,
    selectedLocation: '',
  }

  componentDidMount() {
    csv(
      'Restaurant_Inspection_Scores.csv',
      // 'https://data.austintexas.gov/resource/nguv-n54k.json',
      // @ts-ignore
      (data: AustinRestaurantInspectionsData[]) => {
        console.time()
        // const uniques = data
        //   .map(d => d.FacilityID)
        //   .filter((x, i, a) => a.indexOf(x) === i)
        // console.log(uniques)

        const fixedData = data
          // .filter(d => d.FacilityID === data[1787].FacilityID)
          .reduce((acc, datum, index, arr) => {
            const key = `${datum.RestaurantName} ${datum.Address}`
            if (!acc[key]) {
              acc[key] = []
            }
            acc[key].push({
              ...datum,
              score: +datum.Score,
              InspectionDate: new Date(datum.InspectionDate),
            })
            return acc
          }, {})
        console.timeEnd()
        console.log(fixedData)
        this.setState({
          data: fixedData,
        })
      },
    )
  }

  handleSelection = (selectedLocation: string) => {
    this.setState({selectedLocation})
  }

  render() {
    const {data, selectedLocation} = this.state
    return (
      <div className="App">
        {data !== null && (
          <Search items={data} onChange={this.handleSelection} />
        )}
        {data ? (
          selectedLocation && (
            <GraphContainer>
              <AustinRestaurantInspectionsChart data={data[selectedLocation]} />
            </GraphContainer>
          )
        ) : (
          <Loader />
        )}
      </div>
    )
  }
}

export default App
