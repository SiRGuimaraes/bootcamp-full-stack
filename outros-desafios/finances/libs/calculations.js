function sum(array) {
  const sum = array.reduce((prev, curr) => {
    return prev + curr;
  }, 0);

  return sum;
}

export default { sum };
