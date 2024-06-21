$(document).ready(() => {
    clearMaster();
    $(".chat-room").show();
    setupNavigationFiltering();
});


$("#master .heading img").each(function(index) {
    $(this).click(function() {
        if (index === 1) {
            $(".header .menu").toggle();
        } 
        $(this).toggleClass("clicked");
    });
});


$("#master .chat-room .chat").each(function() {
    $(this).on("contextmenu", function(event) {
        event.preventDefault();
        $(".chat .menu-contact").show();
    });
});




// Navigation
function setActiveNavItem(activeItem) {
    $(".nav-items").removeClass("active");
    $(activeItem).addClass("active");
}

function setupNavigationFiltering() {
    const navItems = $('.nav-items');

    navItems.each(function() {
        $(this).on('click', function() {
            const itemName = $(this).attr('name');
            setActiveNavItem(this);
            clearMaster();
            $('.' + itemName).show();
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

    // window.location.hash = "home-page" + '?' + category ;
}

function clearMaster() {
    $(".chat-room").hide();
    $(".community").hide();
    $(".status").hide();
    $(".channel").hide();
    $(".settings").hide();
    $(".profile").hide();
}