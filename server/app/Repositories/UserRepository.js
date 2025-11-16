const knex = require('../../shared/database/index');
const User = require('../Models/User');

class UserRepository {
  constructor() {
    this.table = 'users';
  }

  async findAll() {
    try {
      const users = await knex(this.table).select('*');
      return User.fromDatabaseArray(users);
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const user = await knex(this.table).where({ id }).first();
      return user ? User.fromDatabase(user) : null;
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      const user = await knex(this.table).where({ email }).first();
      return user ? User.fromDatabase(user) : null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  async create(userData) {
    try {
      const [id] = await knex(this.table)
        .insert({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          created_at: knex.fn.now(),
          updated_at: knex.fn.now()
        })
        .returning('*');

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async update(id, userData) {
    try {
      const updateData = {
        ...userData,
        updated_at: knex.fn.now()
      };

      await knex(this.table)
        .where({ id })
        .update(updateData)
        .returning('*');

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedCount = await knex(this.table).where({ id }).del();
      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async emailExists(email, excludeId = null) {
    try {
      let query = knex(this.table).where({ email });
      
      if (excludeId) {
        query = query.whereNot({ id: excludeId });
      }

      const user = await query.first();
      return !!user;
    } catch (error) {
      throw new Error(`Failed to check email existence: ${error.message}`);
    }
  }

  async findWithPagination(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const users = await knex(this.table)
        .select('*')
        .limit(limit)
        .offset(offset)
        .orderBy('created_at', 'desc');

      const total = await knex(this.table).count('* as count').first();

      return {
        users: User.fromDatabaseArray(users),
        pagination: {
          page,
          limit,
          total: parseInt(total.count),
          totalPages: Math.ceil(total.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch users with pagination: ${error.message}`);
    }
  }
}

module.exports = UserRepository;