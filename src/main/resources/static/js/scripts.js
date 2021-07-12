//Blog Feature
function showListBlog(userId) {
    renderPersonalWallButton();
    renderLeftSideBar();
    renderRightSideBar();
    let url;
    if (userId == null) {
        url = "/blogs/detailed?limit=" + blogLimit;
    } else {
        url = "/users/" + userId + "/detailed-blogs?limit=" + blogLimit;
    }
    $.ajax({
        type: "GET",
        url: url,
        success: function (detailedBlogs) {
            //render blogs in timeline
            let contentBlog = "";
            if (detailedBlogs != undefined) {
                for (let i = 0; i < detailedBlogs.length; i++) {
                    contentBlog += getBlog(detailedBlogs[i]);
                }
            }
            document.getElementById('contentList').innerHTML = contentBlog;
            //render like button for blog you have been reacted
            for (let i = 0; i < detailedBlogs.length; i++) {
                renderLikeButton(detailedBlogs[i].id);
            }
        }
    })
}

function getBlog(detailedBlog) {
    let dateTimeString = detailedBlog.date.toString();
    let formattedDateTimeString = formatDateTime(dateTimeString);
    let blogHtmlContent = "" +
        `<div class="panel panel-default">
                <div class="panel-body">
                    <img src="${detailedBlog.profilePicture}" class="img-circle pull-left">
                     <a href="/wall/${detailedBlog.username}" style='padding-left: 6px'>${detailedBlog.fullName}</a>

                    <div class="clearfix">
                    <i style='padding-left: 6px'>
                        ${formattedDateTimeString}
                        <i class="fa fa-globe" aria-hidden="true"></i>
                    </i>
                    </div>
                    <hr>
                    <p>${detailedBlog.content}</p>
                    <hr>
                    <div>
                        <a style="text-decoration: none; color: black" onclick="renderDetailedReactionListModal(${detailedBlog.id})" href="#">
                            <span>${detailedBlog.reactionCount} reactions</span>
                        </a>
                        <span>${detailedBlog.commentCount} comments</span>
                    </div>
                    <form>
                        <div class="input-group">
                            <div class="input-group-btn">

                            <div class="btn-group dropup">
                                    <button type="button" onmouseover="renderBlogReactModal(${detailedBlog.id})" data-toggle="dropdown" class="btn btn-secondary dropdown-toggle">
                                        <img id="like-btn-icon-${detailedBlog.id}" src="/files/like.png" alt="LIKE" height="19px">
                                        <span id="like-btn-span-${detailedBlog.id}" style='padding-left: 5px' >Like</span>
                                    </button>
                                <div class="dropdown-menu">
                                    <div class="blog-react-modal-body">
                                    </div>
                                </div>
                            </div id="blog-btn-group">
                                <button type='button' onclick="renderComment(${detailedBlog.id})" class="btn btn-default" data-toggle="collapse" data-target="#collapse${detailedBlog.id}, #collapse1${detailedBlog.id}">
                                    <i class="fa fa-comments"></i>
                                    <span style='padding-left: 5px'>Bình Luận</span>
                                </button>`;

    if ((localStorage.getItem("userId") == detailedBlog.userId)
        || (localStorage.getItem("roles") == "ROLE_ADMIN")) {
        blogHtmlContent +=
                                `<button type='button' class="btn btn-default" onclick="deleteBlog(${detailedBlog.id})">
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                    <span style='padding-left: 5px'>Delete</span>
                                </button>`
    };
    blogHtmlContent +=
                            `</div>
                                <div id="collapse${detailedBlog.id}" class="collapse">
                                    <input id="commentBlog${detailedBlog.id}" onkeypress="comment(event, ${detailedBlog.id})"
                                     class="form-control" placeholder="Add a comment.." type="text">
                                </div>
                        </div>
                        <div id="collapse1${detailedBlog.id}" class="collapse">
                            <div class="fb-status-container fb-border fb-gray-bg">
                                <div id="whoLikes${detailedBlog.id}" class="fb-time-action like-info">  
                                </div>
                            </div>
                            <hr>
                            <ul class="fb-comments" style='list-style-type: none;'>
                                <span id="commentBody${detailedBlog.id}" >

                                </span>
                            </ul>
                           <div class="clearfix"></div>
                           </div>
                        </div>
                    </form>
                </div>
            </div>`;
    return blogHtmlContent;
}

