String.prototype.ucfirst = function () {
  let string = this.toString();
  return string.charAt(0).toUpperCase() + string.slice(1);
};
