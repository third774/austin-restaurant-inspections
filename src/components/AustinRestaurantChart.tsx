import React, {Component} from 'react'
import * as d3 from 'd3'
import styled from 'styled-components'

// import responsivefy from 'utils/responsivefy'
import {AustinRestaurantInspectionsData} from '../models'

const Outer = styled.div`
  display: flex;
  justify-content: center;
  margin: 14px;
`

const AustinRestaurantChartContainer = styled.div`
  flex-basis: 600px;
  padding-bottom: 75%;

  .axis {
    font-size: 16px;
    letter-spacing: 2px;
  }
  .domain,
  .tick {
    stroke-width: 2;

    line,
    text {
      stroke: darkslategray;
    }
  }
`

interface AustinRestaurantInspectionsChartProps {
  data: AustinRestaurantInspectionsData[]
}

const margin = {
  top: 10,
  right: 4,
  bottom: 30,
  left: 46,
}

const width = 800 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

export class AustinRestaurantInspectionsChart extends Component<
  AustinRestaurantInspectionsChartProps
> {
  container: HTMLDivElement | null
  svg: any
  line: any
  xScale: any
  xAxis: any
  transition: any

  componentDidMount() {
    this.init()
    this.renderChart(this.formattedData)
  }

  componentDidUpdate() {
    this.renderChart(this.formattedData)
  }

  get formattedData() {
    return this.props.data.map((datum) => ({
      ...datum,
      inspection_date: new Date(datum.inspection_date),
      score: +datum.score,
    }))
  }

  init = () => {
    this.svg = d3
      .select(this.container)
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', `0 0 800 600`)

      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    this.transition = d3.transition().duration(500)

    this.xScale = d3
      .scaleTime()
      .domain([
        d3.min(this.formattedData, (d) => d.inspection_date) as Date,
        d3.max(this.formattedData, (d) => d.inspection_date) as Date,
      ])
      .range([0, width])

    this.xAxis = this.svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('class', 'axis')
      .call(d3.axisBottom(this.xScale))

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height, 0])

    const yAxis = d3.axisLeft(yScale).tickSize(10)

    this.svg
      .append('g')
      .attr('class', 'axis')
      .call(yAxis)

    this.line = d3
      .line<AustinRestaurantInspectionsData>()
      .x((d) => this.xScale(d.inspection_date))
      .y((d) => yScale(d.score))
  }

  renderChart = (data: AustinRestaurantInspectionsData[]) => {
    const sortedData = data.sort(
      (a, b) => a.inspection_date.valueOf() - b.inspection_date.valueOf(),
    )

    const update = this.svg.selectAll('.line').data([sortedData])

    this.xScale.domain([
      d3.min(data, (d) => d.inspection_date) as Date,
      d3.max(data, (d) => d.inspection_date) as Date,
    ])

    this.xAxis.transition(this.transition).call(
      d3
        .axisBottom(this.xScale)
        .ticks(10)
        .tickSize(10)
        .tickFormat(d3.timeFormat('%m/%y')),
    )

    update.exit().remove()

    const enter = update.enter().append('path')

    update
      .merge(enter)
      .transition(this.transition)
      .attr('class', 'line')
      .attr('d', this.line)
      .attr(
        'stroke',
        (d: any) =>
          d[d.length - 1].score >= 90
            ? 'seagreen'
            : d[d.length - 1].score >= 80 ? 'goldenrod' : 'tomato',
      )
      .attr('stroke-width', 3)
      .attr('fill', 'none')
  }

  render() {
    return (
      <Outer>
        <AustinRestaurantChartContainer
          className="AustinRestaurantChart"
          innerRef={(el) => (this.container = el)}
        />
      </Outer>
    )
  }
}