function renderLikeButton(blogId) {
    let userId = localStorage.getItem("userId");
    let url = "/users/" + userId + "/blogs/" + blogId + "/blog-reactions";
    $.ajax({
        type: "GET",
        url: url,
        success: function (blogReaction) {
            let likeButtonThumbId = "like-btn-icon-" + blogId;
            let likeButtonSpanId = "like-btn-span-" + blogId;
            document.getElementById(likeButtonThumbId).src = blogReaction.reaction.icon;
            document.getElementById(likeButtonSpanId).style.color = blogReaction.reaction.color;
            document.getElementById(likeButtonSpanId).style.fontWeight = "bold";
            document.getElementById(likeButtonSpanId).innerHTML = blogReaction.reaction.name;
        }
    });
}

function createBlog() {
    let content = $('#status').val();
    let blog = {
        content: content,
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(blog),
        url: "/blogs",
        success: function (data) {
            console.log(data);
            showListBlog(getWallOwnerId());
        }
    });
}

//Right Side Bar Rendering
function renderRightSideBar() {
    renderTopBlogs();
}

function renderTopBlogs() {
    $.ajax({
        type: "GET",
        url: "/blogs/top",
        success: function (topBlogs) {
            let topBlogContent = "";
            for (let i = 0; i < topBlogs.length; i++) {
                let topBlog = topBlogs[i];
                let blogPreview = topBlog.content;
                if (blogPreview.length > 10) blogPreview = blogPreview.substring(0, 20) + "...";
                topBlogContent +=
                    `<a href="/wall/${topBlog.username}" class="list-group-item">
                        <span>"${blogPreview}"</span><br>
                        <span style="font-weight: bold">${topBlog.fullName}</span><br>
                        <span>${topBlog.reactionCount} <i class="fa fa-smile-o" aria-hidden="true"></i></span>
                        <span>${topBlog.commentCount} <i class="fa fa-comments" aria-hidden="true"></i></span>
                    </a>`;
            }
            $('#top-blog-div').html(topBlogContent);
        }
    });
}

//Left Side Bar Rendering
function renderLeftSideBar() {
    renderTopFriends();
}

function renderTopFriends() {
    let userId = localStorage.getItem("userId");
    let url = "/users/" + userId + "/top-friends"
    $.ajax({
        type: "GET",
        url: url,
        success: function (topFriends) {
            let topFriendContent = "";
            for (let i = 0; i < topFriends.length; i++) {
                let topFriend = topFriends[i];
                topFriendContent +=
                    `<a onclick="showMessageModal(${topFriend.id})" class="list-group-item" href="#">
                        <img src="${topFriend.profilePicture}" alt="${topFriend.username}" class="img-circle" width="50px" height="50px"><br>
                        <span style="font-weight: bold">${topFriend.fullName}</span><br>
                        <span>${topFriend.messagesExchanged}</span>
                        <i class="fa fa-envelope-o" aria-hidden="true"></i>
                    </a>`;
            }
            $('#top-friend-div').html(topFriendContent);
        }
    });
}

//React Feature
function renderDetailedReactionListModal(blogId) {
    let url = "/blogs/" + blogId + "/blog-reactions";
    $.ajax({
        type: "GET",
        url: url,
        success: function (blogReactions) {
            let modalBodyContent = "<ul style='list-style-type: none'>";
            for (let i = 0; i < blogReactions.length; i++) {
                let blogReaction = blogReactions[i];
                modalBodyContent +=
                    `<li style="margin-bottom: 5px">
                            <img src="${blogReaction.reaction.icon}" alt="${blogReaction.reaction.name}" width="20px">
                            <span> ${blogReaction.user.fullName}</span>
                        </li>`;
            }
            modalBodyContent += "</ul>";
            $('#detailed-reaction-list-modal-body').html(modalBodyContent);
        }
    });
    $('#detailed-reaction-list-modal').modal('show');
    event.preventDefault();
}

