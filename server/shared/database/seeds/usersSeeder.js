const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  await knex('users').del();
  
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password456', 10);
  const hashedPassword3 = await bcrypt.hash('admin123', 10);

  return knex('users').insert([
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword3,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);
};