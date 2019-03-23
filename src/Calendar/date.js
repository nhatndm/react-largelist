import { forEach, map, flatten, uniq } from "lodash";
import { format, isEqual, isMonday } from "date-fns";

export const nameOfMonths = () => [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const getNameOfMonths = (id) => {
  return nameOfMonths()[id];
};

export const getNameOfWeeks = (id) => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekdays[id];
};

export const convertToIdDate = (date) => {
  const formatDate = new Date(date);
  return `${formatDate.getDate()}${formatDate.getDay()}${formatDate.getMonth()}${formatDate.getFullYear()}`;
};

export const convertIdToDate = (idDate) => {
  let i = 1;
  let stringYearRemoved = idDate.substring(0, idDate.length - 4);
  let year = parseInt(idDate.substring(idDate.length - 4, idDate.length), 10);
  const idDateLength = stringYearRemoved.length;
  let date;
  let day;
  let month;
  while (i <= idDateLength) {
    date = stringYearRemoved.substring(0, i);
    day = stringYearRemoved.substring(i, i + 1);
    const dateLength = date.length;
    const dayLength = day.length;
    month = stringYearRemoved.substring(dateLength + dayLength, idDateLength);
    const fullDate = convertToIdDate(`${year}-${parseInt(month) + 1}-${date}`);
    if (fullDate.substring(0, fullDate.length - 4) === stringYearRemoved) {
      break;
    } else {
      i++;
    }
  }

  return {
    date: parseInt(date, 10),
    day: parseInt(day, 10),
    month: parseInt(month, 10),
    year: year
  };
};

export const convertIdToMonth = (idMonth) => {
  let month = idMonth.substring(0, idMonth.length - 4);
  let year = parseInt(
    idMonth.substring(idMonth.length - 4, idMonth.length),
    10
  );
  return {
    month: month,
    year: year
  };
};

export const calculateWithBetweenDate = (document, startDate, endDate) => {
  const startDiv = document.getElementById(convertToIdDate(startDate));
  const endDiv = document.getElementById(convertToIdDate(endDate));
  if (startDiv && endDiv) {
    return endDiv.offsetLeft - startDiv.offsetLeft;
  }
  return undefined;
};

export const calculateWithBetweenDateForEvent = (
  document,
  startDate,
  endDate,
  currentWidth
) => {
  const startDiv = document.getElementById(convertToIdDate(startDate));
  const endDiv = document.getElementById(convertToIdDate(endDate));
  const calendarWidth = parseInt(currentWidth.split("px")[0], 10);
  if (startDiv && endDiv) {
    return {
      width: endDiv.offsetLeft - startDiv.offsetLeft,
      startDiv: startDiv,
      endDiv: endDiv
    };
  }

  if (startDiv && !endDiv) {
    return {
      width: calendarWidth - startDiv.offsetLeft,
      startDiv: startDiv,
      endDiv: undefined
    };
  }

  if (!startDiv && endDiv) {
    return {
      width: endDiv.offsetLeft,
      startDiv: undefined,
      endDiv: endDiv
    };
  }

  if (!startDiv && !endDiv) {
    return {
      width: calendarWidth,
      startDiv: undefined,
      endDiv: undefined
    };
  }
};

// Returns an array of dates between the two dates
export const getDates = function(startDate, endDate) {
  let dates = [],
    objectDate = {},
    currentDate = startDate,
    addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
  while (currentDate <= endDate) {
    const currentDateIns = new Date(currentDate);
    objectDate = {
      id: `${currentDateIns.getDate()}${currentDateIns.getDay()}${currentDateIns.getMonth()}${currentDateIns.getFullYear()}`,
      name: `${getNameOfWeeks(
        currentDateIns.getDay()
      )} ${currentDateIns.getDate()}`
    };
    dates.push(objectDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

// Returns an array of dates between the two dates
export const getDatesArrays = function(startDate, endDate) {
  let dates = [],
    currentDate = startDate,
    addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
  while (currentDate <= endDate) {
    const currentDateIns = new Date(currentDate);
    const dateString = format(currentDateIns, "YYYY-MM-DD");
    dates.push(dateString);
    currentDate = addDays.call(currentDate, 1);
  }

  const currentDateIns = new Date(endDate);
  const dateString = format(currentDateIns, "YYYY-MM-DD");
  dates.push(dateString);

  return uniq(dates);
};

// Returns an array of months between the two years
export const getMonths = function(startYear, endYear) {
  let years = [];
  let year = startYear;
  let listYears = [];
  const yearsRanges = endYear - startYear + 1;
  for (let i = 0; i < yearsRanges; i++) {
    if (year <= endYear) {
      years.push(year);
      year = year + 1;
    }
  }
  forEach(years, (v) => {
    listYears.push(
      map(nameOfMonths(), (month) => {
        return {
          id: `${month}${v}`,
          name: month
        };
      })
    );
  });
  return flatten(listYears);
};

const checkDateToShowMonth = (startDate, currentDate) => {
  if (isEqual(startDate, currentDate) || isMonday(currentDate)) {
    return {
      month: true,
      borderLeft: false
    };
  }

  return {
    month: false,
    borderLeft: false
  };
};

// Returns an array of dates between the two dates
export const getArrayDates = function(startDate, endDate) {
  let dates = [],
    objectDate = {},
    currentDate = startDate,
    addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
  while (currentDate <= endDate) {
    const currentDateIns = new Date(currentDate);
    const dateString = format(currentDateIns, "YYYY-MM-DD");
    objectDate = {
      id: `${currentDateIns.getDate()}${currentDateIns.getDay()}${currentDateIns.getMonth()}${currentDateIns.getFullYear()}`,
      dateTitle: `${format(currentDateIns, "ddd DD")}`,
      date: dateString,
      show: checkDateToShowMonth(new Date(startDate), currentDateIns)
    };
    dates.push(objectDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

// Returns an array of dates between the two dates
export const getArrayDatesForEvents = function(
  startDate,
  endDate,
  propertyId,
  unitId
) {
  let dates = [],
    objectDate = {},
    currentDate = startDate,
    addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
  while (currentDate <= endDate) {
    const currentDateIns = new Date(currentDate);
    const dateString = format(currentDateIns, "YYYY-MM-DD");
    objectDate = {
      id: `${currentDateIns.getDate()}${currentDateIns.getDay()}${currentDateIns.getMonth()}${currentDateIns.getFullYear()}`,
      dateTitle: `${getNameOfWeeks(
        currentDateIns.getDay()
      )} ${currentDateIns.getDate()}`,
      date: dateString,
      propertyId: propertyId,
      unitId: unitId,
      status: "available",
      price: "$ 12.000.000"
    };
    dates.push(objectDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

export const getArrayDatesForBlockingEvent = function(
  startDate,
  endDate,
  eventId
) {
  let dates = [],
    objectDate = {},
    currentDate = startDate,
    addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
  while (currentDate <= endDate) {
    const currentDateIns = new Date(currentDate);
    objectDate = {
      id: `${currentDateIns.getDate()}${currentDateIns.getDay()}${currentDateIns.getMonth()}${currentDateIns.getFullYear()}`,
      eventId: eventId
    };
    dates.push(objectDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};
