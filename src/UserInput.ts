const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function askUserBoard(): Promise<String> {
    return new Promise((resolve, reject) => {
        rl.question('Do you have a custom board ? (path or empty) ', (answer: String) => {
            resolve(answer)
        })
    })
}

export async function askUserMove(): Promise<void> {
    const userMable = await marble();
    const userDirection = await direction();
    rl.close();
}

function marble(): Promise<String> {
    return new Promise((resolve, reject) => {
        rl.question('Marble (e.g B2) ', (answer: String) => {
            console.log(`Your marble is: ${answer}`);
            resolve(answer)
        })
    })
}

function direction(): Promise<String> {
    return new Promise((resolve, reject) => {
        rl.question('Direction (e.g W) ', (answer: String) => {
            console.log(`Your direction is: ${answer}`);
            resolve(answer)
        })
    })
}