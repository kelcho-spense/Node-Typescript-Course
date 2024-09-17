import mysql, { PoolOptions, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// Define connection pool options
const access: PoolOptions = {
  host: 'localhost',
  user: 'admin',
  password: '@StrongPassword',
  database: 'todo_db',
};

// Create a connection pool
const pool = mysql.createPool(access);

// CRUD Operations using connection pool

// Create a Todo item
async function createTodo(title: string) {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO todos (title) VALUES (?)', 
    [title]
  );
  console.log('Todo Created:', result);
}

// Fetch all Todos
async function fetchAllTodos() {
  const [todos] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM todos'
  );
  console.log('All Todos:', todos);
}

// Fetch Todo by ID
async function fetchTodoById(id: number) {
  const [todo] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM todos WHERE id = ?', 
    [id]
  );
  console.log('Todo by ID:', todo[0]);
}

// Delete Todo by ID
async function deleteTodoById(id: number) {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM todos WHERE id = ?', 
    [id]
  );
  console.log('Todo deleted with ID:', id);
}

// Execute CRUD operations
(async () => {
  try {
    await createTodo('Learn TypeScript');
    await createTodo('Learn Javascript');
    await createTodo('Learn C#');
    await fetchAllTodos();
    // await fetchTodoById(1);
    // await deleteTodoById(1);
  } catch (error) {
    console.error('Error:', error);
  }
})();
