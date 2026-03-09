const http = require("http");

let students = [
 { id: 1, name: "Roshan", course: "CSE" },
 { id: 2, name: "Manvith", course: "ECE" }
];

const server = http.createServer((req, res) => {

 const path = req.url;
 const method = req.method;

 if (path === "/students" && method === "GET") {

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(students));

 }

 else if (path.startsWith("/students/") && method === "GET") {

  const id = parseInt(path.split("/")[2]);
  const student = students.find(s => s.id === id);

  if (student) {
   res.writeHead(200);
   res.end(JSON.stringify(student));
  } else {
   res.writeHead(404);
   res.end(JSON.stringify({ message: "Student not found" }));
  }

 }

 else if (path === "/students" && method === "POST") {

  let body = "";

  req.on("data", chunk => {
   body += chunk.toString();
  });

  req.on("end", () => {

   const newStudent = JSON.parse(body);

   if (!newStudent.id || !newStudent.name || !newStudent.course) {
    res.writeHead(400);
    res.end(JSON.stringify({ message: "All fields required" }));
    return;
   }

   students.push(newStudent);

   res.writeHead(201);
   res.end(JSON.stringify({ message: "Student added", students }));

  });

 }

 else if (path.startsWith("/students/") && method === "PUT") {

  const id = parseInt(path.split("/")[2]);

  let body = "";

  req.on("data", chunk => {
   body += chunk.toString();
  });

  req.on("end", () => {

   const updatedData = JSON.parse(body);

   const index = students.findIndex(s => s.id === id);

   if (index !== -1) {

    students[index] = { ...students[index], ...updatedData };

    res.writeHead(200);
    res.end(JSON.stringify({ message: "Student updated", student: students[index] }));

   } else {

    res.writeHead(404);
    res.end(JSON.stringify({ message: "Student not found" }));

   }

  });

 }

 else if (path.startsWith("/students/") && method === "DELETE") {

  const id = parseInt(path.split("/")[2]);

  const index = students.findIndex(s => s.id === id);

  if (index !== -1) {

   students.splice(index, 1);

   res.writeHead(200);
   res.end(JSON.stringify({ message: "Student deleted" }));

  } else {

   res.writeHead(404);
   res.end(JSON.stringify({ message: "Student not found" }));

  }

 }

 else {

  res.writeHead(404);
  res.end(JSON.stringify({ message: "Route not found" }));

 }

});

server.listen(3000, () => {
 console.log("Server running on port 3000");
});