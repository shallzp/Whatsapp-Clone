let my_profile = whatsapp_log.users[0];


$(document).ready(() => {
    clearMaster();
    $(".chat-room").show();
    setupNavigationFiltering();

    defaultDetails();
    
    masterChatLogs();

    // const localStorageData = localStorage.getItem('whatsapp_log');
    // if (localStorageData) {
    //     whatsapp_log = JSON.parse(localStorageData);
    // }

    // my_profile = whatsapp_log.users[0];
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




//Master
$("#master .heading img").each(function(index) {
    $(this).click(function() {
        if (index === 1) {
            $("#master .header .menu").toggle();
        } 
        $(this).toggleClass("clicked");
    });
});

function createChatListHTML(chat, type, index) {
    const chatlogs = chat.chat_log;
    const dataIndex = type === 'group' ? `group-index="${index}"` : `contact-index="${index}"`;
    let contentHTML = '';

    if (chatlogs[chatlogs.length - 1].attachments) {
        if (chatlogs[chatlogs.length - 1].images && chatlogs[chatlogs.length - 1].images.length > 0) {
            contentHTML = `
                <div class="attach">
                    <img src="./images/icons/image.png"> Photo
                </div>`;
        } 
        else if (chatlogs[chatlogs.length - 1].videos && chatlogs[chatlogs.length - 1].videos.length > 0) {
            contentHTML = `
                <div class="attach">
                    <img src="./images/icons/video.png"> Video
                </div>`;
        } 
        else if (chatlogs[chatlogs.length - 1].documents && chatlogs[chatlogs.length - 1].documents.length > 0) {
            contentHTML = `
                <div class="attach">
                    <img src="./images/icons/document.png"> Document
                </div>`;
        }
    } 
    else {
        contentHTML = `
            <p>${chatlogs[chatlogs.length - 1].msg.length > 35 ? chatlogs[chatlogs.length - 1].msg.substring(0, 35) + "..." : chatlogs[chatlogs.length - 1].msg}</p>`;
    }

    return `
    <div class="chat ${type}" ${dataIndex}>
        ${chat.profile_pic ? 
            `<div class="profile-pic" style="background-image: url(${chat.profile_pic}); background-repeat: no-repeat; background-size: cover;"></div>` :
            `<div class="profile-pic user">
                <img src="./images/icons/${type === 'group' ? 'group-user' : 'user'}.png" class="user">
            </div>`
        }
        <div class="preview">
            <div class="content">
                <div class="info">
                    <div class="top">
                        <h3 class="contact-name">${chat.name}</h3>
                        <div class="date-time">${chatlogs.length > 0 ? chatlogs[chatlogs.length - 1].date : ''}</div>
                    </div>
                    ${chatlogs[chatlogs.length - 1].type === 'sent' ? 
                        `<img src="./images/icons/${chatlogs[chatlogs.length - 1].situation}.png" class="tick">` : ''
                    }
                    ${contentHTML}
                    <img src="./images/icons/open.png" class="open-menu">
                </div>
            </div>
            <div class="horizontal-divider default-bg"></div>
        </div>
        <div class="menu ${type} white-bg">
            <ul>
                ${type === 'group' ? `
                <li>Archive chat</li>
                <li>Mute notifications</li>
                <li>Exit group</li>
                ` : `
                <li>Delete chat</li>
                <li>Block</li>
                `}
                <li>Pin chat</li>
                <li>Mark as unread</li>
            </ul>
        </div>
    </div>
    `;
}

function masterChatLogs() {
    $(".new-chat").click(() => {
        $(".chat-room").hide();
        $(".contacts-list .chat-list").html(contactsList());
        $(".contacts-list").show();
    });

    $(".contacts-list .home").click(() => {
        $(".chat-room").show();
        $(".contacts-list").hide();
    });

    $('#master .search input').on('keyup', function() {
        if ($(this).val().trim().length > 0) {
            $('.back').show();
            $('.search-icon').hide();
        } else {
            $('.back').hide();
            $('.search-icon').show();
        }
    });


    let groupsHTML = [];
    let contactsHTML = [];

    my_profile.groups.forEach((group, index) => {
        if (group.chat_log.length !== 0) {
            groupsHTML.push(createChatListHTML(group, 'group', index));
        }
    });
    
    my_profile.contacts.forEach((contact, index) => {
        if (contact.chat_log.length !== 0) {
            contactsHTML.push(createChatListHTML(contact, 'contact', index));
        }
    });

    $(".chat-room .chat-list").append(groupsHTML.join('') + contactsHTML.join(''));

    $("#master .chat-room .chat").on('click', function() {
        if ($(this).attr("group-index") !== undefined) {
            DetailsChange("group", parseInt($(this).attr("group-index")));
        } 
        else if ($(this).attr("contact-index") !== undefined) {
            DetailsChange("contact", parseInt($(this).attr("contact-index")));
        }
    });
}

function contactsList() {
    return `
        <div class="chat new create-group">
        <div class="profile-pic">
            <img src="./images/icons/group-user.png">
        </div>
        <div class="preview">
            <p>New group</p>
            <div class="horizontal-divider default-bg"></div>
        </div>
    </div>

    <div class="chat new create-group">
        <div class="profile-pic">
            <img src="./images/icons/community-white.png">
        </div>
        <div class="preview">
            <p>New community</p>
            <div class="horizontal-divider default-bg"></div>
        </div>
    </div>

        <div class="label">
            <p>CONTACTS ON WHATSAPP</p>
        </div>

    <div class="chat me">
    ${my_profile.profile_pic ? 
        `<div class="profile-pic" style="background-image: url(${my_profile.profile_pic}); background-repeat: no-repeat; background-size: cover;"></div>` :
        `<div class="profile-pic">
            <img src="./images/icons/user.png" class="user">
        </div>`
    }
        <div class="preview">
            <div class="horizontal-divider default-bg"></div>
            <div class="content">
                <div class="info">
                    <div class="top">
                        <h3 class="contact-name">${my_profile.name}</h3>
                    </div>
                    <p>Message yourself</p>
                </div>
            </div>
        </div>
    </div>
    ${sortContactList(my_profile.contacts)}
    `;  
}

function sortContactList(contacts) {
    const sortedContacts = contacts.sort((a, b) => a.name.localeCompare(b.name));

    return sortedContacts.map(contact => `
        <div class="chat contact">
            ${contact.profile_pic ? 
                `<div class="profile-pic" style="background-image: url(${contact.profile_pic}); background-repeat: no-repeat; background-size: cover;"></div>` :
                `<div class="profile-pic">
                    <img src="./images/icons/user.png" class="user">
                </div>`
            }
            <div class="preview">
                <div class="horizontal-divider default-bg"></div>
                <div class="content">
                    <div class="info">
                        <div class="top">
                            <h3 class="contact-name">${contact.name}</h3>
                        </div>
                        <p>${contact.about}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

$("#master").on('click', '.chat-room .chat .open-menu', function() {
    $(this).closest(".chat").find(".menu").toggle();
});





//Details
function defaultDetails() {
    defaultHTML = `
    <div class="default">
        <img src="./images/default.png">
        <h1>Download WhatsApp for Windows</h1>
        <p>Make calls, share your screen and get a faster experience when you download the Windows app.</p>
        <button><span>Get from Miscrosoft Store</span></button>
        <p><img src="./images/icons/lock.png">Your personal messages are end-to-end encrypted</p>
    </div>
    `;

    $("#details").append(defaultHTML);
}

function DetailsChange(type, index) {
    $("#details").empty();

    let data;
    if (type === 'group') {
        data = my_profile.groups[index];
    } else if (type === 'contact') {
        data = my_profile.contacts[index];
    }

    $("#details").html(createChatHTML(data, type));

    $(".chat-screen .header .left").on("click", function() {
        initProfileInfo(data);
        $(".profile-info").show();
        $("#details").css("width", "calc((100vw - 29vw - 60px)/2 + 42px)");
    });

    $(".search-chat").on("click", function() {
        $(this).toggleClass("clicked");
        $(".search-tab").append(initSearchTab(data));
        $(".search-tab").show();
        $("#details").css("width", "calc((100vw - 29vw - 60px)/2 + 42px)");
    });

    $(".chat-screen .header .menu-btn").click(function() {
        $(".chat-screen .header .menu").toggle();
        $(this).toggleClass("clicked");
    });

    initializeCall(data);

    $(".menu-attach").on("click", function() {
        $(this).toggleClass("clicked");
        $(".doc-menu").toggle();
    });

    $(".doc-menu ul li").each(function() {
        $(this).click(function() {
            if ($(this).find("div").hasClass("attach-click-pv")) {
                $(".chat-screen .msg-box").hide();
                $(".chat-screen .footer").hide();
                $(".chat-screen").append(initializeCamera());
            }
        });
    });

    $('#send').on('keyup', function() {
        if ($(this).val().trim().length > 0) {
            $('.send').show();
            $('.record').hide();
        } else {
            $('.send').hide();
            $('.record').show();
        }
    });

    $(".send").click(() => {
        sendMessage(data, type, index);
    });
}

function createMessageHTML(log, chat_type) { //here type se group wali msg krna h
    const situationImg = log.situation ? `<img src="./images/icons/${log.situation}.png">` : '';
    let attachmentHTML = '';
    let messageTextHTML = log.msg ? `<p class="msg-text">${log.msg}</p>` : '';

    if (log.attachments) {
        if (log.images && log.images.length > 0) {
            log.images.forEach(image => {
                attachmentHTML += `<img src="${image.path}" class="attachment">`;
            });
        } 
        if (log.videos && log.videos.length > 0) {
            log.videos.forEach(video => {
                attachmentHTML += `<video src="${video.path}" class="attachment" controls autoplay mute></video>`;
            });
        } 
        if (log.documents && log.documents.length > 0) {
            log.documents.forEach(document => {
                attachmentHTML += `<a href="${document.path}" class="attachment" download>${document.name}</a>`;
            });
        }
        if (log.links && log.links.length > 0) {
            log.links.forEach(link => {
                attachmentHTML += `<a href="${link.url}" class="attachment" target="_blank">${link.name}</a>`;
            });
        }
    }

    return `
    <div class="msg-row ${log.type}">
        <div class="msg ${log.type}">
            ${attachmentHTML}
            ${messageTextHTML}
            <div class="right-bottom">
                <span class="time">${log.time}</span>
                ${log.type === 'sent' ? situationImg : ''}
            </div>
            <div class="img-hover menu-hover">
                <img src="./images/icons/down.png">
            </div>
            <div class="img-hover emoji-hover">
                <img src="./images/icons/reaction.png">
            </div>
            <div class="menu white-bg">
                <ul>
                    <li>${log.type === 'sent' ? 'Message info' : ''}</li>
                    <li>Reply</li>
                    <li>React</li>
                    <li>Forward</li>
                    <li>Pin</li>
                    <li>Star</li>
                    <li>${log.type === 'recieved' ? 'Report' : ''}</li>
                    <li>Delete</li>
                </ul>
            </div>
        </div>
    </div>
    `;
}

function sendMessage(data, type, index) {
    const msg = $("#send").val().trim();

    const date = new Date().toLocaleString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    const msg_log = {
        date: date,
        time: time,
        msg: msg,
        type: "sent",
        attachments: false,
        situation: "unread",
        images: [],
        videos: [],
        documents: [],
        links: [],
    };

    data.chat_log.push(msg_log);

    localStorage.setItem('whatsapp_log', JSON.stringify(data)); 

    DetailsChange(type, index);
    
}


const chat_date = "";
function createChatHTML(chat, type) {
    const chatlogs = chat.chat_log.map(log => createMessageHTML(log)).reverse().join('');

    return `
    <div class="chat-screen">
        <div class="header default-bg">
            <div class="left">
                ${chat.profile_pic ? 
                    `<div class="profile-pic" style="background-image: url(${chat.profile_pic}); background-repeat: no-repeat; background-size: cover;"></div>` :
                    `<div class="profile-pic">
                        <img src="./images/icons/${type === 'group' ? 'group-user' : 'user'}.png" class="user">
                    </div>`
                }
                <h3 class="contact-name">${chat.name}</h3>
            </div>
            <div class="right">
                <button>
                    <img src="./images/icons/video.png" onclick="startVideoCall()">
                    <img src="./images/icons/voice.png" onclick="startVoiceCall()">
                </button>
                <div class="btns">
                    <img src="./images/icons/search.png" class="search-chat">
                    <img src="./images/icons/menu.png" class="menu-btn">
                </div>
                <div class="menu white-bg">
                    <ul>
                        <li>Contact info</li>
                        <li>Select messages</li>
                        <li>Close chat</li>
                        <li>Mute notifications</li>
                        <li>Disappearing messages</li>
                        <li>Clear chat</li>
                        <li>Delete chat</li>
                        <li>Report</li>
                        <li>Block</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="msg-box">
            ${chatlogs}
            <div class="date-day on-top">
                <h4>${chat_date}</h4>
            </div>
            <div class="date-day">
                <h4>${chat_date}</h4>
            </div>
        </div>

        <div class="footer default-bg">
            <div class="doc-menu white-bg">
                <ul>
                    <li>
                        <div class="attach-doc">
                            <img src="./images/icons/menu-doc.png">
                            <p>Document</p>
                        </div>
                    </li>
                    <li>
                        <div class="attach-pv">
                            <img src="./images/icons/menu-pv.png">
                            <p>Photos & video</p>
                        </div>
                    </li>
                    <li>
                        <div class="attach-pv-click">
                            <img src="./images/icons/menu-cam.png">
                            <p>Camera</p>
                        </div>
                    </li>
                    <li>
                        <div class="attach-contact">
                            <img src="./images/icons/menu-user.png">
                            <p>Contact</p>
                        </div>
                    </li>
                    <li>
                        <div class="attach-poll">
                            <img src="./images/icons/menu-poll.png">
                            <p>Poll</p>
                        </div>
                    </li>
                    <li>
                        <div class="create-sticker">
                            <img src="./images/icons/menu-sticker.png">
                            <p>New sticker</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="btns">
                <img src="./images/icons/emoji.png">
                <img src="./images/icons/attach.png" class="menu-attach">
            </div>
            <div class="type-msg">
                <input autocomplete="off" type="text" placeholder="Type a message" class="white-bg" id="send">
            </div>
            <div class="btns">
                <img src="./images/icons/send.png" style="display: none;" class="send">
                <img src="./images/icons/mic.png" class="record">
            </div>
        </div>
    </div>
    `;
}


//Msg box
$(".msg-row .menu-hover").each(function() {
    $(this).on("click", function() {
        $(this).siblings(".menu").toggle();
    });
});


//Camera
function initializeCamera() {
    return `
    <div class="camera-click">
        <div class="header">
            <div class="btns">
                <img src="./images/icons/cancel-white.png">
            </div>
            <p>Take Photo</p>
        </div>
        <div class="cam-video">
            <video id="cam" autoplay></video>
        </div>
        <button class="click">
            <img src="./images/icons/camera.png">
        </button>
    </div>
    `;
}

let vidStream;

function startCamera() {
    $(".camera-click").show();

    let accessDevice = navigator.mediaDevices;

    if (!accessDevice || !accessDevice.getUserMedia) {
        console.log("getUserMedia() not supported.");
        return;
    }

    accessDevice.getUserMedia({
        audio: true,
        video: true
    })
    .then(function(stream) {
        vidStream = stream;
        var video = $("#cam")[0];
        if ("srcObject" in video) {
            video.srcObject = stream;
        } else {
            video.src = window.URL.createObjectURL(stream);
        }
        video.onloadedmetadata = function(e) {
            video.play();
        };
    })
    .catch(function(e) {
        console.log(e.name + ": " + e.message);
    });
}

function stopCamera() {
    if (vidStream) {
        vidStream.getTracks().forEach(track => track.stop());
    }

    $(".camera-click").hide();
}



//Call
function initializeCall(chat) {
    const bgHTML = `
    ${chat.profile_pic ? 
        `<div class="profile-pic" style="background-image: url(${chat.profile_pic}); background-repeat: no-repeat; background-size: cover;"></div>` :
        `<div class="profile-pic">
            <img src="./images/icons/${type === 'group' ? 'group-user' : 'user'}.png" class="user">
        </div>`
    }

    <p class="name">${chat.name}</p>
    <p class="current-msg">Ringing...</p>

    <div class="video-screen" style="display: none;">
        <video id="webcam" autoplay></video>
    </div>
    `;

    $(".call .bg").append(bgHTML);
}

let audioStream;

function startVoiceCall() {
    $(".call").show();

    let accessDevice = navigator.mediaDevices;

    if (!accessDevice || !accessDevice.getUserMedia) {
        console.log("getUserMedia() not supported.");
        return;
    }

    accessDevice.getUserMedia({
        audio: true
    })
    .then(function(stream) {
        audioStream = stream;
    })
    .catch(function(e) {
        console.log(e.name + ": " + e.message);
    });
}

function startVideoCall() {
    $(".video-screen").show();
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
    .then(function(stream) {
        vidStream = stream;
        var video = $("#webcam")[0];
        if ("srcObject" in video) {
            video.srcObject = stream;
        } else {
            video.src = window.URL.createObjectURL(stream);
        }
        video.onloadedmetadata = function(e) {
            video.play();
        };
    })
    .catch(function(e) {
        console.log(e.name + ": " + e.message);
    });
}

function stopCall() {
    if (vidStream) {
        vidStream.getTracks().forEach(track => track.stop());
    }
    else if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }
    $(".video-screen").hide();
    $(".call").hide();
}

$(".call .header .close").click(function() {
    stopCall();
});



//For closing extra windows
function close(element) {
    $(element).hide();
}




//Profile info
function initProfileInfo(chat) {
    function countAttachments(chat) {
        let totalImages = 0;
        let totalVideos = 0;
        let totalDocuments = 0;
        let totalLinks = 0;
    
        chat.chat_log.forEach(log => {
            if (log.attachments) {
                if (log.images && log.images.length > 0) {
                    totalImages += log.images.length;
                }
                if (log.videos && log.videos.length > 0) {
                    totalVideos += log.videos.length;
                }
                if (log.documents && log.documents.length > 0) {
                    totalDocuments += log.documents.length;
                }
                if (log.links && log.links.length > 0) {
                    totalLinks += log.links.length;
                }
            }
        });
    
        return (totalImages + totalVideos + totalDocuments + totalLinks);
    }
    

    function getLastThreeMediaLogs(chatLogs) {
        const mediaLogs = chatLogs.filter(log => log.attachments && (log.images.length > 0 || log.videos.length > 0));
        return mediaLogs.slice(-3).reverse();
    }

    const lastThreeMediaLogs = getLastThreeMediaLogs(chat.chat_log);
    let mediaHTML = '';

    lastThreeMediaLogs.forEach(log => {
        if (log.images && log.images.length > 0) {
            log.images.forEach(image => {
                mediaHTML += `<div class="attach default-bg"><img src="${image.path}"></div>`;
            });
        } else if (log.videos && log.videos.length > 0) {
            log.videos.forEach(video => {
                mediaHTML += `<div class="attach default-bg"><video src="${video.path}"></video></div>`;
            });
        }
    });

    profileHTML = `
    <div class="profile-header white-bg">
        <div class="heading">
            <img src="./images/icons/cancel.png" class="close">
            <p>Contact Info</p>
        </div>
        ${chat.profile_pic ? 
            `<div class="profile-pic" style="background-image: url(${chat.profile_pic}); background-repeat: no-repeat; background-size: cover;"></div>` :
            `<div class="profile-pic">
                <img src="./images/icons/${type === 'group' ? 'group-user' : 'user'}.png" class="user">
            </div>`
        }
        <div class="contact-name">${chat.name}</div>
        <div class="number"></div>
    </div>

    <div class="about white-bg">
        <div class="head"><span>About</span></div>
        <p class="about-them">${chat.about}</p>
    </div>

     <div class="media white-bg">
        <div class="head">
            <span>Media, links and docs</span>
            <span>${countAttachments(chat)} <img src="./images/icons/next.png"></span>
        </div>
        <div class="media-row">
            ${mediaHTML}
        </div>
    </div>

    <div class="info white-bg">
        <div class="row">
            <div class="left">
                <img src="./images/icons/star.png">
                <p>Starred messages</p>
            </div>
            <img src="./images/icons/next.png">
        </div>
        <div class="horizontal-divider default-bg"></div>
        <div class="row">
            <div class="left">
                <img src="./images/icons/bell.png">
                <p>Mute notifications</p>
            </div>
            <label class="switch">
                <input autocomplete="off" type="checkbox">
                <span class="slider round"></span>
            </label>
        </div>
        <div class="row">
            <div class="left">
                <img src="./images/icons/timer.png">
                <div>
                    <p>Disappearing messages</p>
                    <p class="small">Off</p>
                </div>
            </div>
            <img src="./images/icons/next.png">
        </div>
        <div class="row">
            <div class="left">
                <img src="./images/icons/lock.png">
                <div>
                    <p>Encryption</p>
                    <p class="small">Messages are end-to-end encrypted. Click to verify.</p>
                </div>
            </div>
        </div>
        <div class="horizontal-divider default-bg"></div>

        <div class="head">n groups in common</div>
        <div class="group-row"></div>
    </div>

    <div class="options white-bg">
        <div class="row">
            <img src="./images/icons/block.png">
            <p>Block ${chat.name}</p>
        </div>
        <div class="row">
            <img src="./images/icons/report.png">
            <p>Report ${chat.name}</p>
        </div>
        <div class="row">
            <img src="./images/icons/delete.png">
            <p>Delete chat</p>
        </div>
    </div>
    `;

    $(".profile-info").html(profileHTML);

    $(".profile-info .profile-header .close").click(function() {
        close($(this).closest(".profile-info"));
        $("#details").css("width", "calc(100vw - 29vw - 60px)");
    });
}




// Search tab
function initSearchTab(chat) {
    const searchHTML = `
    <div class="search-header white-bg">
        <div class="heading">
            <img src="./images/icons/cancel.png" class="close">
            <p>Search messages</p>
        </div>
        <div class="filter">
            <img src="./images/icons/calendar.png">
            <div class="search default-bg">
                <div class="img">
                    <img src="./images/icons/search.png" class="search-icon">
                </div>
                <input autocomplete="off" type="text" placeholder="Search">
                <img src="./images/icons/cancel.png" class="cancel">
            </div>
        </div>
    </div>
    <div class="horizontal-divider default-bg"></div>

    <div class="content white-bg">
        <p class="comment">Search for messages with ${chat.name}.</p>
    </div>
    `;

    $(".search-tab").html(searchHTML);

    $(".search-tab .search-header .close").click(function() {
        close($(this).closest(".search-tab"));
        $("#details").css("width", "calc(100vw - 29vw - 60px)");
    });
}