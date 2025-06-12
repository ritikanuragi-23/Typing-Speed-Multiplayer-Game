![Screenshot 2025-06-12 162502](https://github.com/user-attachments/assets/d96521d6-f5ff-4692-a7f3-87ac702bc407)

![image](https://github.com/user-attachments/assets/b7950439-25bc-4ed7-81b8-e61daf14817d)

# 🏆 Typing Speed Multiplayer Game

## 📌 Project Overview
This project is a **real-time multiplayer typing competition** built using **Node.js, Express, and Socket.io**. The game challenges players to type a predefined paragraph **exactly** and submit their response. The first correct submission wins, displaying the **winner's name and typing speed**.

### 🔹 **Features**
✅ **Multiplayer Support** – Compete in real-time  
✅ **Player Name Input** – Enter your name before joining the game  
✅ **Typing Validation** – Incorrect input turns **red** until corrected  
✅ **Winner Announcement** – Fastest player is displayed to all participants  
✅ **Accessible Across Devices** – Play on mobile or PC over the same local network  

---

## 🛠️ **Installation & Setup**

### **1️⃣ Prerequisites**
Before running the project, ensure you have:

✔️ **Node.js installed** → [Download Here](https://nodejs.org/)  
✔️ **Basic command-line knowledge** to run scripts  
✔️ **Multiple devices or browser tabs** for multiplayer testing  

---

### **2️⃣ Setting Up the Project**
#### **📁 Create a Project Folder**
Open a terminal and run:
```bash
mkdir TypingSpeedGame
cd TypingSpeedGame
```
Now, copy your **`server.js`** file into this folder.

#### **📦 Install Dependencies**
Run the following commands to initialize and install required packages:
```bash
npm init -y
npm install express socket.io
```
This sets up a Node.js environment and installs the necessary libraries.

---

## ▶️ **Running the Server**
### **3️⃣ Start the Game Server**
Run the following command inside the project folder:
```bash
node server.js
```
If successful, the terminal will display:
```
Server running on port 3000.
```

---

## 🎮 **Accessing the Game**
### 🖥️ **On Your Computer**
Open a web browser and go to:
```
http://localhost:3000
```

### 📱 **On Mobile or Another Computer**
1. Find your **local IP address** using:
   - **Windows:** Run `ipconfig` in Command Prompt.
   - **Mac/Linux:** Run `ifconfig` in Terminal.
2. Use your **local IP** instead of localhost:
   ```
   http://YOUR_LOCAL_IP:3000
   ```
3. Ensure that **all devices are on the same Wi-Fi network**.

---

## 🔥 **Testing Multiplayer Gameplay**
🔹 Open **multiple browser tabs** to simulate different players.  
🔹 Enter your **name**, then type the **given paragraph exactly** and submit.  
🔹 The **first correct player wins**, displaying their name & typing speed.  

---

