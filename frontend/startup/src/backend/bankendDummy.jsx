import {userDataDummy, worldDataDummy} from "../storage/storageDummy";

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
export function dummyLogin(username, password) {
    const storedValues = userDataDummy;
    if (storedValues.users.some(user => user.username === username && user.password === password)) {
        return true;
    } else {
        return false;
    }
}

export function dummyCreate(username, password) {
    const storedValues = userDataDummy;
    if (storedValues.users.some(user => user.username === username)) {
        return false;
    } else {
        storedValues.users.push({username: username, password: password});
        return true;
    }
}
