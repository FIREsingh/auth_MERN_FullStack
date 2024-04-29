import React from "react";
import Card from "./Card";

export default function GetSalaryAll({ avgSalaryAllData }) {
  return (
    <div>
      {avgSalaryAllData.map((item, index) => {
        console.log("print it");
        console.log(item);
        return <Card key={index} item={item} />;
      })}
    </div>
  );
}
