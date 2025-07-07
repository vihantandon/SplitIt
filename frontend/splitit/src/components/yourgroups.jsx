import { Users, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "./navbar"
import "./yourgroups.css"

function YourGroups() {
  const navigate = useNavigate()

  // Sample groups data
  const groups = [
    {
      id: 1,
      name: "Weekend Trip",
      status: "You lent $20 to Alex",
      type: "lent",
      amount: 20,
    },
    {
      id: 2,
      name: "Dinner Party",
      status: "You owe $15 to Sarah",
      type: "owe",
      amount: 15,
    },
    {
      id: 3,
      name: "Movie Night",
      status: "You are owed $5 by Chris",
      type: "owed",
      amount: 5,
    },
    {
      id: 4,
      name: "Vacation",
      status: "You owe $40 to Emily",
      type: "owe",
      amount: 40,
    },
  ]

  const handleNewGroup = () => {
    navigate("/creategrp")
  }

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`)
  }

  return (
    <div className="your-groups-page">
      <Navbar activeItem="groups" />

      <main className="main-content">
        <div className="content-container">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">Your Groups</h1>
            <button className="new-group-btn" onClick={handleNewGroup}>
              <Plus className="plus-icon" />
              New group
            </button>
          </div>

          {/* Groups List */}
          <div className="groups-container">
            {groups.length === 0 ? (
              <div className="empty-state">
                <Users className="empty-icon" />
                <h3 className="empty-title">No groups yet</h3>
                <p className="empty-description">Create your first group to start splitting expenses with friends.</p>
                <button className="create-first-group-btn" onClick={handleNewGroup}>
                  Create your first group
                </button>
              </div>
            ) : (
              <div className="groups-list">
                {groups.map((group) => (
                  <div key={group.id} className="group-card" onClick={() => handleGroupClick(group.id)}>
                    <div className="group-icon">
                      <Users className="users-icon" />
                    </div>
                    <div className="group-info">
                      <h3 className="group-name">{group.name}</h3>
                      <p className={`group-status ${group.type}`}>{group.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default YourGroups
