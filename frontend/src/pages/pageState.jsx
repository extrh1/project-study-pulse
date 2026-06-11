const PageState = ({ darkMode }) => {
  const rowStyle = {
    background: darkMode ? "#0f172a" : "#f1f5f9",
    color: darkMode ? "white" : "#0f172a",
    padding: "15px 20px",
    borderRadius: "8px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
  };

  const data = [
    { course: "Math", status: "In Progress", quiz: "Passed" },
    { course: "Physics", status: "Completed", quiz: "Passed" },
    { course: "Biology", status: "In Progress", quiz: "Not Attempted" },
  ];

  return (
    <div style={{
        minHeight: "calc(100vh - 64px)",
        padding: "40px 20px",
        color: darkMode ? "#f8fafc" : "#0f172a",
        background: darkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        marginTop: "64px",
      }}>
      <h2 style={{ marginBottom: "20px", color: darkMode ? "white" : "#0f172a" }}>User State Details</h2>
      {data.map((item, index) => (
        <div key={index} style={rowStyle}>
          <span>{item.course}</span>
          <span>{item.status}</span>
          <span>{item.quiz}</span>
        </div>
      ))}
    </div>
  );
};

export default PageState;