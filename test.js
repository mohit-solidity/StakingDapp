body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

#container {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

button, input {
  padding: 10px 20px;
  margin: 10px 0;
  width: 200px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
}

button {
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  background-color: #45a049;
}

.input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin: 10px 0;
}

.input-group input {
  width: 120px;
}

#balance {
  margin-top: 20px;
  font-weight: bold;
  color: #444;
}