function renderBlogReactModal(blogId) {
    $.ajax({
        type: "GET",
        url: "/reactions",
        success: function (reactions) {
            let modalBody = "";
            for (let i = 0; i < reactions.length; i++) {
                modalBody += renderReaction(blogId, reactions[i]);
            }
            $('.blog-react-modal-body').html(modalBody);
        },
    });
}

function renderReaction(blogId, data) {
    return "" +
        `<a onclick="reactToBlog(${blogId},${data.id})" style="margin: 0px 5px; text-decoration: none" class="blog-react-a-body">
            <img src="${data.icon}" alt="${data.name}" width="20px">
        </a>`
}

function reactToBlog(blogId, reactionId) {
    if (localStorage.getItem("token") != null) {
        let blogReaction = {
            blog: {
                id: blogId,
            },
            reaction: {
                id: reactionId,
            }
        }
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token"),
            },
            type: "POST",
            data: JSON.stringify(blogReaction),
            url: "/blog-reactions",
            success: function (savedBlogReaction) {
                console.log(savedBlogReaction);
                showListBlog(getWallOwnerId());
                renderWhoLikes(blogId);
                checkNotifications(blogId, userId);
            }
        });
    } else {
        alert("Please login first!");
    }
}

function checkNotifications(blogId, userId) {
    let url = "/blogs/" + blogId;
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            checkNewReaction(data, userId);
        }
    });
}

function checkNewReaction(blog, userIdReact) {
    let userIdBlog = blog.user.id;
    let content = "";
    if (userIdBlog == userIdReact) {
        content = notificationBody(1)
        document.getElementById("notification").innerHTML = content;
    } else {
        content = notificationBodyWithoutReact()
        document.getElementById("notification").innerHTML = content;
    }
}

function notificationBody(number) {
    return "" +
        `<a data-toggle="dropdown">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
            </svg>
            <div id="countNotification" style="width: 17px;height: 17px;position: absolute;text-align: center;border-radius: 50%;background: red;color: white;right: 2px;top: 4px;">
                ${number}
            </div>
            <ul class="dropdown-menu" id="contentNotification">
                
            </ul>
        </a>`
}

function notificationBodyWithoutReact() {
    return "" +
        `<a data-toggle="dropdown">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
            </svg>
            <ul class="dropdown-menu">
                <li>
                    <a href="#">
                    <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                          fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
                          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                          </svg>
                    </span>
                    Setting</a>
                </li>
            </ul>
        </a>`
}

function renderDropDownNotification(blog) {
    document.getElementById("countNotification").style.display = "none";
    let blogId = blog.id;
    let url = "/blogs/" + blogId + "/blog-reactions";
    $.ajax({
        type: "GET",
        url: url,
        success: function (blogReactions) {
            let content = "";
            for (let i = 0; i < blogReactions.length; i++) {
                content += `<li>
                               <a href="#">${blogReactions[i].user.username} <span> đã thích bài của bạn!</span></a>
                           </li>`
            }
            $('#contentNotification').html(content);
        }
    });
}

//Messaging Feature
function renderMessageModal(friendId, userId) {
    renderMessageModalTitle(friendId);
    renderMessageModalBody(friendId, userId);
    renderMessageSendButton(friendId, userId);
}

function renderMessageModalTitle(friendId) {
    let url = "/users/" + friendId;
    $.ajax({
        type: "GET",
        url: url,
        success: function (friendUser) {
            console.log(friendUser);
            $('#message-modal-title').html(friendUser.fullName);
        }
    });
}

