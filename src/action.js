import { random, name, finance } from "faker";
import {
  FETCH_PROPERTY_DATA,
  SAVE_CURRENT_TIMESTAMP,
  SAVE_CURRENT_UNITS,
  SAVE_EVENTS
} from "./type";
import { addDays, format } from "./Calendar/date";
import { sample } from "lodash";

export const fetchPropertyData = () => {
  const array = new Array(1000).fill(null).map((v, i) => {
    return {
      id: random.uuid(),
      propertyName: `${name.title()} Property`,
      showPropertyName: i % 50 === 0 ? true : false,
      unitId: random.uuid(),
      propertyItemName: name.findName(),
      unit: Math.floor(Math.random() * 1000),
      dailyPrice: finance.amount(10, 1000, 2, "$")
    };
  });

  return array;
};

export const savePropertyData = data => {
  return {
    type: FETCH_PROPERTY_DATA,
    data: data
  };
};

export const saveCurrentTimeStamp = (startTime, endTime) => {
  return {
    type: SAVE_CURRENT_TIMESTAMP,
    timeStamp: {
      startTime: startTime,
      endTime: endTime
    }
  };
};

export const saveCurrentUnits = units => {
  return {
    type: SAVE_CURRENT_UNITS,
    units: units
  };
};

export const fetchEventsData = (timeStamp, units) => {
  const unitsLength = units.length;
  const array = [];
  const arrayType = [
    "reservation",
    "block",
    "promotion",
    "promotion_reservation"
  ];
  for (let i = 0; i < unitsLength; i++) {
    const startTime = format(
      addDays(timeStamp.startTime, Math.floor(Math.random() * 10)),
      "YYYY-MM-DD"
    );
    const endTime = format(
      addDays(startTime, Math.floor(Math.random() * 100)),
      "YYYY-MM-DD"
    );
    array.push({
      startTime: startTime,
      endTime: endTime,
      unitId: units[i],
      type: sample(arrayType)
    });
  }

  return {
    type: SAVE_EVENTS,
    data: array
  };
};
