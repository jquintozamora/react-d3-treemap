const randomName = (maxChars = 50) => {
  const allowedChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_/.-";
  return [...Array(maxChars)]
    .map(() => allowedChars.charAt((Math.random() * allowedChars.length) | 0))
    .join("");
};

const randomNumber = (low = 5, high = 15) => {
  return Math.floor(Math.random() * (high - low + 1)) + low;
};

export const generateData = (level = 1, maxLevels = 4) => {
  const dataObj: any = {
    name: randomName(level * 10),
  };
  if (level <= maxLevels) {
    dataObj.children = [...Array(randomNumber())].map(() => {
      return generateData(level + 1);
    });
  } else {
    dataObj.value = randomNumber(100, 9999);
  }
  return dataObj;
};

export const data = generateData();
