const express = require("express");

const client = require("./app");

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
    client.getAllEvents(null, (err, data) => {
        if (err) throw err;
        res.status(200).send({ data });
    });
});

app.post("/", (req, res) => {
    const newEvent = {
        name: req.body.name,
        description: req.body.age,
        location: req.body.address,
        duration: req.body.address,
        lucky_number: req.body.address,
        status: req.body.status
    };
 
    client.insert(newEvent, (err, data) => {
        if (err) throw err;
        res.status(200).send({
            data,
            message: 'Event created successfully'
        });
    });
});

app.put("/updateEvent", (req, res) => {
    const newEvent = {
        name: req.body.name,
        description: req.body.age,
        location: req.body.address,
        duration: req.body.address,
        lucky_number: req.body.address,
        status: req.body.status
    };
 
    client.update(newEvent, (err, data) => {
        if (err) throw err;
 
        res.status(200).send({
            data,
            message: 'Event updated successfully'
        });
    });
 });
 
 app.delete("/deleteEvent", (req, res) => {
    client.remove({ id: req.body.eventId }, (err, _) => {
        if (err) throw err;
 
        res.status(200).send({
            message: 'Event deleted successfully'
        });
    });
 });
 
 const PORT = process.env.PORT || 50050;
 app.listen(PORT, () => {
    console.log("Client Server listening to port %d", PORT);
 });


