const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/", (req, res) => res.send("Why hello there!"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`souste social - listening on PORT ${PORT}`);
});
