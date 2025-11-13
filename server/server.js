const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    const Arr = [1,2,3,4,5,6,7,8,9,10];

  res.send(Arr.toString());
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  console.error('test error');
});
