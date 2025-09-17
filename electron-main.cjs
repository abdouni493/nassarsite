// electron-main.cjs
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

const isDev = process.env.NODE_ENV === "development";

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    // ⚠️ Vite default port is 5173, not 8080
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
  }
}

app.on("ready", () => {
  if (!isDev) {
    // Only start backend server when building the packaged app
    const serverPath = path.join(__dirname, "server.cjs");
    serverProcess = spawn("node", [serverPath], {
      stdio: "inherit",
      shell: true,
    });
  }

  createWindow();
});


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("quit", () => {
  if (serverProcess) serverProcess.kill();
});
