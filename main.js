import psi from 'psi';
import { WebClient } from '@slack/web-api';

const web = new WebClient(process.env.SLACK_TOKEN);

async function getPSIScore(url){
  const score = {
    url: url,
    mobile:0,
    desktop:0
  };
  const mobile = await psi(url,
  {
    key:process.env.PSI_KEY,
    strategy: 'mobile'
  });

  score['mobile'] = mobile.data.lighthouseResult.categories.performance.score;

  const desktop = await psi(url, {
    key:process.env.PSI_KEY,
    strategy: 'desktop'
  });
  score['desktop'] = desktop.data.lighthouseResult.categories.performance.score;
  return score;
}

let data = await getPSIScore('http://verpakapotheek.nl/');

sendSlackMessage(data);

async function sendSlackMessage(data){
  const {url, mobile, desktop} = data;
  try {
    await web.chat.postMessage({
      channel: '#general',
      text: "New page speed score",
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": `${url} Page Speed Score`,
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": `*Mobile:* ${mobile * 100}`
            },
            {
              "type": "mrkdwn",
              "text": `*Desktop:* ${desktop * 100}`
            }
          ]
        },
        {
          "type": "actions",
          "block_id" : "actionblock789",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Check manually",
              },
              "style" : "primary",
              "url": `https://pagespeed.web.dev/report?url=${url}`
            }
          ]
        }
      ],      
    });
    console.log('Message posted!');
  } catch (error) {
    console.log(error);
  }
}