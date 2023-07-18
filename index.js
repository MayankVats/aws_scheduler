const SchedulerHelper = require("./SchedulerHelper");

async function main() {
  try {
    // const scheduleARN = await SchedulerHelper.updateSchedule({
    //   name: "dev_schedule_1",
    //   ScheduleExpression: "rate(2 minutes)",
    //   state: "DISABLED",
    //   data: {
    //     message: "Hello from the scheduler",
    //   },
    // });
    // console.log(scheduleARN);

    const scheduleData = await SchedulerHelper.updateScheduleTime({
      name: "dev_schedule_1",
      ScheduleExpression: "cron(30 11 * * ? *)",
    });

    console.log(scheduleData);
  } catch (err) {
    console.error(err);
  }
}

main();
