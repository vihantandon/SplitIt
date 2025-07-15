import express from "express"
import cors from "cors"
import pg from "pg"
import bcrypt from "bcrypt"
import { OAuth2Client } from "google-auth-library"

const client = new OAuth2Client("247414368917-r36k47jv56hi8dei8oi2hqdmech6qbba.apps.googleusercontent.com")
const app = express()
const port = 3000

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
)
app.use(express.json())

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "SplitIt",
  password: "avnivihan0",
  port: 5432,
})
db.connect()

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from Node backend!" })
})

//signup route
app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body
  const passwordHash = await bcrypt.hash(password, 13)
  try {
    await db.query("INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)", [
      firstName,
      lastName,
      email,
      passwordHash,
    ])
    res.json({ message: "User signed up successfully!" })
  } catch (err) {
    console.error("Signup error:", err)
    res.status(500).json({ error: "Signup failed." })
  }
})

//signin validation route
app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await db.query("select * from users where email = $1", [email])
    if (result.rows.length === 0) return res.status(401).json({ error: "User not found" })
    const user = result.rows[0]
    if (user.password != null && !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: "Invalid password" })
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    })
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ error: "Server error during login" })
  }
})

// Google Sign In route
app.post("/api/google-signin", async (req, res) => {
  const { token } = req.body
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "247414368917-r36k47jv56hi8dei8oi2hqdmech6qbba.apps.googleusercontent.com",
    })
    const payload = ticket.getPayload()
    const { email, given_name, family_name, picture } = payload

    // Check if user already exists
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email])
    if (result.rows.length === 0) {
      // User does not exist, create a new user
      await db.query("INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3)", [
        given_name,
        family_name,
        email,
      ])
    }

    res.json({
      message: "Google Sign In successful",
      user: {
        id: result.rows.length > 0 ? result.rows[0].id : null, // Use existing user ID or null if new
        email,
        firstName: given_name,
        lastName: family_name,
        image: picture,
      },
    })
  } catch (error) {
    console.error("Google Sign In error:", error)
    res.status(500).json({ error: "Google Sign In failed" })
  }
})

//Get groups of logged-in user
app.get("/api/user-groups/:userId", async (req, res) => {
  const userId = req.params.userId
  try {
    const result = await db.query(
      `
      SELECT g.id, g.name
      FROM groups g
      JOIN group_members gm ON g.id = gm.group_id
      WHERE gm.user_id = $1
    `,
      [userId],
    )
    res.json(result.rows)
  } catch (err) {
    console.error("Error fetching user groups:", err)
    res.status(500).json({ error: "Failed to fetch user groups" })
  }
})

//Create a new group route
app.post("/api/groups", async (req, res) => {
  const { groupName, inviteEmails, creatorEmail } = req.body
  try {
    const creatorResult = await db.query("SELECT id FROM users WHERE email = $1", [creatorEmail])
    if (creatorResult.rows.length === 0) {
      return res.status(404).json({ error: "Creator not found" })
    }
    const creatorId = creatorResult.rows[0].id

    const groupResult = await db.query("INSERT INTO groups (name, created_by) VALUES ($1, $2) RETURNING id", [
      groupName,
      creatorId,
    ])
    const groupId = groupResult.rows[0].id

    // Add creator as a member
    await db.query("INSERT INTO group_members (user_id, group_id) VALUES ($1, $2)", [creatorId, groupId])

    // Add invited users as members (if they exist)
    for (const email of inviteEmails) {
      const userResult = await db.query("SELECT id FROM users WHERE email = $1", [email])
      if (userResult.rows.length > 0) {
        const userId = userResult.rows[0].id
        await db.query("INSERT INTO group_members (user_id, group_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [
          userId,
          groupId,
        ])
      }
    }

    res.json({ message: "Group created successfully", groupId })
  } catch (err) {
    console.error("Error creating group:", err)
    res.status(500).json({ error: "Failed to create group" })
  }
})

//Group details route
app.get("/api/group-details/:groupId", async (req, res) => {
  const groupId = req.params.groupId
  try {
    // Get group name
    const groupResult = await db.query("SELECT id, name FROM groups WHERE id = $1", [groupId])
    if (groupResult.rows.length === 0) {
      return res.status(404).json({ error: "Group not found" })
    }
    const group = groupResult.rows[0]

    // Get group members
    const membersResult = await db.query(
      `
      SELECT u.id, u.first_name, u.last_name, u.email
      FROM group_members gm
      JOIN users u ON gm.user_id = u.id
      WHERE gm.group_id = $1
    `,
      [groupId],
    )

    // TODO: Calculate balances for each member (for now, set to 0)
    const members = membersResult.rows.map((m) => ({
      id: m.id,
      name: `${m.first_name} ${m.last_name}`,
      email: m.email,
      balance: 0, // Replace with real balance logic if needed
    }))

    res.json({
      id: group.id,
      name: group.name,
      members,
    })
  } catch (err) {
    console.error("Error fetching group details:", err)
    res.status(500).json({ error: "Failed to fetch group details" })
  }
})

