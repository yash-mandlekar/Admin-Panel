const Channel = require("../../models/adminModels/channelModel")
const User = require("../../models/adminModels/userModel");
const ErrorHandler = require("../../utils/ErrorHandler");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");

exports.CreateChannel = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const channel = await Channel.create({
        channelName: req.body.channelName,
        description: req.body.description,
        type: req.body.type,
        layout: req.body.layout,
        titlePosition: req.body.titlePosition,
        top: req.body.top,
        play: req.body.play,
        partition: req.body.partition,
    });
    user.channels.push(channel._id);
    await user.save();
    res.status(201).json({
        status: "success",
        channel,
    });
});

exports.AllChannels = catchAsyncErrors(async (req, res, next) => {
    const channels = await Channel.find();
    res.status(200).json(channels);
});

exports.GetChannel = catchAsyncErrors(async (req, res, next) => {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
        return next(new ErrorHandler("Channel not found", 404));
    }   
    res.status(200).json(channel);
});

exports.UpdateChannel = catchAsyncErrors(async (req, res, next) => {
    const channel = await Channel.findById(req.body._id);
    if (!channel) {
        return next(new ErrorHandler("Channel not found", 404));
    }
    channel.channelName = req.body.channelName;
    channel.description = req.body.description;
    channel.type = req.body.type;
    channel.layout = req.body.layout;
    channel.titlePosition = req.body.titlePosition;
    channel.top = req.body.top;
    channel.play = req.body.play;
    channel.partition = req.body.partition;
    await channel.save();
    res.status(200).json({
        status: "success",
        channel,
    });
});



exports.DeleteChannel = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const { channelId } = req.body;
    const channel = await Channel.findOne({ _id: channelId });
    const index = user.channels.indexOf(channelId);
    user.channels.splice(index, 1);
    await user.save();
    await channel.remove();
    res.status(201).json(channel);
});

