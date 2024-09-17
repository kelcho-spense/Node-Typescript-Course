import * as fs from 'fs';

// With async/await, error handling is similar to synchronous code.
//  You can use try/catch blocks to handle errors in asynchronous code.

async function readFileAsync() {
  try {
    const data = await fs.promises.readFile('nonexistentfile.txt', 'utf-8');
    console.log('File content:', data);
  } catch (err: any) {
    console.error('Error reading file:', err.message);
  }
}

readFileAsync();


// Example: Handling errors in a promise
const asyncOperation = new Promise((resolve, reject) => {
  const errorOccurred = true;
  if (errorOccurred) {
    reject(new Error('Something went wrong!'));
  } else {
    resolve('Operation succeeded');
  }
});

asyncOperation
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error('Error in promise:', err.message);
  });