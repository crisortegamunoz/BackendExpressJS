require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const LoggerMiddleware = require('./middlewares/logger');
const ErrorHandlerMiddleware = require('./middlewares/error-handler');
const { validateUser } = require('./util/validation');
const authenticateToken = require('./middlewares/auth');

const bodyParser = require('body-parser');
const fs = require('fs');
const PATH = require('path');
const usersFilePath = PATH.join(__dirname, 'user.json');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(LoggerMiddleware);
app.use(ErrorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <h1>Curso Express.js</h1>
        <p>Esto es una aplicación node.js con express.js</p>
        <p>Corre en el puerto: ${PORT}</p>
    `)
});

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;

    res.send(`Mostrar la información del usuario con ID: ${userId}`)
});

app.get('/search', (req, res) => {
    const terms = req.query.termino || 'No especificado';
    const category = req.query.categoria || 'Todas'

    res.send(`
        <h2>Resultados de Búsqueda:</h2>
        <p>Termino: ${terms}</p>
        <p>Categoría: ${category}</p>  
    `);
});

app.post('/form', (req, res) => {
    const name = req.body.nombre || 'Anónimo';
    const email = req.body.email || 'No proporcionado';
    res.json({
        message: 'Datos recibidos',
        data: {
            name,
            email
        }
    });
});

app.post('/api/data', (req, res) => {
    const data = req.body;
    if(!data && Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No se recibieron datos'});
    }

    res.status(201).json({
        message: 'Datos recibidos',
        data
    })
});

app.get('/users', (req, res) => {
    fs.readFile(usersFilePath, 'utf-8', (error, data) => {
        if(error) {
            return res.status(500).json({ error: 'Error con conexión de datos.'});
        }
        const user = JSON.parse(data);
        res.status(200).json(user);
    });
});

app.post('/users', (req, res) => {
  const newUser = req.body;
  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error con conexión de datos.' });
    }
    const users = JSON.parse(data);

    const validation = validateUser(newUser, users);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    users.push(newUser);
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar el usuario.' });
      }
      res.status(201).json(newUser);
    });
  });
});

app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updatedUser = req.body;

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error con conexión de datos.' });
    }
    let users = JSON.parse(data);

    const validation = validateUser(updatedUser, users);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    users = users.map(user =>
      user.id === userId ? { ...user, ...updatedUser } : user
    );
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
      if (err) {
        return res
          .status(500)
          .json({ error: 'Error al actualizar el usuario' });
      }
      res.status(200).json(updatedUser);
    });
  });
});

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error con conexiÃ³n de datos.' });
        }
        let users = JSON.parse(data);
        users = users.filter(user => user.id !== userId);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
            if (err) {
                return res
                .status(500)
                .json({ error: 'Error al actualizar el usuario' });
            }
            res.status(204).send();
        });
    });
});

app.get('/error', (req, res, next) => {
    next(new Error('Error intencional'));
});


app.get('/db-users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al comunicarse con la base de datos'});
    }
});

app.get('/protected-route', authenticateToken, (req, res) => {
  res.send('Esta es una ruta protegida');
});

app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'USER'
    }
  });
  res.status(201).json({ message: 'User Register Succesfully', data: newUser});
});

app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
});
