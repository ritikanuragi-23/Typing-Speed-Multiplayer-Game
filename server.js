// server.js
//
// This one‑file project implements a multiplayer typing game with a modern UI.  
// It prompts for a player name, logs join and submit events in the terminal,  
// and colors the input border red when the text doesn't match exactly.

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const currentParagraph = "The quick brown fox jumps over the lazy dog.";
let winner = null;

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Typing Speed Multiplayer</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <!-- Google Font -->
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Roboto', sans-serif;
          background: linear-gradient(135deg, #74ABE2, #5563DE);
          color: #333;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          width: 90%;
          max-width: 800px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          padding: 30px;
          text-align: center;
        }
        h1 {
          margin-bottom: 20px;
          font-weight: 700;
          color: #444;
        }
        #paragraph {
          font-size: 20px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ddd;
          background: #f2f2f2;
          border-radius: 5px;
          word-wrap: break-word;
          max-width: 100%;
        }
        #inputField {
          width: 90%;
          padding: 12px;
          font-size: 18px;
          margin: 20px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
          outline: none;
          transition: border 0.3s ease;
        }
        #submitButton {
          padding: 12px 30px;
          font-size: 18px;
          border: none;
          background-color: #5563DE;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        #submitButton:hover {
          background-color: #4452c7;
        }
        #result {
          margin-top: 30px;
          font-size: 22px;
          color: #27ae60;
          font-weight: 500;
        }
        #message {
          margin-top: 15px;
          color: #e74c3c;
          font-size: 18px;
        }
        /* Login Modal Styles */
        #loginContainer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        #loginBox {
          background: #fff;
          border-radius: 8px;
          padding: 20px;
          width: 90%;
          max-width: 400px;
          text-align: center;
        }
        #loginBox input {
          width: 80%;
          padding: 10px;
          margin: 10px 0;
          font-size: 18px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        @media (max-width: 600px) {
          .container {
            padding: 20px;
          }
          #inputField, #submitButton {
            font-size: 16px;
          }
        }
      </style>
    </head>
    <body>
      <!-- Login Modal -->
      <div id="loginContainer">
        <div id="loginBox">
          <h2>Enter Your Name</h2>
          <input type="text" id="playerNameInput" placeholder="Your name" autocomplete="off" />
          <br>
          <button id="joinButton">Join Game</button>
        </div>
      </div>

      <!-- Game Container -->
      <div class="container" style="display: none;" id="gameContainer">
        <h1>Real-Time Typing Race</h1>
        <div id="paragraph">Waiting for paragraph...</div>
        <input type="text" id="inputField" placeholder="Type the paragraph exactly..." autocomplete="off" />
        <br>
        <button id="submitButton">Submit</button>
        <div id="result"></div>
        <div id="message"></div>
      </div>

      <!-- Socket.io client library -->
      <script src="/socket.io/socket.io.js"></script>
      <script>
        const socket = io();
        let playerName = '';
        
        // Login Elements
        const loginContainer = document.getElementById('loginContainer');
        const joinButton = document.getElementById('joinButton');
        const playerNameInput = document.getElementById('playerNameInput');
        
        // Game Elements
        const gameContainer = document.getElementById('gameContainer');
        const paragraphElem = document.getElementById('paragraph');
        const inputField = document.getElementById('inputField');
        const submitButton = document.getElementById('submitButton');
        const resultElem = document.getElementById('result');
        const messageElem = document.getElementById('message');
        let startTime = null;
        
        // Join game with player's name.
        joinButton.addEventListener('click', () => {
          const name = playerNameInput.value.trim();
          if (name === "") return;
          playerName = name;
          socket.emit('join', { name: playerName });
          loginContainer.style.display = 'none';
          gameContainer.style.display = 'block';
        });

        // When paragraph is received, start the game.
        socket.on('paragraph', (data) => {
          paragraphElem.textContent = data.paragraph;
          // Record the start time when the paragraph is shown.
          startTime = Date.now();
          // Reset any previous error states.
          inputField.style.border = "1px solid #ccc";
          inputField.value = "";
          resultElem.textContent = "";
          messageElem.textContent = "";
        });

        // On click, submit the typed text and calculate time taken.
        submitButton.addEventListener('click', () => {
          const text = inputField.value;
          if (!text) return;
          const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
          socket.emit('submit', { text: text, timeTaken: timeTaken });
        });

        // Listen for error messages (text mismatch) and turn border red.
        socket.on('message', (msg) => {
          messageElem.textContent = msg;
          if (msg.includes('Text does not match exactly')) {
            inputField.style.border = "2px solid #e74c3c";
          }
        });

        // Reset red border when the user starts typing.
        inputField.addEventListener('input', () => {
          inputField.style.border = "1px solid #ccc";
        });

        // Display the winner details and disable further input.
        socket.on('winner', (data) => {
          resultElem.textContent = "Winner: " + data.winnerName + " | Time: " + data.timeTaken + " seconds.";
          inputField.disabled = true;
          submitButton.disabled = true;
        });
      </script>
    </body>
    </html>
  `);
});

// ---------------------
// Server-side Socket.io
// ---------------------
io.on('connection', (socket) => {
  // When a player joins, store their name and log it.
  socket.on('join', (data) => {
    socket.playerName = data.name;
    console.log("Player joined: " + data.name + " (Socket ID: " + socket.id + ")");
    // Send the paragraph once they join.
    socket.emit('paragraph', { paragraph: currentParagraph });
  });

  // Upon submission, compare the text; log the submission connection.
  socket.on('submit', (data) => {
    console.log("Submission from " + socket.playerName + " (ID: " + socket.id + "): " + data.text + " | Time: " + data.timeTaken + " sec");
    if (winner) {
      socket.emit('message', 'Game over. Winner is ' + winner.winnerName);
      return;
    }
    if (data.text.trim() === currentParagraph) {
      winner = { winnerName: socket.playerName, timeTaken: data.timeTaken };
      console.log("Winner: " + socket.playerName + " in " + data.timeTaken + " seconds.");
      io.emit('winner', winner);
    } else {
      socket.emit('message', 'Text does not match exactly. Try again.');
    }
  });

  // Log disconnection.
  socket.on('disconnect', () => {
    console.log("Player disconnected: " + (socket.playerName || socket.id));
  });
});

// Start the server on port 3000


server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

