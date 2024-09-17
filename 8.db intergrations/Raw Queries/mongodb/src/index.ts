import { MongoClient, ObjectId } from 'mongodb';

// Encode special characters in the password
const encodedPassword = encodeURIComponent('@StrongPassword');

//'mongodb://admin:@StrongPassword@localhost:27017/todo_db?authSource=admin'

// MongoDB connection string
const uri = `mongodb://admin:${encodedPassword}@localhost:27017/todo_db?authSource=admin`;

// MongoDB database and collection
const dbName = 'todo_db';
const collectionName = 'todo_collection';  // Changed collection name to `todo_collection`

// Initialize MongoDB client with proper options
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error:any) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
}

// Create a new Todo item in `todo_collection`
async function createTodo(task: string, completed: boolean) {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne({
      task,
      completed,
      created_at: new Date(),
    });
    console.log('Todo Created:', result.insertedId);
  } catch (error:any) {
    console.error('Error creating todo:', error.message);
  }
}

// Fetch all Todos from `todo_collection`
async function fetchAllTodos() {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const todos = await collection.find({}).toArray();
    console.log('All Todos:', todos);
  } catch (error:any) {
    console.error('Error fetching todos:', error.message);
  }
}

// Fetch a Todo by ID from `todo_collection`
async function fetchTodoById(id: string) {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const todo = await collection.findOne({ _id: new ObjectId(id) });
    if (todo) {
      console.log('Todo by ID:', todo);
    } else {
      console.log(`Todo with ID ${id} not found.`);
    }
  } catch (error:any) {
    console.error('Error fetching todo by ID:', error.message);
  }
}

// Delete a Todo by ID from `todo_collection`
async function deleteTodoById(id: string) {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      console.log(`Todo deleted with ID: ${id}`);
    } else {
      console.log(`No Todo found with ID: ${id}`);
    }
  } catch (error:any) {
    console.error('Error deleting todo:', error.message);
  }
}

// Run MongoDB CRUD Operations
(async () => {
  try {
    await connectToMongoDB();

    // Example operations (uncomment to test)

    // await createTodo('Learn MongoDB', false);
    // await createTodo('Learn JavaScript', false);
    // await createTodo('Learn TypeScript', false);

    await fetchAllTodos();

    // Example ID (replace with an actual ID from your database)
    // const exampleId = '6139db485f13b720f07b7a71'; // Replace with a valid ObjectId
    // await fetchTodoById(exampleId);

    // Uncomment to delete by ID
    // await deleteTodoById(exampleId);

    // await fetchAllTodos();
  } catch (error:any) {
    console.error('Error:', error.message);
  } finally {
    await client.close(); // Ensure MongoDB client is closed when done
  }
})();
