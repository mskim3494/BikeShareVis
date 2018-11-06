import {scaleLinear} from 'd3-scale';
import {interpolateViridis} from 'd3-scale-chromatic';
import {color} from 'd3-color';

const maxDuration = 3600;

export function convertToJSON(data, key) {
  return data.reduce((acc, row) => {
    if (!acc[row[key]]) {
      acc[row[key]] = row;
    }
    return acc;
  }, {});
}

// convert 0..255 R,G,B values to a hexidecimal color string
function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${ hex}` : hex;
}

export function rgbToHex(rgb) {

  return `#${ componentToHex(rgb[0])}${componentToHex(rgb[1]) }${componentToHex(rgb[2])}`;
}

const overScale = scaleLinear().domain([maxDuration, 2000000]).range([0.5, 10]);
const durationScale = scaleLinear().domain([0, maxDuration]).range([1, 0]);

export function getArcColorByDuration(duration) {
  let ret = {};
  if (duration > maxDuration) {
    ret = color(interpolateViridis(overScale(duration)));
  } else {
    ret = color(interpolateViridis(durationScale(duration)));
  }
  return [ret.r, ret.g, ret.b];
}

export function splitByDay(data) {
  const temp = data.reduce((acc, row) => {
    const dateTime = row.start_date.split(' ')[0];
    if (!acc[dateTime]) {
      acc[dateTime] = [];
    }
    acc[dateTime].push(row);
    return acc;
  }, {});
  return temp;
}

export function getHistData(data) {
  return Object.keys(data).reduce((acc, date) => {

    acc[date] = data[date].reduce((accumulator, ride) => {
      const rideTime = new Date(ride.start_date);
      const correctedTime = clampHour(rideTime.getHours());
      if (!accumulator[correctedTime]) {
        const toFill = {x: correctedTime, y: 0};
        accumulator[correctedTime] = toFill;
      }
      accumulator[correctedTime].y += 1;
      return accumulator;
    }, new Array(24).fill(0));

    return acc;
  }, {});
}

function clampHour(time) {
  let ret = 0;
  if (time > 18) {
    ret = time - 18;
  } else {
    ret = time + 6;
  }
  return ret;
}

export function splitByRange(data, start, end) {
  const d1 = new Date(start);
  const d2 = new Date(end);
  return Object.keys(data).reduce((acc, date) => {
    const d = new Date(date);
    if (d >= d1 && d <= d2) {
      acc.push(...data[date]);
    }
    return acc;
  }, []);
}

export function formatDate(date) {
  const day = date.getDate() < 10 ? `0${ date.getDate()}` : date.getDate();
  const month = date.getMonth() < 9 ? `0${ date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();
  return `${year }-${ month }-${ day}`;
}

export function addDay(day) {
  const dayDate = new Date(day);
  dayDate.setDate(dayDate.getDate() + 2);
  if (dayDate.getFullYear() > 2015) {
    return '2015-01-01';
  }
  return formatDate(dayDate);
}

export function clampDate(date) {
  const strings = date.split(' ');
  return `${strings[0] } ${ strings[1] } ${ strings[2] }, ${ strings[3]}`;
}
