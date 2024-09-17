import { Pool } from 'pg';

// PostgreSQL Connection
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'todo_db',
  password: '@StrongPassword',
  port: 5432,
});

// Create a new Todo item in the `todo_tbl` table
async function createTodo(task: string, completed: boolean) {
  const result = await pool.query(
    'INSERT INTO todo_tbl (task, completed, created_at) VALUES ($1, $2, NOW()) RETURNING *',
    [task, completed]
  );
  console.log('Todo Created:', result.rows[0]);
}

// Fetch all Todos from the `todo_tbl` table
async function fetchAllTodos() {
  const result = await pool.query('SELECT * FROM todo_tbl');
  console.log('All Todos:', result.rows);
}

// Fetch a Todo by ID from the `todo_tbl` table
async function fetchTodoById(id: number) {
  const result = await pool.query('SELECT * FROM todo_tbl WHERE id = $1', [id]);
  console.log('Todo by ID:', result.rows[0]);
}

// Delete a Todo by ID from the `todo_tbl` table
async function deleteTodoById(id: number) {
  await pool.query('DELETE FROM todo_tbl WHERE id = $1', [id]);
  console.log('Todo deleted with ID:', id);
}

// Execute CRUD operations
(async () => {
  await createTodo('Learn PostgreSQL', false);
  await fetchAllTodos();
  await fetchTodoById(1);
  // await deleteTodoById(1);
})();
