const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

const authService = {
  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  },

  async updateProfile(userId, data) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const updateData = {};

    if (data.name) updateData.name = data.name;

    if (data.email && data.email !== user.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing) throw new AppError('Email already in use', 409);
      updateData.email = data.email;
    }

    if (data.new_password) {
      if (!data.current_password) {
        throw new AppError('Current password is required to set a new password', 400);
      }
      const isValid = await bcrypt.compare(data.current_password, user.password);
      if (!isValid) throw new AppError('Current password is incorrect', 400);
      updateData.password = await bcrypt.hash(data.new_password, config.bcryptRounds);
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError('No changes provided', 400);
    }

    await userRepository.update(userId, updateData);
    return this.getProfile(userId);
  },
};

module.exports = authService;
