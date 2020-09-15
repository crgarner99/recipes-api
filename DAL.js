const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

//Gran env variables
const url = process.env.MONGODB_URL;
const databaseName = process.env.MONGODB_DATABASE;

console.log(url);
console.log(databaseName);

const collectionName = "recipes";
const settings = {
  useUnifiedTopology: true,
};

let databaseClient;
let recipeCollection;
let deletedRecipesCollection;

//connect()
const connect = function () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, settings, (error, client) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      databaseClient = client.db(databaseName);
      recipeCollection = databaseClient.collection(collectionName);
      deletedRecipesCollection = databaseClient.collection("deletedRecipes");
      console.log("Successfully Connected to Database!");
      resolve();
    });
  });
};

//TODO: define all functions that talk to the Database

/* 
-connect()

-find recipes() documents ( Read - R from CRUD)
-find recipe() document (Read- optional)
-insert recipe() document (Create - C from CRUD)
-update recipe() document (Update -U from CRUD)
-delete recipe() document (Delete -D from CRUD)

*/
const findAll = function () {
  const query = {};

  return new Promise((resolve, reject) => {
    recipeCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log(`Successfully Found ${documents.length} Documents.`);
      resolve(documents);
    });
  });
};

const findOne = function (query) {
  return new Promise((resolve, reject) => {
    recipeCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      if (documents.length > 0) {
        console.log("Successfuly Found Document!");
        const document = documents[0];
        resolve(document);
      } else {
        reject("No Document Found!");
      }
    });
  });
};

const insertOne = function (recipe) {
  return new Promise((resolve, reject) => {
    recipeCollection.insertOne(recipe, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log("Successfully Inserted a New Document");
      resolve();
    });
  });
};

const updateOne = function (query, newRecipe) {
  const newRecipeQuery = {};

  if (newRecipe.name) {
    newRecipeQuery.name = newRecipe.name;
  }
  if (newRecipe.category) {
    newRecipeQuery.category = newRecipe.category;
  }
  if (newRecipe.ingredients) {
    newRecipeQuery.ingredients = newRecipe.ingredients;
  }
  if (newRecipe.instructions) {
    newRecipeQuery.instructions = newRecipe.instructions;
  }
  if (newRecipe.prepTime) {
    newRecipeQuery.prepTime = newRecipe.prepTime;
  }
  if (newRecipe.totalTime) {
    newRecipeQuery.totalTime = newRecipe.totalTime;
  }
  if (newRecipe.serves) {
    newRecipeQuery.serves = newRecipe.serves;
  }

  return new Promise((resolve, reject) => {
    recipeCollection.updateOne(
      query,
      { $set: newRecipeQuery },
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        } else if (result.modifiedCount === 0) {
          console.log("No Document Found");
          reject("No Document Found");
          return;
        }

        console.log("Successfully Updated Document!");
        resolve();
      }
    );
  });
};

const deleteOne = function (query) {
  return new Promise((resolve, reject) => {
    //get recipe with findOne
    recipeCollection.deleteOne(query, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      } else if (result.deleteCount === 0) {
        console.log("No Document Found");
        reject("No Document Found");
        return;
      }
      //add to deleted receipes collection

      console.log("Successfully Deleted Document!");
      resolve();
    });
  });
};

//TODO: module.exports = {connect, ....}

const findAllDeletedRecipes = () => {
  // reference find all
};

const permanentlyDeleteRecipe = (recipeId) => {
  // reference delete
};

const restoreRecipe = (recipeId) => {
  //get recipe with recipeid from the deleted recipes collection
  //delete recipe with recipe id from deleted recipes collection
  //add the recipe to the recipe collection
};

module.exports = {
  findAllDeletedRecipes,
  permanentlyDeleteRecipe,
  restoreRecipe,
  connect,
  findAll,
  findOne,
  updateOne,
  deleteOne,
  insertOne,
};
