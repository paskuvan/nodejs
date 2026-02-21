import { User } from '../models/user.model.js';

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password, 
            loggedIn: false,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: { id: user.id, email: user.email, username: user.username }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
        
    }
};

const loginUser = async (req, res) => {
    try {
        

        // Checking if the user already exists

        const { email, password } = req.body;

        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) return res.status(400).json({
            message: "User not found",
        });

        // Check if the password is correct

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({
            message: "Invalid credentials",
        })

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            }
        })
    } catch (error) {
        res.status(500).json({ 
            message: "Internal server error"
        });
        
    }
}

const logoutUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({
            email
        });

        if(!user) return res.status(400).json({
            message: "User not found",
        });

        res.status(200).json({
            message: "User logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
}
export {
    registerUser,
    loginUser,
    logoutUser,
};