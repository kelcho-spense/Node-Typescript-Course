import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

// Register multiple listeners for the same event
eventEmitter.on('greet', (name) => {
  console.log(`Listener 1: Hello, ${name}!`);
});

eventEmitter.on('greet', (name) => {
  console.log(`Listener 2: How are you, ${name}?`);
});

// Emit the 'greet' event
eventEmitter.emit('greet', 'Bob');

// Unregister a listener
eventEmitter.off('greet', (name) => {
  console.log(`Goodbye, ${name}!`);
});

eventEmitter.emit('greet', 'Bob');

// Output:
// Listener 1: Hello, Bob!
// Listener 2: How are you, Bob?

// Register an error event listener
eventEmitter.on('error', (err) => {
  console.error('Error occurred:', err);
});

// Emit an error event
eventEmitter.emit('error', new Error('Something went wrong!'));

// Output: Error occurred: Error: Something went wrong!