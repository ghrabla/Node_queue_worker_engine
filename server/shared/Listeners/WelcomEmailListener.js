const eventEmitter = require("../Events/EventEmitter");
const emailQueue = require("../../queue/EmailQueue");

eventEmitter.on("UserCreated", ({ email }) => {
  emailQueue.add("sendWelcomeEmail", { email });
});
