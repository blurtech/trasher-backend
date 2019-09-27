const User = require('./model');

exports.saveUser = (data, saveCb) => {
  const user = new User(data);
  return user.save(saveCb);
};

exports.editUser = (user, data, saveCb) => {
  if (data.password) {
    if (!data.check_password) {
      return saveCb({
        errors: [
          {
            path: 'password',
            message: 'Require check_password field for change password',
          },
        ],
      });
    }
    return user
      .verifyPassword(data.check_password)
      .then(data => {
        if (!data) {
          return saveCb({
            errors: [
              {
                path: 'password',
                message: 'check_password is not correct',
              },
            ],
          });
        }
        user.set(data);
        return user.save(saveCb);
      })
      .catch(err => saveCb(err));
  }
  if (data.token) {
    return saveCb({
      errors: [
        {
          path: 'token',
          message: 'You could not set token',
        },
      ],
    });
  }
  user.set(data);
  return user.save(saveCb);
};

exports.deleteUser = user => user.remove();

exports.findUserByID = id => User.findById(id);

exports.findUserByUsername = username =>
  User.findOne({ username }).select({ token: 0, password: 0 });

exports.findUsernamesById = idArr =>
  User.where('_id')
    .in(idArr)
    .select('username');

exports.addExperience = async (user, value, saveCb) => {
  user.experience.currentexp += value;
  if (user.experience.currentexp >= 1000) {
    user.experience.level = Math.floor(user.experience.level + 1);
    user.experience.currentexp = user.experience.currentexp % 1000;
  }
  return await user.save(saveCb);
};

exports.selectUserPublicInfo = user =>
  User.findById(user.id).select({ token: 0, password: 0 });
