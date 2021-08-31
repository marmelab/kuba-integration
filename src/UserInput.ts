const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function askWhichBoard(): Promise<string> {
    return new Promise((resolve, reject) => {
        rl.question('Type 1 for initial board or 2 for custom board ', (answer: string) => {
            resolve(answer)
        })
    })
}

export function askUserBoardPath(): Promise<string> {
    return new Promise((resolve, reject) => {
        rl.question('Path ', (answer: string) => {
            resolve(answer)
        })
    })
}

export async function askUserMove(): Promise<void> {
    const userMable = await marble();
    const userDirection = await direction();
    rl.close();
}

function marble(): Promise<string> {
    return new Promise((resolve, reject) => {
        rl.question('Marble (e.g B2) ', (answer: string) => {
            console.log(`Your marble is: ${answer}`);
            resolve(answer)
        })
    })
}

function direction(): Promise<string> {
    return new Promise((resolve, reject) => {
        rl.question('Direction (e.g W) ', (answer: string) => {
            console.log(`Your direction is: ${answer}`);
            resolve(answer)
        })
    })
}