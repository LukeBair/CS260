import {worldDataDummy} from "../storage/storageDummy";

export function loginDummy() {
    return true;
}

export function loadUserStoryData() {
    return worldDataDummy;
}

function communicateWithAI() {
    console.log("Communicating with AI");
}
