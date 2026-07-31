function splitName(fullName) {
  if (typeof fullName !== 'string' || !fullName.trim()) {
    return { firstName: '', lastName: '' };
  }
  const name = fullName.trim();
  const index = name.indexOf(' ');

  if (index === -1) {
    return { firstName: name, lastName: '' };
  }

  return {
    firstName: name.substring(0, index),
    lastName: name.substring(index + 1).trim(),
  };
}

// const { firstName, lastName } = splitName("Jakaria Ahmed Jakaria");
// console.log(firstName, lastName);

export default splitName;
