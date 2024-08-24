const cron = require(`node-cron`);
const { Event } = require(`../models/index`);
const { Op } = require(`sequelize`);

cron.schedule(`0 0 0 * * *`, async () => {
  // Run each day at 12 AM
  await Event.update(
    { deletedAt: Date.now() },
    {
      where: {
        deletedAt: null,
        date: { [Op.lt]: Date.now() },
      },
    }
  );
  console.log(`Hello world`);
});
