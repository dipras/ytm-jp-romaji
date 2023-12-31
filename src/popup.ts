import browser from "webextension-polyfill";

const btn = document.querySelector('#tl-btn');
const port = browser.runtime.connect();

const enablebtn = (id: any) => {
    btn?.removeAttribute('disabled');
    btn?.addEventListener('click', () => {
        // browser.tabs.create({url: "https://google.com"});
        port.postMessage({
            id,
            type: 'ACTIVE'
        });
    })
}

const exec = async () => {
    let currentTab = await browser.tabs.query(({currentWindow: true, active: true}));
    let url : any = currentTab[0].url;
    url = new URL(url);
    if(url.hostname == 'music.youtube.com' && url.pathname == '/watch') {
        enablebtn(currentTab[0].id);
    }
}

exec();


port.onMessage.addListener((msg) => {
    console.log(msg)
})
console.log("Hello from the popup!", { id: browser.runtime.id });