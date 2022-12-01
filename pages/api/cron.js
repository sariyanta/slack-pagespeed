import psi from 'psi';
import { WebClient } from '@slack/web-api';

const web = new WebClient(process.env.SLACK_TOKEN);
const websites = [
  'https://www.bmair.com/en/',
  'https://www.bobautowas.nl/',
  'https://www.detransformatiegroep.nl/',
  'https://www.devries-st.nl/',
  'https://www.demaco-cryogenics.com/',
  'https://www.webshop.demaco.nl/',
  'https://dutchdryer.com/',
  'https://econic.homes/',
  'https://www.jasa.nl/',
  'https://www.pqr.com/',
  'https://www.prozee.nl/',
  'https://www.puregoatcompany.com/',
  'https://www.radine.nl/',
  'https://www.ralstoncolour.com/',
  'https://www.solidluxcoating.com/',
  'https://www.technobis.com/',
  'https://hightechsolutions.technobis.com/',
  'https://www.thephonelab.nl/',
  'https://zakelijk.thephonelab.nl/',
  'https://thuysvers.nl/',
  'https://www.verpakapotheek.nl/',
  'https://werkenbij.radine.nl/',
  'https://www.wijzonol.nl/consument/',
]
export default async function handler(req, res) {
  
  if (req.method === 'POST') {
    websites.forEach( async function (website)  {

      let data = await getPSIScore(website);
  
      const {mobile, desktop} = data;
  
      if (mobile < 0.6 || desktop < 0.6){
        sendSlackMessage(data);
      }
   
    })
  }
}


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