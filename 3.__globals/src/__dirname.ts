import * as path from 'path';
import * as fs from 'fs';

const my_dirname = (file_name: string) => {


    // Example: Use __dirname to handle file paths dynamically
    const filePath = path.join(__dirname, 'data', file_name);

    // Checking if the file exists before reading
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        console.log('File Content:', fileContent);
    } else {
        console.log(`File not found at ${filePath}`);
    }

    // Output __dirname value
    console.log('Current directory:', __dirname);
}
export default my_dirname