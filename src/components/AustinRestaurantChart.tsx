import React, {Component} from 'react'
import * as d3 from 'd3'

import responsivefy from 'utils/responsivefy'
import {AustinRestaurantInspectionsData} from '../models'

interface AustinRestaurantInspectionsChartProps {
  data: AustinRestaurantInspectionsData[]
}

const margin = {
  top: 50,
  right: 100,
  bottom: 40,
  left: 80,
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
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.left + margin.right)
      .call(responsivefy)
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
      .attr('class', 'x-axis')
      .call(d3.axisBottom(this.xScale))

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height, 0])

    const yAxis = d3.axisLeft(yScale)

    this.svg
      .append('g')
      .attr('class', 'y-axis')
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

    this.xAxis
      .transition(this.transition)
      .call(d3.axisBottom(this.xScale).tickFormat(d3.timeFormat('%m/%y')))

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
            ? 'green'
            : d[d.length - 1].score >= 80 ? 'goldenrod' : 'red',
      )
      .attr('stroke-width', 2)
      .attr('fill', 'none')
  }

  render() {
    return <div ref={(el) => (this.container = el)} />
  }
}
