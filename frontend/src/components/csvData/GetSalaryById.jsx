import React from "react";

export default function GetSalaryById({ avgSalById }) {
  return (
    <div className=" m-2 shadow-xl border border-cyan-800 p-6 rounded-lg flex justify-between">
      <div>
        <h2>
          <span className=" font-semibold">empId: </span> {avgSalById.empId}
        </h2>
        <h2>
          <span className=" font-semibold">avgSalary: ₹</span>
          {avgSalById.averageSalary}
        </h2>
      </div>
    </div>
  );
}
