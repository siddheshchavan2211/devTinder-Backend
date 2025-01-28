const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnReqModel = require("../models/connRequest");

cron.schedule(" * 10 * * *", async () => {
  // Send emails to all people who got requests the previous day
  try {
    const yesterday = subDays(new Date(), 0);

    const yesterdayStartTime = startOfDay(yesterday);
    const yesterdayEndTime = endOfDay(yesterday);

    const pendingRequests = await ConnReqModel.find({
      status: "Intersted",
      createdAt: {
        $gte: yesterdayStartTime,
        $lt: yesterdayEndTime,
      },
    }).populate("recieverId senderId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.senderId.email)),
    ];

    console.log(listOfEmails);

    for (const email of listOfEmails) {
      // Send Emails
      try {
        const res = await sendEmail.run(
          "New Friend Requests pending for " + email,
          "There are so many frined requests pending, please login to DevTinder and accept or reject the requ ests."
        );
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
});
