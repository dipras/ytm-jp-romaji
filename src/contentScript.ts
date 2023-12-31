import browser from "webextension-polyfill";

const port = browser.runtime.connect();

const get_content = () => {
    const tabs = document.querySelectorAll('.tab-content');
    tabs[1].click();
    setTimeout(() => {
        const desc = document.querySelector('.description');
        port.postMessage({
            type: "POST_CONTENT",
            data: desc?.textContent
        });
    }, 1000);
}

const tranlsate = (data: any) => {
    port.postMessage({
        type: "STOP_PING_TL"
    });

    document.querySelector('#japanese_input').innerHTML = data;
    document.querySelector('.convert_button').click();
}

const get_tl = () => {
    let tl : string = "";
    document.querySelectorAll('#res_romaji span, #res_romaji br').forEach(e => {
        if(e.nodeName == 'BR') {
            tl += "\n";
        } else {
            tl += e.innerHTML + " ";
        }
    })
    port.postMessage({
        type: "SEND_TRANSLATE",
        data: tl
    })
}

const apply_tl = (data: any) => {
    console.log({
        type: "APPLY_TRANSLATE content",
        data
    })
    
    const p = document.createElement('p');
    p.innerText = data + "\n\n =================== \n\n";
    p.style.fontSize = "14px";
    document.querySelector('.ytmusic-section-list-renderer').appendChild(p)
}

browser.runtime.onMessage.addListener((msg) => {
    switch (msg.type) {
        case 'GET_CONTENT':
            get_content();
            break;
        case 'TRANSLATE':
            tranlsate(msg.data);
            break;
        case 'REQ_TRANSLATE':
            get_tl();
            break;
        case "APPLY_TRANSLATE":
            apply_tl(msg.data);
            break;
    }
})