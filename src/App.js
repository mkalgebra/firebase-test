import "./App.css";
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState({
    away_name: "",
    home_name: "",
    home_points: 1,
    away_points: 0,
  });

  const app = initializeApp(process.env.REACT_APP_FIREBASECONFIG);

  const db = getFirestore(app);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rez"));

        const newData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [db]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({
      ...prevData,
      [name]:
        name === "home_points" || name === "away_points"
          ? parseInt(value, 10)
          : value,
    }));
  };

  const handleAddData = async () => {
    try {
      await addDoc(collection(db, "rez"), newData);

      setNewData({
        away_name: "",
        home_name: "",
        home_points: 0,
        away_points: 0,
      });
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  return (
    <div className="App">
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.id}</li>
        ))}
      </ul>

      <form>
        <label>
          First Name:
          <input
            type="text"
            name="home_name"
            value={newData.home_name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="away_name"
            value={newData.away_name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Age:
          <input
            type="number"
            name="home_points"
            value={newData.home_points}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Score:
          <input
            type="number"
            name="away_points"
            value={newData.away_points}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="button" onClick={handleAddData}>
          Add Data
        </button>
      </form>
    </div>
  );
}

export default App;
