import { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editedName, setEditedName] = useState('');

  const apiUrl = 'https://randomuser.me/api/?seed=dexi-interview';
  let page = 1;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${apiUrl}&page=${page}`)
      .then(response => response.json())
      .then(data => {
        setUsers([...users, ...data.results]);
        setLoading(false);
        page++;
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditedName(`${user.name.first} ${user.name.last}`);
  };

  const handleConfirmEdit = () => {
    // Here you can update the user's name with the editedName
    // For simplicity, let's just log the edited name for now
    console.log("Edited Name:", editedName);
    const updatedUsers = users.map(u => {
      if (u === editUser) {
        const [firstName, lastName] = editedName.split(' ');
        return { ...u, name: { first: firstName, last: lastName } };
      }
      return u;
    });
    setUsers(updatedUsers);
    setEditUser(null);
  };

  return (
    <>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">NAME</th>
            <th scope="col">TITLE</th>
            <th scope="col">STATUS</th>
            <th scope="col">ROLE</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>
                <img src={user.picture.thumbnail} alt="User Thumbnail" className="user-thumbnail" />
                <span>{user.name.first} {user.name.last}</span><br />
                <span>{user.email}</span>
              </td>
              <td>Lead Implementation Liaison</td>
              <td style={{ backgroundColor: 'mintcream' }}>Active</td>
              <td>Admin</td>
              <td>
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => handleEdit(user)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && <p>Loading...</p>}

      {/* Edit Modal */}
      <div className={`modal fade ${editUser ? 'show' : ''}`} id="staticBackdrop" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden={!editUser}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">Edit User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setEditUser(null)}></button>
            </div>
            <div className="modal-body">
              <div className="input-group mb-3">
                <span className="input-group-text">Name</span>
                <input type="text" className="form-control" placeholder="Enter name" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setEditUser(null)}>Close</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleConfirmEdit}>Save changes</button>
            </div>
          </div>
        </div>
      </div>

      {/* Load More Button */}
      <button className="btn btn-info" onClick={fetchUsers}>Load More</button>
    </>
  );
}

export default App;
