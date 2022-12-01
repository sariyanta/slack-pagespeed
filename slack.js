const {WebClient} = require('@slack/web-api');

const web = new WebClient(process.env.SLACK_TOKEN);
const currentTime = new Date().toTimeString();

(async () => {
  try {
    await web.chat.postMessage({
      channel: '#general',
      text: `Hello world! ${currentTime}`,
    });
    console.log('Message posted!');
  } catch (error) {
    console.log(error);

  }
})();

