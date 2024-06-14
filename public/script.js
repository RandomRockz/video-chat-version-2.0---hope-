const socket = io("/");

const user = prompt("Enter your name");
const myVideo = document.createElement("video")
myVideo.muted = true

let myStream
navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
    myStream = stream
    addVideoStream(myvideo, stream)
    socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream)
    })
})




function connectToNewUser(userid, stream) {
    const call = peer.call(userid, stream)
    const video = document.createElement("video")
    call.on("stream", (userVideoStream), () => {
        addVideoStream(video, userVideoStream)
    })





    peer.on("call", call => {
        call.answer(stream)

        const video = document.createElement("video")
        call.on("stream", (userVideoStream), () => {
            addVideoStream(video, userVideoStream)
        })
    })
}




function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener("loadedmetadata", () => {
        video.play()
        $("#video_grid").append(video)
    })
}





$(function () {
    $("#send").click(function () {
        if ($("#chat_message").val().length !== 0) {
            console.log(user);
            socket.emit("message", $("#chat_message").val(), user);
            $("#chat_message").val("");
        }
    })
    $("#chat_message").keydown(function (e) {
        if (e.key == "Enter" && $("#chat_message").val().length !== 0) {
            socket.emit("message", $("#chat_message").val(), user);
            $("#chat_message").val("");
        }
    })
    $("#mute_button").click(function () {
        const enabled = myStream.getAudioTracks()[0].enabled
        if (enabled) {
            myStream.getAudioTracks()[0].enabled = false
            html = `<i class="fas fa-microphone-slash"></i>`
            $("#mute_button").toggleclass("background_red")
        }
        else {
            myStream.getAudioTracks()[0].enabled = true
            html = `<i class="fas fa-microphone"></i>`
            $("#mute_button").toggleclass("background_blue")
        }

    })
    $("#invite_button").click(function () {
        const to = prompt("Enter the email addres$ ")
        let data = {
            url: window.location.href,
            to: to
        }
        $.ajax({
            url: "/sent-mail",
            type: "post",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                alert("invite seNt")
            },
            error: function (result) {
                console.log(result.responseJSON)
            }
        })
    })


    $("#video_button").click(function () {
        const enabled = myStream.getVideoTracks()[0].enabled
        if (enabled) {
            myStream.getVideoTracks()[0].enabled = false
            html = `<i class="fas fa-video-slash"></i>`
            $("#video_button").toggleclass("background_red")
        }
        else {
            myStream.getVideoTracks()[0].enabled = true
            html = `<i class="fas fa-video"></i>`
            $("#video_button").toggleclass("background_blue")
        }

    })
})

socket.on("createMessage", (message, userName) => {
    $(".messages").append(`
        <div class="message">
            <b><span class="username"> ${userName}: </span> </b>
            <span>${message}</span>
        </div>
    `)
});