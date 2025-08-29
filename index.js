// index.js - Main API file
const express = require('express');
const app = express();

app.use(express.json());

// Helper functions
const isNumber = (str) => !isNaN(str) && !isNaN(parseFloat(str));
const isAlphabet = (str) => /^[a-zA-Z]+$/.test(str);
const isSpecialChar = (str) => /[^a-zA-Z0-9]/.test(str) && str.length === 1;

// Generate user_id in the required format: full_name_ddmmyyyy
const generateUserId = () => {
  const fullName = "mukesh_lodhi"; 

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = now.getFullYear();
  return `${fullName}_${day}${month}${year}`;
};

// Process data function
const processData = (data) => {
  let oddNumbers = [];
  let evenNumbers = [];
  let alphabets = [];
  let specialCharacters = [];
  let sum = 0;
  let alphaChars = [];

  data.forEach(item => {
    // Convert to string to handle numbers passed as strings
    const strItem = String(item);
    
    if (isNumber(strItem)) {
      const num = parseInt(strItem);
      sum += num;
      if (num % 2 === 0) {
        evenNumbers.push(strItem);
      } else {
        oddNumbers.push(strItem);
      }
    } else if (isAlphabet(strItem)) {
      const upperCase = strItem.toUpperCase();
      alphabets.push(upperCase);
      // Add each character for concatenation in reverse order
      for (let char of upperCase) {
        alphaChars.unshift(char); // Add to beginning to reverse order
      }
    } else if (isSpecialChar(strItem)) {
      specialCharacters.push(strItem);
    }
   

  });

  // Create concatenated string with alternating caps
  let concatString = '';
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
      user_id: generateUserId(),
      email: "mukeshlodhi2022@vitbhopal.ac.in",
      roll_number: "22BEY10090", 
      ...result
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      is_success: false,
      error: "Internal server error"
    });
  }
});

// GET endpoint (for testing)
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