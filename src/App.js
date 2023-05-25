import { useState } from "react";
import "./App.css";
import JsonToExcel from "./JsonToExcel";
import { v4 as uuid } from "uuid";

function App() {
  const [task, setTask] = useState({
    taskId: "",
    taskList: "",
    title: "",
    description: "",
  });

  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Edit existing task
      setTasks((prevTasks) =>
        prevTasks.map((item, index) =>
          index === editingTaskIndex ? task : item
        )
      );
      setIsEditing(false);
      setEditingTaskIndex(null);
    } else {
      // Add new task
      const newTask = {
        ...task,
        taskId: uuid(),
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }

    // Reset task form
    setTask({
      taskId: "",
      taskList: "",
      title: "",
      description: "",
    });
  };

  const handleEdit = (index) => {
    const editingTask = tasks[index];
    // Set the task data for editing
    setTask({
      taskId: editingTask.taskId,
      taskList: editingTask.taskList,
      title: editingTask.title,
      description: editingTask.description,
    });
    setIsEditing(true);
    setEditingTaskIndex(index);
  };

  const handleDelete = (taskId) => {
    // Delete task based on taskId
    setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
  };

  const handleChangeTaskList = (taskId) => {
    const newTaskList = prompt("Enter the new taskList:");
    if (newTaskList !== null) {
      // Change the taskList of the task
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.taskId === taskId ? { ...task, taskList: newTaskList } : task
        )
      );
    }
  };

  const groupTasksByTaskList = () => {
    return tasks.reduce((groupedTasks, task) => {
      const { taskList } = task;
      groupedTasks[taskList] = groupedTasks[taskList] || [];
      groupedTasks[taskList].push({ ...task });
      return groupedTasks;
    }, {});
  };

  const groupedTasks = groupTasksByTaskList();

  return (
    <div className="app">
      <h1>TASK MANAGEMENT APP</h1>
      <form onSubmit={handleSubmit}>
        {/* Task form */}
        <input
          value={task.taskList}
          name="taskList"
          placeholder="TaskList"
          type="text"
          onChange={handleChange}
        />
        <br />
        <br />
        <input
          value={task.title}
          name="title"
          placeholder="Title"
          type="text"
          onChange={handleChange}
        />
        <br />
        <br />
        <input
          value={task.description}
          name="description"
          placeholder="Description"
          type="text"
          onChange={handleChange}
        />
        <br />
        <br />
        <button type="submit">Submit</button>
        <br />
        <br />
      </form>

      {Object.entries(groupedTasks).map(([taskList, tasks]) => (
        <div key={taskList}>
          {/* Display task list */}
          <h1>{taskList}</h1>
          <h1>JSON to Excel Export</h1>
          <JsonToExcel jsonData={tasks} />
          <ul>
            {tasks.map((task, index) => (
              <li key={task.taskId}>
                {/* Display individual task */}
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(task.taskId)}>
                  Delete
                </button>
                <button onClick={() => handleChangeTaskList(task.taskId)}>
                  Change TaskList
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
