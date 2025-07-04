import express from "express";
import cors from "cors";
import pg from "pg"

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

const db = new pg.Client({
  user:"postgres",
  host: "localhost",
  database: "SplitIt",
  password: "avnivihan0",
  port: 5432,
});
db.connect();

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Node backend!' });
});

//signup route
app.post('/api/signup',async (req,res) => {
  const {firstName, lastName, email, password} = req.body;

  try{
    await db.query('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)',
      [firstName, lastName, email, password]
    );
    res.json({message: 'User signed up successfully!'});
  }catch(err){
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed.' });
  }
});

//signin validation route
app.post('/api/signin',async (req,res)=>{
  const {email, password} = req.body;

  try{
    const result = await db.query('select * from users where email = $1',[email]);

    if(result.rows.length === 0)
      return res.status(401).json({error:'User not found'});

    const user = result.rows[0];

    if(user.password != password)
      return res.status(401).json({ error: 'Invalid password' });
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  }catch(err){
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});


app.listen(port,()=>{
    console.log(`Port running on ${port}`);
    
})