import ReactMapGL from 'react-map-gl';
// import ExampleArcData from './example-arc-data';
import React from 'react';
import {getArcColorByDuration, rgbToHex} from '../utils';
import {ContinuousColorLegend} from 'react-vis';
// import {csv} from 'd3-fetch';
import DeckGL, {ArcLayer} from 'deck.gl';

class Map extends React.Component {

  state = {
    viewport: {
      width: 500,
      height: 800,
      // centered around Palo Alto
      latitude: 37.59694542840548,
      longitude: -122.30889858317528,
      zoom: 9.80533076241453,
      altitude: 1.5,
      bearing: 102.42000000000002,
      pitch: 51.85654177519535
    }
  };

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _onViewportChange = viewport => this.setState({
    viewport: {...this.state.viewport, ...viewport}
  });

  _resize = () => this._onViewportChange({
    width: this.props.width - 100 || window.innerWidth - 100
    // height: this.props.height || window.innerHeight
  });

  render() {

    const {viewport} = this.state;
    const {tripData, stationData} = this.props;

    const c1 = rgbToHex(getArcColorByDuration(0));
    const c2 = rgbToHex(getArcColorByDuration(3600));
    const c3 = rgbToHex(getArcColorByDuration(1800));
    return (
      <div>
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={'pk.eyJ1IjoiemthbSIsImEiOiJjamhmYjZkZHYxN3h0M2NtZDJ4aXgwcWEyIn0.NjZOAIvFDDpFO_TDNgfAOQ'} // eslint-disable-line
          mapStyle="mapbox://styles/mapbox/dark-v9"
          onViewportChange={(vp) => this.setState({viewport: vp})}
          style={{flex: 1}}
        >
          <DeckGL {...viewport} layers={[
            new ArcLayer({
              id: 'arc-layer',
              data: tripData,
              getSourcePosition: d => {
                return [Number(stationData[d.start_station_id].longitude),
                  Number(stationData[d.start_station_id].latitude)];
              },
              getTargetPosition: d => {
                return [Number(stationData[d.end_station_id].longitude),
                  Number(stationData[d.end_station_id].latitude)];
              },
              getSourceColor: d => getArcColorByDuration(d.duration_sec),
              getTargetColor: d => getArcColorByDuration(d.duration_sec),
              strokeWidth: 2
              // strokewidth has to be uniform
            })
          ]}/>
        </ReactMapGL>
        <div className="flex center">
          <ContinuousColorLegend
            endColor={c2}
            endTitle={'1 Hr'}
            midColor={c3}
            midTitle={'0.5 Hr'}
            startColor={c1}
            startTitle={'0 Hr'}
            width={viewport.width}
            height={50}
          />
        </div>
      </div>

    );

  }
}

export default Map;
