import './App.css';
import {useState} from "react";

function App() {
  let [count, setCount] = useState(0);
  const clickOnMe = () => {
    setCount(count+1);
  }
  return(<>
    <button onClick={clickOnMe}>Click me</button>
    <span data-testid="count">{count}</span>
  </>)
}

export default App;
