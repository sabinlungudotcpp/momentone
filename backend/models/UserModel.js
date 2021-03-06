const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
const HASH_BYTES = 12;

const userSchema = new mongoose.Schema({ 

	username: { 
		type: String, 
		unique: [true, 'Username taken'], 
		match: [/^[a-zA-Z0-9]+$/, 'Invalid username'], 
		min: 3, 
		index: true,
		required: [true, 'You must provide your username']
	},

	aboutMe: { // About me field
		type: String, 
		max: 500,
		required: false
	},

	roles: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user'
	},

	profileImage: String,
	bannerImage: String,

	password: { 
		type: String, 
		required: [true, 'You must provide your password']
	},

	passwordResetExpiry: Date,

	//Arrey that will hold all of the users journal posts
	posts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Posts'
	}],

	//Arrey that will hold all of the users goals
	goals: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Goals'
	}]
}); 

userSchema.pre('save', async function(next) { 
	const currentUser = this; 

	if(!currentUser.isModified('password')) {
		return next();
	}

	this.password = await bcrypt.hash(this.password, HASH_BYTES); // Hash the user password
	this.passwordConfirm = undefined; // Password confirm dissappears
	return next();
});

userSchema.methods.comparePasswords = async function(candidatePassword, userPassword) { // Method to compare user passwords
	return await bcrypt.compare(candidatePassword, userPassword); // Compare the passwords before authentication
}

const User = mongoose.model('User', userSchema);
module.exports = User; // Export the user schema model