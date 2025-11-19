const BaseCommand = require('../BaseCommand');
const knex = require('../../database/index');

class UpdateEmailCommand extends BaseCommand {
  constructor() {
    super('update:emails', 'Update user emails based on their names');
  }

  async execute(args = []) {
    try {
      this.info('Starting email update process...');
      
      const users = await knex('users').select('id', 'name', 'email');
      
      if (users.length === 0) {
        this.warning('No users found in the database');
        return;
      }

      this.info(`Found ${users.length} users to process`);

      let updatedCount = 0;
      let skippedCount = 0;

      for (const user of users) {
        try {
          const firstName = user.name.split(' ')[0].toLowerCase();
          
          const emailParts = user.email.split('@');
          const domain = emailParts.length > 1 ? emailParts[1] : 'example.com';
          
          const newEmail = `${firstName}@${domain}`;
          
          if (user.email === newEmail) {
            this.info(`Skipping ${user.name} - email already matches pattern`);
            skippedCount++;
            continue;
          }

          const existingUser = await knex('users')
            .where('email', newEmail)
            .whereNot('id', user.id)
            .first();

          if (existingUser) {
            this.warning(`Skipping ${user.name} - email ${newEmail} already exists for another user`);
            skippedCount++;
            continue;
          }

          await knex('users')
            .where('id', user.id)
            .update({
              email: newEmail,
              updated_at: knex.fn.now()
            });

          this.success(`Updated ${user.name}: ${user.email} -> ${newEmail}`);
          updatedCount++;

        } catch (userError) {
          this.error(`Failed to update user ${user.name}: ${userError.message}`);
          skippedCount++;
        }
      }

      this.info('\n=== Update Summary ===');
      this.success(`Total users processed: ${users.length}`);
      this.success(`Successfully updated: ${updatedCount}`);
      this.warning(`Skipped: ${skippedCount}`);
      this.info('Email update process completed');

    } catch (error) {
      this.error(`Command failed: ${error.message}`);
      throw error;
    }
  }
}

module.exports = UpdateEmailCommand;