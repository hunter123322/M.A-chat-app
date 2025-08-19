import { createServer } from "http";
import { Server } from "socket.io";
import { io as Client, Socket } from "socket.io-client";
import handleSocketConnection from "./socket.server"; // adjust path

describe("handleSocketConnection", () => {
    let io: Server;
    let httpServer: any;
    let clientSocket: Socket;
    let port: number;

    beforeAll((done) => {
        httpServer = createServer();
        io = new Server(httpServer, { cors: { origin: "*" } });

        // attach your socket handler
        handleSocketConnection(io);

        httpServer.listen(() => {
            port = (httpServer.address() as any).port;
            done();
        });
    });

    afterAll(() => {
        io.close();
        httpServer.close();
    });

    afterEach(() => {
        if (clientSocket && clientSocket.connected) {
            clientSocket.disconnect();
        }
    });

    test("should disconnect if user_id is missing", (done) => {
        clientSocket = Client(`http://localhost:${port}`, {
            auth: {}, // no user_id
        });

        clientSocket.on("disconnect", (reason) => {
            expect(reason).toBe("io server disconnect"); // server called socket.disconnect()
            done();
        });
    });


    test("should join user room if user_id is provided", (done) => {
        clientSocket = Client(`http://localhost:${port}`, {
            auth: { user_id: 42 },
        });

        clientSocket.on("connect", () => {
            expect(clientSocket.connected).toBe(true);
            done();
        });
    });

    test("should handle leaveRoom event", (done) => {
        clientSocket = Client(`http://localhost:${port}`, {
            auth: { user_id: 99 },
        });

        clientSocket.on("connect", () => {
            clientSocket.emit("leaveRoom", "room123");

            // Wait a bit for server to process
            setTimeout(() => {
                expect(clientSocket.connected).toBe(true);
                done();
            }, 100);
        });
    });
});
