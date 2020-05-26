const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "a517487630a546d5977d30693fd36131",
});
const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("unable to work with api"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    // .returning("entries")
    .then(() => {
      // console.log(entries);
      // res.json(entries);
      db.select("*")
        .from("users")
        .where("id", "=", id)
        .then((user) => {
          //console.log(user);
          res.json(user[0].entries);
        });
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};
module.exports = {
  handleImage,
  handleApiCall,
};
