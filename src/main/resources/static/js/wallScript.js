window.onload = function () {
    renderWall();
}

//Render User Profile
function renderWall() {
    let userId = $('#user-id').val();
    getUserProfile(userId);
    getUserBlogs(userId);
}

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
    let userProfileContent =
        `<img class="profile-pic" src="${user.profilePicture}" alt="profile">
                <span class="profile-name">${user.fullName}</span>`;

    //Only show edit button for authenticated wall owner
    if (user.id == localStorage.getItem("userId")) {
        let editUserProfileContent =
            `<div sec:authorize="isAuthenticated()">
                        <button onclick="showEditModal(${user.id})" class="btn btn-primary btn-icon-text btn-edit-profile">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit btn-icon-prepend">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                        Edit profile
                    </button>
                </div>`;
        $('#edit-user-profile-div').html(editUserProfileContent);
    }
    $('#user-profile-div').html(userProfileContent);
}

function renderEditModal(user) {
    let modalBodyContent =
        `<div class="form-group">
                <label for="new-full-name" class="col-form-label">Recipient:</label>
                <input id="new-full-name" value="${user.fullName}" type="text" class="form-control" >
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
    $('#edit-profile-modal').modal('show');
}

function hideEditModal() {
    $('#edit-profile-modal').modal('hide');
}

function updateUserProfile() {
    //get new info
    let newFullName = $('#new-full-name').val();
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
    let userId = $('#user-id').val();
    let user = {
        id: userId,
        fullName: newFullName,
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
            console.log(user + "updated");
            localStorage.setItem("fullName", user.fullName);
            hideEditModal();
            renderWall();
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
        type: "POST",
        url: url,
        success: function () {
            let userId = $('#user-id').val();
            console.log("Delete blog success!")
            getUserBlogs(userId);
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