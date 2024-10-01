const http = require("http");

const todos = [
  { id: 1, text: "todo list1" },
  { id: 2, text: "todo list2" },
  { id: 3, text: "todo list3" },
  { id: 4, text: "todo list4" },
];

const server = http.createServer((req, res) => {
  const { method, url } = req;
  let body = [];

  // Collect the body data
  req.on("data", (chunk) => {
    body.push(chunk);
  });

  // When body collection is complete
  req.on("end", () => {
    body = Buffer.concat(body).toString(); // Concatenate buffer to string

    // Log the body for debugging purposes
    console.log("Received Body:", body);

    let status = 404;
    const response = {
      success: false,
      data: null,
    };

    // Handle GET request
    if (method === "GET" && url === "/todos") {
      status = 200;
      response.success = true;
      response.data = todos;
    }

    // Handle POST request
    else if (method === "POST" && url === "/todos") {
      try {
        // Check if body is not empty
        if (body && body.trim() !== "") {
          const { id, text } = JSON.parse(body); // Parse the JSON body

          // Push the new todo item to the todos array
          todos.push({ id, text });
          status = 201;
          response.success = true;
          response.data = todos;
        } else {
          throw new Error("Body is empty");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error.message);
        status = 400;
        response.success = false;
        response.message = "Invalid request data";
      }
    }

    // Send the response
    res.writeHead(status, {
      "Content-Type": "application/json",
      "X-Powered-By": "Node.js",
    });
    res.end(JSON.stringify(response));
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
