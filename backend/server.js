import express from "express";
import cors from "cors";


const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Node backend!' });
});

app.listen(port,()=>{
    console.log(`Port running on ${port}`);
    
})