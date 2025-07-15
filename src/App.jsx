import { useState, useRef, useEffect } from "react";
import logo from "./assets/clipart2449171.png";
import "./App.css";

function App() {
  const [items, setItems] = useState(() => {
    const storedItems = localStorage.getItem("items");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  function handleAddTasks(task) {
    setItems((tasks) => [...tasks, task]);
  }

  function handleToggle(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, phase: !item.phase } : item
      )
    );
  }

  function handleDelete(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isDeleting: true } : item
      )
    );

    setTimeout(() => {
      setItems((items) => items.filter((item) => item.id !== id));
    }, 500); // Match CSS animation duration
  }

  return (
    <>
      <Navbar />
      <AddItem onHandleAddTasks={handleAddTasks} />
      <ItemCollection
        items={items}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
      <Footer items={items} />
    </>
  );
}

function Navbar() {
  return (
    <nav className="w-screen h-20 bg-color2 text-color5 flex items-center px-4 sm:px-20">
      <img src={logo} alt="logo" className="h-12 w-12" />
      <h1 className="ml-5 text-2xl sm:text-3xl">Task Tracker</h1>
    </nav>
  );
}

function AddItem({ onHandleAddTasks }) {
  const [taskName, setTaskName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function generateUniqueKey() {
    return (
      Math.random().toString(36).substring(2, 10) +
      Math.random().toString(36).substring(2, 6)
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!taskName) {
      alert("Please enter some task");
      return;
    }

    const newTask = {
      id: generateUniqueKey(),
      name: taskName,
      phase: false,
      isDeleting: false,
    };

    onHandleAddTasks(newTask);
    setTaskName("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-color5 backdrop-blur-[2px] w-screen flex flex-col sm:flex-row items-center gap-2 px-4 py-3 sm:py-0 sm:h-[4rem]"
    >
      <label className="text-base sm:text-lg text-color1 font-semibold">
        Write your tasks
      </label>
      <input
        ref={inputRef}
        placeholder="Add task"
        value={taskName}
        className="h-10 w-full sm:w-[20rem] bg-white shadow-xl rounded-lg p-4 outline-none"
        onChange={(e) => setTaskName(e.target.value)}
      />
      <button
        type="submit"
        className="border rounded bg-color2 text-color5 h-10 w-full sm:w-[5rem]"
      >
        Add
      </button>
    </form>
  );
}

function ItemCollection({ items, onToggle, onDelete }) {
  const bottomRef = useRef(null);
  const prevItemCount = useRef(items.length);

  useEffect(() => {
    const wasItemAdded = items.length > prevItemCount.current;
    if (wasItemAdded) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevItemCount.current = items.length;
  }, [items]);

  return (
    <div className="bg-color5 h-[67vh] overflow-hidden">
      <ul className="flex flex-col items-center h-full overflow-y-auto px-4">
        {items.map((task) => (
          <Item
            task={task}
            key={task.id}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
        <div ref={bottomRef} />
      </ul>
    </div>
  );
}

function Item({ task, onToggle, onDelete }) {
  return (
    <div
      className={`flex items-center justify-center transition-all duration-500 ${
        task.isDeleting ? "fall-out" : ""
      }`}
    >
      <li className="flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-lg p-5 cursor-pointer bg-white h-20 w-[70vw] sm:w-[70vw] mt-6">
        <span
          className="text-base sm:text-lg text-color1"
          style={task.phase ? { textDecoration: "line-through" } : {}}
        >
          {task.name}
        </span>
      </li>
      <button
        onClick={() => onToggle(task.id)}
        className="ml-2 sm:ml-5 text-color5 bg-color1 h-10 w-10 border rounded-full"
      >
        {task.phase ? "↶" : "✔"}
      </button>
      <button
        className="ml-2 sm:ml-5 bg-color1 h-10 w-10 border rounded-full"
        onClick={() => onDelete(task.id)}
      >
        ❌
      </button>
    </div>
  );
}

function Footer({ items }) {
  if (!items.length) {
    return (
      <footer className="w-screen h-[10vh] bg-color2 flex items-center justify-center text-color5 text-base sm:text-xl px-4 text-center fixed">
        <p>Please add some tasks to the task tracker.</p>
      </footer>
    );
  }

  const numTasks = items.length;
  const doneTasks = items.filter((item) => item.phase === true).length;
  const remTasks = numTasks - doneTasks;

  return (
    <footer className="w-screen h-[10vh] bg-color2 flex items-center justify-center text-color5 text-base sm:text-xl px-4 text-center fixed">
      <p>
        You have completed {doneTasks} task{doneTasks !== 1 ? "s" : ""}.{" "}
        {remTasks} remaining.
      </p>
    </footer>
  );
}

export default App;
