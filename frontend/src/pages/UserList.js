// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function UserList() {
//   const [users, setUsers] = useState([]);
//   const navigate = useNavigate();

//   const currentUser = JSON.parse(localStorage.getItem("user"));
//   const myId = currentUser?._id || currentUser?.id;

//   useEffect(() => {
//     axios
//       .get(`/api/users?exclude=${myId}`)
//       .then(res => setUsers(res.data))
//       .catch(err => console.log(err));
//   }, [myId]);

//   return (
//     <div>
//       <h2>Select a user to chat</h2>

//       {users.map(user => (
//         <div
//           key={user._id}
//           style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ccc" }}
//           onClick={() => navigate(`/chat/${user._id}`)}
//         >
//           {user.username}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default UserList;
