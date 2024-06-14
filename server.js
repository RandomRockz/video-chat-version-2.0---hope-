const express = require("express");
const app = express();
const server = require("http").Server(app);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json())

const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
    res.render("index", { roomId: req.params.room });
});

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        io.to(roomId).emit("user-connected", userId);
    })
});

server.listen(process.env.PORT || 3030);

var nodeMailer = require("nodemailer")
const transporter = nodeMailer.createTransport({
    port: 587,
    host: "smtp.gmail.com",
    auth: {
        user: "",
        pass: "bvhe qhyc duma penh"
    },
    secure: true

})
app.host("/send-mail", (req, res) => {
    const to = req.body.to
    const url = req.body.url
    const maildata = {
        from: "",
        to: to,
        subject: "join the video chat with me",
        html: `<p>hello there </p><p>come and join for a video chat - ${url}</p>`
    }
    transporter.sendMail(maildata, (error, info) => {
        if (error) {
            return console.log("Error!")
        }
        else {
            res.status(200).send({
                message: "invitation sent",
                message_id: info.message
            })
        }
    })
})











