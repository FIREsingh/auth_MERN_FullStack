import axios from "axios";
import React, { useEffect, useState } from "react";
import EmpData from "./EmpData";

export default function Dashboard() {
  const [active, setActive] = useState("upload");
  const [avgSalaryAllData, setAvgSalaryAllData] = useState(null);
  const [val, setVal] = useState("");
  const [avgSalById, setAvgSalaryById] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios
      .get("http://localhost:4000/api/v1/dashboard/averageSalaryAll")
      .then((res) => {
        const avgSalaryResults = res.data?.avgSalaryResults;
        setAvgSalaryAllData(avgSalaryResults);
      });
  };

  //====================== change Handler =================
  const changeHandler = (event) => {
    setVal(event.target.value);
  };

  //===================== getSalaryHandler ==================
  const getSalaryHandler = async () => {
    setActive("avgSalayById");
    console.log(val);
    const res = await axios
      .get(`http://localhost:4000/api/v1/dashboard/averageSalary/${val}`)
      .then((res) => {
        setAvgSalaryById(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //=================== getSalaryAllHandler ===================
  const getSalaryAllHandler = async () => {
    setActive("salaryAll");
  };
  //================= upload Handler =========================
  const uploadHandler = async () => {
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const response = await axios
        .post("http://localhost:4000/api/v1/dashboard/uploadCSV", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setActive("upload");
          console.log("useState set as uploadBTN");
          console.log("File uploaded successfully:", res.data);
          alert("File uploaded successfully.");
        })
        .catch((err) => {
          console.error("Error uploading file:", err);
          alert("An error occurred while uploading the file.");
        });
    } catch (error) {
      console.log("in catch Block");
    } finally {
      fetchData();
    }
  };

  return (
    <div className=" flex border border-gray-600 gap-10 p-10 rounded-lg">
      <div className=" flex flex-col gap-4 w-4/5 p-5 shadow-md ">
        <div className=" flex justify-center items-center">
          <input type="file" />

          <button onClick={uploadHandler} className=" w-2/5 ">
            Upload File
          </button>
        </div>
        <button onClick={getSalaryAllHandler}> Get Avg Salary (All)</button>
        <div>
          <input
            className=" h-10 rounded-lg p-4"
            type="text"
            placeholder="Enter user's EmpID"
            value={val}
            onChange={changeHandler}
          />
          <button onClick={getSalaryHandler}>Get Avg Salary</button>
        </div>
      </div>
      <div>
        <EmpData
          active={active}
          setActive={setActive}
          avgSalaryAllData={avgSalaryAllData}
          avgSalById={avgSalById}
        />
      </div>
    </div>
  );
}