function renderMessageModalBody(friendId, userId) {
    let url = "/messages/user/" + userId + "/user/" + friendId;
    $.ajax({
        type: "GET",
        url: url,
        success: function (privateMessages) {
            let modalBodyContent = "";
            if (privateMessages != undefined) {
                for (let i = 0; i < privateMessages.length; i++) {
                    let privateMessage = privateMessages[i];
                    if (privateMessage.receiver.id == friendId) {
                        modalBodyContent += modalBodyContentPersonal(privateMessage)
                    } else {
                        modalBodyContent += modalBodyContentUser(privateMessage);
                    }
                }
            }
            scroll();
            $('#message-modal-body').html(modalBodyContent);
        }
    });
}

function scroll() {
    let div = $('#message-modal-body')
    return div.animate({scrollTop: 9999999999999999999999999999999999});
}

function modalBodyContentPersonal(privateMessage) {
    return "" +
        `<div class='message-content${privateMessage.id}' style="margin-bottom: 30px;">
            <div style='text-align: end'>
                <p style='width: 100%'>${privateMessage.content}</p>
            </div>
        </div>`
}

function modalBodyContentUser(privateMessage) {
    return "" +
        `<div class='message-content${privateMessage.id}' style="margin-bottom: 20px">
            <img src="${privateMessage.receiver.profilePicture}" height="40px" width="40px" class="img-circle" >
            <span>${privateMessage.content}</span>
        </div>`
}

function renderMessageSendButton(friendId, userId) {
    let buttonContent =
        `<button onclick="sendMessage(${friendId},${userId})" class="btn btn-default btn-primary" type="button">Send</button>`;
    $('#message-send-button').html(buttonContent);
}

function sendMessage(friendId, userId) {
    let messageContent = $('#message-text-area').val();
    if (messageContent != "") {
        let message = {
            sender: {
                id: userId,
            },
            receiver: {
                id: friendId,
            },
            content: messageContent,
        };
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(message),
            url: "/messages",
            success: function (sentMessage) {
                console.log("message has been sent");
                console.log(sentMessage)
                renderMessageModal(friendId, userId);
                showListBlog(getWallOwnerId());
            }
        });
    }
    $('#message-text-area').val("");
}

function showMessageModal(friendId) {
    let userId = localStorage.getItem("userId");
    renderMessageModal(friendId, userId);
    $('#message-modal').modal('show');
    event.preventDefault();
}

function hideMessageModal() {
    $('#message-modal').modal('hide');
}

//Friend List Feature
function showFriends() {
    $.ajax({
        type: "GET",
        url: "/users",
        success: function (listUser) {
            let content = ""
            for (let i = 0; i < listUser.length; i++) {
                content += getBodyModalFriends(listUser[i])
            }
            document.getElementById("modal-friend-body").innerHTML = content;
        }
    });
    $('#modalFriends').modal('show');
}

function getBodyModalFriends(listUser) {
    return "" +
        `<div class="well well-sm">
                <div class="media">
                    <a class="thumbnail pull-left" href="#" style="width: 50px; height: 50px">
                        <img class="img-circle" src="${listUser.profilePicture}" style="width: 100%; height: 100%;">
                    </a>
                    <div class="media-body">
                        <h4 class="media-heading">${listUser.username}</h4>
                        </p>
                        <p>
                            <a onclick="showMessageModal(${listUser.id})" class="btn btn-xs btn-default">
                            <i class="fa fa-comments" aria-hidden="true"></i> Message</a>
                        </p>
                    </div>
                </div>
            </div>`
}

//Other functions
function goToPersonalWall() {
    let url = "/wall/" + localStorage.getItem("username");
    window.location.href = url;
}

function logout() {
    localStorage.clear();
    window.location.href = "/logout";
}

function formatDateTime(dateTimeString) {
    let year = dateTimeString.substring(0, 4);
    let month = dateTimeString.substring(5, 7);
    let day = dateTimeString.substring(8, 10);
    return year + "-" + month + "-" + day;
}

function loadMoreBlogs() {
    blogLimit += 5;
    showListBlog(getWallOwnerId());
}

