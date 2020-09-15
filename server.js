const express = require("express");
// Create the server
const app = express();
const DAL = require("./DAL");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ObjectID, ObjectId } = require("mongodb");

DAL.connect();

app.use(cors());

app.use(bodyParser.json());

// TODO: add in middleware: cors, body-parser

// TODD: add the endpoints e.g. app.get("/path", ()=> {...})

app.get("/api/recipes", async (req, res) => {
  const recipes = await DAL.findAll();

  res.send(recipes);
});

app.get("/api/recipes/:id", async (req, res) => {
  const recipeId = req.params.id;

  if (!ObjectID.isValid(recipeId)) {
    res
      .status(400)
      .send(
        `Recipe ID ${recipeId} is incorrect. ID must be 25 characters long.`
      );
    return;
  }

  const recipeQuery = {
    _id: new ObjectId(recipeId),
  };
  let recipe;

  try {
    recipe = await DAL.findOne(recipeQuery);
  } catch (error) {
    res.status(404).send(`Recipe with id ${recipeId} not found!`);
    return;
  }
  res.send(recipe);
});

app.post("/api/recipes", async (req, res) => {
  const body = req.body;
  if (
    !body.name ||
    !body.category ||
    !body.ingredients ||
    !body.instructions ||
    !body.prepTime ||
    !body.totalTime ||
    !body.serves
  ) {
    res
      .status(400)
      .send(
        "Bad Request. Validation Error. Missing value of name, category, ingredients, instructions, prep-time, total-time or serves!"
      );
    return;
  }

  if (body.name && typeof body.name !== "string") {
    res.status(400).send("The name parameter must be a type of string.");
    return;
  }
  if (body.category && typeof body.category !== "string") {
    res.status(400).send("The category parameter must be a type of string.");
    return;
  }
  if (body.ingredients && typeof body.ingredients !== "string") {
    res.status(400).send("The ingredients parameter must be a type of string.");
    return;
  }
  if (body.instructions && typeof body.instructions !== "string") {
    res
      .status(400)
      .send("The instructions parameter must be a type of string.");
    return;
  }
  if (body.prepTime && typeof body.prepTime !== "string") {
    res.status(400).send("The prep-time parameter must be a type of string.");
    return;
  }
  if (body.totalTime && typeof body.totalTime !== "string") {
    res.status(400).send("The total-time parameter must be a type of string.");
    return;
  }
  if (body.serves && typeof body.serves !== "string") {
    res.status(400).send("The serves parameter must be a type of string.");
    return;
  }

  await DAL.insertOne(body);

  res.status(201).send("Recipe added Successfully!");
});

app.put("/api/recipes/:id", async (req, res) => {
  const recipeId = req.params.id;
  const body = req.body;

  if (!ObjectID.isValid(recipeId)) {
    res
      .status(400)
      .send(
        `Recipe ID ${recipeId} is incorrect. ID must be 25 characters long.`
      );
    return;
  }

  const recipeQuery = {
    _id: new ObjectId(recipeId),
  };

  try {
    await DAL.updateOne(recipeQuery, body);
  } catch (error) {
    res.status(404).send(`Recipe with id ${recipeId} not found!`);
    return;
  }

  res.send("Good to Go!");
});

app.delete("/api/recipes/:id", async (req, res) => {
  const recipeId = req.params.id;

  if (!ObjectID.isValid(recipeId)) {
    res
      .status(400)
      .send(
        `Recipe ID ${recipeId} is incorrect. ID must be 25 characters long.`
      );
    return;
  }

  const recipeQuery = {
    _id: new ObjectId(recipeId),
  };

  try {
    await DAL.deleteOne(recipeQuery);
  } catch (error) {
    res.status(404).send(`Recipe with id ${recipeId} not found!`);
    return;
  }

  res.send(`Recipe with ID ${recipeId} has been deleted.`);
});

app.post("/api/restoreRecipe/:recipeId", (request, response) => {
  //get recipe with recipeid from the deleted recipes collection
  //delete recipe with recipe id from deleted recipes collection
  //add the recipe to the recipe collection
});

app.get("/api/deletedRecipes", (request, response) => {
  //get all recipes from the deleted recipes collection
  //response.send(deletedRecipes)
});

app.delete("/api/deletedRecipes/:recipeId", (request, response) => {
  //reference the app.delete("/api/recipes")
});

//Starting the server
const port = process.env.PORT ? process.env.PORT : 3005;
app.listen(port, () => {
  console.log("API STARTED!");
});
