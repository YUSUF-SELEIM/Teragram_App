import { prisma } from '../../../prisma/prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hive';

interface contextValue {
    user: any;
}

// Fetch all users (using context for authentication)
export const getAllUsers = async (_parent: any, args: any, contextValue: contextValue) => {
    console.log('Context:', contextValue);
    console.log('Context yuser:', contextValue.user);

    if (!contextValue.user) {
        throw new Error('Not authenticated');
    }

    const users = await prisma.user.findMany();
    console.log('Users fetched:', users);
    return users;
};

// Register a new user
export const register = async (_parent: any, args: any) => {
    console.log('Register mutation called with args:', args);
    const { name, email, password, confirmPassword } = args;

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        throw new Error('Password and confirm password do not match');
    }

    console.log('Email:', email);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed:', hashedPassword);

    // Create the user in the database
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    console.log('User created:', user);

    // Ensure all non-nullable fields are present
    if (!user.id || !user.email) {
        throw new Error('User creation failed, missing id or email');
    }

    return user;
};

// Login a user
export const login = async (_parent: any, args: any) => {
    console.log('Login mutation called with args:', args);
    const { email, password } = args;
    console.log('Email:', email);
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: '1h',
    });

    console.log('Token generated:', token);

    return {
        token,
    };
};
