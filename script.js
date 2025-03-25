import { studentsData } from './data.js';
const attendanceBody = document.getElementById('attendance-body');
const dateInput = document.getElementById('attendance-date');
const lecStartTime = document.getElementById('lecture-start-time');
const lecEndTime = document.getElementById('lecture-start-time');


// Set default date and time
dateInput.value = new Date().toISOString().split('T')[0];
lecStartTime.value = new Date().toISOString().split('T')[1].split('.')[0].slice(0, 5);
lecEndTime.value = new Date().toISOString().split('T')[1].split('.')[0].slice(0, 5);

function updateStudentTable() {
    const Course = document.getElementById("Course").value;
    const Section = document.getElementById("Section").value;

    // Clear previous data
    attendanceBody.innerHTML = "";

    // Get students data safely
    const students = studentsData[Course]?.[Section] || [];

    // Populate student table
    students.forEach((student) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.rollNumber}</td>
            <td><input type="checkbox" class="attendance-checkbox" data-rollnumber="${student.rollNumber}"></td>
        `;
        attendanceBody.appendChild(row);
    });
}

// Add event listeners for dropdowns
document.getElementById("Course").addEventListener("change", updateStudentTable);
document.getElementById("Section").addEventListener("change", updateStudentTable);

// Load default data on page load

updateStudentTable();

// Prevent form reload on submit

document.getElementById('Reset').addEventListener('click', () => {
    location.reload();
});


function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get user inputs
    const lecture = document.getElementById("lecture-name").value;
    const course = document.getElementById("Course").value;
    const section = document.getElementById("Section").value;
    const date = document.getElementById("attendance-date").value;
    const startTime = document.getElementById("lecture-start-time").value;
    const endTime = document.getElementById("lecture-end-time").value;

    // Set title
    doc.setFontSize(16);
    doc.text(`Attendance of ${course} Sec: ${section}`, 10, 10);

    // Add date & time with proper spacing
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 10, 20);
    doc.text(`Lecture Name: ${lecture}`, 10, 30)
    doc.text(`Lecture Time: ${startTime} - ${endTime}`, 10, 40);

    // Table headers
    let y = 50;  // Add spacing before table starts
    doc.setFont("courier", "bold"); // Change font for table headers
    doc.setFontSize(14);
     
    doc.setFontSize(14);
    doc.text("Student Name", 10, y);
    doc.text("Student Id.", 100, y);
    y += 10;  // Move down

    // Get student data from table
    const rows = document.querySelectorAll("#attendance-table tbody tr");

    rows.forEach(row => {
        let checkbox = row.querySelector(".attendance-checkbox");
        if (checkbox.checked) {
            let studentName = row.children[0].innerText;
            let rollNumber = row.children[1].innerText;

            doc.setFontSize(12);
            doc.text(studentName, 10, y);
            doc.text(rollNumber, 100, y);
            y += 10;
        }
    });
    // Save the PDF
    doc.save(`Attendance_${course}_Sec${section}.pdf`);
}

// function generateExcel() {
//     const table = document.getElementById("attendance-table");
//     const ws = XLSX.utils.table_to_sheet(table);  // Convert HTML table to Excel sheet
//     const wb = XLSX.utils.book_new();  // Create a new workbook
//     XLSX.utils.book_append_sheet(wb, ws, "Attendance");  // Append sheet to workbook

//     // Download the Excel file
//     XLSX.writeFile(wb, "Attendance_Report.xlsx");
// }

function generateExcel() {
    const course = document.getElementById("Course").value;
    const section = document.getElementById("Section").value;
    const date = document.getElementById("attendance-date").value;
    const lectureName = document.getElementById("lecture-name").value;  // Make sure you have an input field with this ID
    const startTime = document.getElementById("lecture-start-time").value;
    const endTime = document.getElementById("lecture-end-time").value;

    // Initialize worksheet data with headings
    const wsData = [
        [`Attendance Report`],  // Title
        [`Date: ${date}`],  // Date
        [`Lecture Name: ${lectureName}`],  // Lecture Name
        [`Lecture Time: ${startTime} - ${endTime}`],  // Lecture Time
        [],  // Empty row for spacing
        ["Student Name", "Roll Number"]  // Table Headers
    ];

    // Get only checked students
    document.querySelectorAll("#attendance-table tbody tr").forEach(row => {
        let checkbox = row.querySelector(".attendance-checkbox");
        if (checkbox.checked) {  // ✅ Only include checked students
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            
            rows.forEach(row => {
                let studentName = row.children[0].innerText;
                let rollNumber = row.children[1].innerText;
            
                doc.text(studentName, 10, y);
                doc.text(rollNumber, 100, y);
                y += 10; // Move to the next row
            });
            
        }
    });

    // Create worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    ws['!cols'] = [
        { wch: 20 }, 
        { wch: 15 }, 
      ];
    // Download the Excel file
    XLSX.writeFile(wb, `Attendance_${course}_Sec${section}.xlsx`);
}


// Add event listener to the button
document.getElementById("DownloadXL").addEventListener("click", function (event) {
    event.preventDefault();  
    generateExcel();
})

document.getElementById("Download").addEventListener("click", function (event) {
    event.preventDefault();  
    generatePDF();
});

    

