const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('public')); 

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const db = new sqlite3.Database('Usuarios.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conectado a la base de datos Usuarios');
  }
});

// Base de datos
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )
`);

app.get('/', (req, res) => {
  res.render('login');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.run('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) {
      console.error(err.message);
      res.send('Error en el registro');
    } else {
      res.send('Se ha registrado correctamente');
    }
  });
});

// Aqui es la vaina donde se maneja el inicio de sesión de usuarios
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM usuarios WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      console.error(err.message);
      res.send('Error en el inicio de sesión');
    } else if (!row) {
      res.send('Nombre de usuario o contraseña incorrectos');
    } else {
      res.send('Bienvenido');
    }
  });
});


// El servidor esta escuchando....
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});


app.get('/usuarios', (req, res) => {
  db.all('SELECT * FROM usuarios', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.send('Error al obtener los usuarios');
    } else {
      res.json(rows);
    }
  });
});
