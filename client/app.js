const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "../events.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
   keepCase: true,
   longs: String,
   enums: String,
   arrays: true
});

const EventService = grpc.loadPackageDefinition(packageDefinition).EventService;
const client = new EventService("localhost:50051", grpc.credentials.createInsecure());

module.exports = client;