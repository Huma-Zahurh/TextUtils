const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const stringSimilarity = require('string-similarity');
const cors = require('cors');
const dotenv = require("dotenv").config();
const path = require("path");
const Mongo_URL = process.env.dB_URI;


const app = express();

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB database
mongoose
  .connect(Mongo_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Define Document schema
const documentSchema = new mongoose.Schema({
  text: String,
});

const Document = mongoose.model('Document', documentSchema);

// Endpoint for checking plagiarism
app.post('/api/check-plagiarism', async (req, res) => {
  const { text } = req.body;

  try {
    // Sample documents for testing
    const originalDocument = 'This is the original document.';
    const plagiarismDocument = 'This is a plagiarized document.';

    // Calculate similarity using the Jaro-Winkler algorithm
    const similarity = stringSimilarity.compareTwoStrings(text.toLowerCase(), plagiarismDocument.toLowerCase());

    // Define a plagiarism threshold (e.g., 0.8 for 80% similarity)
    const plagiarismThreshold = 80;

    // Determine if the similarity exceeds the threshold
    const isPlagiarized = similarity >= plagiarismThreshold;

    const plagiarismResult = {
      similarity,
      isPlagiarized,
    };

    res.json(plagiarismResult);
  } catch (error) {
    console.error('Error while checking plagiarism:', error);
    res.status(500).json({ error: 'An error occurred while checking plagiarism' });
  }
});

// Static files
app.use(express.static(path.join(__dirname, './Client/build')))
app.get('*', function(req,res){
res.sendFile(path.join(__dirname, './Client/build/index.html'))
})

 const port = 5000
app.listen(port, () => {
  console.log(`Server running on port ${port}` );
});