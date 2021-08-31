const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function askWhichBoard(): Promise<String> {
    return new Promise((resolve, reject) => {
        rl.question('Type 1 for initial board or 2 for custom board ', (answer: String) => {
            resolve(answer)
        })
    })
}

export function askUserBoardPath(): Promise<String> {
    return new Promise((resolve, reject) => {
        rl.question('Path ', (answer: String) => {
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