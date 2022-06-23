import { IncomingMessage } from "http";
import * as WebSocket from "ws";

let websocketServer: WebSocket.Server;

function initWebsocketServer(server: any) {
  websocketServer = new WebSocket.Server({ server });

  websocketServer.on('connection', onConnect);
}

function getWebsocketServer(): WebSocket.Server {
  return websocketServer;
}

function onConnect(connection: WebSocket, request: IncomingMessage) {
  connection.on('message', (rawData: WebSocket.RawData) => onMessage(connection, rawData, request));
}

function onMessage(connection: WebSocket, rawData: WebSocket.RawData, request: IncomingMessage) {
  const payload = JSON.parse(rawData.toString());
  console.log(payload);
}

export {
  initWebsocketServer,
  getWebsocketServer,
  onConnect,
  onMessage,
}