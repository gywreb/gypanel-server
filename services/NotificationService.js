const OneSignal = require("onesignal-node");

exports.NotificationService = class NotificationService {
  static init() {
    this.client = new OneSignal.Client(
      process.env.ONESIGNAL_APPID,
      process.env.ONESIGNAL_APIKEY
    );
    this.webClient = new OneSignal.Client(
      process.env.WEB_ONESIGNAL_APPID,
      process.env.WEB_ONESIGNAL_APIKEY
    );
    this.userClient = new OneSignal.UserClient(process.env.ONESIGNAL_USERAUTH);
  }

  static async sendNotification(content) {
    try {
      const response = await this.client.createNotification({
        headings: { en: "NEW INVOICE!" },
        contents: {
          en: content,
        },
        included_segments: ["Subscribed Users"],
        android_channel_id: "9d74ab53-d41a-4b18-ab8c-a127a9fe459a",
      });
      const webReposne = await this.webClient.createNotification({
        headings: { en: "NEW INVOICE!" },
        contents: {
          en: content,
        },
        included_segments: ["Subscribed Users"],
      });
      console.log(response.body, webReposne.body);
    } catch (e) {
      if (e instanceof OneSignal.HTTPError) {
        // When status code of HTTP response is not 2xx, HTTPError is thrown.
        console.log(e.statusCode);
        console.log(e.body);
      }
    }
  }
};
