"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Plus, DollarSign, Trash2, Users, CheckCircle, UserPlus, Mail } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "./navbar"
import axios from "axios"
import "./grpdetails.css"

function GroupDetail() {
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const { groupId } = useParams()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSettleModal, setShowSettleModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [expenses, setExpenses] = useState([])
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [memberSplits, setMemberSplits] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchGroupDetails() {
      try {
        const res = await fetch(`http://localhost:3000/api/group-details/${groupId}`)
        const data = await res.json()
        setGroup(data)
      } catch (err) {
        console.error("Error fetching group details:", err)
      }
    }
    if (groupId) fetchGroupDetails()
  }, [groupId])

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const res = await fetch(`http://localhost:3000/api/groups/${groupId}/expenses`)
        const data = await res.json()
        setExpenses(data)
      } catch (err) {
        console.error("Error fetching expenses:", err)
      }
    }
    if (groupId) fetchExpenses()
  }, [groupId])

  useEffect(() => {
    async function fetchMemberSplits() {
      const res = await fetch(`http://localhost:3000/api/groups/${groupId}/member-splits`);
      const data = await res.json();
      setMemberSplits(data);
    }
    if (groupId) fetchMemberSplits();
  }, [groupId]);

  const handleSettle = async (expenseId) => {
  try {
    await axios.post(`http://localhost:3000/api/expenses/${expenseId}/settle`, { userId });
    // Refresh expenses after settling
    const res = await fetch(`http://localhost:3000/api/groups/${groupId}/expenses`);
    const data = await res.json();
    setExpenses(data);

    // Refresh memberSplits after settling
    const splitsRes = await fetch(`http://localhost:3000/api/groups/${groupId}/member-splits`);
    const splitsData = await splitsRes.json();
    setMemberSplits(splitsData);
  } catch (err) {
    alert("Failed to settle expense");
  }
};

  if (!group) {
    return <div>Loading group details...</div>
  }

  const handleBack = () => {
    navigate("/yourgroups")
  }

  const handleAddExpense = () => {
    navigate("/addexpense")
  }

  const handleInviteMember = () => {
    setShowInviteModal(true)
  }

  const handleSettleMoney = (member) => {
    setSelectedMember(member)
    setShowSettleModal(true)
  }

  const handleDeleteGroup = async () => {
    setShowDeleteModal(true)
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

  const confirmSettle = () => {
    // Handle settle logic here
    console.log("Settling with:", selectedMember.name)
    setShowSettleModal(false)
    setSelectedMember(null)
  }

  const confirmInvite = async () => {
    try {
      await axios.post("http://localhost:3000/api/groups/invite", {
        groupId,
        email: inviteEmail,
      })
      console.log("Inviting:", inviteEmail)
      setShowInviteModal(false)
      setInviteEmail("")
      const res = await fetch(`http://localhost:3000/api/group-details/${groupId}`);
      const data = await res.json();
      setGroup(data);
    } catch (err) {
      console.error("Error inviting member:", err)
      alert("Failed to send invitation")
    }
  }

  const getBalanceText = (member) => {
    if (member.balance === 0) return "Settled up"
    if (member.balance > 0) return `is owed $${Math.abs(member.balance)}`
    return `owes $${Math.abs(member.balance)}`
  }

  const getBalanceColor = (member) => {
    if (member.balance === 0) return "settled"
    if (member.balance > 0) return "owed"
    return "owes"
  }

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
            <button className="delete-btn" onClick={handleDeleteGroup}>
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
              <button className="invite-btn" onClick={handleInviteMember}>
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
              {group.members.map((member, index) => (
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
                    <p className={`member-balance ${getBalanceColor(member)}`}>{getBalanceText(member)}</p>
                  </div>
                </div>

                {/* Expenses for this member */}
                <div className="member-expenses-list">
                  {memberSplits
                    .filter(split => split.user_id === member.id && parseFloat(split.amount_owed) > 0)
                    .map(split => (
                      <div key={split.expense_id} className="member-expense-detail">
                        <span>
                          <strong>{split.description}</strong> - ₹{split.amount_owed}
                        </span>
                        <span style={{ fontSize: "0.95em", color: "#64748b" }}>
                          Paid by: {split.paid_by_name}
                        </span>
                        {split.paid_by == userId && !split.settled && (
                          <button
                            className="settle-btn"
                            onClick={() => {
                              setSelectedExpense(expenses.find(e => e.id === split.expense_id));
                              setShowSettleModal(true);
                            }}
                          >
                            <DollarSign className="settle-icon" />
                            Settle Up
                          </button>
                        )}
                        {/* Optionally show settled badge if you want */}
                      </div>
                    ))}
                </div>
                {member.balance !== 0 && member.name !== "You" && (
                  <button className="settle-btn" onClick={() => handleSettleMoney(member)}>
                    <DollarSign className="settle-icon" />
                    Settle Up
                  </button>
                )}

                {member.balance === 0 && (
                  <div className="settled-badge">
                    <CheckCircle className="check-icon" />
                    Settled
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        </div>
      </main>


      {/* Delete Confirmation Modal */}
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

      {/* Settle Money Modal */}
      {showSettleModal && (selectedMember || selectedExpense) && (
  <div className="modal-overlay" onClick={() => {
    setShowSettleModal(false);
    setSelectedMember(null);
    setSelectedExpense(null);
  }}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3 className="modal-title">Settle Money</h3>
      <p className="modal-text">
        {selectedExpense ? (
          <>
            Settle <strong>{selectedExpense.description}</strong> of ₹{selectedExpense.amount}?<br />
            Paid by: {selectedExpense.paid_by_name}
          </>
        ) : selectedMember ? (
          selectedMember.balance > 0
            ? `${selectedMember.name} will pay you $${Math.abs(selectedMember.balance)}`
            : `You will pay ${selectedMember.name} $${Math.abs(selectedMember.balance)}`
        ) : null}
      </p>
      <div className="modal-actions">
        <button className="cancel-btn" onClick={() => {
          setShowSettleModal(false);
          setSelectedMember(null);
          setSelectedExpense(null);
        }}>
          Cancel
        </button>
        <button
          className="confirm-settle-btn"
          onClick={async () => {
            if (selectedExpense) {
              await handleSettle(selectedExpense.id);
              setSelectedExpense(null);
            } else if (selectedMember) {
              confirmSettle();
            }
            setShowSettleModal(false);
          }}
        >
          Mark as Settled
        </button>
      </div>
    </div>
  </div>
)}

      {/* Invite Member Modal */}
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
