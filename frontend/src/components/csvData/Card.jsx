import React from "react";

export default function Card({ item }) {
  return (
    <div className=" m-2 shadow-xl border border-cyan-800 p-6 rounded-lg flex justify-between">
      <div className=" p-1  flex justify-center items-center ">
        <h2> {item.name}</h2>
      </div>
      <div>
        <h2>
          <span className=" font-semibold">empId: </span> {item.empId}
        </h2>
        <h2>
          <span className=" font-semibold">avgSalary: ₹</span>
          {item.averageSalary}
        </h2>
      </div>
    </div>
  );
}
