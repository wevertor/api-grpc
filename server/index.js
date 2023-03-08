const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { randomUUID } = require("node:crypto");

const PROTO_PATH = "./event.proto";

// loads the event.proto definition
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const eventsProto = grpc.loadPackageDefinition(packageDefinition);

// array were the events will be stored
const events = [];

// creates the server
const server = new grpc.Server();

// defines the service functions 
server.addService(eventsProto.EventService.service, {
    
    getAllEvents: (_, callback) => {
        callback(null, { events })
    },
    
    getEvent: (call, callback) => {
        const event = events.find(n => n.id === call.request.id);

        if (event) {
            callback(null, event);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Event not found."
            })
        }
    },
    
    createEvent: (call, callback) => {
        const event = call.request;

        event.id = randomUUID();
        events.push(event);
        callback(null, event);
    },
    
    updateEvent: (call, callback) => {
        const existingEvent = events.find(n => n.id === call.request.id);
        const newEvent = call.request;

        if (existingEvent) {
            existingEvent.name = newEvent.name;
            existingEvent.description = newEvent.description;
            existingEvent.location = newEvent.location;
            existingEvent.duration = newEvent.duration;
            existingEvent.lucky_number = newEvent.lucky_number;
            existingEvent.status = newEvent.status;
            callback(null, existingEvent);

        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Event not found."
            })
        }
    },
    
    deleteEvent: (call, callback) => {
        let existingEventIndex = events.findIndex(n => n.id == call.request.id);
 
        if (existingEventIndex != -1) {
            events.splice(existingEventIndex, 1);
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Event Not found"
            });
        }
    }
});

// configure the server
server.bindAsync("127.0.0.1:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
    console.log(`Server listening at http://localhost:${port}`);
    server.start();
    });

    