// Генератор случайных чисел
const generateNumber = (numLength) => {
  return Math.floor(
    Math.pow(10, numLength - 1) +
      Math.random() * 9 * Math.pow(10, numLength - 1)
  );
};
