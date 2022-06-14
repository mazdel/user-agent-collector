// https://surajsharma.net/blog/javascript-get-yesterday-date
const getYesterdayDate = () => {
  return new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
};
const getTomorrowDate = () => {
  return new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
};
const parseIfInt = (str) => {
  const test = /^\+?\d+$/.test(str);
  if (test) {
    return parseInt(str);
  } else {
    return str;
  }
};
const parseIfIntToIDR = (str) => {
  const test = /^\+?\d+$/.test(str);
  if (test) {
    return parseInt(str).toLocaleString('ID-id', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
  } else {
    return str;
  }
};

const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};
const getKeyLikeValue = (object, value) => {
  return Object.keys(object).find((key) => object[key].indexOf(value) >= 0);
};

const randBetween = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};
