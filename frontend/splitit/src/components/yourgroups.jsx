import { useEffect, useState } from "react"
import { Users, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "./navbar"
import "./yourgroups.css"

function YourGroups() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState([]) // Ensure groups is initialized as an array

  const userId = localStorage.getItem("userId")

  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await fetch(`http://localhost:3000/api/user-groups/${userId}`)
        const data = await res.json()

        // Ensure data is an array before setting
        if (Array.isArray(data)) {
          setGroups(data)
        } else {
          console.warn("Unexpected response format:", data)
          setGroups([]) // fallback
        }
      } catch (error) {
        console.error("Error fetching groups:", error)
        setGroups([]) // fallback on error
      }
    }

    if (userId) {
      fetchGroups()
    }
  }, [userId])

  const handleNewGroup = () => {
    navigate("/creategrp")
  }

  const handleGroupClick = (groupId) => {
    navigate(`/grpdetails/${groupId}`);
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
                <p className="empty-description">
                  Create your first group to start splitting expenses with friends.
                </p>
                <button className="create-first-group-btn" onClick={handleNewGroup}>
                  Create your first group
                </button>
              </div>
            ) : (
              <div className="groups-list">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="group-card"
                    onClick={() => handleGroupClick(group.id)}
                  >
                    <div className="group-icon">
                      <Users className="users-icon" />
                    </div>
                    <div className="group-info">
                      <h3 className="group-name">{group.name}</h3>
                      <p className="group-status">Click to view details</p>
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
