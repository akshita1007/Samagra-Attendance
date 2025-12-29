import * as XLSX from "xlsx";

const ExcelReportGenerator = ({ title, data }) => {
  const rows = data.map(item => ({
    Date: item.date,
    Present: item.present,
    Absent: item.absent,
    "On Leave": item.leave,
    "On Duty": item.onduty,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
  XLSX.writeFile(workbook, `${title.replace(/\s/g, "_")}.xlsx`);
};

export default ExcelReportGenerator;
