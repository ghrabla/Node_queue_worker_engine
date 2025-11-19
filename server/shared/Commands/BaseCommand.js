class BaseCommand {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  async execute(args = []) {
    throw new Error('Execute method must be implemented by subclass');
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '[INFO]',
      success: '[SUCCESS]',
      error: '[ERROR]',
      warning: '[WARNING]'
    }[type] || '[INFO]';

    console.log(`${timestamp} ${prefix} ${message}`);
  }

  success(message) {
    this.log(message, 'success');
  }

  error(message) {
    this.log(message, 'error');
  }

  warning(message) {
    this.log(message, 'warning');
  }

  info(message) {
    this.log(message, 'info');
  }
}

module.exports = BaseCommand;