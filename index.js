import express from 'express';
import fs from 'fs';
import { format } from 'date-fns';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config()

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  try {
    const today = format(new Date(), 'dd-MM-yyyy-HH-mm-ss');
    const filePath = path.join('current_timesstamp', `${today}.txt`);
    
    fs.writeFileSync(filePath, today, 'utf8');
    const data = fs.readFileSync(filePath, 'utf8');
    
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
// New endpoint to retrieve all text files in a folder

app.get('/getTextFiles', (req, res) => {
  const folderPath = 'current_timesstamp';

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while listing the files from the directory');
    } else {
      const textFiles = files.filter((file) => path.extname(file) === '.txt');
      res.status(200).json(textFiles);
    }
  });
});

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
