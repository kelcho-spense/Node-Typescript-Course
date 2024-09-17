import sql from 'mssql';

// MSSQL Connection Configuration
const config: sql.config = {
  user: 'sa', // Replace with your SQL Server username
  password: '@StrongPassword', // Replace with your SQL Server password
  server: 'localhost', // Server name or IP address
  database: 'todo_db',
  options: {
    encrypt: false, // Set to true if you're using Azure or SSL
    trustServerCertificate: true, // Change to true for local dev / self-signed certs
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Initialize Connection Pool
const poolPromise: Promise<sql.ConnectionPool> = new sql.ConnectionPool(config)
  .connect()
  .then((pool: sql.ConnectionPool) => {
    console.log('Connected to MSSQL');
    return pool;
  })
  .catch((err: Error) => {
    console.error('Database Connection Failed! Bad Config: ', err);
    throw err;
  });

// Create a new Todo
async function createTodo(title: string): Promise<void> {
  try {
    const pool: sql.ConnectionPool = await poolPromise;
    const request: sql.Request = pool.request();
    request.input('title', sql.NVarChar(255), title);
    const result: sql.IResult<{ id: number }> = await request.query(
      'INSERT INTO todos (title) VALUES (@title); SELECT SCOPE_IDENTITY() as id;'
    );
    console.log('Todo Created with ID:', result.recordset[0].id);
  } catch (err: any) {
    console.error('Error creating todo:', err);
  }
}

// Fetch all Todos
async function fetchAllTodos(): Promise<void> {
  try {
    const pool: sql.ConnectionPool = await poolPromise;
    const result: sql.IResult<any> = await pool.request().query('SELECT * FROM todos');
    console.log('All Todos:', result.recordset);
  } catch (err: any) {
    console.error('Error fetching todos:', err);
  }
}

// Fetch Todo by ID
async function fetchTodoById(id: number): Promise<void> {
  try {
    const pool: sql.ConnectionPool = await poolPromise;
    const request: sql.Request = pool.request();
    request.input('id', sql.Int, id);
    const result: sql.IResult<any> = await request.query('SELECT * FROM todos WHERE id = @id');
    if (result.recordset.length > 0) {
      console.log('Todo:', result.recordset[0]);
    } else {
      console.log(`Todo with ID ${id} not found.`);
    }
  } catch (err: any) {
    console.error('Error fetching todo by ID:', err);
  }
}

// Delete Todo by ID
async function deleteTodoById(id: number): Promise<void> {
  try {
    const pool: sql.ConnectionPool = await poolPromise;
    const request: sql.Request = pool.request();
    request.input('id', sql.Int, id);
    const result: sql.IResult<any> = await request.query('DELETE FROM todos WHERE id = @id');
    if (result.rowsAffected[0] > 0) {
      console.log(`Todo deleted with ID: ${id}`);
    } else {
      console.log(`No Todo found with ID: ${id}`);
    }
  } catch (err: any) {
    console.error('Error deleting todo:', err);
  }
}

// Execute CRUD operations
(async () => {
  await createTodo('Learn MSSQL');
  await fetchAllTodos();
  await fetchTodoById(1);
  await deleteTodoById(1);
  await fetchAllTodos(); // To verify deletion
})();
