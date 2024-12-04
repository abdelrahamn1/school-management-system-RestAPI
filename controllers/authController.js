const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const User = require("../models/userModel");
const AppError = require("../utils/AppErrorr.js");

const sendEmail = require("../controllers/emailController");
const crypto = require("crypto");
require("dotenv").config();

// Utility function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_JWT, {
    expiresIn: process.env.JWT_EXPIERS,
  });
};

// Utility function to send JWT via cookies
const sendTokenResponse = (user, res) => {
  const token = generateToken(user._id);
  const cookieExpiration = new Date(Date.now() + 2 * 60 * 60 * 24 * 1000); // 2 days

  res.cookie("jwt", token, {
    expires: cookieExpiration,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return token;
};

// Register User
exports.register = async (req, res, next) => {
  try {
    // Destructure request body
    const { name, email, password, passwordConfirm } = req.body;

    // Validate required fields
    if (!name || !email || !password || !passwordConfirm) {
      return next(new AppError("All fields are required!", 400));
    }

    // Create the user
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    // Send JWT token as response
    sendTokenResponse(newUser, res);

    res.status(200).json({
      status: "success",
      message: "You are registered successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Login User
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return next(new AppError("Email and password are required!", 400));
    }

    // Find user by email
    const currentUser = await User.findOne({ email }).select(
      "+password +active"
    );
    if (!currentUser || currentUser.active === false) {
      return next(
        new AppError(
          "Incorrect email or password or your account is deactivated!",
          403
        )
      );
    }

    // Check if password matches
    if (!(await bcrypt.compare(password, currentUser.password))) {
      return next(new AppError("Incorrect email or password!", 403));
    }

    // Send JWT token as response
    sendTokenResponse(currentUser, res);

    res.status(200).json({
      status: "success",
      message: "Logged in successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Middleware for protecting routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in cookies
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError("You are not logged in, please log in or register!", 401)
      );
    }

    // Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_JWT);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id).select("+active");
    if (!currentUser) return next(new AppError("User not found!", 404));

    // Attach user to the request
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware for role-based authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not allowed to perform this operation!",
      });
    }
    next();
  };
};

// Forget Password - Send reset token via email
exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError("Please provide an email!", 400));

    const user = await User.findOne({ email }).select("email active");

    if (!user || user.active === false) {
      return next(
        new AppError("No user found or account is deactivated!", 400)
      );
    }

    // Generate password reset token
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send reset token to user's email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetpassword/${resetToken}`;
    const message = `Forgot your password? Please follow this link to reset your password: ${resetURL}. If you didn't forget your password, please ignore this email.`;

    try {
      await sendEmail({
        email: email,
        subject: "Password Reset Request",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Password reset link sent to your email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          "There was an error sending the email. Please try again later.",
          500
        )
      );
    }
  } catch (err) {
    next(err);
  }
};

// Reset Password - Reset the password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user by reset token and expiry time
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("This link has expired or is invalid.", 400));
    }

    const { password, passwordConfirm } = req.body;

    if (!password || !passwordConfirm) {
      return next(
        new AppError("Please provide a new password and confirm it!", 400)
      );
    }

    // Update the password
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Your password has been updated successfully!",
    });
  } catch (err) {
    next(err);
  }
};
