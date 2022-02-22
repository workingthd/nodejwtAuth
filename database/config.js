const mongoose = require('mongoose')
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() =>
    console.log(`MongoDb Connection :: Connected to ${process.env.DB_URL}`)
  )
  .catch(err =>
    console.log(`MongoDb Connection Error:: ${process.env.DB_URL} :: ${err}`)
  )
