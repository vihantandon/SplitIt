"use client"

import { useEffect, useState } from "react"
import { DollarSign, FileText, Users, Minus, Plus } from "lucide-react"
import Navbar from "./navbar"
import "./addexpense.css"
import axios from "axios"

function Addexpense() {
  const [expenseMessage, setExpenseMessage] = useState("")
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    group: "",
    splitType: "manual",
  })
  const [groups, setGroups] = useState([])
  const [members, setMembers] = useState([])
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    async function fetchGroups() {
      const res = await axios.get(`http://localhost:3000/api/user-groups/${userId}`)
      setGroups(res.data)
    }
    if (userId) fetchGroups()
  }, [userId])

  useEffect(() => {
    async function fetchMembers() {
      if (!formData.group) {
        setMembers([])
        return
      }
      const res = await axios.get(`http://localhost:3000/api/group-details/${formData.group}`)

      // Set default amount to 0 for each member
      setMembers(
        res.data.members.map((m) => ({
          id: m.id,
          name: m.name,
          amount: 0,
        })),
      )
    }
    fetchMembers()
  }, [formData.group])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMemberAmountChange = (memberId, newAmount) => {
    const amount = Math.max(0, Number.parseFloat(newAmount) || 0)
    setMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, amount } : member)))
  }

  const adjustAmount = (memberId, increment) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, amount: Math.max(0, member.amount + increment) } : member,
      ),
    )
  }

  const getTotalSplitAmount = () => {
    return members.reduce((total, member) => total + member.amount, 0)
  }

  const getRemainingAmount = () => {
    const totalExpense = Number.parseFloat(formData.amount) || 0
    const totalSplit = getTotalSplitAmount()
    return totalExpense - totalSplit
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const totalExpense = Number.parseFloat(formData.amount) || 0
    const totalSplitAmount = getTotalSplitAmount()

    if (Math.abs(totalSplitAmount - totalExpense) > 0.01) {
      // Allow for small floating point differences
      alert(
        `Total split amount (₹${totalSplitAmount.toFixed(2)}) must equal the expense amount (₹${totalExpense.toFixed(2)}). Remaining: ₹${getRemainingAmount().toFixed(2)}`,
      )
      return
    }

    const splits = members.map((m) => ({
      userId: m.id,
      amount: m.amount,
    }))

    const paidBy = localStorage.getItem("userId")

    try {
      await axios.post(`http://localhost:3000/api/groups/${formData.group}/expenses`, {
        description: formData.description,
        amount: formData.amount,
        paidBy,
        splits,
      })

      // Reset form
      setFormData({
        description: "",
        amount: "",
        group: "",
        splitType: "manual",
      })
      setMembers([])
      setExpenseMessage("Expense added successfully!")
      setTimeout(() => setExpenseMessage(""), 3000)
    } catch (error) {
      console.error("Error adding expense:", error)
      alert("Failed to add expense")
    }
  }

  return (
    <div className="add-expense-page">
      {/* Import Navbar Component */}
      <Navbar activeItem="expense" />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <div className="add-expense-card">
            <h1 className="page-title">Add Expense</h1>

            {expenseMessage && <div className="success-message">{expenseMessage}</div>}

            <form className="add-expense-form" onSubmit={handleSubmit}>
              {/* Description */}
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <div className="input-wrapper">
                  <FileText className="input-icon" />
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter a description"
                    required
                  />
                </div>
              </div>

              {/* Amount */}
              <div className="form-group">
                <label htmlFor="amount" className="form-label">
                  Total Amount
                </label>
                <div className="input-wrapper">
                  <DollarSign className="input-icon" />
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Group */}
              <div className="form-group">
                <label htmlFor="group" className="form-label">
                  Group
                </label>
                <div className="input-wrapper">
                  <Users className="input-icon" />
                  <select
                    id="group"
                    name="group"
                    value={formData.group}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select a group</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Split */}
              <div className="form-group">
                <label className="form-label">Split Method</label>
                <div className="split-type-container">
                  <div className="split-type-option">
                    <input
                      type="radio"
                      id="manual"
                      name="splitType"
                      value="manual"
                      checked={formData.splitType === "manual"}
                      onChange={handleInputChange}
                      className="radio-input"
                    />
                    <label htmlFor="manual" className="radio-label">
                      Manual split by amount
                    </label>
                  </div>
                </div>
              </div>

              {/* Members */}
              {members.length > 0 && (
                <div className="form-group">
                  <label className="form-label">
                    Split Between Members
                    <div className="amount-summary">
                      <span className={`total-amount ${Math.abs(getRemainingAmount()) < 0.01 ? "valid" : "invalid"}`}>
                        Total Split: ₹{getTotalSplitAmount().toFixed(2)} / ₹
                        {(Number.parseFloat(formData.amount) || 0).toFixed(2)}
                      </span>
                      {Math.abs(getRemainingAmount()) > 0.01 && (
                        <span className="remaining-amount">Remaining: ₹{getRemainingAmount().toFixed(2)}</span>
                      )}
                    </div>
                  </label>
                  <div className="members-container">
                    {members.map((member) => (
                      <div key={member.id} className="member-row">
                        <div className="member-info">
                          <span className="member-name">{member.name}</span>
                          <span className="member-label">Amount</span>
                        </div>
                        <div className="amount-controls">
                          <button
                            type="button"
                            className="amount-btn minus"
                            onClick={() => adjustAmount(member.id, -1)}
                          >
                            <Minus className="btn-icon" />
                          </button>
                          <input
                            type="number"
                            value={member.amount}
                            onChange={(e) => handleMemberAmountChange(member.id, e.target.value)}
                            className="amount-input"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                          />
                          <button type="button" className="amount-btn plus" onClick={() => adjustAmount(member.id, 1)}>
                            <Plus className="btn-icon" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Expense Button */}
              <button type="submit" className="save-expense-btn" disabled={Math.abs(getRemainingAmount()) > 0.01}>
                Save Expense
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Addexpense
