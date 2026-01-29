require('dotenv').config({ path: '../.env' });

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');


const app = express();
app.use(bodyParser.json());
app.use(cors());

//deixando tudo seguro(sem vazar informações)
dotenv.config()
const { DB_HOST,DB_PORT,DB_DATABASE,DB_USER,DB_PASSWORD } = process.env

const conn = mysql.createConnection({
    host:DB_HOST,
    port:DB_PORT,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_DATABASE
});

conn.connect();

app.get('/users', (req,res) => {
    conn.query('SELECT * FROM users', (error,results) => {
        if (error) {
            res.status(500).send('Erro ao obter dados.');
            return;
        }
        res.json(results);
    });
});

app.get('/users/:id', (req,res) => {
    const {id} = req.params

    conn.query('SELECT * FROM users WHERE ID = ?',[id],(error,results) =>{
        if (error) {
            res.status(500).send('Erro ao obter dados');
        }
        res.json(results[0]);
    })
});

app.post('/users', (req,res) => {
    const {nome,email,senha} = req.body;
    conn.query('INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)', [nome, email,senha], (error,results) => {
        if (error) {
            res.status(500).send('Erro ao inserir novo usuario')
            return
        }
        res.status(201).send('Usuario criado com sucesso');
    });
});

app.put('/users/:id', (req,res) => {
    const {id} = req.params;
    const {nome,email,senha} = req.body;
    conn.query('UPDATE users SET nome = ?, email = ?, senha = ? WHERE ID = ?', [nome,email,senha,id], (error,results) => {
        if (error) {
            res.status(500).send('Erro ao atualizar usuario');
            return
        }
        res.status(201).send('Usuario atualizado com sucesso');
    });
});

app.delete('/users/:id', (req,res) => {
    const {id} = req.params;
    conn.query('DELETE FROM users WHERE id = ?', [id], (error,results) => {
        if (error) {
            res.status(500).send('Erro ao deletar usuario');
            return
        };
        res.status(201).send('Usuario deletado com sucesso')
    });
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server rodando na porta http://localhost:${port}`);
});