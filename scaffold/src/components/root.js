import React from 'react';
import {csv} from 'd3-fetch';
import MapComponent from './map-component';
import {convertToJSON, splitByDay, addDay, getHistData} from '../utils';
import Slider from './slider';
import RideHist from './histogram';

class RootComponent extends React.Component {
  state = {
    tripDataByDay: null,
    tripHistData: null,
    loading1: true,
    stationData: null,
    loading2: true,
    currentDate: '2015-01-01',
    tickOn: false
  };

  componentWillMount() {
    // (I tend to think it's best to use screaming snake case for imported json)
    csv('DataWork/tripsFiltered.csv')
      .then(data => {
        this.setState({
          tripDataByDay: splitByDay(data)
        });
        this.setState({
          tripHistData: getHistData(this.state.tripDataByDay),
          loading1: false
        });
      });
    csv('DataWork/stationsFiltered.csv')
      .then(data => {
        this.setState({
          stationData: convertToJSON(data, 'station_id'),
          loading2: false
        });
      });
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(addDay(this.state.currentDate)), 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick(newDate) {
    if (this.state.tickOn) {
      this.setState({currentDate: newDate});
    }
  }

  render() {

    const {tripDataByDay, tripHistData, loading1, stationData, loading2, currentDate} = this.state;

    return (
      <div className="flex center flex-column">
        <h1>SAN FRANCISCO DAILY BIKESHARE TRIPS 2015</h1>
        {loading1 && loading2 && <h1> LOADING </h1>}
        <div className="flex center">
          {!loading1 && !loading2 &&
          <MapComponent stationData={stationData} tripData={tripDataByDay[currentDate]}/>}
        </div>
        <div className="flex center flex-row">
          <div className="toggleButton">
            <button
              onClick={() => this.setState({tickOn: !this.state.tickOn})}
            >Animate!!
            </button>
          </div>
          <div className="slider">
            <Slider value={currentDate} range={['2015-01-01', '2015-12-31']} stepSize={8.64 * Math.pow(10, 7)}
                    name={'Date'} onChange={newDate => {
                      this.setState({currentDate: newDate});
                    }}
                    sliderName={'gray'}/>
          </div>
          <div className="hist">
            {!loading1 && !loading2 &&
            <RideHist rideStats={tripHistData[currentDate]}/>}
          </div>
        </div>
        <div className="flex left">
          <p style={{marginLeft: `${20 }px`, marginRight: `${20 }px`}}>
            The map presents the daily usage of bikeshare trips in
            San Francisco during the entirety of 2015.
            Each trip is represented by a line, which is colored based
            on the duration of the trip (refer to legend).
            The date can be adjusted on the slider on the bottom,
            and on its left the histogram includes the
            data on that date. More specifically,
            it shows the number of rides that were started
            for each hour of the day.
            The button enables an animation that automatically
            updates the date every 100ms,
            giving a general sense of the bike trip
            volume and something nice to look at.
          </p>
        </div>
      </div>

    );
  }
}

RootComponent.displayName = 'RootComponent';
export default RootComponent;
