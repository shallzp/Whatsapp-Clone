$(document).ready(() => {
    clearMaster();
    $(".chat-room").show();
    setupNavigationFiltering();
});


$("#master .heading img").each(function(index) {
    $(this).click(function() {
        if (index === 1) {
            $("#master .header .menu").toggle();
        } 
        $(this).toggleClass("clicked");
    });
});


$("#master .chat-room .chat .open").each(function() {
    $(this).on("click", function() {
        $(".chat .menu-contact").toggle();
    });
});


$("#master .chat-room .chat").each(function() {
    $(this).on("click", function() {
        $("#details .default").hide();
        $("#details .chat-screen").show();
    });
});



// Navigation
function setActiveNavItem(activeItem) {
    $(".nav-items").removeClass("active");
    $(activeItem).addClass("active");
}

function setupNavigationFiltering() {
    const navItems = $(".nav-items");

    navItems.each(function() {
        $(this).on("click", function() {
            const itemName = $(this).attr("name");
            setActiveNavItem(this);
            clearMaster();
            $("." + itemName).show();
        });
    });
}

function filterContent(name) {
    if(name === "chat-room"){
        
    }
    else if(name === "tv-shows") {
    
    }
    else if(name === "movies") {
        
    }
    else if(name === "new-popular") {
        
    }
    else if(name === "my-list") {
        
    }
    else if (name === "languages") {
        
    }
}

function clearMaster() {
    $(".chat-room").hide();
    $(".community").hide();
    $(".status").hide();
    $(".channel").hide();
    $(".settings").hide();
    $(".profile").hide();
}




//Details

//Header
$(".search-chat").on("click", function() {
    $(this).toggleClass("clicked");
    $(".search-tab").show();
    $("#details").css("width", "calc((100vw - 29vw - 60px)/2 + 42px)");
});

$(".chat-screen .header .menu-btn").click(function() {
    $(".chat-screen .header .menu").toggle();
    $(this).toggleClass("clicked");
});

//Msg box
$(".msg-row .menu-hover").each(function() {
    $(this).on("click", function() {
        $(this).siblings(".menu").toggle();
    });
});



//Call
function startVoiceCall() {
    $(".call").show();
}

function startVideoCall() {
    $(".call").show();

    let accessDevice = navigator.mediaDevices;

    if (!accessDevice || !accessDevice.getUserMedia) {
        console.log("getUserMedia() not supported.");
        return;
    }

    accessDevice.getUserMedia({
        audio: true,
        video: true
    })
    .then(function(vidStream) {
        var video = $("#webcam")[0];
        if ("srcObject" in video) {
            video.srcObject = vidStream;
        } else {
            video.src = window.URL.createObjectURL(vidStream);
        }
        video.onloadedmetadata = function(e) {
            video.play();
        };
    })
    .catch(function(e) {
        console.log(e.name + ": " + e.message);
    });
}