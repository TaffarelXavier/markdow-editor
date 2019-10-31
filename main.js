const electron = require("electron");
const { app, BrowserWindow, ipcMain } = electron;
const path = require("path");
const url = require("url");

let win;

function createWindow() {

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: width - 50,
    height: height - 50,
    frame: true, //Definir os campos de cima
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      webviewTag: false
    }
  });



  //Abrir o DevTools do nevegador
  //win.webContents.openDevTools()

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "public/index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  //Menu
  win.setMenu(null);

  win.on("closed", () => {
    win = null;
  });
}

/*
ipcMain.on('open-new-window', (event, fileName) => {
  let win = new BrowserWindow({width:960, height:540})
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "public/ping.html"),
      protocol: "file:",
      slashes: true
    })
  );
  console.log("AAA");
});

app.on("open-new-window", function(evebt, el){
console.log("A");
});*/

app.on("ready", createWindow);


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
