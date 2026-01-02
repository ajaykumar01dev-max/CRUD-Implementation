import { useEffect, useState } from "react";
import "./App.css";
import { Toaster, toast } from "react-hot-toast";

function App() {
  /* ------------------ STATE ------------------ */
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  /* ------------------ API CALLS ------------------ */

  // GET
  const getData = async () => {
    try {
      const res = await fetch("http://localhost:8080/user", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    }
  };

  // POST
  const sendData = async () => {
    try {
      const res = await fetch("http://localhost:8080/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUsers(prev => [...prev, data]);
      toast.success("User added successfully");
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to add user");
    }
  };

  // PUT
  const saveChanges = async (selectedUser) => {
    try {
      const res = await fetch(`http://localhost:8080/user?userID=${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (!data) {
        toast.error("Update failed: no data received");
        return;
      }

      setUsers(prev =>
        prev.map(user =>
          user.id === selectedUser.id
            ?  { ...user, ...(data || {}) }
            : user
        )
      );


      toast.success("User updated successfully");
      setEditId(null);
    } catch (err) {
      toast.error(`${err.message} || Update failed`);
    }
  };

  // DELETE
  const deleteClicked = async (user) => {
    try {
      const res = await fetch(`http://localhost:8080/user?userID=${user.id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Delete failed");

      setUsers(prev => prev.filter(u => u.id !== user.id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ------------------ EFFECT ------------------ */
  useEffect(() => {
    getData();
  }, []);

  /* ------------------ HANDLERS ------------------ */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("All fields are required");
      return;
    }
    sendData();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const updateClicked = (user) => {
    setEditId(user.id);
    setEditedData({
      name: user.name,
      email: user.email,
      phone: user.phone
    });
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "" });
  };

  /* ------------------ UI ------------------ */

  return (
    <>
      <main className="hero">
        <div className="heroContent">
          <header className="heroHeader">
            <h1>CRUD Operations</h1>
          </header>

          <div className="container">
            {/* FORM */}
            <div className="entryForm">
              <h2>Entry Data</h2>
              <form className="form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="phone"
                  placeholder="Enter phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <button type="submit">Submit</button>
              </form>
            </div>

            {/* DATA VIEW */}
            <div className="dataView">
              {users.length === 0 ? (
                <div className="noData">No data to display</div>
              ) : (
                users.map(user => (
                  <div className="itemView" key={user.id}>
                    {editId === user.id ? (
                      <>
                        <input
                          name="name"
                          value={editedData.name}
                          onChange={handleNewChange}
                        />
                        <input
                          name="email"
                          value={editedData.email}
                          onChange={handleNewChange}
                        />
                        <input
                          name="phone"
                          value={editedData.phone}
                          onChange={handleNewChange}
                        />
                      </>
                    ) : (
                      <>
                        <h2 className="userName">{user.name}</h2>
                        <p className="userEmail">{user.email}</p>
                        <p className="userPhone">{user.phone}</p>
                      </>
                    )}

                    <div className="actionButtons">
                      {editId === user.id ? (
                        <button
                          className="saveBtn"
                          onClick={() => saveChanges(user)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="editBtn"
                          onClick={() => updateClicked(user)}
                        >
                          Update
                        </button>
                      )}

                      <button
                        className="deleteBtn"
                        onClick={() => deleteClicked(user)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Toaster position="top-center" />
    </>
  );
}

export default App;
