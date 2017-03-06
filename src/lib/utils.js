const Utils = {
  move: function (array, fromIndex, toIndex) {
    return array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
  },
};

export default Utils;