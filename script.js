function saveDataToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    }
    catch (e) {
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            console.error('Local storage quota exceeded.');
            // Optionally, handle the error by clearing old items or notifying the user
        }
    }
}

function getDataFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function init() {
    clearMaster();
    $(".chat-room").show();
    setupNavigationFiltering();
    masterChatLogs();
}


var my_profile = wpData.users[0];

$(document).ready(() => {
    const storedData = getDataFromLocalStorage('wpData');
    if (storedData) {
        wpData = storedData;
        my_profile = wpData.users[0];
    }

    init();
    defaultDetails();
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
        } 
        else {
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

    $(".chat-room .chat-list").html(groupsHTML.join('') + contactsHTML.join(''));

    $("#master .chat-room .chat").on('click', function() {
        if ($(this).attr("group-index") !== undefined) {
            DetailsChange("group", parseInt($(this).attr("group-index")));
        } 
        else if ($(this).attr("contact-index") !== undefined) {
            DetailsChange("contact", parseInt($(this).attr("contact-index")));
        }
    });

    $(document).on('click', '#master .contacts-list .chat', function() {
        if ($(this).attr("contact-index") !== undefined) {
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

    let currentLetter = '';

    return sortedContacts.map((contact, index) => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        let labelHtml = '';

        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            labelHtml = `
                <div class="label">
                    <p>${currentLetter}</p>
                </div>
            `;
        }

        return `
            ${labelHtml}
            <div class="chat contact" contact-index="${index}">
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
                            ${contact.about ? 
                                `<p>${contact.about}</p>`:
                                `<br>`
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
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
    } 
    else if (type === 'contact') {
        data = my_profile.contacts[index];
    }

    $("#details").html(createChatHTML(data, type));

    $(".chat-screen .header .left").on("click", function() {
        initProfileInfo(data, type);
        $(".profile-info").show();
        $("#details").css("width", "calc((100vw - 29vw - 60px)/2 + 42px)");
    });

    $(".voice-call").click(() => {
        startVoiceCall(data);
    });

    $(".video-call").click(() => {
        startVideoCall(data);
    });

    $(".call .header .close, .call .end-call").click(function() {
        stopCall(data);
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

    initializeCall(data, type);

    $(".menu-attach").on("click", function() {
        $(this).toggleClass("clicked");
        $(".doc-menu").toggle();
    });

    $(".attach-doc").click(() => {
        uploadDoc(data, type, index);
    });

    $(".attach-pv").click(() => {
        uploadPV(data, type, index);
    });

    $(".attach-pv-click").click(() => {
        openCamera(data, type, index);
    });

    $('.chat-screen .footer .send-msg').on('keyup', function() {
        if ($(this).val().trim().length > 0) {
            $('.send').show();
            $('.record').hide();
        } 
        else {
            $('.send').hide();
            $('.record').show();
        }
    });

    $(".send").click(function() {
        const msg = $(this).closest(".footer").find(".send-msg").val().trim();
        if (msg.length > 0) {
            sendMessage(msg, data, type, index);
            $(this).closest(".footer").find(".send-msg").val("");
        }
    });

    $(".attachment.docm .btns.download").click(function() {
        const filename = $(this).closest(".data").find(".up").val();
        if (data.chat_log[data.chat_log.length - 1].documents.name === filename) {
            const path = data.chat_log[data.chat_log.length - 1].documents.path;
            window.location.href = path;
        }
    });
}


function editDocHTML() {
    return `
    <div class="edit-doc">
        <div class="edit-row">

        </div>
        <div class="d">
            No file preview
        </div>
        <iframe src="" frameborder=0 class="d-pdf"></iframe>
        <div class="send-footer">
            <div class="type-caption">
                <input autocomplete="off" type="text" placeholder="Add a caption" class="white-bg send-caption">
            </div>
            <div class="btns">
                <img src="./images/icons/view-once.png">
            </div>
            <button class="send-pv">
                <img src="./images/icons/send-white.png">
            </button>
        </div>
    </div>
    `;
}

function editImageHTML() {
    return `
    <div class="edit-image">
        <div class="edit-row">

        </div>
        <div class="d" style="display: none;"></div>
        <video class="v" style="display: none;" controls mute autoplay></video>
        <canvas class="pv" width="640" height="480"></canvas>
        <div class="send-footer">
            <div class="type-caption">
                <input autocomplete="off" type="text" placeholder="Add a caption" class="white-bg send-caption">
            </div>
            <div class="btns">
                <img src="./images/icons/view-once.png">
            </div>
            <button class="send-pv">
                <img src="./images/icons/send-white.png">
            </button>
        </div>
    </div>
    `;
}

let currdate = '';
function createMessageHTML(log, type) {
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
                attachmentHTML += `
                <div class="attachment docm" role="button">
                    <div class="doc-info">
                        <div class="type-img">
                            <img src="./images/icons/${document.type}.png">
                        </div>
                        <div class="data">
                            <div class="up">${document.name}</div>
                            <div class="down">
                                <div class="pages">
                                    ${document.pg_count} pages
                                </div>
                                <div class="type">
                                    ${document.type}
                                </div>
                                <div class="size">
                                    ${document.size}
                                </div>
                            </div>
                        </div>
                        <div class="btns download">
                            <img src="./images/icons/download.png">
                        </div>
                    </div>
                </div>
                `;
            });
        }
        if (log.links && log.links.length > 0) {
            log.links.forEach(link => {
                attachmentHTML += `<a href="${link.url}" class="attachment" target="_blank">${link.name}</a>`;
            });
        }
    }

    const date = log.date;
    let dateHTML = '';

    if (date !== currdate) {
        currdate = date;
        dateHTML = `
        <div class="date-day on-top">
            <h4>${date}</h4>
        </div>
        <div class="date-day">
            <h4>${date}</h4>
        </div>

        `;
    }

    return `
    <div class="msg-row ${log.type}">
        <div class="msg ${log.type}">
            ${type === 'group' ? `
                <div class="left-upper">
                    <a href="#">${log.by}</a>
                </div>`
            : ''}
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
                    <li>${log.type === 'received' ? 'Report' : ''}</li>
                    <li>Delete</li>
                </ul>
            </div>
        </div>
    </div>
    ${dateHTML}
    `;
}

function createChatHTML(chat, type) {
    currdate = '';
    const chatlogs = chat.chat_log.map(log => createMessageHTML(log, type)).reverse().join('');

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
                    <img src="./images/icons/video.png" class="video-call">
                    <img src="./images/icons/voice.png" class="voice-call">
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

        <div class="cam-tab">
            <div class="camera-click">
                <div class="header">
                    <div class="btns">
                        <img src="./images/icons/cancel-white.png" class="close">
                    </div>
                    <p>Take Photo</p>
                </div>

                <div class="snap-image">
                    <div class="cam-video">
                        <video id="cam" autoplay></video>
                    </div>
                    <button class="click">
                        <img src="./images/icons/camera.png">
                    </button>
                </div>

                ${editImageHTML()}
            </div>
        </div>

        <div class="doc-upload-tab">
            <div class="btns">
                <img src="./images/icons/cancel.png" class="close">
            </div>
            ${editDocHTML()}
        </div>

        <div class="pv-upload-tab">
            <div class="btns">
                <img src="./images/icons/cancel.png" class="close">
            </div>
            ${editImageHTML()}
        </div>

        <div class="msg-box">
            ${chatlogs}
        </div>

        <div class="footer default-bg">
            <div class="doc-menu white-bg">
                <ul>
                    <li class="attach-doc">
                        <div>
                            <img src="./images/icons/menu-doc.png">
                            <p>Document</p>
                        </div>
                    </li>
                    <li class="attach-pv">
                        <div>
                            <img src="./images/icons/menu-pv.png">
                            <p>Photos & video</p>
                        </div>
                    </li>
                    <li class="attach-pv-click">
                        <div>
                            <img src="./images/icons/menu-cam.png">
                            <p>Camera</p>
                        </div>
                    </li>
                    <li class="attach-contact">
                        <div>
                            <img src="./images/icons/menu-user.png">
                            <p>Contact</p>
                        </div>
                    </li>
                    <li class="attach-poll">
                        <div>
                            <img src="./images/icons/menu-poll.png">
                            <p>Poll</p>
                        </div>
                    </li>
                    <li class="create-sticker">
                        <div>
                            <img src="./images/icons/menu-sticker.png">
                            <p>New sticker</p>
                        </div>
                    </li>
                </ul>
                <input type="file" id="pv-upload" style="display: none;">
                <input type="file" id="doc-upload" style="display: none;">
            </div>
            <div class="btns">
                <img src="./images/icons/emoji.png">
                <img src="./images/icons/attach.png" class="menu-attach">
            </div>
            <div class="type-msg">
                <input autocomplete="off" type="text" placeholder="Type a message" class="white-bg send-msg">
            </div>
            <div class="btns">
                <img src="./images/icons/send.png" style="display: none;" class="send">
                <img src="./images/icons/mic.png" class="record">
            </div>
        </div>
    </div>
    `;
}


function createMsgLog(msg, type) {
    const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

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
        links: []
    };
    
    if (type === 'group') {
        msg_log.by = my_profile.name;
    }

    return msg_log;
}

function sendMessage(msg, data, type, index) {
    const msg_log = createMsgLog(msg, type);    

    data.chat_log.push(msg_log);

    saveDataToLocalStorage('wpData', wpData);

    init();
    DetailsChange(type, index);
}

function sendImage(caption, data, type, index, img_path) {
    const msg_log = createMsgLog(caption, type);

    msg_log.attachments = true;

    image_log = {path : img_path};
    msg_log.images.push(image_log);
    
    data.chat_log.push(msg_log);

    saveDataToLocalStorage('wpData', wpData);

    init();
    DetailsChange(type, index);
}

function sendVideo(caption, data, type, index, video_path) {
    const msg_log = createMsgLog(caption, type);

    msg_log.attachments = true;

    video_log = {path : video_path};
    msg_log.videos.push(video_log);
    
    data.chat_log.push(msg_log);

    saveDataToLocalStorage('wpData', wpData);

    init();
    DetailsChange(type, index);
}

function sendDoc(caption, data, type, index, doc_path, filetype, filename, filesize) {
    const msg_log = createMsgLog(caption, type);

    msg_log.attachments = true;

    function convertFileSize(filesize) {
        let kb = filesize / 1024;
        let mb = kb / 1024;
        let gb = mb / 1024;
    
        if (gb >= 1) {
            return gb.toFixed(2) + ' GB';
        } else if (mb >= 1) {
            return mb.toFixed(2) + ' MB';
        } else {
            return kb.toFixed(2) + ' KB';
        }
    }

    doc_log = {
        path: doc_path,
        type: filetype,
        name: filename,
        pg_count: 1,
        size: convertFileSize(filesize)
    };
    msg_log.documents.push(doc_log);
    
    data.chat_log.push(msg_log);

    saveDataToLocalStorage('wpData', wpData);

    init();
    DetailsChange(type, index);
}


//Msg box
$(".msg-row .menu-hover").each(function() {
    $(this).on("click", function() {
        $(this).siblings(".menu").toggle();
    });
});


//Document
function uploadDoc(data, type, index) {
    $(".doc-menu").hide();
    $(".menu-attach").removeClass("clicked");

    $("#doc-upload").attr("accept", ".pdf,.docx,.xlsx,.pptx,.zip,.txt");
    $("#doc-upload").off('change');
    $("#doc-upload").click();

    $("#doc-upload").change((event) => {
        const file = event.target.files[0];
        if (file) {
            console.log(file);
            $(".msg-box, .chat-screen .footer").hide();
            $(".doc-upload-tab").show();

            const reader = new FileReader();
            reader.readAsDataURL(file);

            const name = file.name;
            const ftype = file.name.split('.').pop().toUpperCase();
            const size = file.size;

            reader.onload = (e) => {
                const result = e.target.result;

                if (file.type.startsWith("application/pdf")) {
                    $(".doc-upload-tab .d").hide();
                    $(".doc-upload-tab .d-pdf").show().prop("src", result);
                } else if (file.type.startsWith("application/")) {
                    $(".doc-upload-tab .d").show();
                    $(".doc-upload-tab .d-pdf").hide();
                }

                $(".doc-upload-tab .send-pv").off('click').on('click', () => {
                    const caption = $(".doc-upload-tab").find("input").val();
                    sendDoc(caption, data, type, index, result, ftype, name, size);
                    $(".doc-upload-tab").find("input").val("");
                });
            };
        }
    });

    $(".doc-upload-tab .close").click(function() {
        $(this).closest(".doc-upload-tab").hide();
        $(".msg-box, .chat-screen .footer").show();
    });
}


//Photos & Videos
function uploadPV(data, type, index) {
    $(".doc-menu").hide();
    $(".menu-attach").removeClass("clicked");

    $("#pv-upload").off('change');
    $("#pv-upload").click();

    $("#pv-upload").change((event) => {
        const file = event.target.files[0];
        if (file) {
            $(".msg-box, .chat-screen .footer").hide();
            $(".pv-upload-tab").show();

            const canvas = $(".pv-upload-tab").find(".pv")[0];
            const context = canvas.getContext("2d");
            const videoElement = $(".pv-upload-tab").find(".v")[0];

            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = (e) => {
                const result = e.target.result;

                if (file.type.startsWith("image/")) {
                    $(".pv-upload-tab canvas").show();
                    $(".pv-upload-tab .v").hide();

                    const img = new Image();
                    img.onload = () => {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        context.drawImage(img, 0, 0, canvas.width, canvas.height);
                    };
                    img.src = result;

                    $(".pv-upload-tab .send-pv").off('click').on('click', () => {
                        const caption = $(".pv-upload-tab").find("input").val();

                        sendImage(caption, data, type, index, img.src);
                        $(".pv-upload-tab").find("input").val("");
                    });
                } 
                else if (file.type.startsWith("video/")) {
                    console.log("Handling video file.");

                    $(".pv-upload-tab canvas").hide();
                    $(".pv-upload-tab .v").show();

                    videoElement.src = result;

                    $(".pv-upload-tab .send-pv").off('click').on('click', () => {
                        const caption = $(".pv-upload-tab").find("input").val();
                        sendVideo(caption, data, type, index, videoElement.src);
                        $(".pv-upload-tab").find("input").val("");
                    });
                }
            };
        }
    });

    $(".pv-upload-tab .close").click(function() {
        $(this).closest(".pv-upload-tab").hide();
        $(".msg-box, .chat-screen .footer").show();
    });
}




//Camera
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

function openCamera(data, type, index) {
    $(".doc-menu").hide();
    $(".menu-attach").removeClass("clicked");

    startCamera();
    $(".cam-tab").show();
    $(".edit-image").hide();

    $(".msg-box, .chat-screen .footer").hide();

    $(".camera-click .close").click(function() {
        $(this).closest(".cam-tab").hide();
        stopCamera();
        $(".msg-box, .chat-screen .footer").show();
    });

    const canvas = $(".pv")[0];
    const context = canvas.getContext('2d');
    const video = $('#cam')[0];

    $(".click").click(() => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        $(".snap-image").hide();
        $(".edit-image").show();
    });

    $(".camera-click .send-pv").click(function() {
        const snap = canvas.toDataURL('image/png');
    
        if (vidStream) {
            vidStream.getTracks().forEach(track => track.stop());
        }
    
        const msg = $(this).closest(".send-footer").find(".send-caption").val();
        
        sendImage(msg, data, type, index, snap);
        $(this).closest(".send-footer").find(".send-caption").val("");
    });
}




//Call
function initializeCall(chat, type) {
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

function startVoiceCall(data) {
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

    const currDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const currTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    log = {
        date: `${currDate}`,
        time: `${currTime}`,
        duration: Date.now(),
        type: "voice" 
    }

    data.call_log.push(log);

    saveDataToLocalStorage('wpData', wpData);
}

function startVideoCall(data) {
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

    const currDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const currTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    log = {
        date: `${currDate}`,
        time: `${currTime}`,
        duration: Date.now(),
        type: "video" 
    }

    data.call_log.push(log);

    saveDataToLocalStorage('wpData', wpData);
}

function calcDuration(log) {
    callStart = log.duration;

    duration = Date.now() - callStart;

    let totalSeconds = Math.floor(duration / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    log.duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function stopCall(data) {
    if (vidStream) {
        vidStream.getTracks().forEach(track => track.stop());
    }
    else if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }
    $(".video-screen").hide();
    $(".call").hide();

    lastLog = data.call_log[data.call_log.length - 1];

    calcDuration(lastLog);

    saveDataToLocalStorage('wpData', wpData);
}




//For closing extra windows
function close(element) {
    $(element).hide();
}




//Profile info
function initProfileInfo(chat, type) {
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
        const mediaLogs = chatLogs.filter(log => log.attachments && (log.images.length > 0 || log.videos.length > 0 || log.documents.length > 0 || log.links.length > 0));
        return mediaLogs.slice(-3).reverse();
    }

    const lastThreeMediaLogs = getLastThreeMediaLogs(chat.chat_log);
    let mediaHTML = '';

    lastThreeMediaLogs.forEach(log => {
        if (log.images && log.images.length > 0) {
            log.images.forEach(image => {
                mediaHTML += `<div class="attach default-bg"><img src="${image.path}"></div>`;
            });
        }
        if (log.videos && log.videos.length > 0) {
            log.videos.forEach(video => {
                mediaHTML += `<div class="attach default-bg"><video src="${video.path}"></video></div>`;
            });
        }
        if (log.documents && log.documents.length > 0) {
            log.documents.forEach(document => {
                mediaHTML += `<div class="attach default-bg"><img src="./images/icons/${document.type}.png" alt="${document.name}"></div>`;
            });
        }
        if (log.links && log.links.length > 0) {
            log.links.forEach(link => {
                mediaHTML += `<div class="attach default-bg"><a href="${link.path}"></a></div>`;
            });
        }
    });

    const profileHTML = `
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

    $(".profile-info .media .head img").click(() => {
        initMediaPage(chat);
        $(".media-page").show();
        $(".profile-info").hide();

        $(".media-page .close").click(() => {
            close($(this).closest(".media-page"));
            $("#details").css("width", "calc(100vw - 29vw - 60px)");
        });
    });
}





//Search tab
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

    $(".search-tab input").on("keyup", function() {
        if ($(this).val().trim().length > 0) {
            $('.cancel').show();
            $('.search-icon').hide();

            let input = $(this).val().toLowerCase();

            let searchList = chat.chat_log.filter(log => log.msg.toLowerCase().includes(input));

            let resultsHTML = '';
            for (let i = 0; i < searchList.length; i++) {
                resultsHTML += `
                <div class="search-row">
                    <div class="left-upper" time="${searchList[i].time}">${searchList[i].date}</div>
                    <img src="./images/icons/${searchList[i].situation}.png">
                    <div class="searched-msg">
                        ${searchList[i].msg.length > 50 ? searchList[i].msg.substring(0, 50) + "..." : searchList[i].msg}
                    </div>
                </div>
                <div class="horizontal-divider default-bg"></div>
                `;
            }

            $(".search-tab .content").html(resultsHTML);

            $(".search-tab").on("click", ".search-row", function() {
                const msg = $(this).find(".searched-msg").text().trim();
                const time = $(this).find(".left-upper").attr("time");
            
                $(".chat-screen .msg").each(function() {
                    const chatMsg = $(this).find(".msg-text").text().trim();
                    const chatTime = $(this).find(".time").text();
                    
                    if (chatMsg === msg && chatTime === time) {
                        $(this).get(0).scrollIntoView({ behavior: 'smooth', block: 'start' });
                        return false;
                    }
                });
            });

            $(".search-tab").on("click", ".cancel", function() {
                $(".search-tab input").val("");

                $('.cancel').hide();
                $('.search-icon').show();

                $(".search-tab .content").empty();
            });
        }
        else {
            $('.cancel').hide();
            $('.search-icon').show();
        }
    });
}   




//Media page
let currMonth = '';
function extractMonthFromDate(dateString) {
    const dateParts = dateString.split("-");
    const month = parseInt(dateParts[1], 10);

    const monthNames = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];

    return monthNames[month - 1];
}

function initMediaPage(data) {
    let mediaRowsHTML = '';
    let docRowsHTML = '';
    let linkRowsHTML = '';
    let currMonth = '';

    data.chat_log.forEach(log => {
        const date = log.date;
        const month = extractMonthFromDate(date);

        let mediaHTML = '';
        let docHTML = '';
        let linkHTML = '';

        if (log.images && log.images.length > 0) {
            log.images.forEach(image => {
                mediaHTML += `
                <div class="attach default-bg"><img src="${image.path}"></div>
                `;
            });
        } 
        if (log.documents && log.documents.length > 0) {
            log.documents.forEach(document => {
                docHTML += `
                <div class="attach default-bg"><img src="./images/icons/${document.type}.png" alt="${document.name}"></div>
                `;
            });
        }
        if (log.links && log.links.length > 0) {
            log.links.forEach(link => {
                linkHTML += `
                <div class="attach default-bg"><a href="${link.path}"></a></div>
                `;
            });
        }

        if (mediaHTML !== '' || docHTML !== '' || linkHTML !== '') {
            if (month !== currMonth) {
                if (currMonth !== '') {
                    mediaRowsHTML += `</div>`;
                    docRowsHTML += `</div>`;
                    linkRowsHTML += `</div>`;
                }
                currMonth = month;
                mediaRowsHTML += `
                <div class="month">${currMonth}</div>
                <div class="row">
                `;
                docRowsHTML += `
                <div class="month">${currMonth}</div>
                <div class="row">
                `;
                linkRowsHTML += `
                <div class="month">${currMonth}</div>
                <div class="row">
                `;
            }

            if (mediaHTML !== '') {
                mediaRowsHTML += mediaHTML;
            }
            if (docHTML !== '') {
                docRowsHTML += docHTML;
            }
            if (linkHTML !== '') {
                linkRowsHTML += linkHTML;
            }
        }
    });

    mediaRowsHTML += `</div>`;
    docRowsHTML += `</div>`;
    linkRowsHTML += `</div>`;

    const mediaPageHTML = `
    <div class="media-header">
        <div class="top">
            <img src="./images/icons/back-white.png" class="close">
        </div>
        <ul>
            <li class="on">Media</li>
            <li>Docs</li>
            <li>Links</li>
        </ul>
    </div>
    <div class="media">${mediaRowsHTML}</div>
    <div class="docs">${docRowsHTML}</div>
    <div class="links">${linkRowsHTML}</div>
    `;

    $(".media-page").html(mediaPageHTML);

    $(".media-page .media").show();
    $(".media-page .docs, .media-page .links").hide();

    $(".media-page ul li").each(function() {
        $(this).click(() => {
            $(".media-page ul li").removeClass("on");
            $(this).addClass("on");
            $(".media-page .media, .media-page .docs, .media-page .links").hide();
            $(`.media-page .${$(this).text().toLowerCase()}`).show();
        });
    });

    $(".media-page .close").click(function() {
        close($(this).closest(".media-page"));
        $("#details").css("width", "calc(100vw - 29vw - 60px)");
    });
}