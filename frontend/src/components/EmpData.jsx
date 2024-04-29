import React from "react";
import Upload from "./csvData/Upload";
import GetSalaryAll from "./csvData/GetSalaryAll";
import GetSalaryById from "./csvData/GetSalaryById";

export default function empData({
  active,
  setActive,
  avgSalaryAllData,
  avgSalById,
}) {
  return (
    <div className=" p-2">
      {active === "upload" && <Upload />}
      {active === "salaryAll" && (
        <GetSalaryAll avgSalaryAllData={avgSalaryAllData} />
      )}
      {active === "avgSalayById" && <GetSalaryById avgSalById={avgSalById} />}
    </div>
  );
}
