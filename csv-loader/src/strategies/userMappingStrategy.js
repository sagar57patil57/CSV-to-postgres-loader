class UserRecordMapper {
  mapToDatabaseUser(user) {
    const { firstName, lastName, age, address, ...other } = user;
    const name = [firstName, lastName].filter(Boolean).join(' ');
    // Build address object with support for line1 and line2
    let fullAddress = address || {};
    if (user['address.line1']) fullAddress.line1 = user['address.line1'];
    if (user['address.line2']) fullAddress.line2 = user['address.line2'];

    const dbUser = {
      name,
      age: age ? Number(age) : null,
      address: Object.keys(fullAddress).length ? fullAddress : null,
      additional_info: {}
    };
    for (const key in other) {
      if (!['name', 'age', 'address', 'address.line1', 'address.line2'].includes(key)) {
        dbUser.additional_info[key] = other[key];
      }
    }
    return dbUser;
  }
}

module.exports = UserRecordMapper;