//Delete group route
app.post("/api/groups/deletegroup", async (req, res) => {
  const { groupId } = req.body
  try {
    await db.query("DELETE FROM group_members WHERE group_id = $1", [groupId])
    await db.query("DELETE FROM groups WHERE id = $1", [groupId])
    res.json({ message: "Group deleted successfully" })
  } catch (err) {
    console.error("Error deleting group:", err)
    res.status(500).json({ error: "Failed to delete group" })
  }
})

// Invite member route from group details
app.post("/api/groups/invite", async (req, res) => {
  const { groupId, email } = req.body
  try {
    const userResult = await db.query("select id from users where email = $1", [email])
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }
    const userId = userResult.rows[0].id
    await db.query("insert into group_members (user_id,group_id) values ($1,$2) on conflict do nothing", [
      userId,
      groupId,
    ])
    res.json({ message: "Member invited successfully" })
  } catch (err) {
    console.error("Error inviting member:", err)
    res.status(500).json({ error: "Failed to invite member" })
  }
})

// Add expense route
app.post("/api/groups/:groupId/expenses", async (req, res) => {
  const { description, amount, paidBy, splits } = req.body
  const groupId = req.params.groupId
  try {
    const expenseResult = await db.query(
      "INSERT INTO expenses (group_id, description, amount, paid_by) VALUES ($1, $2, $3, $4) RETURNING id",
      [groupId, description, amount, paidBy],
    )
    const expenseId = expenseResult.rows[0].id

    for (const split of splits) {
      if (split.userId == paidBy) continue // Skip the one who paid
      await db.query("INSERT INTO expense_splits (expense_id, user_id, amount_owed) VALUES ($1, $2, $3)", [
        expenseId,
        split.userId,
        split.amount,
      ])
    }
    res.json({ message: "Expense added successfully", expenseId })
  } catch (err) {
    console.error("Error adding expense:", err)
    res.status(500).json({ error: "Failed to add expense" })
  }
})

//settle specific member's debt for an expense
app.post("/api/expenses/:expenseId/settle-member", async (req, res) => {
  const { payerId, memberId } = req.body
  const expenseId = req.params.expenseId

  try {
    // Check if the user is the one who paid for this expense
    const expenseResult = await db.query("SELECT paid_by FROM expenses WHERE id = $1", [expenseId])
    if (expenseResult.rows.length === 0) {
      return res.status(404).json({ error: "Expense not found" })
    }

    const paidBy = expenseResult.rows[0].paid_by

    // Only allow the person who paid to settle
    if (paidBy != payerId) {
      return res.status(403).json({ error: "Only the person who paid can settle this expense" })
    }

    // Mark ONLY this specific member's split as settled
    const updateResult = await db.query(
      "UPDATE expense_splits SET settled = true WHERE expense_id = $1 AND user_id = $2 AND settled = false",
      [expenseId, memberId],
    )

    if (updateResult.rowCount === 0) {
      return res.status(400).json({ error: "No unsettled debt found for this member" })
    }

    res.json({ message: "Member's debt settled successfully" })
  } catch (err) {
    console.error("Error settling member debt:", err)
    res.status(500).json({ error: "Failed to settle member debt" })
  }
})

app.get("/api/groups/:groupId/expenses", async (req, res) => {
  const { groupId } = req.params
  try {
    const result = await db.query(
      `
      SELECT e.*, u.first_name || ' ' || u.last_name AS paid_by_name
      FROM expenses e
      JOIN users u ON e.paid_by = u.id
      WHERE e.group_id = $1`,
      [groupId],
    )
    res.json(result.rows)
  } catch (err) {
    console.error("Error fetching expenses:", err)
    res.status(500).json({ error: "Failed to fetch expenses" })
  }
})

//member splits route
app.get("/api/groups/:groupId/member-splits", async (req, res) => {
  const { groupId } = req.params
  try {
    const result = await db.query(
      `
      SELECT es.user_id, es.amount_owed, es.expense_id, e.description, e.amount, e.paid_by, es.settled AS settled, u.first_name || ' ' || u.last_name AS paid_by_name
      FROM expense_splits es
      JOIN expenses e ON es.expense_id = e.id
      JOIN users u ON e.paid_by = u.id
      WHERE e.group_id = $1 AND es.amount_owed > 0`,
      [groupId],
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch member splits" })
  }
})

app.listen(port, () => {
  console.log(`Port running on ${port}`)
})