function renderPersonalWallButton() {
    $('.personal-wall-button').html(localStorage.getItem("fullName"));
    event.preventDefault();
}

function getWallOwnerId() {
    let userId = null;
    let userIdElement = document.getElementById("user-id");
    if (userIdElement != null) {
        userId = userIdElement.value;
    }
    return userId
}

//Comment Feature
//Create Comment
function comment(event, blogId) {
    if (event.keyCode === 13) {
        if (localStorage.getItem("token") != null) {
            let commentBlog = $('#commentBlog' + blogId).val();
            let comment = {
                blog: {
                    id: blogId,
                },
                content: commentBlog,
            }
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token"),
                },
                type: "POST",
                data: JSON.stringify(comment),
                url: "/comment-blog",
                success: function (blogId) {
                    renderComment(blogId);
                    showListBlog(getWallOwnerId());
                }
            });
            event.preventDefault();
        } else {
            alert("Please login first!");
        }
    }
}

function renderComment(blogId) {
    $.ajax({
        type: "GET",
        url: "/comment-blog/" + blogId,
        success: function (comments) {
            let userId = localStorage.getItem("userId");
            let content = "";
            for (let i = 0; i < comments.length; i++) {
                if ((userId == comments[i].user.id) || (localStorage.getItem("roles") == "ROLE_ADMIN")){
                    content += getBodyComment(comments[i])
                } else {
                    content += getBodyCommentWithoutUserId(comments[i])
                }
            }
            document.getElementById("commentBody" + blogId).innerHTML = content;
            renderWhoLikes(blogId);
        }
    });
}

function getBodyCommentWithoutUserId(comments) {
    return "" +
        `<li>
                <a href="#" class="cmt-thumb">
                    <img src="${comments.user.profilePicture}" style="width: 40px; height: 40px"
                         class="img-circle pull-left">
                </a>
                <div class="cmt-details" style='margin-top: 25px'>
                    <a style='padding-left: 5px' href="#">${comments.user.username}</a>
                    <p style='padding-left: 45px'>${comments.content} - <a href="#" class="like-link">Like</a></p>
                </div>
            </li>
        <hr>`
}

function renderWhoLikes(blogId) {
    let url = "/blogs/" + blogId + "/blog-reactions";
    $.ajax({
        type: "GET",
        url: url,
        success: function (blogReactions) {
            let contentBlog = "";
            let countBlogReaction = blogReactions.length - 1;
            if (blogReactions.length <= 1) {
                for (let i = 0; i < blogReactions.length; i++) {
                    contentBlog += `<a href="#">${blogReactions[i].user.username}</a>`
                }
            } else {
                for (let i = 0; i < 1; i++) {
                    contentBlog += `<a href="#">${blogReactions[i].user.username}</a>
                                    <span>and</span>
                                    <a onclick="renderDetailedReactionListModal(${blogId})">${countBlogReaction} more</a>`
                }
            }
            document.getElementById("whoLikes" + blogId).innerHTML = contentBlog + "<span> like this</span>";
        }
    });
}

function getBodyComment(comments) {
    return "" +
        `<li>
                    <div id="editButton" class="dropdown pull-right">
                        <button class="btn p-0" type="button" id="dropdownMenuButton1" data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">
                            <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                        </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>
                                    <a onclick="showModalEditComment(${comments.id}, ${comments.blog.id})" class="dropdown-item "
                                    style="text-decoration: none; border: none">
                                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                    <span class="" style="padding-left: 5px">Edit</span></a>
                                </li>
                                <li>
                                    <a onclick="deleteComment(${comments.id}, ${comments.blog.id})" class="dropdown-item"
                                    style="text-decoration: none; border: none">
                                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                                    <span class="" style="padding-left: 5px">Delete</span></a>
                                </li>
                            </ul>
                    </div>
                <a href="#" class="cmt-thumb">
                    <img src="${comments.user.profilePicture}" style="width: 40px; height: 40px"
                         class="img-circle pull-left">
                </a>
                <div class="cmt-details" style='margin-top: 25px'>
                    <a style='padding-left: 5px' href="#">${comments.user.username}</a>
                    <p style='padding-left: 45px'>${comments.content} - <a href="#" class="like-link">Like</a></p>
                </div>
            </li>
        <hr>`
}

