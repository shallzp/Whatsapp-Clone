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


$("#master .chat-room .chat").each(function() {
    $(this).on("click", function() {
        $(".chat .menu-contact").toggle();
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
