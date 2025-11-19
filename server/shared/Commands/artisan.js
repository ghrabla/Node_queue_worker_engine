require('dotenv').config();

const UpdateEmailCommand = require('./User/UpdateEmailCommand');

class CommandRunner {
  constructor() {
    this.commands = new Map();
    this.registerCommands();
  }

  registerCommands() {
    const updateEmailCommand = new UpdateEmailCommand();
    this.commands.set(updateEmailCommand.name, updateEmailCommand);
  }

  async run(commandName, args = []) {
    if (!this.commands.has(commandName)) {
      console.error(`Command '${commandName}' not found`);
      this.showAvailableCommands();
      process.exit(1);
    }

    try {
      const command = this.commands.get(commandName);
      await command.execute(args);
      process.exit(0);
    } catch (error) {
      console.error(`Command execution failed: ${error.message}`);
      process.exit(1);
    }
  }

  showAvailableCommands() {
    console.log('\nAvailable commands:');
    this.commands.forEach((command, name) => {
      console.log(`  ${name} - ${command.description}`);
    });
    console.log('');
  }
}

const args = process.argv.slice(2);
const commandName = args[0];

if (!commandName) {
  console.error('Please specify a command');
  const runner = new CommandRunner();
  runner.showAvailableCommands();
  process.exit(1);
}

const runner = new CommandRunner();
runner.run(commandName, args.slice(1));