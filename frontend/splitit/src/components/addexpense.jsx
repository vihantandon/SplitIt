import { DollarSign, FileText, Users, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import Navbar from './navbar'
import './addexpense.css'

function addexpense() {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    group: '',
    splitType: 'percentage'
  })

  const [members, setMembers] = useState([
    { id: 1, name: 'Sophia', percentage: 33 },
    { id: 2, name: 'Ethan', percentage: 33 },
    { id: 3, name: 'Olivia', percentage: 34 }
  ])

  const groups = [
    { id: 1, name: 'Weekend Trip' },
    { id: 2, name: 'Roommates' },
    { id: 3, name: 'Dinner Party' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePercentageChange = (memberId, newPercentage) => {
    const percentage = Math.max(0, Math.min(100, parseInt(newPercentage) || 0))
    setMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { ...member, percentage }
          : member
      )
    )
  }

  const adjustPercentage = (memberId, increment) => {
    setMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { ...member, percentage: Math.max(0, Math.min(100, member.percentage + increment)) }
          : member
      )
    )
  }

  const getTotalPercentage = () => {
    return members.reduce((total, member) => total + member.percentage, 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const totalPercentage = getTotalPercentage()
    
    if (totalPercentage !== 100) {
      alert(`Total percentage must equal 100%. Current total: ${totalPercentage}%`)
      return
    }

    console.log('Add expense:', { ...formData, members })
    // Handle expense creation logic here
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

            <form className="add-expense-form" onSubmit={handleSubmit}>
              {/* Description */}
              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
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
                <label htmlFor="amount" className="form-label">Amount</label>
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
                <label htmlFor="group" className="form-label">Group</label>
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
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Split */}
              <div className="form-group">
                <label className="form-label">Split</label>
                <div className="split-type-container">
                  <div className="split-type-option">
                    <input
                      type="radio"
                      id="percentage"
                      name="splitType"
                      value="percentage"
                      checked={formData.splitType === 'percentage'}
                      onChange={handleInputChange}
                      className="radio-input"
                    />
                    <label htmlFor="percentage" className="radio-label">
                      Split by percentage
                    </label>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div className="form-group">
                <label className="form-label">
                  Members 
                  <span className={`total-percentage ${getTotalPercentage() === 100 ? 'valid' : 'invalid'}`}>
                    (Total: {getTotalPercentage()}%)
                  </span>
                </label>
                <div className="members-container">
                  {members.map(member => (
                    <div key={member.id} className="member-row">
                      <div className="member-info">
                        <span className="member-name">{member.name}</span>
                        <span className="member-label">Percentage</span>
                      </div>
                      <div className="percentage-controls">
                        <button
                          type="button"
                          className="percentage-btn minus"
                          onClick={() => adjustPercentage(member.id, -1)}
                        >
                          <Minus className="btn-icon" />
                        </button>
                        <input
                          type="number"
                          value={member.percentage}
                          onChange={(e) => handlePercentageChange(member.id, e.target.value)}
                          className="percentage-input"
                          min="0"
                          max="100"
                        />
                        <button
                          type="button"
                          className="percentage-btn plus"
                          onClick={() => adjustPercentage(member.id, 1)}
                        >
                          <Plus className="btn-icon" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Expense Button */}
              <button type="submit" className="save-expense-btn">
                Save Expense
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default addexpense;