// index.js - Main API file
const express = require('express');
const app = express();

app.use(express.json());

// Helper functions
const isNumber = (str) => !isNaN(str) && !isNaN(parseFloat(str));
const isAlphabet = (str) => /^[a-zA-Z]+$/.test(str);
const isSpecialChar = (str) => /[^a-zA-Z0-9]/.test(str) && str.length === 1;

// Process data function
const processData = (data) => {
  let oddNumbers = [];
  let evenNumbers = [];
  let alphabets = [];
  let specialCharacters = [];
  let sum = 0;
  let alphaChars = [];

  data.forEach(item => {
    if (isNumber(item)) {
      const num = parseInt(item);
      sum += num;
      if (num % 2 === 0) {
        evenNumbers.push(item.toString());
      } else {
        oddNumbers.push(item.toString());
      }
    } else if (isAlphabet(item)) {
      const upperCase = item.toUpperCase();
      alphabets.push(upperCase);
      // Add each character for concatenation
      for (let char of upperCase) {
        alphaChars.push(char);
      }
    } else if (isSpecialChar(item)) {
      specialCharacters.push(item);
    }
  });

  // Create concatenated string in reverse order with alternating caps
  let concatString = '';
  alphaChars.reverse();
  for (let i = 0; i < alphaChars.length; i++) {
    if (i % 2 === 0) {
      concatString += alphaChars[i].toUpperCase();
    } else {
      concatString += alphaChars[i].toLowerCase();
    }
  }

  return {
    odd_numbers: oddNumbers,
    even_numbers: evenNumbers,
    alphabets: alphabets,
    special_characters: specialCharacters,
    sum: sum.toString(),
    concat_string: concatString
  };
};

// POST endpoint
app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid input. 'data' must be an array."
      });
    }

    const result = processData(data);
    
    res.json({
      is_success: true,
      user_id: "john_doe_17091999", // Replace with actual logic to generate this
      email: "john@xyz.com", // Replace with actual email
      roll_number: "ABCD123", // Replace with actual roll number
      ...result
    });
  } catch (error) {
    res.status(500).json({
      is_success: false,
      error: "Internal server error"
    });
  }
});

// GET endpoint (optional, for testing)
app.get('/bfhl', (req, res) => {
  res.json({
    operation_code: 1
  });
});

// Export for Vercel
module.exports = app;

// For local testing
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}