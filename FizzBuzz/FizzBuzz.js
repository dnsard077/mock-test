'use strict';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}



/*
 * Complete the 'fizzBuzz' function below.
 *
 * The function accepts INTEGER n as parameter.
 */

function fizzBuzz(n) {
    // Loop through numbers from 1 to n
    for (let i = 1; i <= n; i++) {
        // Initialize an empty result string for each iteration
        let res = "";
        // Check if the current number is divisible by 3
        if (i % 3 === 0) {
            res += "Fizz"; // Append "Fizz" to the result string
        }
        // Check if the current number is divisible by 5
        if (i % 5 === 0) {
            res += "Buzz"; // Append "Buzz" to the result string
        }
        // Output "Fizz", "Buzz", "FizzBuzz", or the number itself
        console.log(res || i);
    }
}


function main() {
    const n = parseInt(readLine().trim(), 10);

    fizzBuzz(n);
}

