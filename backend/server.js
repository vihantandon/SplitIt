import express from "express";
import cors from "cors";
import pg from "pg"
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library"; 

const client = new OAuth2Client("247414368917-r36k47jv56hi8dei8oi2hqdmech6qbba.apps.googleusercontent.com");
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
  const passwordHash = await bcrypt.hash(password, 13);
  try{
    await db.query('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)',
      [firstName, lastName, email, passwordHash]
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

    if(user.password != null && !(await bcrypt.compare(password, user.password)))
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


// Google Sign In route
app.post('/api/google-signin', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "247414368917-r36k47jv56hi8dei8oi2hqdmech6qbba.apps.googleusercontent.com"
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    // Check if user already exists
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      // User does not exist, create a new user
      await db.query(
        'INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3)',
        [given_name, family_name, email]
      );
    }

    res.json({
      message: 'Google Sign In successful',
      user: {
        email,
        firstName: given_name,
        lastName: family_name
      }
    });
  } catch (error) {
    console.error('Google Sign In error:', error);
    res.status(500).json({ error: 'Google Sign In failed' });
  }
});



app.listen(port,()=>{
    console.log(`Port running on ${port}`);
    
})