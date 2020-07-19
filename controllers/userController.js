const db = require('../models');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const ObjectId = require('mongodb').ObjectID;

cloudinary.config({
	cloud_name: process.env.cloduinary_cloud,
	api_key: process.env.cloudinary,
	api_secret: process.env.cloudinary_secret
});
require('dotenv').config();

const login = (req, res) => {
	db.User.findOne({ email: req.body.email }).then((user) => {
		if (user !== null) {
			if (user.validPassword(req.body.password)) {
				_sendJwt(user, res);
			} else {
				res.json({
					errors: 'invalid password',
					message: 'Password or Username not found'
				});
			}
		} else {
			res.json({
				errors: 'invalid password',
				message: 'Password or Username not found'
			});
		}
	});
};

const userInfo = (req, res) => {
	db.User.findOne({ _id: new ObjectId(req.params.id) }).then((doc) => res.json(doc)).catch((err) => res.json(err));
};

const register = async (req, res) => {
	const hasFile = Object.keys(req.files).length;
	let imgUrl;

	if (hasFile) {
		await cloudinary.uploader.upload(req.files.file.path, (err, result) => {
			imgUrl = result.url;
		});
	}
	const { firstName, lastName, email, phoneNumber, password, userType } = req.body;
	let newUser = db.User({
		firstName,
		lastName,
		email,
		phoneNumber,
		password,
		userPic: imgUrl
	});

	newUser.password = newUser.generateHash(password);

	const errorObject = { success: false };
	const successObject = { success: true };

	newUser
		.save()
		.then((user) => {
			_sendJwt(user, res);
		})
		.catch((err) => res.json(err));
};
const updateProfile = async (req, res) => {
	const hasFile = Object.keys(req.files).length;
	let imgUrl;

	if (hasFile) {
		await cloudinary.uploader.upload(req.files.file.path, (err, result) => {
			imgUrl = result.url;
		});
	}

	db.User
		.findOneAndUpdate(
			{ email: req.body.userEmail },
			{
				$set: {
					phoneNumber: req.body.phoneNumber,
					userPic: imgUrl
				}
			},
			{ new: true }
		)
		.then((doc) => res.json(doc))
		.catch((err) => res.json(err));
};

const completeWizard = async (req, res) => {
	const { userId } = req.body;
	const hasFile = Object.keys(req.files).length;
	let imgUrl;

	const wizardBody = { userId, ...req.body };

	if (hasFile) {
		await cloudinary.uploader.upload(req.files.file.path, (err, result) => {
			imgUrl = result.url;
		});
	}
	db.User
		.findOneAndUpdate(
			{ _id: ObjectId(userId) },
			{
				$set: {
					...wizardBody,
					completedWizard: true
				}
			},
			{ new: true }
		)
		.then((doc) => res.json(doc))
		.catch((err) => res.json(err));
};

_sendJwt = (user, res) => {
	let token = jwt.sign(
		{
			data: {
				email: user.email,
				password: user.password,
				_id: user._id
			}
		},
		'secret',
		{ expiresIn: '365 days' }
	);

	const userInfo = {
		email: user.email,
		userType: user.userType,
		_id: user._id,
		profilePic: user.profilePic,
		phone: user.phoneNumber
	};

	res.json({ userInfo, token: token });
};

module.exports = {
	login,
	userInfo,
	register,
	updateProfile,
	completedWizard
};
