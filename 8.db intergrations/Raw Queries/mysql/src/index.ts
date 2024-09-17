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

// CRUD Operations using `todo_tbl`

// Create a Todo item in `todo_tbl`
async function createTodo(task: string, completed: boolean) {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO todo_tbl (task, completed, created_at) VALUES (?, ?, NOW())', 
    [task, completed]
  );
  console.log('Todo Created:', result);
}

// Fetch all Todos from `todo_tbl`
async function fetchAllTodos() {
  const [todos] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM todo_tbl'
  );
  console.log('All Todos:', todos);
}

// Fetch Todo by ID from `todo_tbl`
async function fetchTodoById(id: number) {
  const [todo] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM todo_tbl WHERE id = ?', 
    [id]
  );
  console.log('Todo by ID:', todo[0]);
}

// Delete Todo by ID from `todo_tbl`
async function deleteTodoById(id: number) {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM todo_tbl WHERE id = ?', 
    [id]
  );
  console.log('Todo deleted with ID:', id);
}

// Execute CRUD operations
(async () => {
  try {
    await createTodo('Learn TypeScript', false);
    await createTodo('Learn JavaScript', false);
    await createTodo('Learn C#', false);
    await fetchAllTodos();
    // Uncomment the following lines if you want to fetch or delete by ID
    // await fetchTodoById(1);
    // await deleteTodoById(1);
  } catch (error) {
    console.error('Error:', error);
  }
})();
