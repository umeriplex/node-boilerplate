import User from '../models/User';
import { UnauthorizedError, BadRequestError } from '../utils/AppError';
import { signToken } from '../utils/jwt';

export const registerUser = async (userData: any) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new BadRequestError('Email already in use');
  }

  const user = await User.create({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
  });

  const token = signToken({ id: String(user._id), role: user.role });

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const loginUser = async (credentials: any) => {
  const { email, password } = credentials;

  // 1) Check if email and password exist
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new UnauthorizedError('Incorrect email or password');
  }

  // 3) If everything ok, send token
  const token = signToken({ id: String(user._id), role: user.role });

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    token,
  };
};
