const mongoose = require('mongoose'),
  uniqueValidator = require('mongoose-unique-validator'),
  bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const definition = {
  username: {
    type: String,
    unique: true,
    required: [true, 'Username required'],
  },
  password: {
    type: String,
    required: [true, 'Password required'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
    default: 'user',
  },
  address: {
    city: {
      type: String,
      required: [true, 'City required'],
    },
    region: {
      type: String,
    },
    street: {
      type: String,
    },
    latitude: Number,
    longitude: Number,
  },
  token: String,
  bags: {
    type: Number,
    default: 0,
    min: 0
  }
};

const options = {
  timestamps: true,
};

const UserSchema = new Schema(definition, options);

UserSchema.pre('save', function(next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.verifyPassword = function(password, cb) {
  return new Promise((resolve, reject) =>
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      resolve(isMatch);
    })
  );
};

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);
