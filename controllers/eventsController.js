const Event = require("../models/eventsModel");
const AppError = require("../utils/AppErrorr");

exports.getAllEvents = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludedQueries = ["page", "sort", "limit", "fields"];

    excludedQueries.forEach((el) => delete queryObj[el]);

    if (req.query.date) {
      const date = new Date(req.query.date);
      queryObj.date = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      };
    }

    let query = Event.find(queryObj);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("date");
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    const events = await query;

    res.status(200).json({
      status: "success",
      data: events.length > 0 ? events : "no events for this queries!",
    });
  } catch (err) {
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json({
      status: "success",
      data: newEvent,
    });
  } catch (err) {
    next(err);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return next(new AppError("NO Event Founded!", 404));

    res.status(200).json({
      status: "success",
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return next(new AppError("No Event Founded!", 404));

    res.status(200).json({
      status: "success",
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return next(new AppError("NO Event Founded!", 404));

    await Event.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
