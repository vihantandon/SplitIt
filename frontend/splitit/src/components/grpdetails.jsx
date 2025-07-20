"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Plus, DollarSign, Trash2, Users, CheckCircle, UserPlus, Mail } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "./navbar"
import axios from "axios"
import "./grpdetails.css"

function GroupDetail() {
  const navigate = useNavigate()
  const { groupId } = useParams()
  const [group, setGroup] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [memberSplits, setMemberSplits] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSettleModal, setShowSettleModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [selectedSplit, setSelectedSplit] = useState(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const userId = localStorage.getItem("userId")

  // Fetch group details
  useEffect(() => {
    if (groupId) {
      fetch(`http://localhost:3000/api/group-details/${groupId}`)
        .then((res) => res.json())
        .then((data) => setGroup(data))
        .catch((err) => console.error("Error fetching group details:", err))
    }
  }, [groupId])

  // Fetch expenses
  useEffect(() => {
    if (groupId) {
      fetch(`http://localhost:3000/api/groups/${groupId}/expenses`)
        .then((res) => res.json())
        .then((data) => setExpenses(data))
        .catch((err) => console.error("Error fetching expenses:", err))
    }
  }, [groupId])

  // Fetch splits
  useEffect(() => {
    if (groupId) {
      fetch(`http://localhost:3000/api/groups/${groupId}/member-splits`)
        .then((res) => res.json())
        .then((data) => setMemberSplits(data))
    }
  }, [groupId])

  // Settle a specific member's debt for an expense
  const handleSettleMemberDebt = async (expenseId, memberId) => {
    try {
      await axios.post(`http://localhost:3000/api/expenses/${expenseId}/settle-member`, {
        payerId: Number.parseInt(userId),
        memberId: memberId,
      })

      // Refresh data after settling
      const splitsRes = await fetch(`http://localhost:3000/api/groups/${groupId}/member-splits`)
      const updatedSplits = await splitsRes.json()
      setMemberSplits(updatedSplits)

    } catch (err) {
      if (err.response?.status === 403) {
        alert("Only the person who paid can settle this expense!")
      } else if (err.response?.status === 400) {
        alert("No unsettled debt found for this member!")
      } else {
        alert("Failed to settle debt")
      }
      console.error("Error settling debt:", err)
    }
  }

  // Utility functions
  const getBalanceText = (member) => {
    if (member.balance === 0) return "Settled up"
    if (member.balance > 0) return `is owed ₹${Math.abs(member.balance)}`
    return `owes ₹${Math.abs(member.balance)}`
  }

  const getBalanceColor = (member) => {
    if (member.balance === 0) return "settled"
    if (member.balance > 0) return "owed"
    return "owes"
  }

  const handleSettleMoney = (member) => {
    setSelectedMember(member)
    setShowSettleModal(true)
  }

  const confirmSettle = () => {
    console.log("Settling with:", selectedMember.name)
    setShowSettleModal(false)
    setSelectedMember(null)
  }

  const confirmDelete = async () => {
    try {
      await axios.post("http://localhost:3000/api/groups/deletegroup", { groupId })
      setShowDeleteModal(false)
      navigate("/yourgroups")
    } catch (err) {
      console.error("Error deleting group:", err)
      alert("Failed to delete group")
    }
  }

  const confirmInvite = async () => {
    try {
      await axios.post("http://localhost:3000/api/groups/invite", {
        groupId,
        email: inviteEmail,
        senderName: localStorage.getItem("firstName") + " " + localStorage.getItem("lastName"),
        groupName: group.name,
      })
      setShowInviteModal(false)
      setInviteEmail("")
      const res = await fetch(`http://localhost:3000/api/group-details/${groupId}`)
      const data = await res.json()
      setGroup(data)
    } catch (err) {
      console.error("Error inviting member:", err)
      alert("Failed to send invitation")
    }
  }

  const handleBack = () => navigate("/yourgroups")
  const handleAddExpense = () => navigate("/addexpense")

  if (!group) return <div>Loading group details...</div>

  return (
    <div className="group-detail-page">
      <Navbar activeItem="groups" />

      <main className="main-content">
        <div className="content-container">
          {/* Header */}
          <div className="page-header">
            <button className="back-btn" onClick={handleBack}>
              <ArrowLeft className="back-icon" />
              Back to Groups
            </button>
            <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="delete-icon" />
              Delete Group
            </button>
          </div>

          {/* Group Info Card */}
          <div className="group-info-card">
            <div className="group-header">
              <div className="group-icon">
                <Users className="users-icon" />
              </div>
              <div className="group-details">
                <h1 className="group-name">{group.name}</h1>
                <p className="group-members-count">{group.members.length} members</p>
              </div>
            </div>

            <div className="group-actions">
              <button className="invite-btn" onClick={() => setShowInviteModal(true)}>
                <UserPlus className="invite-icon" />
                Invite
              </button>
              <button className="add-expense-btn" onClick={handleAddExpense}>
                <Plus className="plus-icon" />
                Add Expense
              </button>
            </div>
          </div>

          {/* Members List */}
          <div className="members-section">
            <h2 className="section-title">Members & Balances</h2>
            <div className="members-list">
              {group.members.map((member, index) => {
                const memberExpenses = memberSplits.filter(
                  (split) => split.user_id === member.id && Number.parseFloat(split.amount_owed) > 0,
                )

                return (
                  <div
                    key={member.id}
                    className={`member-card ${getBalanceColor(member)}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="member-info">
                      <div className="member-avatar initials">
                        {(member.name?.split(" ")[0]?.[0] || member.email?.[0] || "?").toUpperCase()}
                      </div>
                      <div className="member-details">
                        <h3 className="member-name">{member.name}</h3>
                        {member.balance !== 0 && (
                          <p className={`member-balance ${getBalanceColor(member)}`}>{getBalanceText(member)}</p>
                        )}
                      </div>
                    </div>

                    {/* Expenses for this member */}
                    {memberExpenses.length > 0 && (
                      <div className="member-expenses-list">
                        {memberExpenses.map((split) => (
                          <div key={split.expense_id} className="member-expense-detail">
                            <span>
                              <strong>{split.description}</strong> - ₹{split.amount_owed}
                            </span>
                            <span style={{ fontSize: "0.95em", color: "#64748b" }}>Paid by: {split.paid_by_name}</span>

                            {/* Show settled status or settle button */}
                            {split.settled ? (
                              <div className="settled-badge">
                                <CheckCircle className="check-icon" />
                                Settled
                              </div>
                            ) : (
                              // Show settle button ONLY if current user is the one who paid
                              split.paid_by == userId && (
                                <button
                                  className="settle-btn"
                                  onClick={() => {
                                    setSelectedSplit(split)
                                    setShowSettleModal(true)
                                  }}
                                >
                                  <DollarSign className="settle-icon" />
                                  Settle Up
                                </button>
                              )
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Balance actions */}
                    {member.balance !== 0 && member.name !== "You" && (
                      <button className="settle-btn" onClick={() => handleSettleMoney(member)}>
                        <DollarSign className="settle-icon" />
                        Settle Up
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete Group</h3>
            <p className="modal-text">Are you sure you want to delete "{group.name}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={confirmDelete}>
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettleModal && (selectedMember || selectedSplit) && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowSettleModal(false)
            setSelectedMember(null)
            setSelectedSplit(null)
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Settle Money</h3>
            <p className="modal-text">
              {selectedSplit ? (
                <>
                  Settle <strong>{selectedSplit.description}</strong> debt of ₹{selectedSplit.amount_owed}?
                  <br />
                  Member: {group.members.find((m) => m.id === selectedSplit.user_id)?.name}
                  
                </>
              ) : selectedMember ? (
                selectedMember.balance > 0 ? (
                  `${selectedMember.name} will pay you ₹${Math.abs(selectedMember.balance)}`
                ) : (
                  `You will pay ${selectedMember.name} ₹${Math.abs(selectedMember.balance)}`
                )
              ) : null}
            </p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowSettleModal(false)
                  setSelectedMember(null)
                  setSelectedSplit(null)
                }}
              >
                Cancel
              </button>
              <button
                className="confirm-settle-btn"
                onClick={async () => {
                  if (selectedSplit) {
                    await handleSettleMemberDebt(selectedSplit.expense_id, selectedSplit.user_id)
                    setSelectedSplit(null)
                  } else if (selectedMember) {
                    confirmSettle()
                  }
                  setShowSettleModal(false)
                }}
              >
                Mark as Settled
              </button>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Invite Member</h3>
            <p className="modal-text">Enter the email address of the person you want to invite to "{group.name}".</p>

            <div className="invite-input-wrapper">
              <Mail className="invite-input-icon" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="invite-input"
                placeholder="Enter email address"
                autoFocus
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowInviteModal(false)}>
                Cancel
              </button>
              <button className="confirm-invite-btn" onClick={confirmInvite} disabled={!inviteEmail.trim()}>
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupDetail
