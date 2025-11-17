const Queue = require("bull");
const sendWelcomeEmailJob = require("../Jobs/sendWelcomeEmailJob");

const emailQueue = new Queue("email-queue", process.env.REDIS_URL);

emailQueue.process("sendWelcomeEmail", sendWelcomeEmailJob);

emailQueue.on("active", (job) => {
  console.log(`[EmailQueue] Job ${job.id} started`);
});

emailQueue.on("completed", (job) => {
  console.log(`[EmailQueue] Job ${job.id} completed`);
});

emailQueue.on("failed", (job, err) => {
  console.error(`[EmailQueue] Job ${job.id} failed:`, err.message);
});

module.exports = emailQueue;
