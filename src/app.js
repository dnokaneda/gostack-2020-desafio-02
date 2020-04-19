const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;
  if(!isUuid(id)) { return response.status(400).json({ error: 'Invalid ID' }) }
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories); 
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newItem = {  id: uuid(), 
                        likes: 0,
                        techs,
                        title, 
                        url,
                     }

   repositories.push(newItem); 

   return response.json(newItem);
});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
   const { title, url, techs } = request.body;
   
   const index = repositories.findIndex( item => item.id === id );

   // if (index < 0) { return response.status(400).json({ message: 'Repositório não encontrado.' }); } 

   const { likes } = repositories[index];
   
   const editItem = {   id, 
                        title, 
                        url,
                        techs,
                        likes
                     };
   
   repositories[index] = editItem;

   return response.json(editItem); 
});

app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
   
  const index = repositories.findIndex( item => item.id === id );

  // if (index < 0) { return response.status(400).send(); } 
     
  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const { id } = request.params;
   
  const index = repositories.findIndex( item => item.id === id );
  
  const { likes, techs, title, url } = repositories[index];
  
  const newLike = likes + 1;
  
  const editItem = { "likes": newLike };
   
  repositories[index] = { id, "likes": newLike, techs, title, url };

  return response.json(editItem); 
});

module.exports = app;
