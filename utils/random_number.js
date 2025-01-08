const randomNumber = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

const randomNumberWith12Chars = () => {
  return Math.floor(Math.random() * 1000000000000)
    .toString()
    .padStart(12, "0");
};

module.exports = { randomNumber, randomNumberWith12Chars };
