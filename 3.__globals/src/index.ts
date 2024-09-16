import  my_dirname from './__dirname';

const file_name = 'example.txt';
// my_dirname(file_name);  
// Use case: File path operations that need the relative path from the current module's directory, such as reading or writing files within the application.

// Buffer: Available globally in Node.js, the Buffer class is used to handle binary data.

const buffer = Buffer.from('Hello, world!', 'utf8');
console.log(buffer.toString());  // Output: Hello, world!

// process: A Node.js-specific object that provides information about the current process, as well as methods for controlling it.

console.log(process.env);  // Outputs environment variables
process.exit(1);  // Terminates the process with an error code

