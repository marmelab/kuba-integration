const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export async function askUserMove(): Promise<void> {
    await marble();
    await direction();
    rl.close();
}

function marble(): Promise<void> {
    return new Promise((resolve, reject) => {
        rl.question('Marble (e.g B2) ', (answer: String) => {
            console.log(`Your marble is: ${answer}`);
            resolve()
        })
    })
}

function direction(): Promise<void> {
    return new Promise((resolve, reject) => {
        rl.question('Direction (e.g W) ', (answer: String) => {
            console.log(`Your direction is: ${answer}`);
            resolve()
        })
    })
}