import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [error, setError] = useState("");

  const apiURL = import.meta.env.VITE_API_URL;

  // Ein Fetch-Funktion
  const fetchAPI = async (fetchURL) => {
    try {
      const response = await axios.get(fetchURL);
      console.log(response.data);
      setTasks(response.data);
      toast.success("Todos erfolgreich geladen💪");
    } catch (error) {
      console.log(error.message);
    }
  };

  // mit useEffect durchführen
  useEffect(() => {
    fetchAPI(apiURL);
  }, []);

  const createTask = async (event) => {
    event.preventDefault();
    if (!newTaskText.trim()) {
      setError("Task text cannot be empty.");
      return;
    }

    console.log("newTaskText", newTaskText);
    // Post request an die API (Server)
    try {
      await axios.post(apiURL, {
        todo: newTaskText,
      });
      toast.info("Todo erfolgreich hinzugefügt 💪");
      fetchAPI(apiURL);
    } catch (error) {
      console.log("Failed to create task. Please try again.");
    }

    setNewTaskText("");
  };

  // Delete Task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiURL}/${id}`);
      fetchAPI(apiURL);
      toast.error("Todo erfolgreich gelöscht 💪");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <h1>Tasks To Add</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <form onSubmit={createTask}>
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => {
              setNewTaskText(e.target.value);
            }}
          />
          <button type="submit">Add Task</button>
        </form>
        {/* Render tasks here */}
      </div>
      <ul>
        {/* Tasks hier zeigen nür wenn Tasks gibt sonst zeige "Du hast noch kein Task hinzugefügt" */}
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task._id}>
              <span>{task.todo}</span>
              <button
                className="delete-button"
                onClick={() => {
                  handleDelete(task._id);
                }}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <li>Du hast noch kein Task hinzugefügt</li>
        )}
      </ul>
    </>
  );
};

export default App;
