import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./dashboard.css"  // <-- Import the CSS file

function Dashboard() {
  // State variables to store user inputs and logs
  const [painLevel, setPainLevel] = useState(0)
  const [cycleDay, setCycleDay] = useState(0)
  const [medicationTaken, setMedicationTaken] = useState("")
  const [notes, setNotes] = useState("")
  const [stressLevel, setStressLevel] = useState(0)
  const [diet, setDiet] = useState("")

  // State variables for logs and analysis data
  const [logs, setLogs] = useState([])
  const [analysis, setAnalysis] = useState({})

  const navigate = useNavigate()

  // Fetch logs and analysis data when the component mounts
  useEffect(() => {
    fetchLogs()
    fetchAnalysis()
  }, [])

  // Function to fetch symptom logs from the API
  const fetchLogs = async () => {
    try {
      const { data } = await API.get("/symptoms")
      setLogs(data)
    } catch (error) {
      console.error(error.response?.data || error.message)
    }
  }

  // Function to fetch analysis data from the API
  const fetchAnalysis = async () => {
    try {
      const { data } = await API.get("/symptoms/analysis")
      setAnalysis(data)
    } catch (error) {
      console.error(error.response?.data || error.message)
    }
  }

  // Function to handle form submission for logging symptoms
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        painLevel: Number(painLevel),
        cycleDay: Number(cycleDay),
        medicationTaken,
        notes,
        lifestyleFactors: {
          diet,
          stressLevel: Number(stressLevel),
        }
      }
      await API.post("/symptoms", payload)
      
      // Reset input fields after submission
      setPainLevel(0)
      setCycleDay(0)
      setMedicationTaken("")
      setNotes("")
      setDiet("")
      setStressLevel(0)

      // Refresh logs and analysis after submission
      fetchLogs()
      fetchAnalysis()
    } catch (error) {
      console.error(error.response?.data || error.message)
    }
  }

  
  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div className="dashboard-container">
      {/* Header section with navigation buttons */}
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="button-group">
          <button onClick={() => navigate("/forum")}>Go to Forum</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

       {/* Symptom Logging Form */}
      <form className="symptom-form" onSubmit={handleSubmit}>
        <div>
          <label>Pain Level (1-10):</label>
          <input
            type="number"
            value={painLevel}
            onChange={(e) => setPainLevel(e.target.value)}
            min="0"
            max="10"
            required
          />
        </div>
        <div>
          <label>Cycle Day:</label>
          <input
            type="number"
            value={cycleDay}
            onChange={(e) => setCycleDay(e.target.value)}
          />
        </div>
        <div>
          <label>Medication:</label>
          <input
            type="text"
            value={medicationTaken}
            onChange={(e) => setMedicationTaken(e.target.value)}
          />
        </div>
        <div>
          <label>Stress Level (1-10):</label>
          <input
            type="number"
            value={stressLevel}
            onChange={(e) => setStressLevel(e.target.value)}
            min="0"
            max="10"
          />
        </div>
        <div>
          <label>Diet Description:</label>
          <input
            type="text"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
          />
        </div>
        <div>
          <label>Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit">Add Log</button>
      </form>

      <hr />
      
      {/* Section to display logged symptoms */}
      <div className="logs-section">
        <h3>Your Symptom Logs</h3>
        {logs.map(log => (
          <div key={log._id} className="log-item">
            <p>Pain: {log.painLevel}, Cycle Day: {log.cycleDay}</p>
            <p>Medication: {log.medicationTaken}, Stress: {log.lifestyleFactors?.stressLevel}</p>
            <p>Diet: {log.lifestyleFactors?.diet}</p>
            <p>Notes: {log.notes}</p>
            <p>Created At: {new Date(log.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Analysis Section */}
      <div className="analysis-section">
        <h3>Analysis</h3>
        {analysis?.overallAveragePain ? (
          <div>
            <p>Overall Average Pain: {analysis.overallAveragePain}</p>
            <p>Pain by Stress Level: {JSON.stringify(analysis.painByStressLevel)}</p>
            <p>Pain by Diet: {JSON.stringify(analysis.painByDietType)}</p>
          </div>
        ) : (
          <p>No analysis data yet.</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
