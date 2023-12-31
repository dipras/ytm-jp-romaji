import browser from "webextension-polyfill";

let mainId: number;
let tlId: number | undefined;
let intervalTl: string | number | NodeJS.Timeout | undefined;

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});


browser.runtime.onConnect.addListener(port => {
  const translate = async (text) => {
    const tab = await browser.tabs.create({url: "https://www.romajidesu.com/translator"});
    tlId = tab.id;
    browser.tabs.update(mainId, {selected: true})
    intervalTl = setInterval(() => {
      browser.tabs.sendMessage(tlId, {
        type: 'TRANSLATE',
        data: text
      })
    }, 2000);
  }

  const get_tl = async () => {
    clearInterval(intervalTl);
    intervalTl = setInterval(() => {
      browser.tabs.sendMessage(tlId, {
        type: 'REQ_TRANSLATE',
      })
    }, 2000);
  }

  const apply_tl = async (data : any) => {
    clearInterval(intervalTl);
    browser.tabs.sendMessage(mainId, {
      type: 'APPLY_TRANSLATE',
      data: data
    })
  }

  port.onMessage.addListener((msg, secPort) => {
    switch(msg.type) {
      case 'ACTIVE':
        mainId = msg.id;
        browser.tabs.sendMessage(msg.id, {type: 'GET_CONTENT'});
        break;
      case 'POST_CONTENT':
        translate(msg.data);
        break;
      case 'STOP_PING_TL':
        get_tl();
        break;
      case 'SEND_TRANSLATE':
        apply_tl(msg.data);
        break;
    }
  })
})
