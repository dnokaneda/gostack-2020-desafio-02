////// IMPORTS //////
const express = require('express');
const { uuid } = require('uuidv4');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

////// CREATE //////
app.post('/repositories', (req, res) => {
   const { title, url, techs } = req.body;

   repositories.push({  id: uuid(), 
                        title, 
                        url,
                        techs,
                        likes: 0 
                     });    

   return res.json(repositories);
});

////// READ //////
app.get('/repositories', (req, res) => {
   return res.json(repositories); 
});

////// UPDATE //////
app.put('/repositories/:id', (req, res) => {
   const { id } = req.params;
   const { title, url, techs } = req.body;
   
   const index = repositories.findIndex( item => item.id === id );

   if (index < 0) { return res.status(400).json({ message: 'Repositório não encontrado.' }); } 

   const { likes } = repositories[index];
   
   const editItem = {   id, 
                        title, 
                        url,
                        techs,
                        likes
                     };
   
   repositories[index] = editItem;

   return res.json(repositories); 
});

////// DELETE //////
app.delete('/repositories/:id', (req, res) => {
   const { id } = req.params
   
   const index = repositories.findIndex( item => item.id === id );

   if (index < 0) { return res.status(400).json({ message: 'Repositório não encontrado.' }); } 
      
   repositories.splice(index, 1);

   return res.status(204).send(); 
});

////// LIKE //////
app.post('/repositories/:id/like', (req, res) => {
   const { id } = req.params;
   
   const index = repositories.findIndex( item => item.id === id );

   if (index < 0) { return res.status(400).json({ message: 'Repositório não encontrado.' }); } 

   const { title, url, techs, likes } = repositories[index];

   const newLike = likes + 1;
   
   const editItem = {   id, 
                        title, 
                        url,
                        techs,
                        "likes": newLike
                     };
   
   repositories[index] = editItem;

   return res.json(repositories); 
});

////// START //////
app.listen(3333, () => {
   console.log("Server on!");
});
