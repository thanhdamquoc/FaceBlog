//Initialization:
let blogLimit;
window.onload = function () {
    blogLimit = 5;
    showListBlog();
    $('.personal-wall-button').html(localStorage.getItem("fullName"));
}

//Functions:
//Blog Feature
function showListBlog() {
    let url = "/blogs/sorted?limit=" + blogLimit;
    $.ajax({
        type: "GET",
        url: url,
        success: function (detailedBlogs) {
            //render blogs in timeline
            let contentBlog = "";
            for (let i = 0; i < detailedBlogs.length; i++) {
                contentBlog += getBlog(detailedBlogs[i]);
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
    return "" +
        `<div class="panel panel-default">
                <div class="panel-body">
                    <img src="${detailedBlog.profilePicture}" class="img-circle pull-left">
                     <a href="/wall/${detailedBlog.username}" style='padding-left: 6px'>${detailedBlog.username}</a>

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
                            </div>

                                <button type='button' onclick="renderComment(${detailedBlog.id})" class="btn btn-default" data-toggle="collapse" data-target="#collapse${detailedBlog.id}, #collapse1${detailedBlog.id}">
                                <i class="fa fa-comments"></i>
                                    <span style='padding-left: 5px'>Bình Luận</span>
                                </button>
                            </div>
                            <div id="collapse${detailedBlog.id}" class="collapse">
                                <input id="commentBlog${detailedBlog.id}" onkeypress="comment(event, ${detailedBlog.id})"
                                 class="form-control" placeholder="Add a comment.." type="text">
                            </div>
                        </div>
                        <div id="collapse1${detailedBlog.id}" class="collapse">
                            <div class="fb-status-container fb-border fb-gray-bg">
                                <div class="fb-time-action like-info">
                                    <a href="#">Jhon Due,</a>
                                    <a href="#">Danieal Kalion</a>
                                    <span>and</span>
                                    <a href="#">40 more</a>
                                <span>like this</span>
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
            </div>`
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
            document.getElementById(likeButtonSpanId).style.color = "blue";
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
            showListBlog();
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
                    `<li>
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
        `<a onclick="reactToBlog(${blogId},${data.id})">
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
                showListBlog();
            }
        });
    } else {
        alert("Please login first!");
    }
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
                    modalBodyContent += `<div><img src="${privateMessage.sender.profilePicture}" width="50px" height="50px" class="img-circle"><span>${privateMessage.content}</span></div>`
                }
            }
            $('#message-modal-body').html(modalBodyContent);
        }
    });
}

function renderMessageSendButton(friendId, userId) {
    let buttonContent = `<button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="sendMessage(${friendId},${userId})">Send</button>`;
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
            }
        });
    }
    $('#message-text-area').val("");
}

function showMessageModal(friendId) {
    let userId = localStorage.getItem("userId");
    renderMessageModal(friendId, userId);
    $('#message-modal').modal('show');
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
                    <a class="thumbnail pull-left" href="#">
                        <img class="img-circle pull-left" width="100px" height="100px" src="${listUser.profilePicture}">
                    </a>
                    <div class="media-body">
                        <h4 class="media-heading">${listUser.username}</h4>
                        <p><span class="label label-info">10 photos</span> <span class="label label-primary">89 followers</span>
                        </p>
                        <p>
                            <a onclick="showMessageModal(${listUser.id})" class="btn btn-xs btn-default">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             class="bi bi-messenger" viewBox="0 0 16 16">
                            <path d="M0 7.76C0 3.301 3.493 0 8 0s8 3.301 8 7.76-3.493 7.76-8 7.76c-.81 0-1.586-.107-2.316-.307a.639.639 0 0 0-.427.03l-1.588.702a.64.64 0 0 1-.898-.566l-.044-1.423a.639.639 0 0 0-.215-.456C.956 12.108 0 10.092 0 7.76zm5.546-1.459-2.35 3.728c-.225.358.214.761.551.506l2.525-1.916a.48.48 0 0 1 .578-.002l1.869 1.402a1.2 1.2 0 0 0 1.735-.32l2.35-3.728c.226-.358-.214-.761-.551-.506L9.728 7.381a.48.48 0 0 1-.578.002L7.281 5.98a1.2 1.2 0 0 0-1.735.32z"/>
                            </svg> Message</a>
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
    blogLimit += 2;
    showListBlog();
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
                    showListBlog();
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
            let content = "";
            for (let i = 0; i < comments.length; i++) {
                content += getBodyComment(comments[i])
            }
            document.getElementById("commentBody" + blogId).innerHTML = content;
        }
    });
}

function getBodyComment(comments) {
    return "" +
        `<li>
                <a href="#" class="cmt-thumb">
                    <img src="${comments.user.profilePicture}" style="width: 40px; height: 40px"
                         class="img-circle pull-left">
                </a>
                <div class="cmt-details" style='margin-top: 25px'>
                    <a style='padding-left: 5px' href="#">${comments.user.username}</a>
                    <p style='padding-left: 45px'>${comments.content} - <a href="#" class="like-link">Like</a></p>

                    <div class="dropdown position-absolute top-50 end-0 translate-middle-y">
                        <button class="btn p-0" type="button" id="dropdownMenuButton2" data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">
                            <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                            <a onclick="showModalEditComment(${comments.id}, ${comments.blog.id})" class="dropdown-item d-flex align-items-center"
                               href="#">
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                <span class="" style="padding-left: 5px">Edit</span></a>

                            <a onclick="deleteComment(${comments.id}, ${comments.blog.id})" class="dropdown-item d-flex align-items-center"
                               href="#">
                                <i class="fa fa-trash-o" aria-hidden="true"></i>
                                <span class="" style="padding-left: 5px">Delete</span></a>
                        </div>
                    </div>

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
