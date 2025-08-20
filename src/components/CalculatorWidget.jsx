// components/CalculatorWidget.jsx
import { useState } from "react";

function CalculatorWidget() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const calculate = () => {
    try {
      // ⚠️ Using eval for simplicity — in production replace with a safe parser
      setResult(eval(input).toString());
    } catch {
      setResult("Error");
    }
  };

  const clear = () => {
    setInput("");
    setResult("");
  };

  return (
    <div className="p-4 shadow rounded bg-white dark:bg-gray-800">
      <div className="mb-2 text-lg font-bold">🧮 Calculator</div>
      <div className="mb-2 p-2 border rounded bg-gray-100 dark:bg-gray-700">
        {input || "0"}
      </div>
      <div className="mb-2 text-green-500 font-semibold">{result}</div>

      <div className="grid grid-cols-4 gap-2">
        {[7,8,9,"/",4,5,6,"*",1,2,3,"-",0,".","=","+"].map((val) => (
          <button
            key={val}
            onClick={() => (val === "=" ? calculate() : handleClick(val))}
            className="p-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            {val}
          </button>
        ))}
        <button
          onClick={clear}
          className="col-span-4 p-2 bg-red-400 text-white rounded hover:bg-red-500"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default CalculatorWidget;