//Edit Comment
function showModalComment() {
    $('#edit-comment-modal').modal('show');
}

function hideModalComment() {
    $('#edit-comment-modal').modal('hide');
}

function showModalEditComment(commentId, blogId) {
    $.ajax({
        type: "GET",
        url: "/comment-blog/comment/" + commentId,
        success: function (data) {
            $('#edit-comment-modal-body').html(renderModalComment(data, blogId));
            showModalComment();
        }
    });
}

function renderModalComment(comment, blogId) {
    return "" +
        `<div class="form-group">
                 <input id="old-blog-id" value="${blogId}" type="hidden" class="form-control">
            </div>
            <div class="form-group">
                 <input id="old-comment-id" value="${comment.id}" type="hidden" class="form-control">
            </div>
            <div class="form-group">
                <label for="new-content" class="col-form-label">Content:</label>
                <input id="new-content" value="${comment.content}" type="text" class="form-control" >
            </div>`
}

//update Comment
function updateComment() {
    let commentId = $('#old-comment-id').val();
    let content = $('#new-content').val();
    let blogId = $('#old-blog-id').val();
    let comment = {
        id: commentId,
        content: content,
        blog: {
            id: blogId,
        }
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token"),
        },
        type: "POST",
        data: JSON.stringify(comment),
        url: "/comment-blog/",
        success: function () {
            console.log("Update success!");
            renderComment(blogId);
            hideModalComment();
        }
    });
}

// Delete Comment
function deleteComment(commentId, blogId) {
    $.ajax({
        type: "POST",
        url: "/comment-blog/" + commentId,
        success: function () {
            renderComment(blogId);
        }
    });
    event.preventDefault();
}

//Render User Profile
function getUserProfile(userId) {
    let url = "/users/" + userId;
    //ajax
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token"),
        },
        type: "GET",
        url: url,
        success: function (user) {
            renderUserProfile(user);
            renderEditModal(user);
        },
        error: function () {
            console.log("failed to get user profile");
        }
    });
}

function renderUserProfile(user) {
    document.getElementById("user-profile-avatar").src = user.profilePicture;
    document.getElementById("user-profile-username").innerHTML = user.fullName;
    document.getElementById("user-profile-description").innerHTML = user.description;

    //Message button
    let buttonGroupContent =
        `<button onclick="showMessageModal(${getWallOwnerId()})" class="btn btn-default btn-sm tip btn-responsive">
            <i class="fa fa-envelope-o" aria-hidden="true"></i>
            Message
        </button>`;
    //Only show edit button for authenticated wall owner
    if (user.id == localStorage.getItem("userId")) {
        buttonGroupContent +=
            `<button onclick="showEditModal(${user.id})" class="btn btn-default btn-sm tip btn-responsive">
                <i class="fa fa-pencil" aria-hidden="true"></i>
                Edit profile
            </button>`;
    }
    $('#user-profile-btn-group').html(buttonGroupContent);
}

function renderEditModal(user) {
    let modalBodyContent =
        `<div class="form-group">
            <label for="new-full-name" class="col-form-label">Full name:</label>
            <input id="new-full-name" value="${user.fullName}" type="text" class="form-control" >
        </div>
        <div class="form-group">
            <label for="new-description" class="col-form-label">About me:</label>
            <input id="new-description" value="${user.description}" type="text" class="form-control" >
        </div>
        <div class="form-group">
            <img width="200px" src="${user.profilePicture}">
        </div>
        <div class="form-group">
            <input id="old-profile-pic" value="${user.profilePicture}" type="hidden" class="form-control">
        </div>
        <div class="custom-file">
            <label class="custom-file-label" for="new-profile-pic">Profile pic...</label>
            <input type="file" id="new-profile-pic" class="custom-file-input">
        </div>
        <div class="form-group">
            <label for="new-password" class="col-form-label">Password:</label>
            <input type="password" id="new-password" placeholder="Enter new password" class="form-control" >
        </div>`

    $('#edit-profile-modal-body').html(modalBodyContent);
}

