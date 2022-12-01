import psi from 'psi';

// (async () => {
//   // Get the PageSpeed Insights report
//   const { data } = await psi('https://leapforce.nl',
//   {
//     key:process.env.PSI_KEY,
//     strategy: 'mobile'
//   });
//   console.log('Mobile Score:', data.lighthouseResult.categories.performance.score);


//   // Supply options to PSI and get back speed
//   const data2 = await psi('https://leapforce.nl', {
//     key:process.env.PSI_KEY,
//     strategy: 'desktop'
//   });
//   console.log('Desktop Score:', data2.data.lighthouseResult.categories.performance.score);
// })();

export async function getPSIScore(url){
  const score = {
    url: url,
    mobile:0,
    desktop:0
  };
  const { desktop } = await psi(url, {
    key:process.env.PSI_KEY,
    strategy: 'desktop',
    threshold: 80,
  });

  score['desktop'] = desktop?.lighthouseResult.categories.performance.score;

  const { mobile } = await psi(url, {
    key:process.env.PSI_KEY,
    strategy: 'mobile',
    threshold: 80,
  });

  score['mobile'] = mobile?.lighthouseResult.categories.performance.score;

  return score;

}