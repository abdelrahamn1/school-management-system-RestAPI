const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const User = require("../models/userModel");
const AppError = require("../utils/AppErrorr");
const sendEmail = require("../controllers/emailController");
const crypto = require("crypto");
require("dotenv").config();

// Generating JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_JWT, {
    expiresIn: process.env.JWT_EXPIERS,
  });
};

//sEND error Response
exports.rigster = async (req, res, next) => {
  try {
    //get the data from user and save it
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    // send jwt
    const token = generateToken(newUser._id);
    const cookieExpiration = new Date(Date.now() + 2 * 60 * 60 * 24 * 1000);

    res.cookie("jwt", token, {
      expires: cookieExpiration,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.status(200).json({
      status: "success",
      message: "You are registered successfully!",
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    //Extract user email and passowrd
    const { email, password } = req.body;
    if (!email || !password)
      return next(new AppError("Email and password are required", 400));

    // get the user based on the email
    const currentUser = await User.findOne({ email }).select(
      "+password +active"
    );
    if (!currentUser)
      return next(new AppError("Incorrect email or password!", 403));
    if (currentUser.active === false)
      return next(new AppError("Your email has been deactivated !", 403));

    //check if password matches
    if (!(await bcrypt.compare(password, currentUser.password)))
      return next(new AppError("Incorrect email or password!", 403));
    // generate token
    let token = generateToken(currentUser._id);
    const cookieExpiration = new Date(Date.now() + 2 * 60 * 60 * 24 * 1000);
    res.cookie("jwt", token, {
      expires: cookieExpiration,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    //send data
    res.status(200).json({
      status: "success",
      message: "Logged in successfully!",
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    //check for authoraization and jwt
    let token, currentUser;

    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token)
      return next(
        new AppError("You are not logged in , please log in or register!", 401)
      );
    //verify jwt
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_JWT);

    // check for user or expired token
    currentUser = await User.findById(decoded.id).select("+active");
    if (!currentUser) return next(new AppError("User not found!", 404));
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not allow to perform this operation!",
      });
    }
    next();
  };
};

//forget password
exports.forgetPaasword = async (req, res, next) => {
  // get user using email
  try {
    const email = req.body.email;
    if (!email) return next(new AppError("Please provide an eamil!", 404));

    const user = await User.findOne({ email }).select("email active");

    if (!user) return next(new AppError("No user Found for this email!"));
    if (user.active === false)
      return next(new AppError("This account has been deleted!", 400));

    //if user exist generate random token and hshed it
    const resetToekn = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // create mail
    const restURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetpassword/${resetToekn}`;
    const message = `Forgot your password? Please Follow this link to reset your new password: ${restURL}. \nIf you didn't forget your password, please ignore this email!`;

    //send token to mail
    try {
      await sendEmail({
        email: email,
        subject: "Your Password reset URL (valid for 10 minutes)",
        message,
      });

      console.log(email);

      res.status(200).json({
        status: "succes",
        message: "Please Check your Email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      next(err);
    }
  } catch (err) {
    next(err);
  }
};

// resetPassword
exports.resetPassword = async (req, res, next) => {
  try {
    // get user by the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    //check tioken is valid
    if (!user) return next(new AppError("This link has been expired!", 400));

    //reset password
    const newUpdatePassword = req.body.password;
    const newUpdatePasswordConfirm = req.body.passwordConfirm;

    if (!newUpdatePassword || !newUpdatePasswordConfirm)
      return next(
        new AppError("please provide a new Password and confirm it!", 400)
      );

    user.password = newUpdatePassword;
    user.passwordConfirm = newUpdatePasswordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Your password has been updated successfuly",
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new AppError(`${err.errors.passwordConfirm.message}`, 400));
    } else {
      next(err);
    }
  }
};
