const AWS = require("aws-sdk");

AWS.config.credentials = new AWS.SharedIniFileCredentials({
  profile: "scheduler_admin",
});

const scheduler = new AWS.Scheduler({ region: "ap-south-1" });

const target = {
  Arn: "", // The ARN of the Queue
  RoleArn: "", // The ARN of the role given to the queue
};

class SchedulerHelper {
  static async createSchedule({ name, description, ScheduleExpression, data }) {
    // The data to be sent as a payload to the target
    target["Input"] = JSON.stringify(data);

    const params = {
      Name: name,
      Description: description,
      ScheduleExpression, // ONE TIME -> "at(yyyy-mm-ddThh:mm:ss)" or "cron()" RECURRING -> "rate(val unit)"
      Target: target,
      FlexibleTimeWindow: { Mode: "OFF" },
    };

    return new Promise((resolve, reject) => {
      scheduler.createSchedule(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.ScheduleArn);
        }
      });
    });
  }

  static async deleteSchedule({ name }) {
    const params = {
      Name: name,
    };

    return new Promise((resolve, reject) => {
      scheduler.deleteSchedule(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  static async updateSchedule({ name, description, ScheduleExpression }) {
    const params = {
      Name: name,
      Description: description,
      ScheduleExpression, // ONE TIME -> "at(yyyy-mm-ddThh:mm:ss)" or "cron()" RECURRING -> "rate(val unit)"
      Target: target,
      FlexibleTimeWindow: { Mode: "OFF" },
    };

    return new Promise((resolve, reject) => {
      scheduler.updateSchedule(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.ScheduleArn);
        }
      });
    });
  }

  static async updateScheduleTime({ name, ScheduleExpression }) {
    const scheduleData = await this.getScheduleData({ name });

    const params = {
      Name: scheduleData.Name,
      Description: scheduleData.Description,
      ScheduleExpression, // ONE TIME -> "at(yyyy-mm-ddThh:mm:ss)" or "cron()" RECURRING -> "rate(val unit)"
      Target: scheduleData.Target,
      FlexibleTimeWindow: scheduleData.FlexibleTimeWindow,
    };

    return new Promise((resolve, reject) => {
      scheduler.updateSchedule(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.ScheduleArn);
        }
      });
    });
  }

  static async updateSchedulePayload({ name, data }) {
    const scheduleData = await this.getScheduleData({ name });
    scheduleData.Target["Input"] = JSON.stringify(data);

    const params = {
      Name: scheduleData.Name,
      Description: scheduleData.Description,
      ScheduleExpression: scheduleData.ScheduleExpression, // ONE TIME -> "at(yyyy-mm-ddThh:mm:ss)" or "cron()" RECURRING -> "rate(val unit)"
      Target: scheduleData.Target,
      FlexibleTimeWindow: scheduleData.FlexibleTimeWindow,
    };

    return new Promise((resolve, reject) => {
      scheduler.updateSchedule(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.ScheduleArn);
        }
      });
    });
  }

  static async enableSchedule({ name }) {
    const scheduleData = await this.getScheduleData({ name });

    const params = {
      Name: scheduleData.Name,
      Description: scheduleData.Description,
      ScheduleExpression: scheduleData.ScheduleExpression, // ONE TIME -> "at(yyyy-mm-ddThh:mm:ss)" or "cron()" RECURRING -> "rate(val unit)"
      Target: scheduleData.Target,
      FlexibleTimeWindow: scheduleData.FlexibleTimeWindow,
      State: "ENABLED",
    };

    return new Promise((resolve, reject) => {
      scheduler.updateSchedule(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.ScheduleArn);
        }
      });
    });
  }

  static async disableSchedule({ name }) {
    const scheduleData = await this.getScheduleData({ name });

    const params = {
      Name: scheduleData.Name,
      Description: scheduleData.Description,
      ScheduleExpression: scheduleData.ScheduleExpression, // ONE TIME -> "at(yyyy-mm-ddThh:mm:ss)" or "cron()" RECURRING -> "rate(val unit)"
      Target: scheduleData.Target,
      FlexibleTimeWindow: scheduleData.FlexibleTimeWindow,
      State: "DISABLED",
    };

    return new Promise((resolve, reject) => {
      scheduler.updateSchedule(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.ScheduleArn);
        }
      });
    });
  }

  static async getScheduleData({ name }) {
    const params = { Name: name };

    return new Promise((resolve, reject) => {
      scheduler.getSchedule(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}

module.exports = SchedulerHelper;