//Edit Profile Feature
function showEditModal() {
    let url = "/users/" + localStorage.getItem("userId");
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token"),
        },
        type: "GET",
        url: url,
        success: function (user) {
            renderEditModal(user);
        }
    });
    $('#edit-profile-modal').modal('show');
    event.preventDefault();
}

function hideEditModal() {
    $('#edit-profile-modal').modal('hide');
}

function updateUserProfile() {
    //get new info
    let newFullName = $('#new-full-name').val();
    let newDescription = $('#new-description').val();
    let newPassword = $('#new-password').val();
    let newProfilePicture = $('#old-profile-pic').val();
    //upload image file if present
    let imageFile = $('#new-profile-pic')[0].files[0];
    if (imageFile != undefined) {
        newProfilePicture = "/files/" + imageFile.name;
        let file = new FormData();
        file.append("file", imageFile);
        $.ajax({
            url: '../upload',
            data: file,
            enctype: 'multipart/form-data',
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            type: 'POST', // For jQuery < 1.9
            success: function (fileName) {
                console.log(fileName + " uploaded successfully");
            },
        });
    }
    //save user
    let userId = getWallOwnerId();
    let user = {
        id: userId,
        fullName: newFullName,
        description: newDescription,
        password: newPassword,
        profilePicture: newProfilePicture,
    };
    let url = "/users/" + userId;
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token"),
        },
        type: "POST",
        data: JSON.stringify(user),
        url: url,
        success: function (user) {
            console.log(user);
            localStorage.setItem("fullName", user.fullName);
            hideEditModal();
            renderUserProfile(user);
            showListBlog(getWallOwnerId());
        },
        error: function () {
            console.log("failed to update user profile");
        }
    });
}

// Edit Blog
function showModalEditBlog(blogId) {
    let url = "/blogs/" + blogId;
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token"),
        },
        type: "GET",
        url: url,
        success: function (blog) {
            renderEditBlogModal(blog);
            showEditBlogModal();
        }
    });
    event.preventDefault();
}

function showEditBlogModal() {
    $('#edit-blog-modal').modal('show');
}

function hideEditBlogModal() {
    $('#edit-blog-modal').modal('hide');
}

function renderEditBlogModal(blog) {
    let modalBodyContent =
        `<div class="form-group">
                <input id="old-blog-id" value="${blog.id}" type="hidden" class="form-control">
            </div>
            <div class="form-group">
                <label for="new-content" class="col-form-label">Content:</label>
                <input id="new-content" value="${blog.content}" type="text" class="form-control" >
            </div>`;

    $('#edit-blog-modal-body').html(modalBodyContent);
}

function updateBlog() {
    //update new blog
    let blogId = $('#old-blog-id').val();
    let content = $('#new-content').val();
    //update blog
    let blog = {
        id: blogId,
        content: content,
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(blog),
        url: "/blogs/",
        success: function (data) {
            let userId = $('#user-id').val();
            console.log("Update Blog success!")
            getUserBlogs(userId);
            hideEditBlogModal();
        }
    });
    event.preventDefault();
}

function deleteBlog(blogId) {
    let url = "/blogs/" + blogId;
    $.ajax({
        type: "DELETE",
        url: url,
        success: function (deletedBlog) {
            showListBlog(getWallOwnerId());
        }
    });
    event.preventDefault();
}

//Render User Blogs (Obsolete)
function getUserBlogs(userId) {
    let url = "/users/" + userId + "/detailed-blogs?limit=" + blogLimit;
    //ajax
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token"),
        },
        type: "GET",
        url: url,
        success: function (detailedBlogs) {
            renderUserBlogs(detailedBlogs);
        },
        error: function () {
            console.log("failed to get user's blogs");
        }
    });
}

