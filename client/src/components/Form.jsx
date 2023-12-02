import { useState, useEffect } from "react";
import axios from "axios";

const CRUDComponent = () => {
  const formInitialState = {
    firstName: "",
    lastName: "",
    email: "",
  };
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alreadyFetched, setAlreadyFetched] = useState(false);
  const [formData, setFormData] = useState(formInitialState);

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const createUser = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/users",
        formData
      );
      console.log("User created successfully:", response.data);
      getUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
    setLoading(false);
  };

  const updateUser = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}`,
        formData
      );
      console.log("User updated successfully:", response.data);
      getUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
    setLoading(false);
  };

  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:3000/users/${userId}`
      );
      console.log("User deleted successfully:", response.data);
      getUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser();
  };

  useEffect(() => {
    let mounted = true;
    if (mounted && !alreadyFetched) {
      setAlreadyFetched(true);
      getUsers();
    }
    return () => {
      mounted = false;
    };
  }, [alreadyFetched]);

  return (
    <div>
      <h1>User List</h1>
      {users ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.firstName} {user.lastName} ({user.email})
              <button onClick={() => updateUser(user.id)}>Update</button>
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <p>Found no users.</p>
      )}
      <h1>Create User</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange(e)}
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange(e)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleInputChange(e)}
          />
        </label>
        <br />
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default CRUDComponent;
