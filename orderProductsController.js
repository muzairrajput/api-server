const router = require("express").Router();
var dbConnection = require('./dbCon');

router.get('/', (req, res) => {
    let columnName = req.query.sortBy || 'name'; // Default column to sort by
    let sortOrder = req.query.order || 'ASC'; // Default sort order
  
    // Validate the column name to prevent SQL injection
   // const allowedColumns = ['name', 'price'];
   // if (!allowedColumns.includes(columnName)) {
   //   return res.status(400).json({ error: 'Invalid column name' });
   // }
  
    // Construct SQL query
    const sqlQuery = `SELECT * FROM Product ORDER BY ${columnName} ${sortOrder}`;
  
    // Execute the query
    dbConnection.query(sqlQuery, (error, results) => {
      if (error) {
        console.error('Error executing query: ' + error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results); // Return the sorted results
    });
  });


module.exports = router;
