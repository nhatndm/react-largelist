import Moment from "moment-timezone";
import { extendMoment } from "moment-range";
import { WEEKLY } from "../Calendar/type";
const moment = extendMoment(Moment);

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

export const getNameOfMonths = id => {
  return nameOfMonths()[id];
};

export const getNameOfWeeks = id => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekdays[id];
};

// Covert Date to Id to specify the id of Dom
export const convertToIdDate = (date, ViewMode = WEEKLY) => {
  const dateMoment = moment(date);
  return ViewMode === WEEKLY
    ? format(dateMoment, "DDdMYYYY")
    : format(dateMoment, "MMYYYY");
};

// Convert Id to original date
export const convertIdToDate = idDate => {
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

export const convertIdToMonth = idMonth => {
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

export const calculateWidthBetweenDate = (
  document,
  startDate,
  endDate,
  ViewMode
) => {
  const startDiv = document.getElementById(
    convertToIdDate(startDate, ViewMode)
  );
  const endDiv = document.getElementById(convertToIdDate(endDate, ViewMode));
  if (startDiv && endDiv) {
    return endDiv.offsetLeft - startDiv.offsetLeft;
  }
  return undefined;
};

export const calculateWidthBetweenDateForEvent = (
  document,
  startDate,
  endDate,
  currentWidth,
  ViewMode
) => {
  const startDiv = document.getElementById(
    convertToIdDate(startDate, ViewMode)
  );
  const endDiv = document.getElementById(convertToIdDate(endDate, ViewMode));
  const calendarWidth = currentWidth;
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
  const startDateIns = moment(format(moment(startDate), "YYYY-MM-DD"));
  const endDateIns = moment(format(moment(endDate), "YYYY-MM-DD"));

  const range = moment.range(startDateIns, endDateIns);

  const dates = Array.from(range.by("days")).map(m => {
    return {
      id: format(m, "DDdMYYYY"),
      name: format(m, "ddd DD")
    };
  });

  return dates;
};

const checkDateToShowMonth = (startDate, endDate, currentDate) => {
  let middleDateOfDateRange = null;

  if (isEqual(currentDate, endDateOfTheMonth(currentDate))) {
    return {
      borderLeft: true,
      month: false
    };
  }

  if (
    !isEqualInMonth(startDate, currentDate) &&
    !isEqualInMonth(endDate, currentDate)
  ) {
    middleDateOfDateRange = findMiddleDateOfDateRange(
      startDateOfTheMonth(currentDate),
      endDateOfTheMonth(currentDate)
    );
  }

  if (isEqualInMonth(startDate, currentDate)) {
    middleDateOfDateRange = findMiddleDateOfDateRange(
      startDate,
      endDateOfTheMonth(startDate)
    );
  }

  if (isEqualInMonth(endDate, currentDate)) {
    middleDateOfDateRange = findMiddleDateOfDateRange(
      startDateOfTheMonth(endDate),
      endDate
    );
  }

  if (middleDateOfDateRange && isEqual(middleDateOfDateRange, currentDate)) {
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

const checkTheMonthToShow = (startDate, currentMonth) => {
  if (isEqual(startDate, currentMonth) || isJanuary(currentMonth)) {
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

const getArrayDatesBase = function(startDate, endDate) {
  const startDateIns = moment(format(moment(startDate), "YYYY-MM-DD HH:mm:ss"));
  const endDateIns = moment(format(moment(endDate), "YYYY-MM-DD HH:mm:ss"));

  return moment.range(startDateIns, endDateIns);
};

// Returns an array of dates between the two dates
export const getArrayDates = function(
  startDate,
  endDate,
  ViewMode = WEEKLY,
  lang
) {
  const range = getArrayDatesBase(startDate, endDate);
  if (ViewMode === WEEKLY) {
    return Array.from(range.by("days")).map(m => {
      return {
        id: format(m, "DDdMYYYY"),
        dateTitle: format(m, "ddd DD", lang),
        date: format(m, "YYYY-MM-DD"),
        show: checkDateToShowMonth(startDate, endDate, m)
      };
    });
  }

  return Array.from(range.by("months")).map(m => {
    return {
      id: format(m, "MMYYYY"),
      dateTitle: format(m, "MMM", lang),
      date: format(m, "YYYY-MM-DD"),
      show: checkTheMonthToShow(startDate, m)
    };
  });
};

// Returns an array of dates between the two dates
export const getArrayDatesForEvents = function(
  startDate,
  endDate,
  propertyId,
  unitId,
  monthlyPrice,
  ViewMode = WEEKLY
) {
  const range = getArrayDatesBase(startDate, endDate);

  if (ViewMode === WEEKLY) {
    return Array.from(range.by("days")).map(m => {
      return {
        id: format(m, "DDdMYYYY"),
        dateTitle: format(m, "ddd DD"),
        date: format(m, "YYYY-MM-DD"),
        propertyId: propertyId,
        unitId: unitId,
        type: "available",
        price: monthlyPrice
      };
    });
  }

  return Array.from(range.by("months")).map(m => {
    return {
      id: format(m, "MMYYYY"),
      dateTitle: format(m, "MMM"),
      date: format(m, "YYYY-MM-DD"),
      propertyId: propertyId,
      unitId: unitId,
      type: "available",
      price: monthlyPrice
    };
  });
};

export const getArrayDatesForEventsWithType = function(
  startDate,
  endDate,
  eventId,
  type,
  unitId,
  ViewMode = WEEKLY
) {
  const range = getArrayDatesBase(startDate, endDate);

  if (ViewMode === WEEKLY) {
    return Array.from(range.by("days")).map(m => {
      return {
        id: format(m, "DDdMYYYY"),
        eventId: eventId,
        type: type,
        unitId: unitId
      };
    });
  }

  return Array.from(range.by("months")).map(m => {
    return {
      id: format(m, "MMYYYY"),
      eventId: eventId,
      type: type,
      unitId: unitId
    };
  });
};

export const getArrayDatesForPromotionEvent = function(
  startDate,
  endDate,
  promotionId,
  payload,
  ViewMode = WEEKLY
) {
  const range = getArrayDatesBase(startDate, endDate);

  if (ViewMode === WEEKLY) {
    return Array.from(range.by("days")).map(m => {
      return {
        id: format(m, "DDdMYYYY"),
        promotionId: promotionId,
        payload: payload
      };
    });
  }

  return Array.from(range.by("months")).map(m => {
    return {
      id: format(m, "MMYYYY"),
      promotionId: promotionId,
      payload: payload
    };
  });
};

export const isMonday = date => {
  return moment(date).weekday() === 1;
};

export const isJanuary = date => {
  return moment(date).month() === 0;
};

export const isEqual = (date1, date2) => {
  return moment(date1).isSame(moment(date2), "days");
};

export const isEqualInMonth = (date1, date2) => {
  return moment(date1).isSame(moment(date2), "months");
};

export const format = (date, string, lang = "en") => {
  let langIns;
  langIns = lang === "jp" ? "ja" : lang;
  if (date) {
    return moment(date)
      .locale(langIns)
      .format(string);
  }

  return "N/A";
};

export const momentIns = (time = moment()) => moment(time);

export const addDays = (date, days) => {
  return moment(date).add(days, "days");
};

export const subDays = (date, days) => {
  return moment(date).subtract(days, "days");
};

export const addMonths = (month, months) => {
  return moment(month).add(months, "months");
};

export const subMonths = (month, months) => {
  return moment(month).subtract(months, "months");
};

export const startDateOfTheMonth = (date = moment()) => {
  const month = format(moment(date), "MM");
  const year = format(moment(date), "YYYY");
  return moment(`${year}-${month}-01`);
};

export const endDateOfTheMonth = (date = moment()) => {
  const number = moment(date).daysInMonth();
  const month = format(moment(date), "MM");
  const year = format(moment(date), "YYYY");
  return moment(`${year}-${month}-${number}`);
};

export const startDateOfCurrentYear = moment().dayOfYear(1);

export const endDateOfCurrentYear = moment().isLeapYear()
  ? moment().dayOfYear(366)
  : moment().dayOfYear(365);

export const duration = (startDate, endDate, timeType) => {
  return moment(endDate, "D MMM").diff(
    moment(startDate, "D MMM"),
    `${timeType}`
  ) > 0
    ? moment(endDate, "D MMM").diff(moment(startDate, "D MMM"), `${timeType}`)
    : moment(endDate, "D MMM").diff(moment(startDate, "D MMM"), `${timeType}`) *
        -1;
};

export const findMiddleDateOfDateRange = (startDate, endDate) => {
  const dayDuration = duration(startDate, endDate, "days");
  const day = addDays(startDate, Math.floor(dayDuration / 2) + 2).format("DD");
  const month = format(moment(startDate), "MM");
  const year = format(moment(startDate), "YYYY");
  return moment(`${year}-${month}-${day}`);
};
