import { Users, Mail, Plus, Bell, User } from 'lucide-react'
import { useState } from 'react'
import Navbar from './navbar'
import './creategrp.css'

function creategroup() {
  const [formData, setFormData] = useState({
    groupName: '',
    inviteEmails: ['']
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEmailChange = (index, value) => {
    const newEmails = [...formData.inviteEmails]
    newEmails[index] = value
    setFormData(prev => ({
      ...prev,
      inviteEmails: newEmails
    }))
  }

  const addEmailField = () => {
    setFormData(prev => ({
      ...prev,
      inviteEmails: [...prev.inviteEmails, '']
    }))
  }

  const removeEmailField = (index) => {
    if (formData.inviteEmails.length > 1) {
      const newEmails = formData.inviteEmails.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        inviteEmails: newEmails
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Create group:', formData)
    // Handle group creation logic here
  }

  return (
    <div className="create-group-page">
        {/* Navbar Component */}
      <Navbar activeItem="create" />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <div className="create-group-card">
            <h1 className="page-title">Create a new group</h1>

            <form className="create-group-form" onSubmit={handleSubmit}>
              {/* Group Name */}
              <div className="form-group">
                <label htmlFor="groupName" className="form-label">Group name</label>
                <div className="input-wrapper">
                  <Users className="input-icon" />
                  <input
                    type="text"
                    id="groupName"
                    name="groupName"
                    value={formData.groupName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. Weekend Trip"
                    required
                  />
                </div>
              </div>

              {/* Invite by Email */}
              <div className="form-group">
                <label className="form-label">Invite by email</label>
                {formData.inviteEmails.map((email, index) => (
                  <div key={index} className="email-input-row">
                    <div className="input-wrapper">
                      <Mail className="input-icon" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        className="form-input"
                        placeholder="Enter email address"
                      />
                    </div>
                    {formData.inviteEmails.length > 1 && (
                      <button
                        type="button"
                        className="remove-email-btn"
                        onClick={() => removeEmailField(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  className="add-email-btn"
                  onClick={addEmailField}
                >
                  <Plus className="plus-icon" />
                  Add another email
                </button>
              </div>

              {/* Create Group Button */}
              <button type="submit" className="create-group-btn">
                Create group
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default creategroup;