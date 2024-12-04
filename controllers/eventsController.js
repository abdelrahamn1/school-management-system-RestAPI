const Event = require("../models/eventsModel");
const AppError = require("../utils/AppErrorr.js");

exports.getAllEvents = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludedQueries = ["page", "sort", "limit", "fields"];

    // Exclude unwanted queries
    excludedQueries.forEach((el) => delete queryObj[el]);

    // Handling date filter if provided
    if (req.query.date) {
      const date = new Date(req.query.date);
      // Ensuring the date query is for a full day
      queryObj.date = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      };
    }

    let query = Event.find(queryObj);

    // Handling sorting if specified
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("date");
    }

    // Handling fields selection if specified
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination handling (if requested)
    if (req.query.page || req.query.limit) {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    // Execute the query and send the response
    const events = await query;

    res.status(200).json({
      status: "success",
      result: events.length,
      data:
        events.length > 0 ? events : "No events found matching your criteria.",
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
    if (!event) return next(new AppError("No event found with this ID!", 404));

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
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { updatedAt: Date.now(), ...req.body },
      { new: true, runValidators: true }
    );
    if (!event) return next(new AppError("No event found with this ID!", 404));

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
    if (!event) return next(new AppError("No event found with this ID!", 404));

    await event.deleteOne();
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
