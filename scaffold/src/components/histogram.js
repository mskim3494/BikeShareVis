import React from 'react';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries
} from 'react-vis';

class RideHist extends React.Component {

  render() {
    const {rideStats} = this.props;
    rideStats.map((d, i) => {
      if (d === 0) {
        rideStats[i] = {x: i, y: 0};
      }
    });
    return (
      <XYPlot
        xType="ordinal"
        width={500}
        height={250}
        yDomain={[0, 300]}>
        <VerticalGridLines/>
        <HorizontalGridLines/>
        <XAxis title="Hour of Day"/>
        <YAxis title="Number of Rides Started" type="number"/>
        <LineSeries
          data={rideStats}
          curve={'curveNatural'}
          style={{stroke: 'black', strokeWidth: 3, opacity: 0.5}}/>
      </XYPlot>
    );
  }
}

export default RideHist;
