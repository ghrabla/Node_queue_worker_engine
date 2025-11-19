const eventEmitter = require("../Events/EventEmitter");
const emailQueue = require("../Queues/EmailQueue");

eventEmitter.on("UserCreated", ({ email }) => {
  emailQueue.add("sendWelcomeEmail", { email });
});
