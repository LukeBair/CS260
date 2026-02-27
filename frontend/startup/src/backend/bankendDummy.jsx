import {worldDataDummy} from "../storage/storageDummy";

export function loginDummy() {
    return true;
}

export function saveAccountChanges(username, email) {
    console.log('Saving:', { username, email });
    setTimeout(() => {
        console.log('Saved!');
    }, 500);
}


export function loadUserStoryData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(worldDataDummy);
        }, 500);
    });
}

function communicateWithAI() {
    console.log("Communicating with AI");
}
