import { random, name, finance } from "faker";
import { FETCH_PROPERTY_DATA } from "./type";

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

  return {
    type: FETCH_PROPERTY_DATA,
    data: array
  };
};
