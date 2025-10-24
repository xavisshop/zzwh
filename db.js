const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'news_db'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);

  // Create news table if it doesn't exist
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS news (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      author VARCHAR(100) NOT NULL,
      date VARCHAR(50) NOT NULL,
      image VARCHAR(500),
      summary TEXT NOT NULL,
      content LONGTEXT NOT NULL
    );
  `;
  connection.query(createTableSql, (err, results) => {
    if (err) {
      console.error('Error creating news table:', err.stack);
      return;
    }
    console.log('News table checked/created successfully.');
  });
});

module.exports = connection;