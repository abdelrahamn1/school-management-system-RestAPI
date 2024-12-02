const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please Provide an email"],
    validate: [validator.isEmail, "Please Provide a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide a passweord"],
    minlength: [8, "Password msut be above 8 character"],
    validate: [
      validator.isStrongPassword,
      "Password must contain at least 1 uppercase charcater , 1 Symbols and 1 number",
    ],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please Confirm your password"],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: "password dosen't match",
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "teacher", "student", "parent"],
    default: "student",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