function renderUserBlogs(detailedBlogs) {
    let userBlogContent = ""
    for (let i = 0; i < detailedBlogs.length; i++) {
        let detailedBlog = detailedBlogs[i];
        let detailedBlogDate = detailedBlog.date;
        // let formattedDetailedBlogDate = formatDateTime(detailedBlogDate);
        userBlogContent +=
            `<div class="col-md-12" style="margin-bottom: 10px">
            <div class="card rounded">
              <div class="card-header">
                <div class="d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center">
                    <img class="img-circle rounded-circle" src="${detailedBlog.profilePicture}" alt="">
                    <div class="ml-2">
                      <p><span>${detailedBlog.fullName}</span></p>
                      <p class="tx-11 text-muted"><span>${detailedBlog.date}</span></p>
                    </div>
                  </div>
                  <div class="dropdown">
                    <button class="btn p-0" type="button" id="dropdownMenuButton2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal icon-lg pb-3px">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton2">

                       <a onclick="showModalEditBlog(${detailedBlog.id})" class="dropdown-item d-flex align-items-center" href="#">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                           </svg> <span class="" style="padding-left: 5px">Edit</span></a>

                      <a class="dropdown-item d-flex align-items-center" href="#topPage">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
                        </svg> <span class="" style="padding-left: 5px">Go to top</span></a>

                      <a onclick="deleteBlog(${detailedBlog.id})" class="dropdown-item d-flex align-items-center" href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg> <span class="" style="padding-left: 5px">Delete</span></a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <p class="mb-3 tx-14"><span>${detailedBlog.content}</span></p>
              </div>
          </div>
        </div>`
    }
    $('#user-blog-div').html(userBlogContent);
}

//Search bar
function searchAndRenderResult(inputElement) {
    let keyword = inputElement.value;
    if (keyword != "") {
        keyword = keyword.replace(" ", "-");
        let userUrl = "/users/name/" + keyword;
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token"),
            },
            type: "GET",
            url: userUrl,
            success: function (userResults) {
                renderUserSearchResult(userResults);
            },
        });
        let blogUrl = "/blogs/content/" + keyword;
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token"),
            },
            type: "GET",
            url: blogUrl,
            success: function (blogResults) {
                renderBlogSearchResult(blogResults);
            },
        });
    } else {
        document.getElementById("user-search-result-div").innerHTML = "";
        document.getElementById("blog-search-result-div").innerHTML = "";
    }
}

function renderUserSearchResult(userResults) {
    let searchResultContent = "<div><span style='font-weight: bold'>Users: </span></div>";
    for (let i = 0; i < userResults.length; i++) {
        let userResult = userResults[i];
        searchResultContent +=
            `<div style="width: 500px">
                <a href="/wall/${userResult.username}">
                    <img src="${userResult.profilePicture}" alt="${userResult.username}" class="img-circle" width="50px" height="50px">
                    <span style="font-weight: bold">${userResult.fullName}</span>
                    <span>(@${userResult.username})</span>                
                </a>
            </div><br>`;
    }
    document.getElementById("user-search-result-div").innerHTML = searchResultContent;
}

function renderBlogSearchResult(blogResults) {
    let searchResultContent = "<div><span style='font-weight: bold'>Blogs: </span></div>";
    for (let i = 0; i < blogResults.length; i++) {
        let blogResult = blogResults[i];
        searchResultContent +=
            `<div style="width: 500px">
                <a href="/wall/${blogResult.user.username}">
                    <img src="${blogResult.user.profilePicture}" alt="${blogResult.user.username}" class="img-circle" width="50px" height="50px">
                    <span style="font-weight: bold">${blogResult.user.fullName}</span>
                    <span>(@${blogResult.user.username})</span><br>
                    <span>"${blogResult.content}"</span>
                </a>
            </div><br>`;
    }
    document.getElementById("blog-search-result-div").innerHTML = searchResultContent;
}