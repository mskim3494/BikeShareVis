import React from 'react';
import {formatDate, addDay, clampDate} from '../utils';

const buildClamp = range => value => Math.max(range[0], Math.min(value, range[1]));

class Slider extends React.Component {

  render() {
    const {onChange, range, value, stepSize} = this.props;
    const d1 = new Date(range[0]).valueOf();
    const d2 = new Date(range[1]).valueOf();
    const clamp = buildClamp([d1, d2]);

    return (
      <div className="slider-container center">
        <div className="slider-label">{`${clampDate(String(new Date(addDay(value))))}`}</div>
        <div className="flex">
          <input
            className="range-input-slider"
            value={new Date(value).valueOf()}
            min={d1}
            max={d2}
            step={stepSize}
            type="range"
            onChange={x => {
              const t = new Date(clamp(x.target.value));
              return onChange(formatDate(t));
            }}
            style={{width: 500}}
            />
        </div>
      </div>
    );
  }
}

Slider.displayName = 'Slider';
export default Slider;
