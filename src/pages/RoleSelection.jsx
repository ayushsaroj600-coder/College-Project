
import "./RoleSelection.css";

function RoleSelection({ onSelect }) {
  const roles = [
    {
      title: "Farmer",
      description: "Sell crops and check mandi prices.",
      icon: "🌾",
    },
    {
      title: "Buyer",
      description: "Explore crops and connect with farmers.",
      icon: "🛒",
    },
    {
      title: "Admin",
      description: "Manage users and platform activities.",
      icon: "👨‍💻",
    },
  ];

  return (
    <div className="role-container">
      <h1>Welcome to FasalMitra 🌱</h1>
      <p>Select your role to continue</p>

      <div className="role-cards">
        {roles.map((role) => (
          <div className="role-card" key={role.title}>
            <h2>{role.icon}</h2>
            <h3>{role.title}</h3>
            <p>{role.description}</p>

            <button
              onClick={() =>
                onSelect(role.title.toLocaleLowerCase())
              }
            >
              Continue as {role.title}
            </button>


            {/* <button
              onClick={() => onSelect(role.title.toLowerCase())}
            >
              Continue as {role.title}
            </button> */}


          </div>
        ))}
      </div>
    </div>
  );
}

export default RoleSelection;
