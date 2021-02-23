"use Strict"

var
    AdministrationMethods = {

        showSelectedDivAndHideOthers: function showSelectedDivAndHideOthers(showDivId, hideDiv) {
            var showDiv = document.getElementById(showDivId),
                hideDiv = document.getElementById(hideDiv);
            $(hideDiv).fadeOut('slow', function() {
                $(showDiv).fadeIn('slow');
            });
        },

        printReport: function printReport(divId, reportHeader) {
            var mywindow = window.open('', 'Print Pop Up', 'height=900,width=1600'),
                data = document.getElementById(divId).innerHTML;
            mywindow.document.write('<html><head><title>' + reportHeader + '</title>');
            mywindow.document.write('<link rel="stylesheet" href="/public/all-pages-style.css">')
            mywindow.document.write('</head><body >');
            mywindow.document.write(data);
            mywindow.document.write('</body></html>');

            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/


            setTimeout(function() {
                mywindow.print();
                mywindow.close();
            }, 1000)
            return true;
        },

        showSelectedElementInDropdown: function showSelectedElementInDropdown(divId, personInputId) {
            $('#' + divId).on('click', function(e) {
                var myPersonInputId = document.getElementById(personInputId);
                if (this !== e.target)
                    myPersonInputId.value = e.target.text;
            });
        },

        redirectToAdminTab: function redirectToAdminTab(pageName) {
            document.location = 'http://localhost:1609/' + pageName;
        },

        takeUserInfoFromCookie: function takeUserInfoFromCookie() {
            var remember = $.cookie('remember');
            if (remember == 'true') {
                var userName = $.cookie('username'),
                    name = $.cookie('name'),
                    surname = $.cookie('surname');

                // autofill the fields
                document.getElementById('hUserName').innerHTML = name + ' ' + surname + ' - ' + userName;
            }
        },

        clearForNewUser: function clearForNewUser() {
            AdministrationMethods.fillUserStatisticsTable();

            var userId = $('#userTc').val();

            if (userId != '' || userId > 0) {
                toastr.warning(
                    "<br/><h21>You will lose your entered data if you click yes!<h21/><br/><br/><button type='button' id='clearConfirmBtn' class='inpatientBtn btn-danger' style='width: 315px !important;'>Yes</button>", 'Do you want to CLEAR form?', {
                        allowHtml: true,
                        progressBar: true,
                        timeOut: 10000,
                        onShown: function(toast) {
                            $("#clearConfirmBtn").on('click', function() {
                                AdministrationMethods.findAllUsers();
                                AdministrationMethods.getMaxUserId();
                                document.getElementById('saveUser').innerHTML = 'Save';

                                $("#userNickname").val('');
                                $("#userPassword").val('');
                                $("#userName").val('');
                                $("#userSurname").val('');
                                $("#userTc").val('');
                                $('#userPhotoId')[0].src = 'http://localhost:1609/public/images/Admin-2.png';

                                jQueryMethods.toastrOptions();
                                toastr.info('Form cleared for new user!', 'Form Cleared');
                            });
                        }
                    });
            }
        },

        updateOrSaveUserBtn: function updateOrSaveUserBtn() {
            $.ajax({
                type: "GET",
                url: "/admin/user/checkUserFromDatabase",
                data: { personalIdNumber: $("#userTc").val() },
                success: function(user) {
                    if (user.length != 0 || user != null) {
                        var btn = document.getElementById('saveUser');
                        btn.innerHTML = 'Update';
                    } else {
                        btn.innerHTML = 'Save';
                    }
                },

                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('User couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        saveUser: function saveUser() {
            var btn = document.getElementById('saveUser');

            if (btn.innerHTML == 'Update') {
                AdministrationMethods.updateUserData();
            } else {
                var myUserMajorDicipline = document.getElementById('userMajorDicipline'),
                    myUserGroup = document.getElementById('userGroup'),
                    myData = {
                        userId: $("#userId").val(),
                        userNickname: $("#userNickname").val(),
                        userPassword: $("#userPassword").val(),
                        userName: $("#userName").val(),
                        userSurname: $("#userSurname").val(),
                        userTc: $("#userTc").val(),
                        userPhotoSrc: $('#userPhotoId')[0].src
                    };

                myData.userMajorDicipline = myUserMajorDicipline.options[myUserMajorDicipline.selectedIndex].value;
                myData.userGroup = myUserGroup.options[myUserGroup.selectedIndex].value;

                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/admin/user/save',
                    success: function() {
                        jQueryMethods.toastrOptions();
                        toastr.success('User successfully saved!', 'User Save');
                        AdministrationMethods.findOneUser();
                        AdministrationMethods.getMaxUserId();
                        AdministrationMethods.fillUserStatisticsTable();

                        // reset form data
                        $("#userId").val('');
                        $("#userNickname").val('');
                        $("#userPassword").val('');
                        $("#userName").val('');
                        $("#userSurname").val('');
                        $("#userTc").val('');
                    },
                    error: function(e) {
                        jQueryMethods.toastrOptions();
                        toastr.error('User couldnt save! \n' + e, 'Error!')
                        console.log("ERROR: ", e);
                    }
                });
            }
        },

        findUsersAtOnce: function findUsersAtOnce() {
            var userTc = $('#userTc').val(),
                userListDiv = document.getElementById('userListDiv');

            if (userTc == '' || userTc <= 1 || userTc == null) {
                AdministrationMethods.findAllUsers();
                AdministrationMethods.fillUserStatisticsTable();
                AdministrationMethods.updateOrSaveUserBtn();
                userListDiv.style.width = '266%';
            } else {
                AdministrationMethods.findOneUser();
                AdministrationMethods.fillUserStatisticsTable();
                AdministrationMethods.updateOrSaveUserBtn();
                userListDiv.style.maxWidth = '300%';
                userListDiv.style.width = '300%';
            }
        },

        findAllUsers: function findAllUsers() {
            document.getElementById('usersList').style.fontSize = '13.5px';

            $('#usersList > tbody').empty();
            $.ajax({
                type: "GET",
                url: "/admin/user/all",
                success: function(result) {
                    $.each(result, function(i, users) {
                        i++;
                        $("#usersList> tbody").append(
                            "<tr class='userRow' id='userRowId" + i + "' onmouseover='AdministrationMethods.showUserPhotoOnHover(\"userRowId" + i + "\")' title=''><td class='idTd' title=''>" + users.userId + "</td><td>" + users.userName + "</td><td>" +
                            users.name + "</td><td>" + users.surname + "</td><td>" + users.personalIdNumber + "</td><td>" +
                            users.majorDicipline + "</td><td>" + users.userGroup + "<td class='photoSrcTd'>" +
                            users.userPhotoSrc + "</td><td>-</td></tr>");
                    });

                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Users couldnt list! \n' + message.err, 'Error!')
                    console.log("ERROR: ", e);
                }
            });
        },

        findOneUser: function findOneUser() {
            $('#usersList > tbody').empty();

            var myUserMajorDicipline = document.getElementById('userMajorDicipline'),
                myUserGroup = document.getElementById('userGroup'),
                userMajorDicipline = myUserMajorDicipline.options[myUserMajorDicipline.selectedIndex],
                userGroup = myUserGroup.options[myUserGroup.selectedIndex],
                userSearchInput = document.getElementById('userSearchInput');

            $.ajax({
                type: "GET",
                url: "/admin/user/findOneUser",
                data: { personalIdNumber: $("#userTc").val() },
                success: function(user) {
                    jQueryMethods.toastrOptions();
                    if (user.userId == '' || user.userId == null || user.userId == 'undefind') {
                        toastr.error('User couldnt find! \n\n\n', 'Error!')
                    } else {
                        $("#userId").val(user.userId);
                        $("#userNickname").val(user.userName);
                        $("#userPassword").val(user.userPassword);
                        $("#userName").val(user.name);
                        $("#userSurname").val(user.surname);
                        $("#userTc").val(user.personalIdNumber);
                        $('#userPhotoId')[0].src = user.userPhotoSrc;
                        userMajorDicipline = user.majorDicipline;
                        userGroup = user.userGroup;
                        userSearchInput.style.maxWidth = '93%';

                        $("#usersList> tbody").append(
                            "<tr class='userRow' id='userRow1' onmouseover='AdministrationMethods.showUserPhotoOnHover(\"userRow1\")' title=''><td class='idTd' title=''>" + user.userId + "</td><td>" + user.userName + "</td><td>" +
                            user.name + "</td><td>" + user.surname + "</td><td>" + user.personalIdNumber + "</td><td>" +
                            user.majorDicipline + "</td><td>" + user.userGroup + "</td><td class='photoSrcTd'>" + user.userPhotoSrc + "</td><td><button class='inpatientBtn btn-danger' title='Click for delete user.' onclick='AdministrationMethods.deleteUser()'>Delete</button></td></tr>");

                        toastr.info('User who has - ' + user.personalIdNumber + ' - id number found!', 'User Search');
                    }
                },

                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('User couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        deleteUser: function deleteUser() {
            toastr.warning(
                "<br/><br/><button type='button' id='deleteConfirmBtn' class='inpatientBtn btn-danger' style='width: 210px !important;'>Yes</button>", 'Do you want to DELETE user?', {
                    allowHtml: true,
                    progressBar: false,
                    timeOut: 10000,
                    onShown: function(toast) {
                        $("#deleteConfirmBtn").on('click', function() {
                            $.ajax({
                                type: "GET",
                                url: "/admin/user/deleteUser",
                                data: { personalIdNumber: $("#userTc").val() },
                                success: function() {
                                    jQueryMethods.toastrOptions();
                                    AdministrationMethods.findAllUsers();
                                    AdministrationMethods.getMaxUserId();

                                    toastr.success($("#userTc").val() + ' - ' + $("#userName").val() + ' - ' +
                                        $("#userSurname").val() + ' - Deleted!', 'User Delete');

                                    $("#userNickname").val('');
                                    $("#userPassword").val('');
                                    $("#userName").val('');
                                    $("#userSurname").val('');
                                    $("#userTc").val('');
                                },
                                error: function(e) {
                                    jQueryMethods.toastrOptions();
                                    toastr.error('User couldnt deleted! \n' + e.body, 'Error!')
                                    console.log("ERROR: ", e);
                                }
                            });
                        });
                    }
                });
        },

        resetPassword: function resetPassword() {
            var myData = {
                    userId: $("#userId").val(),
                    userPassword: $("#userPassword").val()
                },
                myUserPassword = $("#userPassword").val(),
                myUserTc = $("#userTc").val();

            if (myUserTc == '' || myUserTc.length <= 0) {
                jQueryMethods.toastrOptions();
                toastr.warning('Please select an user!', 'Select an user');
            } else {
                if (myUserPassword == '' || myUserPassword.length <= 0) {
                    jQueryMethods.toastrOptions();
                    toastr.warning('Please enter your new password!', 'Enter new password');
                } else {
                    $.ajax({
                        type: 'PUT',
                        data: JSON.stringify(myData),
                        cache: false,
                        contentType: 'application/json',
                        datatype: "json",
                        url: '/admin/user/resetPassword',
                        success: function() {
                            jQueryMethods.toastrOptions();
                            toastr.success('Password reseted!', 'Password Reset');
                            // AdministrationMethods.findOneUser();
                        },
                        error: function(e) {
                            jQueryMethods.toastrOptions();
                            toastr.error('User couldnt save! \n\n\n' + e.responseText, 'Error!')
                            console.log("ERROR: ", e.responseText);
                        }
                    });
                }
            }
        },

        updateUserData: function updateUserData() {
            var myUserMajorDicipline = document.getElementById('userMajorDicipline'),
                myUserGroup = document.getElementById('userGroup'),
                myData = {
                    userId: $("#userId").val(),
                    userNickname: $("#userNickname").val(),
                    userName: $("#userName").val(),
                    userSurname: $("#userSurname").val(),
                    userTc: $("#userTc").val()
                };

            myData.userMajorDicipline = myUserMajorDicipline.options[myUserMajorDicipline.selectedIndex].value;
            myData.userGroup = myUserGroup.options[myUserGroup.selectedIndex].value;

            $.ajax({
                type: 'PUT',
                data: JSON.stringify(myData),
                cache: false,
                contentType: 'application/json',
                datatype: "json",
                url: '/admin/user/updateUserData',
                success: function() {
                    jQueryMethods.toastrOptions();
                    AdministrationMethods.findOneUser();
                    toastr.success('User data updated!', 'User Data Update');
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error(userOrStaff + ' couldnt save! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        updatePhoto: function updatePhoto(userOrStaff) {
            var myData = {
                    userId: $("#userId").val(),
                    userPhoto: $('#userPhotoId')[0].src
                },
                myUserTc = $("#userTc").val();

            if (myUserTc == '' || myUserTc.length <= 0) {
                jQueryMethods.toastrOptions();
                toastr.warning('Please select a/an ' + userOrStaff + '!', 'Select an ' + userOrStaff + '');
            } else {
                $.ajax({
                    type: 'PUT',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/admin/user/updatePhoto',
                    success: function() {
                        jQueryMethods.toastrOptions();
                        toastr.success('Photo updated!', 'Photo Update');
                        // AdministrationMethods.findOneUser();
                    },
                    error: function(e) {
                        jQueryMethods.toastrOptions();
                        toastr.error(userOrStaff + ' couldnt save! \n\n\n' + e.responseText, 'Error!')
                        console.log("ERROR: ", e.responseText);
                    }
                });
            }
        },

        getMaxUserId: function getMaxUserId() {
            $.ajax({
                type: "GET",
                url: "/admin/user/getMaxUserId",
                success: function(user) {
                    if (user.length < 1) {
                        $("#userId").val(1);
                    } else {
                        $("#userId").val(user.userId + 1);
                        // console.log(user.userId);
                    }
                },

                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error("Couldn't get max id! \n\n\n' + e.responseText, 'Error!")
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        showUserPhotoOnHover: function showUserPhotoOnHover(userRowid) {
            var userNameSurname = $('#' + userRowid + '').children("td:nth-child(3)").text() + ' ' +
                $('#' + userRowid + '').children("td:nth-child(4)").text(),
                userMajorDicipline = $('#' + userRowid + '').children("td:nth-child(6)").text(),
                userGroup = $('#' + userRowid + '').children("td:nth-child(7)").text(),
                userIDText = $('#' + userRowid + '').children("td:nth-child(5)").text(),
                myPhotoSrc = $('#' + userRowid + ' #userNickname').val();

            myPhotoSrc = $('#' + userRowid + '').children("td:nth-child(8)").text();

            $(function() {
                s = '<table style="border-style:hidden;width:200px;box-shadow:0px 0px 15px 3px white;">';
                s += '<tr style="border-style:ridge;border:5px solid #761c54;"><img src="' + myPhotoSrc + '" style="width:200px; height:200px;align-items:center;box-shadow:"/> </td><td valign="top">' + userNameSurname + '</td></tr>';
                s += '<td class="Text">' + userMajorDicipline + ' - ' + userGroup + ' <br/>' + userIDText + '</td>';
                s += '</table>';
                $('#' + userRowid + '').tooltip({
                    content: s,
                    show: {
                        effect: "slideDown",
                        delay: 250,
                        track: true
                    },
                    position: {
                        my: "center top",
                        at: "center bottom-5",
                    }
                });
            });
        },

        fillUserStatisticsTable: function fillUserStatisticsTable() {
            var total = 0,
                userStatisticsCardBack = document.getElementById('userStatisticsCardBack');

            $('#userStatisticsTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/admin/user/fillUserStatisticsTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#userStatisticsTable> tbody").append(
                            "<tr class='userStatisticsRow'><td class='userGroup'>" +
                            docs[i]["_id"] + "</td><td class='userCount'>" + docs[i]["count"] + "</td></tr>");

                        total += docs[i]['count'];

                        // jQueryMethods.toastrOptions();
                        // toastr.info('User group counted!', 'User Count');
                    });

                    userStatisticsCardBack.innerHTML = 'User Statistics: <br> Total Staff = ' + total;
                },

                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('User group couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        // ========================== staff functions =============================
        clearForNewStaff: function clearForNewStaff() {
            AdministrationMethods.fillStaffStatisticsTable();

            var staffId = $('#staffTc').val();

            if (staffId != '' || staffId > 0) {
                toastr.warning(
                    "<br/><h21>You will lose your entered data if you click yes!<h21/><br/><br/><button type='button' id='clearConfirmBtn' class='inpatientBtn btn-danger' style='width: 315px !important;'>Yes</button>", 'Do you want to CLEAR form?', {
                        allowHtml: true,
                        progressBar: true,
                        timeOut: 10000,
                        onShown: function(toast) {
                            $("#clearConfirmBtn").on('click', function() {
                                AdministrationMethods.findAllStaffs();
                                AdministrationMethods.getMaxStaffId();

                                document.getElementById('saveStaff').innerHTML = 'Save';
                                document.getElementById('onLeaveChkbx').checked = false;
                                document.getElementById('staffLeaveStartDate').style.display = 'none';
                                document.getElementById('staffLeaveEndDate').style.display = 'none';
                                document.getElementById('staffLeaveStartDateLbl').style.display = 'none';
                                document.getElementById('staffLeaveEndDateLbl').style.display = 'none';

                                $("#staffTc").val('');
                                $("#staffName").val('');
                                $("#staffSurname").val('');
                                $("#staffDiplomaNo").val('');
                                $('#staffPhotoId')[0].src = 'http://localhost:1609/public/images/Admin-2.png';

                                jQueryMethods.toastrOptions();
                                toastr.info('Form cleared for new staff!', 'Form Cleared');
                            });
                        }
                    });
            }
        },

        updateOrSaveStaffBtn: function updateOrSaveStaffBtn() {
            var btn = document.getElementById('saveStaff');
            $.ajax({
                type: "GET",
                url: "/admin/staff/checkStaffFromDatabase",
                data: { staffIdNumber: $("#staffTc").val() },
                success: function(staff) {
                    if (staff.staffIdNumber == 0 || staff.staffIdNumber == null ||
                        staff.staffIdNumber == undefined || staff.staffIdNumber == 'undefined') {
                        btn.innerHTML = 'Save';
                    } else {
                        btn.innerHTML = 'Update';
                    }
                },

                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Staff couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        saveStaff: function saveStaff() {
            var btn = document.getElementById('saveStaff'),
                leaveChkbx = document.getElementById('onLeaveChkbx').checked;

            if (btn.innerHTML == 'Update') {
                AdministrationMethods.updateStaffData();
            } else {
                var myStaffMajorDicipline = document.getElementById('staffMajorDicipline'),
                    myStaffGroup = document.getElementById('staffGroup'),
                    myData = {
                        staffId: $("#staffId").val(),
                        staffTc: $("#staffTc").val(),
                        staffName: $("#staffName").val(),
                        staffSurname: $("#staffSurname").val(),
                        staffDiplomaNo: $("#staffDiplomaNo").val(),
                        staffPhotoSrc: $('#userPhotoId')[0].src
                    };

                if (leaveChkbx == true) {
                    myData.staffLeaveStartDate = $('#staffLeaveStartDate').val();
                    myData.staffLeaveEndDate = $('#staffLeaveEndDate').val()
                } else {
                    myData.staffLeaveStartDate = '';
                    myData.staffLeaveEndDate = '';
                }

                myData.staffMajorDicipline = myStaffMajorDicipline.options[myStaffMajorDicipline.selectedIndex].value;
                myData.staffGroup = myStaffGroup.options[myStaffGroup.selectedIndex].value;

                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/admin/staff/save',
                    success: function() {
                        jQueryMethods.toastrOptions();
                        toastr.success('Staff successfully saved!', 'Staff Save');
                        console.log(myData + ' = staffSave function sent me!')
                        AdministrationMethods.findAllStaffs();
                        AdministrationMethods.getMaxStaffId();
                        AdministrationMethods.fillStaffStatisticsTable();

                        // reset form data
                        $("#staffTc").val('');
                        $("#staffName").val('');
                        $("#staffSurname").val('');
                        $("#staffDiplomaNo").val('');
                    },
                    error: function(e) {
                        jQueryMethods.toastrOptions();
                        toastr.error('Staff couldnt save! \n' + e, 'Error!')
                        console.log("ERROR: ", e);
                    }
                });
            }
        },

        findStaffAtOnce: function findStaffAtOnce() {
            var userTc = $('#staffTc').val();

            if (userTc == '' || userTc <= 1) {
                AdministrationMethods.findAllStaffs();
                AdministrationMethods.fillUserStatisticsTable();
                AdministrationMethods.updateOrSaveStaffBtn();
            } else {
                AdministrationMethods.findOneStaff();
                AdministrationMethods.fillUserStatisticsTable();
                AdministrationMethods.updateOrSaveStaffBtn();
            }
        },

        findAllStaffs: function findAllStaffs() {
            $('#staffList > tbody').empty();
            var staffListDiv = document.getElementById('staffListDiv'),
                x = '---------';

            $.ajax({
                type: "GET",
                url: "/admin/staff/findAllStaffs",
                success: function(result) {
                    $.each(result, function(i, staff) {
                        staffListDiv.style.width = '262%'
                        staffListDiv.style.maxWidth = '262%'

                        if (staff.staffLeaveStartDate == '' ||
                            staff.staffLeaveStartDate == undefined ||
                            staff.staffLeaveStartDate == 'undefined') {
                            staff.staffLeaveStartDate = x;
                            staff.staffLeaveEndDate = x;
                        }

                        i++;
                        $("#staffList> tbody").append(
                            "<tr class='staffRow' id='staffRowId" + i + "' onmouseover='AdministrationMethods.showUserPhotoOnHover(\"staffRowId" + i + "\")' title='' style='background-color=''><td class='idTd' title=''>" + i + "</td><td>" +
                            staff.staffIdNumber + "</td><td>" +
                            staff.staffName + "</td><td>" + staff.staffSurname + "</td><td>" +
                            staff.staffDiplomaNo + "</td><td>" +
                            staff.majorDicipline + "</td><td>" + staff.staffGroup + "<td class='photoSrcTd'>" +
                            staff.staffPhotoSrc + "</td><td>" + staff.staffLeaveStartDate.substring(0, 10) + "</td><td>" +
                            staff.staffLeaveEndDate.substring(0, 10) + "</td><td>-</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Staff couldnt list! \n' + message.err, 'Error!')
                    console.log("ERROR: ", e);
                }
            });
        },

        findOneStaff: function findOneStaff() {
            $('#staffList > tbody').empty();
            var staffListDiv = document.getElementById('staffListDiv'),
                x = '-----------';

            $.ajax({
                type: "GET",
                url: "/admin/staff/findOneStaff",
                data: { staffIdNumber: $("#staffTc").val() },
                success: function(staff) {
                    jQueryMethods.toastrOptions();
                    if (staff.staffName == '' || staff.staffName == null || staff.staffName == 'undefined') {
                        toastr.error('Staff couldnt find! \n\n\n', 'Error!')
                    } else {
                        $("#staffId").val(staff.staffId);
                        $("#staffTc").val(staff.staffIdNumber);
                        $("#staffName").val(staff.staffName);
                        $("#staffSurname").val(staff.staffSurname);
                        $("#staffDiplomaNo").val(staff.staffDiplomaNo);
                        $('#staffPhotoId')[0].src = staff.staffPhotoSrc;
                        staffListDiv.style.width = '265%'
                        staffListDiv.style.maxWidth = '265%'

                        if (staff.staffLeaveStartDate == '' ||
                            staff.staffLeaveStartDate == undefined ||
                            staff.staffLeaveStartDate == 'undefined') {
                            staff.staffLeaveStartDate = x;
                            staff.staffLeaveEndDate = x;
                        }

                        $("#staffList> tbody").append(
                            "<tr class='userRow' id='userRow1' onmouseover='AdministrationMethods.showUserPhotoOnHover(\"userRow1\")' title=''><td class='idTd' title=''>" + staff.staffId + "</td><td>" + staff.staffIdNumber + "</td><td>" +
                            staff.staffName + "</td><td>" + staff.staffSurname + "</td><td>" + staff.staffDiplomaNo + "</td><td>" +
                            staff.majorDicipline + "</td><td>" + staff.staffGroup + "</td><td class='photoSrcTd'>" +
                            staff.staffPhotoSrc + "</td><td>" + staff.staffLeaveStartDate.substring(0, 10) + "</td><td>" +
                            staff.staffLeaveEndDate.substring(0, 10) + "</td><td><button class='inpatientBtn btn-danger' title='Click for delete user.' onclick='AdministrationMethods.deleteStaff()'>Delete</button></td></tr>");

                        toastr.info('Staff who has - ' + staff.staffIdNumber + ' - id number found!', 'User Search');
                    }
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Staff couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        deleteStaff: function deleteStaff() {
            toastr.warning(
                "<br/><h21>You will delete staff from database permanently!<h21/><br/><br/><button type='button' id='deleteConfirmBtn' class='inpatientBtn btn-danger' style='width: 210px !important;'>Yes</button>", 'Do you want to DELETE staff?', {
                    allowHtml: true,
                    progressBar: false,
                    timeOut: 10000,
                    onShown: function(toast) {
                        $("#deleteConfirmBtn").on('click', function() {
                            $.ajax({
                                type: "GET",
                                url: "/admin/staff/deleteStaff",
                                data: { staffIdNumber: $("#staffTc").val() },
                                success: function() {
                                    jQueryMethods.toastrOptions();
                                    toastr.success($("#staffTc").val() + ' - ' + $("#staffName").val() + ' - ' +
                                        $("#staffSurname").val() + ' - Deleted!', 'Staff Delete');
                                    AdministrationMethods.clearForNewStaff();
                                },
                                error: function(e) {
                                    jQueryMethods.toastrOptions();
                                    toastr.error('Staff couldnt deleted! \n' + e.body, 'Error!')
                                    console.log("ERROR: ", e);
                                }
                            });
                        });
                    }
                });
        },

        updateStaffData: function updateStaffData() {
            var myStaffMajorDicipline = document.getElementById('staffMajorDicipline'),
                leaveChkbx = document.getElementById('onLeaveChkbx').checked,
                myStaffGroup = document.getElementById('staffGroup'),
                myData = {
                    staffId: $("#staffId").val(),
                    staffTc: $("#staffTc").val(),
                    staffName: $("#staffName").val(),
                    staffSurname: $("#staffSurname").val(),
                    staffDiplomaNo: $("#staffDiplomaNo").val(),
                    staffLeaveStartDate: $('#staffLeaveStartDate').val(),
                    staffLeaveEndDate: $('#staffLeaveEndDate').val()
                };

            if (leaveChkbx == true) {
                myData.staffLeaveStartDate = $('#staffLeaveStartDate').val();
                myData.staffLeaveEndDate = $('#staffLeaveEndDate').val();
            } else {
                myData.staffLeaveStartDate = '';
                myData.staffLeaveEndDate = '';
            }

            myData.staffMajorDicipline = myStaffMajorDicipline.options[myStaffMajorDicipline.selectedIndex].value;
            myData.staffGroup = myStaffGroup.options[myStaffGroup.selectedIndex].value;

            $.ajax({
                type: 'PUT',
                data: JSON.stringify(myData),
                cache: false,
                contentType: 'application/json',
                datatype: "json",
                url: '/admin/staff/updateStaffData',
                success: function() {
                    jQueryMethods.toastrOptions();
                    toastr.success('Staff data updated!', 'Staff Data Update');
                    AdministrationMethods.findOneStaff();
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Staff couldnt update! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        updateStaffPhoto: function updateStaffPhoto(userOrStaff) {
            var myData = {
                    staffId: $("#staffId").val(),
                    staffPhoto: $('#staffPhotoId')[0].src
                },
                myStaffTc = $("#staffTc").val();

            if (myStaffTc == '' || myStaffTc.length <= 0) {
                jQueryMethods.toastrOptions();
                toastr.warning('Please select a/an ' + userOrStaff + '!', 'Select an ' + userOrStaff + '');
            } else {
                $.ajax({
                    type: 'PUT',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/admin/staff/updatePhoto',
                    success: function() {
                        jQueryMethods.toastrOptions();
                        toastr.success('Photo updated!', 'Photo Update');
                        AdministrationMethods.findOneStaff();
                    },
                    error: function(e) {
                        jQueryMethods.toastrOptions();
                        toastr.error(userOrStaff + ' couldnt Update! \n\n\n' + e.responseText, 'Error!')
                        console.log("ERROR: ", e.responseText);
                    }
                });
            }
        },

        getMaxStaffId: function getMaxStaffId() {
            $.ajax({
                type: "GET",
                url: "/admin/staff/getMaxStaffId",
                success: function(staff) {
                    if (staff.length < 1) {
                        $("#staffId").val(1);
                    } else {
                        $("#staffId").val(staff.staffId + 1);
                        // console.log(staff.staffId);
                    }
                },
                error: function(e) {
                    console.log(staff.staffId);
                    jQueryMethods.toastrOptions();
                    toastr.error("Couldn't get max id from staff table! \n\n\n' + e.responseText, 'Error!")
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillStaffStatisticsTable: function fillStaffStatisticsTable() {
            var total = 0,
                cardFrontHeader = document.getElementById('staffStatisticsCardFrontHeader');

            $('#staffStatisticsTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/admin/staff/fillStaffStatisticsTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#staffStatisticsTable> tbody").append(
                            "<tr class='staffStatisticsRow'><td class='staffGroup'>" +
                            docs[i]["_id"] + "</td><td class='staffCount'>" + docs[i]["count"] + "</td></tr>");

                        total += docs[i]["count"];

                        // jQueryMethods.toastrOptions();
                        // toastr.info('User group counted!', 'User Count');
                    });
                    cardFrontHeader.innerHTML = 'Staff Statistics: <br> Total Staff = ' + total;
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Staff group couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillDatabaseStatusTable: function fillDatabaseStatusTable() {
            $('#databaseStatusTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/admin/staff/countTableAndRows",
                success: function(names) {
                    $.each(names, function(i) {
                        $("#databaseStatusTable> tbody").append(
                            "<tr class='databaseStatisticsRow'><td class='databaseGroup'>" +
                            names[i]["name"] + "</td><td class='databaseCount'>" + names[i]["count"] + "</td></tr>");

                        // jQueryMethods.toastrOptions();
                        // toastr.info('User group counted!', 'User Count');
                    })
                },

                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('databaseStatusTable couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        staffOnLeaveCheckbox: function staffOnLeaveCheckbox() {
            var leaveChkbx = document.getElementById('onLeaveChkbx').checked,
                staffLeaveStartDate = document.getElementById('staffLeaveStartDate'),
                staffLeaveEndDate = document.getElementById('staffLeaveEndDate'),
                staffLeaveStartDateLbl = document.getElementById('staffLeaveStartDateLbl'),
                staffLeaveEndDateLbl = document.getElementById('staffLeaveEndDateLbl');

            if (leaveChkbx == true) {
                staffLeaveStartDate.style.display = 'block'
                staffLeaveStartDateLbl.style.display = 'block'
                staffLeaveEndDate.style.display = 'block'
                staffLeaveEndDateLbl.style.display = 'block'
            } else {
                staffLeaveStartDate.style.display = 'none'
                staffLeaveStartDateLbl.style.display = 'none'
                staffLeaveEndDate.style.display = 'none'
                staffLeaveEndDateLbl.style.display = 'none'
            }
        },

        fillStafOnLeaveTable: function fillStafOnLeaveTable() {
            var total = 0,
                staffOnLeaveBackCard = document.getElementById('staffOnLeaveBackCard');

            $('#staffLeaveStatisticsTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/admin/staff/fillStafOnLeaveTable",
                success: function(docs) {
                    if (docs.length > 0) {
                        $.each(docs, function(i) {
                            $("#staffLeaveStatisticsTable> tbody").append(
                                "<tr class='staffOnLeaveRow'><td class='staffGroup'>" +
                                docs[i]["_id"] + "</td><td class='staffCount'>" + docs[i]["count"] + "</td></tr>");

                            total += docs[i]['count'];
                            // jQueryMethods.toastrOptions();
                            // toastr.info('User group counted!', 'User Count');
                        });
                        staffOnLeaveBackCard.innerHTML = 'Staff on Leave Statistics: <br> Total = ' + total;
                    } else {
                        $("#staffLeaveStatisticsTable> tbody").append(
                            "<tr class='staffOnLeaveRow'><td class='staffGroup'>No Staff</td><td class='staffCount'>On Leave </td></tr>");
                    }

                },

                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Staff on leave couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        // ========================== unit functions =============================
        clearForNewUnit: function clearForNewUnit() {
            AdministrationMethods.fillUnitStatisticsTable();

            var unitName = $('#unitName').val();

            if (unitName != '' || unitName > 0) {
                toastr.warning(
                    "<br/><h21>You will lose your entered data if you click yes!<h21/><br/><br/><button type='button' id='clearConfirmBtn' class='inpatientBtn btn-danger' style='width: 315px !important;'>Yes</button>", 'Do you want to CLEAR form?', {
                        allowHtml: true,
                        progressBar: true,
                        timeOut: 10000,
                        onShown: function(toast) {
                            $("#clearConfirmBtn").on('click', function() {
                                document.getElementById('saveUnit').innerHTML = 'Save';

                                $("#unitName").val('');
                                AdministrationMethods.getMaxUnitId();
                                AdministrationMethods.findAllUnits();

                                jQueryMethods.toastrOptions();
                                toastr.info('Form cleared for new unit!', 'Form Cleared');
                            });
                        }
                    });
            }
        },

        updateOrSaveUnitBtn: function updateOrSaveUnitBtn() {
            $.ajax({
                type: "GET",
                url: "/admin/units/checkUnitFromDatabase",
                data: { unitId: $("#unitId").val() },
                success: function(unit) {
                    if (unit.length != 0 || unit != null) {
                        var btn = document.getElementById('saveUnit');
                        btn.innerHTML = 'Update';
                    } else {
                        btn.innerHTML = 'Save';
                    }
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Unit couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        saveUnit: function saveUnit() {
            var btn = document.getElementById('saveUnit');

            if (btn.innerHTML == 'Update') {
                AdministrationMethods.updateUnitData();
            } else {
                var myUnitMajorDicipline = document.getElementById('unitMajorDicipline'),
                    myUnitActivePassive = document.getElementById('unitActivePassive'),
                    myUnitType = document.getElementById('unitType'),
                    myData = {
                        unitId: $("#unitId").val(),
                        unitName: $("#unitName").val(),
                        unitType: myUnitType.options[myUnitType.selectedIndex].value,
                        unitMajorDicipline: myUnitMajorDicipline.options[myUnitMajorDicipline.selectedIndex].value,
                        beds: '',
                        unitActivePassive: myUnitActivePassive.options[myUnitActivePassive.selectedIndex].value
                    };

                if ($("#unitType option:selected").val() == 'Clinic') {
                    myData.beds == $('#beds').val();
                } else {
                    myData.beds == '';
                }

                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/admin/units/save',
                    success: function() {
                        jQueryMethods.toastrOptions();
                        toastr.success('Unit successfully saved!', 'Staff Save');

                        AdministrationMethods.findAllUnits();
                        AdministrationMethods.getMaxUnitId();
                        AdministrationMethods.fillUnitStatisticsTable();

                        // reset form data
                        $("#unitName").val('');
                        $("#beds").val('');
                    },
                    error: function(e) {
                        jQueryMethods.toastrOptions();
                        toastr.error('Unit couldnt save! \n' + e, 'Error!')
                        console.log("ERROR: ", e);
                    }
                });
            }
        },

        findUnitsAtOnce: function findUnitsAtOnce() {
            var userTc = $('#unitName').val();

            if (userTc == '' || userTc == null) {
                AdministrationMethods.findAllUnits();
                AdministrationMethods.fillUnitStatisticsTable();
                AdministrationMethods.updateOrSaveUnitBtn();
            } else {
                AdministrationMethods.findOneUnit();
                AdministrationMethods.fillUnitStatisticsTable();
                AdministrationMethods.updateOrSaveUnitBtn();
            }
        },

        findAllUnits: function findAllUnits() {
            $('#unitListTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/admin/units/findAllUnits",
                success: function(result) {
                    $.each(result, function(i, units) {
                        i++;
                        $("#unitListTable> tbody").append(
                            "<tr class='unitRow' id='unitRowId" + i + " title='' ><td class='idTd' title=''>" +
                            i + "</td><td>" +
                            units.unitId + "</td><td>" +
                            units.unitName + "</td><td>" +
                            units.unitType + "</td><td>" +
                            units.unitMajorDicipline + "</td><td>" +
                            units.unitActivePassive + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Unit couldnt list! \n' + message.err, 'Error!')
                    console.log("ERROR: ", e);
                }
            });
        },

        findOneUnit: function findOneUnit() {
            $('#unitListTable > tbody').empty();
            var searchName = $("#unitName").val();

            $.ajax({
                type: "GET",
                url: "/admin/units/findOneUnit",
                data: { unitName: searchName },
                success: function(unit) {
                    jQueryMethods.toastrOptions();
                    if (unit.unitName == '' || unit.unitName == null || unit.unitName == 'undefined') {
                        $("#unitId").val('');
                        toastr.error('Unit couldnt find! \n\n\n', 'Error!')
                    } else {
                        $("#unitId").val(unit.unitId);
                        $("#unitName").val(unit.unitName);
                        $("#unitType").val(unit.unitType);
                        $("#unitMajorDicipline").val(unit.unitMajorDicipline);
                        $("#beds").val(unit.beds);
                        $("#unitActivePassive").val(unit.unitActivePassive);

                        $("#unitListTable> tbody").append(
                            "<tr class='unitRow' id='unitRow1' title=''><td class='idTd' title=''>" +
                            "#" + "</td><td id='idTd1'>" +
                            unit.unitId + "</td><td>" +
                            unit.unitName + "</td><td>" +
                            unit.unitType + "</td><td>" +
                            unit.unitMajorDicipline + "</td><td>" +
                            unit.unitActivePassive + "</td></tr>");

                        toastr.info('Unit - ' + unit.unitName + ' -  found!', 'Unit Search');
                    }
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Unit couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        updateUnitData: function updateUnitData() {
            var myUnitType = document.getElementById('unitType'),
                myUnitMajorDicipline = document.getElementById('unitMajorDicipline'),
                myUnitActivePassive = document.getElementById('unitActivePassive'),
                myData = {
                    unitId: $("#unitId").val(),
                    unitName: $("#unitName").val(),
                    unitType: myUnitType.options[myUnitType.selectedIndex].value,
                    unitMajorDicipline: myUnitMajorDicipline.options[myUnitMajorDicipline.selectedIndex].value,
                    beds: $("#beds").val(),
                    unitActivePassive: myUnitActivePassive.options[myUnitActivePassive.selectedIndex].value
                };

            $.ajax({
                type: 'PUT',
                data: JSON.stringify(myData),
                cache: false,
                contentType: 'application/json',
                datatype: "json",
                url: '/admin/units/updateUnitData',
                success: function() {
                    jQueryMethods.toastrOptions();
                    AdministrationMethods.findOneUnit();
                    toastr.success('Unit data updated!', 'Unit Data Update');
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Unit couldnt update! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        getMaxUnitId: function getMaxUnitId() {
            $.ajax({
                type: "GET",
                url: "/admin/units/getMaxUnitId",
                success: function(unit) {
                    if (unit.length < 1) {
                        $("#unitId").val(1);
                    } else {
                        $("#unitId").val(unit.unitId + 1);
                        // console.log(unit.unitId);
                    }
                },
                error: function(e) {
                    console.log(unit.unitId);
                    jQueryMethods.toastrOptions();
                    toastr.error("Couldn't get max id from units table! \n\n\n' + e.responseText, 'Error!")
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillUnitStatisticsTable: function fillUnitStatisticsTable() {
            var total = 0,
                activeTotal = 0,
                passiveTotal = 0,
                cardBackHeader = document.getElementById('unitStatisticBackCardHeader');

            $('#unitStatisticsTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/admin/units/fillUnitStatisticsTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#unitStatisticsTable> tbody").append(
                            "<tr class='unitStatisticsRow'><td class='unitGroup'>" +
                            docs[i]["_id"]['unitType'] +
                            "</td><td id='activePassive'>" + docs[i]['_id']['unitActivePassive'] +
                            "</td><td class='unitCount'>" + docs[i]["count"] + "</td></tr>");

                        total += docs[i]["count"];

                        if (docs[i]['_id']['unitActivePassive'] == 'Active') {
                            activeTotal += docs[i]["count"];
                        } else {
                            passiveTotal += docs[i]["count"];
                        }
                        // jQueryMethods.toastrOptions();
                        // toastr.info('User group counted!', 'User Count');
                    });
                    cardBackHeader.innerHTML = 'Unit Statistics: <br> Unit Total = ' + total + '<br> Active Total = ' + activeTotal + '<br> Passive Total = ' + passiveTotal;
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Staff group couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },
        // ========================== test functions =============================
        clearForNewTest: function clearForNewTest() {
            AdministrationMethods.fillUnitStatisticsTable();

            var testName = $('#testName').val();

            if (testName != '' || testName > 0) {
                toastr.warning(
                    "<br/><h21>You will lose your entered data if you click yes!<h21/><br/><br/><button type='button' id='clearConfirmBtn' class='inpatientBtn btn-danger' style='width: 315px !important;'>Yes</button>", 'Do you want to CLEAR form?', {
                        allowHtml: true,
                        progressBar: true,
                        timeOut: 10000,
                        onShown: function(toast) {
                            $("#clearConfirmBtn").on('click', function() {
                                document.getElementById('saveTest').innerHTML = 'Save';

                                $("#testName").val('');
                                $("#testCode").val('');
                                $("#testHint").val('');
                                $("#maxRequest").val('');
                                AdministrationMethods.getMaxTestId();
                                AdministrationMethods.findAllTests();

                                jQueryMethods.toastrOptions();
                                toastr.info('Form cleared for new test!', 'Form Cleared');
                            });
                        }
                    });
            }
        },

        updateOrSaveTestBtn: function updateOrSaveTestBtn() {
            var btn = document.getElementById('saveTest');
            $.ajax({
                type: "GET",
                url: "/admin/tests/checkTestFromDatabase",
                data: { testCode: $("#testCode").val() },
                success: function(test) {
                    if (test.length != 0 || test != null) {
                        btn.innerHTML = 'Update';
                    } else {
                        btn.innerHTML = 'Save';
                    }
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Test couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        saveTest: function saveTest() {
            var btn = document.getElementById('saveTest');

            if (btn.innerHTML == 'Update') {
                AdministrationMethods.updateTestData();
            } else {
                var myTestLab = $('#testLab option:selected').val(),
                    myTestActivePassive = $('#testActivePassive option:selected').val(),
                    myTestType = $('#testType option:selected').val(),
                    myData = {
                        testId: $("#testId").val(),
                        testCode: $("#testCode").val(),
                        testName: $("#testName").val(),
                        testType: myTestType,
                        testLab: myTestLab,
                        testHint: $("#testHint").val(),
                        maxRequest: $("#maxRequest").val(),
                        testActivePassive: myTestActivePassive
                    };

                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/admin/tests/saveTest',
                    success: function() {
                        jQueryMethods.toastrOptions();
                        toastr.success('Test successfully saved!', 'Test Save');

                        AdministrationMethods.findAllTests();
                        AdministrationMethods.getMaxTestId();
                    },
                    error: function(e) {
                        jQueryMethods.toastrOptions();
                        toastr.error('Test couldnt save! \n' + e, 'Error!')
                        console.log("ERROR: ", e);
                    }
                });
            }
        },

        findTestAtOnce: function findTestAtOnce() {
            var testCode = $('#testCode').val();

            if (testCode == '' || testCode == null) {
                AdministrationMethods.findAllTests();
                AdministrationMethods.fillUnitStatisticsTable();
                AdministrationMethods.updateOrSaveTestBtn();
            } else {
                AdministrationMethods.findOneTest();
                AdministrationMethods.updateOrSaveTestBtn();
            }
        },

        findAllTests: function findAllTests() {
            $('#testListTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/admin/tests/findAllTests",
                success: function(result) {
                    $.each(result, function(i, tests) {
                        i++;
                        $("#testListTable> tbody").append(
                            "<tr class='testRow' id='testRowId" + i + " title='' ><td class='idTd' title=''>" +
                            i + "</td><td>" +
                            tests.testId + "</td><td>" +
                            tests.testCode + "</td><td>" +
                            tests.testName + "</td><td>" +
                            tests.testType + "</td><td>" +
                            tests.testLab + "</td><td>" +
                            tests.testHint + "</td><td>" +
                            tests.maxRequest + "</td><td>" +
                            tests.testActivePassive + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Test couldnt list! \n' + message.err, 'Error!')
                    console.log("ERROR: ", e);
                }
            });
        },

        findOneTest: function findOneTest() {
            $('#testListTable > tbody').empty();
            var searchCode = $("#testCode").val();

            $.ajax({
                type: "GET",
                url: "/admin/tests/findOneTest",
                data: { testCode: searchCode },
                success: function(test) {
                    if (test.testName == '' || test.testName == null || test.testName == 'undefined') {
                        $("#testName").val('');
                        toastr.error('Test couldnt find! \n\n\n', 'Error!')
                    } else {
                        $("#testId").val(test.testId);
                        $("#testCode").val(test.testCode);
                        $("#testName").val(test.testName);
                        $("#testType").val(test.testType);
                        $("#testLab").val(test.testLab);
                        $("#testHint").val(test.testHint);
                        $("#maxRequest").val(test.maxRequest);
                        $("#testActivePassive").val(test.testActivePassive);

                        $("#testListTable> tbody").append(
                            "<tr class='unitRow' id='unitRow1' title=''><td class='idTd' title=''>" +
                            "#" + "</td><td id='idTd1'>" +
                            test.testId + "</td><td>" +
                            test.testCode + "</td><td>" +
                            test.testName + "</td><td>" +
                            test.testType + "</td><td>" +
                            test.testLab + "</td><td>" +
                            test.testHint + "</td><td>" +
                            test.maxRequest + "</td><td>" +
                            test.testActivePassive + "</td></tr>");

                        toastr.info('Test - ' + test.testCode + ' - ' + test.testName + ' -  found!', 'Test Search');
                    }
                },
                error: function(e) {
                    toastr.error('Test couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        updateTestData: function updateTestData() {
            var myTestLab = $('#testLab option:selected').val(),
                myTestActivePassive = $('#testActivePassive option:selected').val(),
                myTestType = $('#testType option:selected').val(),
                myData = {
                    testId: $("#testId").val(),
                    testCode: $("#testCode").val(),
                    testName: $("#testName").val(),
                    testType: myTestType,
                    testLab: myTestLab,
                    testHint: $("#testHint").val(),
                    maxRequest: $("#maxRequest").val(),
                    testActivePassive: myTestActivePassive
                };

            $.ajax({
                type: 'PUT',
                data: JSON.stringify(myData),
                cache: false,
                contentType: 'application/json',
                datatype: "json",
                url: '/admin/tests/updateTestData',
                success: function() {
                    jQueryMethods.toastrOptions();
                    AdministrationMethods.findOneTest();
                    toastr.success('Test data updated!', 'Test Data Update');
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Test couldnt update! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        getMaxTestId: function getMaxTestId() {
            $.ajax({
                type: "GET",
                url: "/admin/tests/getMaxTestId",
                success: function(test) {
                    if (test.testId == 0 || test.testId == 'NaN' || test.testId == 'undefined' || test.length < 1) {
                        $("#testId").val(1);
                    } else {
                        $("#testId").val(test.testId + 1);
                        // console.log(test.testId);
                    }
                },
                error: function(e) {
                    console.log(unit.unitId);
                    jQueryMethods.toastrOptions();
                    toastr.error("Couldn't get max id from test model! \n\n\n' + e.responseText, 'Error!")
                    console.log("ERROR: ", e.responseText);
                }
            });
        },
        // ========================== general functions =============================

        fetchUnits: function fetchUnits(unitType, selectId) {
            $('#' + selectId).empty();
            $.ajax({
                type: "GET",
                url: "/admin/units/fetchUnits",
                data: { unitType: unitType, unitActivePassive: 'Active' },
                success: function(result) {
                    $.each(result, function(i, unitData) {
                        i++
                        var name = unitData.unitName;
                        $('#' + selectId + '').append("<option value='" + name.replace(/\s/g, '') + "'>" +
                            unitData.unitName + "</option>");
                    });
                },
                error: function(e) {
                    toastr.error('Couldn\'t fetch units! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fetchTests: function fetchTests(testType, tableId) {
            $('#' + tableId + ' > tbody').empty();
            var selectTable, selectTotal;
            if (testType == 'Laboratory') {
                selectTable = 'selectedExamTable';
                selectTotal = 'totalExam';
            } else {
                selectTable = 'selectedRadiologyExamTable'
                selectTotal = 'totalRadiologyExam';
            }
            $.ajax({
                type: "GET",
                url: "/admin/tests/fetchTests",
                data: { testType: testType, testActivePassive: 'Active' },
                success: function(result) {
                    $.each(result, function(i, tests) {
                        i++
                        $('#' + tableId + ' > tbody').append(
                            "<tr class='testRow' id='testRowId" + i + "' title='" + tests.testHint + "' >" +
                            "<td><input type='checkbox' class='labRadIstemChckbx' id='customCheck" + i +
                            "' onchange='PolyclinicMethods.tetkikSelect(\"customCheck" + i + "\", \"labRadIstemChckbx\", \"" + selectTable + "\", \"" + selectTotal + "\")'></td><td id='testCode" + i + "'> " +
                            tests.testCode + "</td><td id='testName" + i + "'> " +
                            tests.testName + "</td><td id=testLab" + i + "'> " +
                            tests.testLab + "</td><td>" +
                            "<input type='number' name='labQuantity' id='labQuantity" + i + "\' min='1' value='1' style = 'text-align: center;' ></td ></tr > ");
                    });
                },
                error: function(e) {
                    toastr.error('Couldn\'t fetch units! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fetchStaff: function fetchStaff(staffGroup, selectId) {
            $('#' + selectId).empty();
            $.ajax({
                type: "GET",
                url: "/admin/staff/fetchStaff",
                data: { staffGroup: staffGroup, staffLeaveStartDate: '' },
                success: function(result) {
                    $.each(result, function(i, staffData) {
                        i++
                        var name = staffData.staffName + ' ' + staffData.staffSurname;
                        $('#' + selectId + '').append("<option value='" + name.replace(/\s/g, '') + "'>" +
                            name + "</option>");
                    });
                },
                error: function(e) {
                    toastr.error('Couldn\'t fetch staff! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        calculateAge: function calculateAge(dateString) {
            var today = new Date();
            var birthDate = new Date(dateString);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        },

        getBeds: function getBeds() {
            var unitName = $('#clinicSelector option:selected').text();

            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/getBeds",
                data: { unitName: unitName, unitActivePassive: 'Active' },
                success: function(result) {
                    if (result.length > 0) {
                        $('#bedsDiv').empty();
                        $('#totalBedCount').text(result[0].beds);
                        AdministrationMethods.countFullandEmptyBeds(unitName.replace(/\s/g, ''));
                        x = result[0].beds - $('#fullBedCount').text();
                        for (let i = 0; i < x; i++) {
                            $('#bedsDiv').append("<img id='bed" + i + "' onclick='AdministrationMethods.bedSelect(\"bed" + i + "\");' class='bedImages' src='/public/images/Medical-icons/empty bed.png' alt='bed'></img>");
                        }
                    } else {
                        $('#bedsDiv').empty();
                    }
                },
                error: function(e) {
                    toastr.error('Couldn\'t fetch beds! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        countFullandEmptyBeds: function countFullandEmptyBeds(unitName) {
            var totalBeds = $('#totalBedCount').text(),
                fullBeds,
                emptyBeds = 0;
            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/countFullandEmptyBeds",
                data: { clinicSelect: unitName },
                success: function(result) {
                    if (result.length > 0) {
                        fullBeds = result[0]['count'];
                        emptyBeds = totalBeds - fullBeds;

                        $('#emptyBedCount').text(emptyBeds);
                        $('#fullBedCount').text(result[0]['count'])
                    } else {
                        $('#emptyBeds').text(emptyBeds)
                    }
                },
                error: function(e) {
                    toastr.error('Couldn\'t fetch beds! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });

        },

        getConsultationCount: function getConsultationCount(unitSelectId) {
            var unitName = $('#' + unitSelectId + ' option:selected').text(),
                unitName = unitName.replace(/\s/g, ''),
                done;

            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/getConsultationCount",
                data: { unitName },
                success: function(result) {
                    if (result[0].Total > 0) {
                        $('#totalCons').text(result[0].Total);
                        $('#waitingCons').text(result[0].Waiting);
                        done = result[0].Total - result[0].Waiting;
                        if (done != '0' || done != 0) {
                            $('#doneCons').text('0');
                        } else {
                            $('#doneCons').text(done);
                        }
                    } else {
                        $('#totalCons').text('0');
                        $('#waitingCons').text('0');
                        $('#doneCons').text('0');
                    }
                },
                error: function(e) {
                    toastr.error('Couldn\'t fetch consultation! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        bedSelect: function bedSelect(bedId) {
            var bed = document.getElementById(bedId),
                bedSrc = document.getElementById(bedId).src,
                selectedBed = document.querySelector("img[alt='selected']"),
                totalBedCount = document.getElementById('totalBedCount'),
                fullBedCount = document.getElementById('fullBedCount'),
                emptyBedCount = document.getElementById('emptyBedCount');

            if (bedSrc == 'http://localhost:1609/public/images/Medical-icons/full%20bed.png') {
                alert('You can\'t choose full bed!')
            } else {
                if (selectedBed != null && bedId == selectedBed.id) {
                    bed.alt = 'bed';
                    bed.style.border = '2px ridge black';
                    bed.style.backgroundColor = 'inherit';
                    fullBedCount.innerHTML--;
                    emptyBedCount.innerHTML = totalBedCount.innerHTML - fullBedCount.innerHTML;
                } else if (selectedBed != null && bedId != selectedBed.id) {
                    alert('You can\'t choose 2 beds!')
                } else {
                    bed.alt = 'selected';
                    bed.style.border = '5px inset red';
                    bed.style.backgroundColor = 'grey';
                    fullBedCount.innerHTML++;
                    emptyBedCount.innerHTML = totalBedCount.innerHTML - fullBedCount.innerHTML;
                }
            }
        }
    },

    AnnouncementMethods = {
        clearForNewAnnouncement: function clearForNewAnnouncement() {
            var myAnnouncementTitle = $("#announcementTitle").val(),
                announcementSave = document.getElementById('announcementSave');

            if (myAnnouncementTitle != '') {
                toastr.warning(
                    "<br/><h21>You will lose your entered data if you click yes!<h21/><br/><br/><button type='button' id='clearConfirmBtn' class='inpatientBtn btn-danger' style='width: 315px !important;height:35px;border-radius:8px;'>Yes</button>", 'Do you want to CLEAR form?', {
                        allowHtml: true,
                        progressBar: true,
                        timeOut: 10000,
                        onShown: function(toast) {
                            $("#clearConfirmBtn").on('click', function() {
                                AnnouncementMethods.getMaxAnnouncementId();
                                AnnouncementMethods.findAnnouncementHistory();

                                $("#announcementTitle").val('');
                                $("#announcementText").val('');

                                announcementSave.innerHTML = 'Save';

                                toastr.info('Form cleared for new announcement!', 'Form Cleared');
                            });
                        }
                    });
            }
        },

        saveAnnouncement: function saveAnnouncement() {
            jQueryMethods.toastrOptions();
            var myData = {
                announcementId: $("#announcementId").val(),
                announcementTitle: $("#announcementTitle").val(),
                announcementUserGroup: $("#announcementUserGroup option:selected").val(),
                announcementUserMajorDiscipline: $("#announcementUserMajorDiscipline option:selected").val(),
                announcementUserClinic: $("#announcementUserClinic option:selected").val(),
                announcementStartDate: $("#announcementStartDate").val(),
                announcementEndDate: $("#announcementEndDate").val(),
                announcementShowTime: $("#announcementShowTime option:selected").val(),
                announcementActivePasive: $("#announcementActivePasive").val(),
                announcementText: $("#announcementText").val(),
                announcementSavedUser: $.cookie('username')
            };

            if (document.getElementById('announcementSave').innerHTML == 'Update') {
                AnnouncementMethods.updateAnnouncementData()
            } else {
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/announcement/saveAnnouncement',
                    success: function() {
                        toastr.success('Announcement successfully saved!', 'Save');
                        AnnouncementMethods.findAnnouncementHistory();
                        // AppointmentMethods.fillCanceledValidAppointmentTable();
                        // AppointmentMethods.fillAppointmentGenderTable();
                        // AppointmentMethods.findPatientAppointmentHistory();
                        // AppointmentMethods.fillPolAppointmentStatusTable();
                        // PolyclinicExamMethods.fillPatientAppointmentStatusTable();
                        // PolyclinicExamMethods.fillDoctorAppointmentTable();
                        // PolyclinicExamMethods.fillDoctorOnLeaveTable();
                    },
                    error: function(e) {
                        toastr.error('Announcement couldnt save! \n' + e, 'Error!')
                        console.log("ERROR: ", e);
                    }
                });
            }
        },

        getMaxAnnouncementId: function getMaxAnnouncementId() {
            $.ajax({
                type: "GET",
                url: "/announcement/getMaxAnnouncementId",
                success: function(announcement) {
                    if (announcement.length < 1) {
                        $("#announcementId").val(1);
                    } else {
                        $("#announcementId").val(announcement.announcementId + 1);
                    }
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error("Couldn't get max appointmentId!", "Error!")
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        findByAnnouncementId: function findByAnnouncementId(rowId) {
            jQueryMethods.toastrOptions();
            var myRow = document.getElementById(rowId),
                myAnnouncementId = myRow.cells[0].innerHTML,
                announcementSaveBtn = document.getElementById('announcementSave');
            $.ajax({
                type: "GET",
                url: "/announcement/findByAnnouncementId",
                data: { announcementId: myAnnouncementId },
                success: function(announcement) {
                    if (announcement.announcementId == '' || announcement.announcementId == null ||
                        announcement.announcementId == 'undefind') {
                        toastr.error('Announcement found but data couldnt set to form! \n\n\n', 'Error!')
                    } else {
                        $("#announcementId").val(announcement.announcementId);
                        $("#announcementTitle").val(announcement.announcementTitle);
                        $("#announcementUserGroup").val(announcement.announcementUserGroup);
                        $("#announcementUserMajorDiscipline").val(announcement.announcementUserMajorDiscipline);
                        $("#announcementUserClinic").val(announcement.announcementUserClinic);
                        $("#announcementStartDate").val(announcement.announcementStartDate);
                        $("#announcementEndDate").val(announcement.announcementEndDate);
                        $("#announcementShowTime").val(announcement.announcementShowTime);
                        $("#patientBirthPlace").val(announcement.patientBirthPlace);
                        $("#patientBirthDate").val(announcement.patientBirthDate);
                        $("#announcementActivePasive").val(announcement.announcementActivePasive);
                        $("#announcementText").val(announcement.announcementText);
                        announcementSaveBtn.innerHTML = 'Update';

                        toastr.info('Announcement Id: ' + announcement.announcementId + ' - selected!', 'Announcement Search');
                    }
                },
                error: function(e) {
                    toastr.error('Announcement couldn\'t find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        updateAnnouncementData: function updateAnnouncementData() {
            var myData = {
                announcementId: $('#announcementId').val(),
                announcementTitle: $('#announcementTitle').val(),
                announcementUserGroup: $('#announcementUserGroup option:selected').val(),
                announcementUserMajorDiscipline: $('#announcementUserMajorDiscipline option:selected').val(),
                announcementUserClinic: $('#announcementUserClinic option:selected').val(),
                announcementStartDate: $('#announcementStartDate').val(),
                announcementEndDate: $('#announcementEndDate').val(),
                announcementShowTime: $('#announcementShowTime option:selected').val(),
                announcementActivePasive: $('#announcementActivePasive option:selected').val(),
                announcementText: $('#announcementText').val()
            };

            if ($("#announcementId").val() == '') {
                toastr.error('Please enter patient personal ID number! \n\n\n', 'Error!')
            } else {
                $.ajax({
                    type: 'PUT',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/announcement/updateAnnouncementData',
                    success: function(patient) {
                        toastr.success('Announcement updated! \n\n\n', 'Announcement Update');
                        AnnouncementMethods.findAnnouncementHistory();
                    },
                    error: function(e) {
                        jQueryMethods.toastrOptions();
                        toastr.error('Announcement couldnt update! \n\n\n' + e.responseText, 'Error!')
                        console.log("ERROR: ", e.responseText);
                    }
                });
            }
        },

        findAnnouncementHistory: function findAnnouncementHistory() {
            $('#announcementHistoryTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/announcement/findAnnouncementHistory",
                success: function(result) {
                    $.each(result, function(i, announcementData) {
                        i++;
                        $("#announcementHistoryTable> tbody").append(
                            "<tr class='announcementHistory' id='announcementHistory" + i + "' title=''>" +
                            "<td id='announcementId" + i + "'>" + announcementData.announcementId + "</td>" +
                            "<td id='announcementTitle" + i + "'>" + announcementData.announcementTitle + "</td>" +
                            "<td id='announcementUserMajorDiscipline" + i + "'>" + announcementData.announcementUserMajorDiscipline + "</td>" +
                            "<td id='announcementUserGroup" + i + "'>" + announcementData.announcementUserGroup + "</td>" +
                            "<td id='announcementUserClinic" + i + "'>" + announcementData.announcementUserClinic + "</td>" +
                            "<td id='announcementUserDate" + i + "'>" + announcementData.announcementStartDate + " - " + announcementData.announcementEndDate + "</td>" +
                            "<td id='announcementShowTime" + i + "'>" + announcementData.announcementShowTime + "</td>" +
                            "<td id='announcementActivePasive" + i + "'>" + announcementData.announcementActivePasive + "</td>" +
                            "<td><div class='announcementTextDiv' id='announcementTextDiv" + i + "'>" + announcementData.announcementText + "</td>" +
                            "</div><td id='announcementSavedUser" + i + "'>" + announcementData.announcementSavedUser + "</td>" +
                            "<td><button class='inpatientBtn btn-success' title='Click for select announcement.' onclick=\"AnnouncementMethods.findByAnnouncementId(\'announcementHistory" + i + "\')\">Select</button></td></tr>"
                        );

                        if (announcementData.announcementActivePasive == 'Passive') {
                            var x = 'announcementHistory' + i;
                            document.getElementById(x).style.backgroundColor = 'red';
                        }
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Announcement History couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        printReaders: function printReaders() {
            var mywindow = window.open('', 'Print Pop Up', 'height=900,width=1600'),
                data = document.getElementById('announcementReadersDiv').innerHTML;
            mywindow.document.write('<html><head><title>Announcement Readers Details</title>');
            mywindow.document.write('<link rel="stylesheet" href="/public/all-pages-style.css">')
            mywindow.document.write('</head><body >');
            mywindow.document.write(data);
            mywindow.document.write('</body></html>');

            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/


            setTimeout(function() {
                mywindow.print();
                mywindow.close();
            }, 1000)
            return true;
        },

        showAnnouncementReadersToolTip: function showAnnouncementReadersToolTip(cellId) {
            var rec = document.getElementById(cellId),
                parentrec = rec.parentElement,
                announcementTitle = parentrec.children[1].innerHTML,
                announcementGroup = parentrec.children[2].innerHTML,
                announcementDisicpline = parentrec.children[3].innerHTML,
                announcementClinicPolyclinic = parentrec.children[4].innerHTML,
                announcementBody = parentrec.children[5].innerHTML,
                readersDiv = document.getElementById('announcementReadersDiv'),
                myCell = document.getElementById(cellId);


            document.getElementById('announcementReadersTitle').innerHTML = 'Duyuru Konusu: ' + announcementTitle;
            document.getElementById('announcementReadersBody').innerHTML = 'Duyuru Detayi: ' + announcementBody;
            document.getElementById('announcementReadersGroup').innerHTML = 'Duyuru Grubu: ' + announcementGroup;
            document.getElementById('announcementReadersDicipline').innerHTML = 'Duyuru Anabilimdali: ' + announcementDisicpline;
            document.getElementById('announcementReadersClinicPolyclinic').innerHTML =
                'Duyuru Klinik/Poliklinik: ' + announcementClinicPolyclinic;
            readersDiv.style.top = myCell.offsetTop + 251 + 'px';
            readersDiv.style.left = myCell.offsetLeft + 470 + 'px';

            $('#' + readersDiv.id).fadeIn('medium');
        },

        announcementsToBottomAndTopScroll: function announcementsToBottomAndTopScroll() {
            var allAnnouncements = '';

            $.ajax({
                type: "GET",
                url: "/announcement/announcementsToBottomAndTopScroll",
                success: function(result) {
                    $.each(result, function(i, announcementData) {
                        i++;
                        allAnnouncements += i + ' - ' + announcementData.announcementTitle;
                        allAnnouncements += ' - \n' + announcementData.announcementText;
                        allAnnouncements += ' \n ¤¤¤¤¤¤ \n ';
                    });
                    if (allAnnouncements.length > 500) {
                        if ($('#bottomScrollP4').length > 0) {
                            document.getElementById('bottomScrollP4').style.animationDuration = '80s';
                        }

                        if ($('#bottomScrollP5').length > 0) {
                            document.getElementById('bottomScrollP5').style.animationDuration = '80s';
                        }
                    }

                    $('#bottomScrollP4').text(allAnnouncements)
                    $('#bottomScrollP5').text(allAnnouncements)
                    $('#topScroolAnnouncement').text(allAnnouncements)
                },
                error: function(e) {
                    toastr.error('announcementsToBottomAndTopScroll couldnt work! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillAnnouncementStatusTable: function fillAnnouncementStatusTable() {

            $('#announcementStatusTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/announcement/fillAnnouncementStatusTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#announcementStatusTable> tbody").append(
                            "<tr class='announcementStatusRow'><td class='announcementStatus'>" +
                            docs[i]["_id"] + "</td><td class='staffCount'>" + docs[i]["count"] + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('announcementStatusRow couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillAnnouncementUserGroupTable: function fillAnnouncementUserGroupTable() {

            $('#announcementUserGroupTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/announcement/fillAnnouncementUserGroupTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#announcementUserGroupTable> tbody").append(
                            "<tr class='announcementUserGroupRow'><td class='announcementUserGroup'>" +
                            docs[i]["_id"] + "</td><td class='staffCount'>" + docs[i]["count"] + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('announcementStatusRow couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillAnnouncementMajorDisciplineTable: function fillAnnouncementMajorDisciplineTable() {

            $('#announcementMajorDisciplineTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/announcement/fillAnnouncementMajorDisciplineTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#announcementMajorDisciplineTable> tbody").append(
                            "<tr class='announcementUserGroupRow'><td class='announcementUserGroup'>" +
                            docs[i]["_id"] + "</td><td class='staffCount'>" + docs[i]["count"] + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('fillAnnouncementMajorDisciplineTable couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillAnnouncementClinicPolyclinicTable: function fillAnnouncementClinicPolyclinicTable() {

            $('#announcementClinicPolyclinicTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/announcement/fillAnnouncementClinicPolyclinicTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#announcementClinicPolyclinicTable> tbody").append(
                            "<tr class='announcementUserGroupRow'><td class='announcementUserGroup'>" +
                            docs[i]["_id"] + "</td><td class='staffCount'>" + docs[i]["count"] + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('fillAnnouncementClinicPolyclinicTable couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillAnnouncementExpirationDateTable: function fillAnnouncementExpirationDateTable() {

            $('#announcementExpirationDateTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/announcement/fillAnnouncementExpirationDateTable",
                success: function(docs) {
                    $.each(docs, function(i, announcementData) {
                        i++
                        $("#announcementExpirationDateTable> tbody").append(
                            "<tr class='announcementExpirationDate'><td class='announcementExpirationDate'>" +
                            announcementData.announcementTitle + "</td><td class='expirationDate'>" +
                            announcementData.announcementEndDate + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('fillAnnouncementExpirationDateTable couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        }
    },

    AppointmentMethods = {

        clearForNewPatient: function clearForNewPatient() {
            jQueryMethods.toastrOptions();
            var myPatientId = $("#patientId").val(),
                savePatient = document.getElementById('appointmentSave'),
                myPolyclinicSelect = document.getElementById('appointmentPolyclinic'),
                myDoctorSelector = document.getElementById('appointmentDoctor'),
                myStatusSelect = document.getElementById('appointmentStatus'),
                myPatientIdNo = document.getElementById('patientIdNo'),
                myPatientId = document.getElementById('patientId');

            if (myPatientId != '' || myPatientId > 0) {
                toastr.warning(
                    "<br/><h21>You will lose your entered data if you click yes!<h21/><br/><br/><button type='button' id='clearConfirmBtn' class='inpatientBtn btn-danger' style='width: 315px !important;height:35px;border-radius:8px;'>Yes</button>", 'Do you want to CLEAR form?', {
                        allowHtml: true,
                        progressBar: true,
                        timeOut: 10000,
                        onShown: function(toast) {
                            $("#clearConfirmBtn").on('click', function() {
                                AppointmentMethods.getMaxAppointmentId();
                                jQueryMethods.setCalenderValueToday('appointmentDate');
                                $('#patientHistoryTable > tbody').empty();
                                // $('#patientVisitStatisticsTable > tbody').empty();
                                // $('#patientAppointmentStatusTable > tbody').empty();
                                // $('#patientUpcominAppointmentTable > tbody').empty();
                                // $('#polyclinicPatientCountTable > tbody').empty();
                                // $('#patientHealtInsuranceTable > tbody').empty();
                                // $('#patientGenderTable > tbody').empty();

                                $("#appointmentId").val('');
                                $("#patientId").val('');
                                $("#patientIdNo").val('');
                                $("#patientName").val('');
                                $("#patientSurname").val('');
                                $("#patientFatherName").val('');
                                $("#patientMotherName").val('');
                                $("#patientGender").val('');
                                $("#patientBirthPlace").val('');
                                $("#patientBirthDate").val('');
                                jQueryMethods.setCalenderValueToday('appointmentDate');
                                $("#appointmentHour").val('');
                                $("#patientPhone").val('');
                                $("#patientAdress").val('');
                                $('#appointmentRegPatientPhotoId')[0].src = 'http://localhost:1609/public/images/Patient_Male.ico';
                                savePatient.innerHTML = 'Save';
                                myPatientIdNo.readOnly = false;
                                myPatientId.readOnly = false;
                                myPolyclinicSelect.readOnly = false;
                                myDoctorSelector.readOnly = false;
                                myStatusSelect.readOnly = false;
                                document.getElementById("appointmentDate").readOnly = false;
                                $("#appointmentDate").css("pointer-events", "all");
                                $("#appointmentDate").css("background-color", "white");
                                $("#appointmentPolyclinic").css("pointer-events", "all");
                                $("#appointmentPolyclinic").css("background-color", "white");
                                $("#appointmentDoctor").css("pointer-events", "all");
                                $("#appointmentDoctor").css("background-color", "white");

                                toastr.info('Form cleared for new patient!', 'Form Cleared');
                            });
                        }
                    });
            }
        },

        randevuSelect: function randevuSelect(checkboxId, checkboxClass) {
            var selectedCheckbox = document.getElementById(checkboxId),
                checkboxParent = selectedCheckbox.parentElement,
                grandParent = checkboxParent.parentElement,
                checkboxes = document.getElementsByClassName(checkboxClass),
                y = 0;

            if (selectedCheckbox.checked == true) {
                grandParent.style.backgroundColor = 'red';

                for (let i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].checked == true) {
                        y++
                    }
                }
            } else {
                grandParent.style.backgroundColor = '#dddddd';

            }
        },

        findPatient: function findPatient() {
            var searchQuery = 0,
                myQuery = {},
                myStatusSelect = document.getElementById('appointmentStatus'),
                statusSelect = myStatusSelect.options[myStatusSelect.selectedIndex];

            if ($("#patientIdNo").val() == '') {
                searchQuery = $("#patientId").val();
                myQuery = {
                    patientId: searchQuery
                }
            } else {
                searchQuery = $("#patientIdNo").val();
                myQuery = {
                    patientIdNo: searchQuery
                }
            };

            if ($("#patientIdNo").val() == '' && $("#patientId").val() == '') {
                toastr.error('Patient Id or Patient Id No cant be empty! \n\n\n', 'Error!')
            } else {
                $.ajax({
                    type: "GET",
                    url: "/appSave/findPatient",
                    data: myQuery,
                    success: function(patient) {
                        jQueryMethods.toastrOptions();
                        if (patient.patientId == '' || patient.patientId == null || patient.patientId == 'undefind') {
                            toastr.error('Patient couldnt find! \n\n\n', 'Error!')
                        } else {
                            $("#patientId").val(patient.patientId);
                            $("#patientIdNo").val(patient.patientIdNo);
                            $("#patientName").val(patient.patientName);
                            $("#patientSurname").val(patient.patientSurname);
                            $("#patientFatherName").val(patient.patientFatherName);
                            $("#patientMotherName").val(patient.patientMotherName);
                            $("#patientGender").val(patient.patientGender);
                            $("#patientBirthPlace").val(patient.patientBirthPlace);
                            $("#patientBirthDate").val(patient.patientBirthDate);
                            $("#patientPhone").val(patient.patientPhone);
                            $("#patientAdress").val(patient.patientAdress);
                            $('#appointmentRegPatientPhotoId')[0].src = patient.patientPhotoSrc;
                            statusSelect = patient.statusSelect;

                            AppointmentMethods.fillPolyclinicAppointmentStatusTable();
                            AppointmentMethods.fillCanceledValidAppointmentTable();
                            AppointmentMethods.fillAppointmentGenderTable();
                            AppointmentMethods.findPatientAppointmentHistory();
                            AppointmentMethods.fillPolAppointmentStatusTable();
                            PolyclinicExamMethods.fillPatientAppointmentStatusTable();
                            PolyclinicExamMethods.fillDoctorAppointmentTable();
                            PolyclinicExamMethods.fillDoctorOnLeaveTable();


                            toastr.info('Patient - ' + $("#patientName").val() + $("#patientSurname").val() + ' - found!', 'Patient Search');
                        }
                    },
                    error: function(e) {
                        jQueryMethods.toastrOptions();
                        toastr.error('Patient couldnt find! \n\n\n' + e.responseText, 'Error!')
                        console.log("ERROR: ", e.responseText);
                    }
                });
            }
        },

        saveAppointment: function saveAppointment() {
            jQueryMethods.toastrOptions();
            var myPolyclinicSelect = document.getElementById('appointmentPolyclinic'),
                myDoctorSelector = document.getElementById('appointmentDoctor'),
                myStatusSelect = document.getElementById('appointmentStatus'),
                myData = {
                    appointmentId: $("#appointmentId").val(),
                    patientId: $("#patientId").val(),
                    patientIdNo: $("#patientIdNo").val(),
                    patientName: $("#patientName").val(),
                    patientSurname: $("#patientSurname").val(),
                    patientFatherName: $("#patientFatherName").val(),
                    patientMotherName: $("#patientMotherName").val(),
                    patientGender: $("#patientGender").val(),
                    patientBirthPlace: $("#patientBirthPlace").val(),
                    patientBirthDate: $("#patientBirthDate").val(),
                    appointmentDate: $("#appointmentDate").val(),
                    appointmentHour: $("#appointmentHour").val(),
                    appointmentPolyclinic: myPolyclinicSelect.options[myPolyclinicSelect.selectedIndex].value,
                    appointmentDoctor: myDoctorSelector.options[myDoctorSelector.selectedIndex].value,
                    appointmentStatus: myStatusSelect.options[myStatusSelect.selectedIndex].value,
                    patientSavedUser: $.cookie('username')
                };

            if (document.getElementById('appointmentSave').innerHTML == 'Update') {
                AppointmentMethods.updateAppointmentData()
            } else {
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/appSave/saveAppointment',
                    success: function() {
                        toastr.success('Appointment successfully saved!', 'Save');
                        AppointmentMethods.fillPolyclinicAppointmentStatusTable();
                        AppointmentMethods.fillCanceledValidAppointmentTable();
                        AppointmentMethods.fillAppointmentGenderTable();
                        AppointmentMethods.findPatientAppointmentHistory();
                        AppointmentMethods.fillPolAppointmentStatusTable();
                        PolyclinicExamMethods.fillPatientAppointmentStatusTable();
                        PolyclinicExamMethods.fillDoctorAppointmentTable();
                        PolyclinicExamMethods.fillDoctorOnLeaveTable();
                    },
                    error: function(e) {
                        toastr.error('Appointment couldnt save! \n' + e, 'Error!')
                        console.log("ERROR: ", e);
                    }
                });
            }
        },

        getMaxAppointmentId: function getMaxAppointmentId() {
            $.ajax({
                type: "GET",
                url: "/appSave/getMaxAppointmentId",
                success: function(appointment) {
                    if (appointment.length < 1) {
                        $("#appointmentId").val(1);
                    } else {
                        $("#appointmentId").val(appointment.appointmentId + 1);
                    }
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error("Couldn't get max appointmentId!", "Error!")
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        updateAppointmentData: function updateAppointmentData() {
            jQueryMethods.toastrOptions();
            var myStatusSelect = document.getElementById('appointmentStatus'),
                myAppointmentHour = document.getElementById('appointmentHour').value,
                myAppointmentId = document.getElementById('appointmentId').value,
                myData = {
                    appointmentId: myAppointmentId,
                    appointmentHour: myAppointmentHour,
                    appointmentStatus: myStatusSelect.options[myStatusSelect.selectedIndex].value
                };

            $('#patientHistoryTable > tbody').empty();

            if ($("#patientIdNo").val() == '') {
                toastr.error('Please enter patient personal ID number! \n\n\n', 'Error!')
            } else {
                $.ajax({
                    type: 'PUT',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/appSave/updateAppointmentData',
                    success: function(patient) {
                        toastr.success('Appointment updated! \n\n\n', 'Appointment Update');
                        AppointmentMethods.fillPolyclinicAppointmentStatusTable();
                        AppointmentMethods.fillCanceledValidAppointmentTable();
                        AppointmentMethods.fillAppointmentGenderTable();
                        AppointmentMethods.findPatientAppointmentHistory();
                        AppointmentMethods.fillPolAppointmentStatusTable();
                        PolyclinicExamMethods.fillPatientAppointmentStatusTable();
                        PolyclinicExamMethods.fillDoctorAppointmentTable();
                        PolyclinicExamMethods.fillDoctorOnLeaveTable();
                    },
                    error: function(e) {
                        jQueryMethods.toastrOptions();
                        toastr.error('Appointment couldnt update! \n\n\n' + e.responseText, 'Error!')
                        console.log("ERROR: ", e.responseText);
                    }
                });
            }
        },

        findPatientAppointmentHistory: function findPatientAppointmentHistory() {
            $('#patientHistoryTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/appSave/findPatientAppointmentHistory",
                data: { patientIdNo: $("#patientIdNo").val() },
                success: function(result) {
                    $.each(result, function(i, appointmentData) {
                        i++;
                        $("#patientHistoryTable> tbody").append(
                            "<tr class='patientHistory' id='patientHistory" + i + "' title=''><td >" +
                            i + "</td><td>" + appointmentData.appointmentId + "</td><td>" +
                            appointmentData.appointmentDate + " - " + appointmentData.appointmentHour + "</td><td>" +
                            appointmentData.appointmentPolyclinic + "</td><td>" +
                            appointmentData.appointmentDoctor + "</td><td>" +
                            appointmentData.appointmentStatus + "</td><td><button class='inpatientBtn btn-success' title='Click for select appointment.' onclick=\"AppointmentMethods.findByAppointmentId(\'patientHistory" + i + "\')\">Select</button></td></tr>");
                    });
                    AppointmentMethods.colorRedCanceledAppointmentId('patientHistoryTable', 5);
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Patient appointment history couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        colorRedCanceledAppointmentId: function colorRedCanceledAppointmentId(tableId, cellId) {
            var table = document.getElementById(tableId);
            for (var r = 0, n = table.rows.length; r < n; r++) {
                for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
                    if (table.rows[r].cells[cellId].innerHTML == 'Canceled-Doctor-Operation' ||
                        table.rows[r].cells[cellId].innerHTML == 'Canceled-By-Patient') {
                        table.rows[r].style.background = 'linear-gradient(90deg,rgb(229 48 62),lightgrey)';
                        table.rows[r].style.color = 'white  ';
                    }
                }
            }
        },

        findByAppointmentId: function findByAppointmentId(rowId) {
            jQueryMethods.toastrOptions();
            var myRow = document.getElementById(rowId),
                myPolyclinicSelect = document.getElementById('appointmentPolyclinic'),
                polyclinicSelect = myPolyclinicSelect.options[myPolyclinicSelect.selectedIndex],
                myDoctorSelector = document.getElementById('appointmentDoctor'),
                doctorSelector = myDoctorSelector.options[myDoctorSelector.selectedIndex],
                myStatusSelect = document.getElementById('appointmentStatus'),
                statusSelect = myStatusSelect.options[myStatusSelect.selectedIndex],
                myAppointmentId = myRow.cells[1].innerHTML,
                myPatientIdNo = document.getElementById('patientIdNo'),
                myPatientId = document.getElementById('patientId'),
                appointmentSaveBtn = document.getElementById('appointmentSave');
            $.ajax({
                type: "GET",
                url: "/appSave/findByAppointmentId",
                data: { appointmentId: myAppointmentId },
                success: function(patient) {
                    if (patient.appointmentId == '' || patient.appointmentId == null ||
                        patient.appointmentId == 'undefind') {
                        toastr.error('Patient appointment found by data couldnt set to form! \n\n\n', 'Error!')
                    } else {
                        $("#patientId").val(patient.patientId);
                        $("#appointmentId").val(patient.appointmentId);
                        $("#patientIdNo").val(patient.patientIdNo);
                        $("#patientName").val(patient.patientName);
                        $("#patientSurname").val(patient.patientSurname);
                        $("#patientFatherName").val(patient.patientFatherName);
                        $("#patientMotherName").val(patient.patientMotherName);
                        $("#patientGender").val(patient.patientGender);
                        $("#patientBirthPlace").val(patient.patientBirthPlace);
                        $("#patientBirthDate").val(patient.patientBirthDate);
                        $("#appointmentDate").val(patient.appointmentDate);
                        $("#appointmentHour").val(patient.appointmentHour);
                        polyclinicSelect = patient.appointmentPolyclinic;
                        doctorSelector = patient.appointmentDoctor;
                        statusSelect = patient.appointmentStatus;
                        appointmentSaveBtn.innerHTML = 'Update';

                        myPatientIdNo.readOnly = true;
                        myPatientId.readOnly = true;
                        myPolyclinicSelect.readOnly = true;
                        myDoctorSelector.readOnly = true;
                        document.getElementById("appointmentDate").readOnly = true;
                        $("#appointmentDate").css("pointer-events", "none");
                        $("#appointmentDate").css("background-color", "lightgrey");
                        $("#appointmentPolyclinic").css("pointer-events", "none");
                        $("#appointmentPolyclinic").css("background-color", "lightgrey");
                        $("#appointmentDoctor").css("pointer-events", "none");
                        $("#appointmentDoctor").css("background-color", "lightgrey");

                        toastr.info('Appointment No: ' + patient.appointmentId + ' - selected!', 'Patient Appointment Search');
                    }
                },
                error: function(e) {
                    toastr.error('Patient appointment couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillPolyclinicAppointmentStatusTable: function fillPolyclinicAppointmentStatusTable() {
            var appMonth = document.getElementById('appMonth'),
                date = new Date(),
                firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString(),
                lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString();

            $('#polyclinicAppointmentStatusTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/appSave/fillPolyclinicAppointmentStatusTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#polyclinicAppointmentStatusTable> tbody").append(
                            "<tr class='userStatisticsRow'><td class='doctorSelector'>" +
                            docs[i]["_id"] +
                            "</td><td class='patientCount'>" + docs[i]["count"] + "</td></tr>");
                    });

                    appMonth.innerHTML = 'Appointments between = <br>' + firstDay + ' - ' + lastDay;
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Polyclinic appointments couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillCanceledValidAppointmentTable: function fillCanceledValidAppointmentTable() {
            var canceled = 0,
                valid = 0,
                percentageValid = 0,
                percentageCanceled = 0,
                total = 0;

            $('#canceledValidAppointmentTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/appSave/fillCanceledValidAppointmentTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#canceledValidAppointmentTable> tbody").append(
                            "<tr class='userStatisticsRow'><td class='doctorSelector'>" +
                            docs[i]["_id"]['appointmentStatus'] +
                            "</td><td class='patientCount'>" + docs[i]["count"] + "</td></tr>");

                        if (docs[i]["_id"]['appointmentStatus'] == 'Canceled-Doctor-Operation' ||
                            docs[i]["_id"]['appointmentStatus'] == 'Canceled-By-Patient') {
                            canceled = docs[i]["count"];
                        } else {
                            valid = docs[i]["count"];
                        }
                    });

                    total = canceled + valid;
                    percentageValid = (valid * 100) / total;
                    percentageCanceled = (canceled * 100) / total;

                    document.getElementById('appValid').innerHTML = 'Valid percentage = % ' + Math.round(percentageValid);
                    document.getElementById('appCanceled').innerHTML = 'Canceled percentage = % ' + Math.round(percentageCanceled);
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Canceled / Valid Appointments couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillAppointmentGenderTable: function fillAppointmentGenderTable() {
            var appGenderTableDate = document.getElementById('appGenderTableDate'),
                date = new Date(),
                firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString(),
                lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString();

            $('#appointmentGenderTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/appSave/fillAppointmentGenderTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#appointmentGenderTable> tbody").append(
                            "<tr class='userStatisticsRow'><td class='patientData'>" +
                            docs[i]["_id"]["appointmentPolyclinic"] +
                            "</td><td class='patientGender'>" + docs[i]["_id"]["patientGender"] +
                            "</td><td class='polyclinicCount'>" + docs[i]["count"] + "</td></tr>");
                    });

                    appGenderTableDate.innerHTML = 'Appointments between = <br>' + firstDay + ' - ' + lastDay;
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Appointment gender couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillPolAppointmentStatusTable: function fillPolAppointmentStatusTable() {
            $('#polStatusTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/appSave/fillPolAppointmentStatusTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#polStatusTable> tbody").append(
                            "<tr class='appPol' id='appPolRowId" + i + "' colspan='0'><td class='doctorSelector'>" + docs[i]['_id']
                        );
                        for (let i2 = 0; i2 < docs[i]["data"].length; i2++) {
                            $("#appPolRowId" + i).append(
                                "</td><td class='appHour'>" +
                                docs[i]["data"][i2]["patientName"] + " " + docs[i]["data"][i2]["patientSurname"] + "<br>" +
                                docs[i]["data"][i2]["appointmentDate"] + " - " + docs[i]["data"][i2]["appointmentHour"] +
                                "<br> Appointment Id: " +
                                docs[i]["data"][i2]["appointmentId"] +
                                "</td></tr>");
                        };
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('fillPolStatusTable couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        }
    },

    CardAnimationAndAdjustmentMethods = {
        cardColor: function cardColor() { // only for cardview load
            var elements = document.querySelectorAll(".front"); // get all elements
            var colorStop = document.getElementById('colorChk').checked; // when color change stop checkbox checked
            var nightMode = document.getElementById('chooseClassColor');
            if (colorStop == true && nightMode != '3') {
                for (var i = 0; i < elements.length; i++) {
                    ColorAndAdjustmentMethods.adjustClassColor(elements[i].id);
                    elements[i].style.backgroundColor = ColorAndAdjustmentMethods.randomDarkColor();
                    elements[i].style.borderStyle = 'none';
                    elements[i].style.borderRadius = '10px';
                }

                // colors selected indexchange
                var selectElem1 = document.querySelector('#chooseClassColor');
                // When a new <option> is selected
                selectElem1.addEventListener('change', function() {
                    var index = selectElem1.selectedIndex;
                    for (let i = 0; i < elements.length; i++) {

                        if (index == "0") {
                            elements[i].style.backgroundColor = ColorAndAdjustmentMethods.getSoftColor();
                        } else if (index == "1") {
                            elements[i].style.backgroundColor = ColorAndAdjustmentMethods.randomDarkColor();
                        } else if (index == "2") {
                            elements[i].style.backgroundColor = ColorAndAdjustmentMethods.myColors();
                        } else if (index == "3") {
                            elements[i].style.backgroundColor = ColorAndAdjustmentMethods.nightModeColors();
                            document.body.style.backgroundColor = 'grey';
                            elements[i].style.color = 'darkgrey';
                        } else {
                            elements[i].style.backgroundColor = ColorAndAdjustmentMethods.myColors();
                        }
                    }
                })
            }
        },

        leftAndRightSlide: function leftAndRightSlide() {
            var hastaKimlikBaseCard = document.getElementById('hastaKimlikBaseCard'),
                polMuayeneBaseCard = document.getElementById('polMuayeneBaseCard'),
                randevuKayitBaseCard = document.getElementById('randevuKayitBaseCard'),
                // randevuSorguBaseCard = document.getElementById('randevuSorguBaseCard'),
                laboratoryBaseParent = document.getElementById('laboratoryBaseParent'),
                radiologyBaseParent = document.getElementById('radiologyBaseParent'),

                polDefteriBaseParent = document.getElementById('polDefteriBaseParent'),
                diyetModuleBaseParent = document.getElementById('diyetModuleBaseParent'),
                announcementBaseParent = document.getElementById('announcementBaseParent'),
                inpatientBaseParent = document.getElementById('inpatientBaseParent'),
                administrationBaseParent = document.getElementById('administrationBaseParent');

            // ================ slide right

            hastaKimlikBaseCard.style.animation = 'slide-cards-right 1.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';
            hastaKimlikBaseCard.style.webkitAnimation = 'slide-cards-right 1.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';

            polMuayeneBaseCard.style.animation = 'slide-cards-right 0.9s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';
            polMuayeneBaseCard.style.webkitAnimation = 'slide-cards-right 0.9s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';

            randevuKayitBaseCard.style.animation = 'slide-cards-right 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';
            randevuKayitBaseCard.style.webkitAnimation = 'slide-cards-right 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';

            // randevuSorguBaseCard.style.animation = 'slide-cards-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';
            // randevuSorguBaseCard.style.webkitAnimation = 'slide-cards-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';

            laboratoryBaseParent.style.animation = 'slide-cards-right 5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';
            laboratoryBaseParent.style.webkitAnimation = 'slide-cards-right 1.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';

            radiologyBaseParent.style.animation = 'slide-cards-right 1.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';
            radiologyBaseParent.style.webkitAnimation = 'slide-cards-right 1.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';

            administrationBaseParent.style.animation = 'slide-cards-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';
            administrationBaseParent.style.webkitAnimation = 'slide-cards-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';

            // ====================================================== slide left

            polDefteriBaseParent.style.animation = 'slide-cards-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';
            polDefteriBaseParent.style.webkitAnimation = 'slide-cards-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';

            diyetModuleBaseParent.style.animation = 'slide-cards-left 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';
            diyetModuleBaseParent.style.webkitAnimation = 'slide-cards-left 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';

            announcementBaseParent.style.animation = 'slide-cards-left 0.9s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';
            announcementBaseParent.style.webkitAnimation = 'slide-cards-left 0.9s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';

            inpatientBaseParent.style.animation = 'slide-cards-left 1.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';
            inpatientBaseParent.style.webkitAnimation = 'slide-cards-left 1.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both';


        },

        addCardFavourites: function addCardFavourites(cardId, myHeartId) { // add or remove cards from favourites
            var line1 = document.getElementById('card-container'),
                line2 = document.getElementById('card-container2'),
                line3 = document.getElementById('card-container3'),
                line2Cards = ['polDefteriBaseParent', 'diyetModuleBaseParent', 'announcementBaseParent', 'inpatientBaseParent'],
                line3Cards = ['laboratoryBaseParent', 'radiologyBaseParent', 'administrationBaseParent'],
                card = document.getElementById(cardId);

            line1.insertBefore(card, line1.firstChild);

            if (card.classList.contains('favourite')) { // remove from favourites
                card.classList.remove('favourite');
                document.getElementById(myHeartId).style.color = 'white';

                if (line2Cards.includes(cardId)) { // if card belongs line 2
                    line2.appendChild(card);
                } else if (line3Cards.includes(cardId)) { // if card belongs line 3
                    line3.appendChild(card)
                } else { line1.appendChild(card); } // add line 1

                CardAnimationAndAdjustmentMethods.cardsPreviousLine();
                ShowOrHideMethods.showRemoveAlert();

            } else { // add favourites
                card.classList.add('favourite');
                ShowOrHideMethods.showSuccesAlert();
                document.getElementById(myHeartId).style.color = 'red';
                document.getElementById(myHeartId).title = 'Remove from your favourites!'
                CardAnimationAndAdjustmentMethods.cardsNextLine();
            }
        },

        cardsNextLine: function cardsNextLine() {
            var line1 = document.getElementById('card-container'),
                line2 = document.getElementById('card-container2'),
                line3 = document.getElementById('card-container3');

            if (line1.childElementCount > 4) {
                line2.insertBefore(line1.lastElementChild, line2.firstElementChild)
            }
            if (line2.childElementCount > 4) {
                line3.insertBefore(line2.lastElementChild, line3.firstElementChild)
            }

        },

        cardsPreviousLine: function cardsPreviousLine() {
            var line1 = document.getElementById('card-container'),
                line2 = document.getElementById('card-container2'),
                line3 = document.getElementById('card-container3');
            if (line1.childElementCount < 4) {
                line1.appendChild(line2.firstElementChild)
            }
            if (line2.childElementCount < 4) {
                line2.appendChild(line3.firstElementChild)
            }

        },

        createNewLineForCards: function createNewLineForCards() {
            var line2 = document.getElementById('card-container3'),
                line3 = document.createElement('div');

            if (line2.childElementCount > 4) {
                line3.setAttribute('class', 'card-container4');
                line3.appendChild(line2.lastElementChild);
            }
        }
    },

    CheckAndClearMethods = {
        isNull: function isNull(text) {
            if (text == null || text === '') {
                return true;
            }
        },

        checksBeforeExit: function checksBeforeExit(iframeId, Tagname, containerTabId) { // checks if there is any value on iframe 
            var x = document.getElementById(iframeId).contentDocument
                .querySelectorAll(Tagname);
            var hasvalue = [];
            for (let i = 0; i < x.length; i++) {
                if (x[i].value.length > 0) {
                    hasvalue += x[i].value;
                }
            }
            if (hasvalue.length > 0) {
                var conf = confirm('Girdiginiz verileri kaydetmeden cikmak istediginize emin misiniz?');
                if (conf == true) {
                    TabProcess.closeContainerTab(containerTabId);
                    CheckAndClearMethods.cleanIframeContentValues(iframeId);
                }
            } else {
                TabProcess.closeContainerTab(containerTabId);
                CheckAndClearMethods.cleanIframeContentValues(iframeId);
            }

        },

        checkNullFieldsInIframe: function checkNullFieldsInIframe(iframeId) { // good for check before save or update
            var iframe = document.getElementById(iframeId);
            var elements = iframe.contentWindow.document.querySelectorAll("input");

            var y = [];
            for (let i = 0; i < elements.length; i++) { // check all ipnut text 
                y += elements[i].id;

                if (CheckAndClearMethods.isNull(elements[i].value) == true) {
                    alert(elements[i].id + ' alani bos olamaz.');
                }
            }
            var x = iframe.contentWindow.document.querySelectorAll("select");
            if (x[0].value == 'bos') { // check gender
                alert('cinsiyet secin.');
            }

            var adresss = iframe.contentWindow.document.querySelectorAll("textarea");
            if (adresss[0].value.length <= 0) { // check adress
                alert('adress alani bos olamaz.');
            }

            // alert(y+' ,');
        },

        cleanIframeContentValues: function cleanIframeContentValues(iframeId) {
            var iframe = document.getElementById(iframeId);
            iframe.src = iframe.src;
        },

        isMobile: function isMobile() { // check if user device is mobile or not
            var check = false;
            (function(a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                    check = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        },

        checkIfTextsAreSame: function checkIfTextsAreSame(text1, text2, alertTextId) {
            var text1InnerHTML = document.getElementById(text1).value,
                text2InnerHTML = document.getElementById(text2).value,
                alertText = document.getElementById(alertTextId);

            if (text1InnerHTML == text2InnerHTML) {
                alertText.style.display = 'block';
                alertText.style.color = 'green';
                alertText.style.fontSize = '21px';
                alertText.style.borderStyle = 'ridge';
                alertText.style.borderRadius = '50px';
                alertText.style.width = '44px';
                alertText.style.padding = '5px 9px';
                alertText.style.margin = '0px 47%';
                alertText.innerHTML = '&#10004;';
            } else {
                alertText.style.display = 'block';
                alertText.style.color = 'red';
                alertText.style.fontSize = '16px';
                alertText.style.borderStyle = 'ridge';
                alertText.style.borderRadius = '50px';
                alertText.style.width = '59%';
                alertText.style.padding = '5px 9px';
                alertText.style.margin = '0px 20%';
                alertText.innerHTML = '&#10008; - New password and repeat are not same, please check! '
            }
        }

    },

    ColorAndAdjustmentMethods = {
        closeBtnStyleTopchange: function closeBtnStyleTopchange(buttonid, pixel) {
            document.getElementById(buttonid).style.top = pixel;
        },

        scroolCloseBtn: function scroolCloseBtn() {
            let mybtn = document.querySelectorAll(".closeBtn");
            window.onscroll = function() { scroolCloseBtn() };
            if (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5) {
                mybtn.style.display = "block";
            } else {
                mybtn.style.display = "none";
            }
        },

        getSoftColor: function getSoftColor() {
            // get only soft colors
            return "hsl(" + 360 * Math.random() + ',' +
                (25 + 70 * Math.random()) + '%,' +
                (85 + 10 * Math.random()) + '%)'
        },

        myColors: function colors() {
            // get all colors
            let colorArray = [];

            for (let i = 0; i < 3; i++) {
                colorArray.push(Math.floor(Math.random() * (255 - 0) + 0));
            }
            // rgb -> hex
            let color = colorArray
                .map(x => x.toString(16))
                .join('');

            return `#${color}`;
        },

        classColor: function classColor() { //class background color
            var colorStop = document.getElementById('colorChk').checked, // when color change stop checkbox checked
                nightMode = document.getElementById('chooseClassColor'),
                elements = document.querySelectorAll(".column"), // get all columns
                navWrapper = document.getElementById('nav-wrapper');

            if (colorStop == true && nightMode != '3') {
                for (var i = 0; i < elements.length; i++) {
                    elements[i].style.background = 'linear-gradient(90deg,' +
                        ColorAndAdjustmentMethods.randomDarkColor() +
                        ',' + ColorAndAdjustmentMethods.getSoftColor() + ')';
                    ColorAndAdjustmentMethods.adjustClassColor(elements[i].id);
                    document.body.style.backgroundColor = 'white';
                    elements[i].style.color = 'white';
                    navWrapper.style.backgroundColor = 'white';
                }
                // colors selected indexchange -- for columns (list and grid) and cards
                var selectElem = document.getElementById('chooseClassColor');
                selectElem.addEventListener('change', function() {
                    var index = selectElem.selectedIndex,
                        myHeadTitle = document.getElementById('title'),
                        cards = document.querySelectorAll(".card"); // for cards

                    myHeadTitle.style.background = 'url(/public/images/turquoise-green-watercolor-brush-stroke-4.png)';
                    myHeadTitle.style.backgroundRepeat = 'no-repeat';
                    myHeadTitle.style.backgroundSize = '100% 120%';

                    for (let i = 0; i < elements.length; i++) { // for columns

                        if (index == "0") { // light colors
                            elements[i].style.background =
                                'linear-gradient(90deg,' +
                                ColorAndAdjustmentMethods.getSoftColor() +
                                ',' + ColorAndAdjustmentMethods.getSoftColor() + ')';
                            elements[i].style.borderStyle = 'none none solid solid';
                            elements[i].style.borderRadius = '';
                            elements[i].style.margin = '0px';
                            elements[i].style.borderWidth = '1px';
                            elements[i].style.borderColor = 'white';
                            document.body.style.backgroundColor = 'white';
                            elements[i].style.color = 'white';
                            document.getElementById('colorChk').checked = true;
                            navWrapper.style.backgroundColor = 'white';
                        } else if (index == "1") { // dark colors
                            elements[i].style.background =
                                'linear-gradient(90deg,' +
                                ColorAndAdjustmentMethods.randomDarkColor() +
                                ',' + ColorAndAdjustmentMethods.getSoftColor() + ')';
                            ColorAndAdjustmentMethods.adjustClassColor(elements[i].id);
                            elements[i].style.borderStyle = 'none none solid solid';
                            elements[i].style.borderRadius = '';
                            elements[i].style.margin = '0px';
                            elements[i].style.borderWidth = '1px';
                            elements[i].style.borderColor = 'white';
                            document.body.style.backgroundColor = 'white';
                            elements[i].style.color = 'white';
                            document.getElementById('colorChk').checked = true;
                            navWrapper.style.backgroundColor = 'white';
                        } else if (index == "2") { //all colors
                            elements[i].style.background =
                                'linear-gradient(90deg,' +
                                ColorAndAdjustmentMethods.myColors() +
                                ',' + ColorAndAdjustmentMethods.getSoftColor() + ')';
                            elements[i].style.borderStyle = 'none none solid solid';
                            elements[i].style.borderRadius = '';
                            elements[i].style.margin = '0px';
                            elements[i].style.borderWidth = '1px';
                            elements[i].style.borderColor = 'white';
                            document.body.style.backgroundColor = 'white';
                            elements[i].style.color = 'white';
                            document.getElementById('colorChk').checked = true;
                            navWrapper.style.backgroundColor = 'white';
                        } else if (index == "3") { // nightmode
                            for (let i = 0; i < elements.length; i++) {
                                elements[i].style.background = ColorAndAdjustmentMethods.nightModeColors();
                                document.body.style.backgroundColor = 'grey';
                                elements[i].style.color = 'darkgrey';
                                document.getElementById('colorChk').checked = false;
                            }
                        }
                        for (let i2 = 0; i2 < cards.length; i2++) { // cards background
                            if (index == "0") {
                                cards[i2].style.backgroundColor = ColorAndAdjustmentMethods.getSoftColor();
                                cards[i2].style.borderStyle = 'none';
                                cards[i2].style.borderRadius = '';
                                document.body.style.backgroundColor = 'white';
                                cards[i2].style.color = 'white';
                                document.getElementById('colorChk').checked = true;
                            } else if (index == "1") {
                                cards[i2].style.backgroundColor = ColorAndAdjustmentMethods.randomDarkColor();
                                ColorAndAdjustmentMethods.adjustClassColor(elements[i].id);
                                cards[i2].style.borderStyle = 'none';
                                cards[i2].style.borderRadius = '';
                                document.body.style.backgroundColor = 'white';
                                cards[i2].style.color = 'white';
                                document.getElementById('colorChk').checked = true;
                            } else if (index == "2") {
                                cards[i2].style.backgroundColor = ColorAndAdjustmentMethods.myColors();
                                cards[i2].style.borderStyle = 'none';
                                cards[i2].style.borderRadius = '';
                                document.body.style.backgroundColor = 'white';
                                cards[i2].style.color = 'white';
                                document.getElementById('colorChk').checked = true;
                            } else if (index == "3") {
                                cards[i2].style.backgroundColor = ColorAndAdjustmentMethods.nightModeColors();
                                document.body.style.backgroundColor = 'grey';
                                cards[i2].style.color = 'darkgrey';
                                document.getElementById('colorChk').checked = false;
                            } else {
                                cards[i2].style.backgroundColor = ColorAndAdjustmentMethods.myColors();
                                cards[i2].style.borderStyle = 'none';
                                cards[i2].style.borderRadius = '';
                                document.body.style.backgroundColor = 'white';
                                cards[i2].style.color = 'white';
                                document.getElementById('colorChk').checked = true;
                            }
                        }
                    }
                })
            }
        },

        classColorSoft: function classColorSoft() { //
            //class background color
            var elements = document.querySelectorAll(".column"); // get all elements
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.backgroundColor = ColorAndAdjustmentMethods.getSoftColor();
                elements[i].style.borderStyle = 'none';
                elements[i].style.borderRadius = '';
            }
        },

        colorChangeChkbox: function colorChangeChkbox() { // change or fix color of classes
            try {
                var columns = document.querySelectorAll(".column"), // get all columns
                    cards = document.querySelectorAll(".card"), // get all cards
                    x = document.getElementById('colorChk').checked,
                    selectElem = document.getElementById('languageChange'),
                    mystabledColors = document.getElementById('stabledColors'),
                    index = selectElem.selectedIndex;

                if (x == true) {
                    mystabledColors.style.display = 'none';
                    if (index == 1) {
                        alert('Modüllerin rengi sürekli değişecek.')
                        ColorAndAdjustmentMethods.classColor();
                        CardAnimationAndAdjustmentMethods.cardColor();
                        document.getElementById('chooseClassColor').selectedIndex = '1';
                        for (var i = 0; i < columns.length; i++) {
                            columns[i].style.borderStyle = 'none';
                            columns[i].style.borderRadius = '';
                        }
                    } else {
                        alert('Moduls color will change after every change.')
                        ColorAndAdjustmentMethods.classColor();
                        CardAnimationAndAdjustmentMethods.cardColor();
                        document.getElementById('chooseClassColor').selectedIndex = '1';
                        for (var i = 0; i < columns.length; i++) {
                            columns[i].style.borderStyle = 'none';
                            columns[i].style.borderRadius = '';
                        }
                    }
                } else {
                    mystabledColors.style.display = 'inherit';
                    for (var i = 0; i < columns.length; i++) {
                        columns[i].style.background = 'linear-gradient(90deg, #61045f, #aa076b)';
                        columns[i].style.borderStyle = 'solid';
                        columns[i].style.borderRadius = '10px';
                    }
                    for (var i = 0; i < cards.length; i++) {
                        cards[i].style.background = 'linear-gradient(90deg, #61045f, #aa076b)';
                    }
                    if (index == 1) {
                        alert("Modüllerin rengi sabitlendi.")
                    } else {
                        alert("Moduls color fixed and won't change.")
                    }
                }
            } catch (error) {
                console.log(error)
            }
        },

        stabledColorsChange: function stabledColorsChange() {
            try {
                var columns = document.querySelectorAll(".column"), // get all columns
                    front = document.querySelectorAll(".front"), // get all cards front side
                    cards = document.querySelectorAll(".card"), // get all cards front side
                    mystabledColors = document.getElementById('stabledColors');

                mystabledColors.addEventListener('change', function() {
                    var myStableColorIndex = mystabledColors.selectedIndex;

                    if (myStableColorIndex == 0) { //renkli - colorful
                        for (var i = 0; i < columns.length; i++) {
                            columns[i].style.background = 'linear-gradient(90deg, #aa076b, #61045f)';
                            columns[i].style.borderStyle = 'solid';
                            columns[i].style.borderRadius = '10px';
                        }
                        for (var i = 0; i < cards.length; i++) {
                            // front[i].style.background = 'linear-gradient(90deg, #aa076b, #61045f)';
                            cards[i].style.background = 'linear-gradient(90deg, #aa076b, #61045f)';
                            if (CheckAndClearMethods.isMobile() == true) {
                                front[i].style.backgroundSize = 'contain';
                                front[i].style.backgroundPosition = 'center top';
                            } else {
                                front[i].style.backgroundSize = '200px';
                                front[i].style.backgroundPosition = 'center center';
                            }
                            front[i].style.backgroundRepeat = 'no-repeat';
                            front[0].style.backgroundImage = 'url("/public/images/id-3.png")';
                            front[1].style.backgroundImage = 'url("/public/images/exam_2.png")';
                            front[2].style.backgroundImage = 'url("/public/images/Medical-icons/calender.png")';
                            front[3].style.backgroundImage = 'url("/public/images/Medical-icons/Calendar-selected-day.png")';
                            front[4].style.backgroundImage = 'url("/public/images/Medical-icons/polyclinic-doctor.png")';
                            front[5].style.backgroundImage = 'url("/public/images/diet_3.png")';
                            front[6].style.backgroundImage = 'url("/public/images/new_announcements.png")';
                            front[7].style.backgroundImage = 'url("/public/images/Medical-icons/nurse.png")';
                            front[8].style.backgroundImage = 'url("/public/images/Medical-icons/microscope.png")';
                            front[9].style.backgroundImage = 'url("/public/images/Medical-icons/X-Ray_Hand.ico")';
                            front[10].style.backgroundImage = 'url("/public/images/settings-1.png")';
                        }
                    } else if (myStableColorIndex == 1) { //yesil - green
                        for (var i = 0; i < columns.length; i++) {
                            columns[i].style.background = 'linear-gradient(90deg, green, transparent)';
                            columns[i].style.borderStyle = 'solid';
                            columns[i].style.borderRadius = '10px';
                        }
                        for (var i = 0; i < cards.length; i++) {
                            front[i].style.background = 'linear-gradient(90deg, green, transparent)';
                            cards[i].style.background = 'linear-gradient(90deg, green, transparent)';
                            if (CheckAndClearMethods.isMobile() == true) {
                                front[i].style.backgroundSize = 'contain';
                                front[i].style.backgroundPosition = 'center top';
                            } else {
                                front[i].style.backgroundSize = '200px';
                                front[i].style.backgroundPosition = 'center center';
                            }
                            front[i].style.backgroundRepeat = 'no-repeat';
                            front[0].style.backgroundImage = 'url("/public/images/id-3.png")';
                            front[1].style.backgroundImage = 'url("/public/images/exam_2.png")';
                            front[2].style.backgroundImage = 'url("/public/images/Medical-icons/calender.png")';
                            front[3].style.backgroundImage = 'url("/public/images/Medical-icons/Calendar-selected-day.png")';
                            front[4].style.backgroundImage = 'url("/public/images/Medical-icons/polyclinic-doctor.png")';
                            front[5].style.backgroundImage = 'url("/public/images/diet_3.png")';
                            front[6].style.backgroundImage = 'url("/public/images/new_announcements.png")';
                            front[7].style.backgroundImage = 'url("/public/images/Medical-icons/nurse.png")';
                            front[8].style.backgroundImage = 'url("/public/images/Medical-icons/microscope.png")';
                            front[9].style.backgroundImage = 'url("/public/images/Medical-icons/X-Ray_Hand.ico")';
                            front[10].style.backgroundImage = 'url("/public/images/settings-1.png")';
                        }
                    } else if (myStableColorIndex == 2) { // kirmizi - red
                        for (var i = 0; i < columns.length; i++) {
                            columns[i].style.background = 'linear-gradient(90deg, red, transparent)';
                            columns[i].style.borderStyle = 'solid';
                            columns[i].style.borderRadius = '10px';
                        }
                        for (var i = 0; i < cards.length; i++) {
                            front[i].style.background = 'linear-gradient(90deg, red, transparent)';
                            cards[i].style.background = 'linear-gradient(90deg, red, transparent)';
                            if (CheckAndClearMethods.isMobile() == true) {
                                front[i].style.backgroundSize = 'contain';
                                front[i].style.backgroundPosition = 'center top';
                            } else {
                                front[i].style.backgroundSize = '200px';
                                front[i].style.backgroundPosition = 'center center';
                            }
                            front[i].style.backgroundRepeat = 'no-repeat';
                            front[0].style.backgroundImage = 'url("/public/images/id-3.png")';
                            front[1].style.backgroundImage = 'url("/public/images/exam_2.png")';
                            front[2].style.backgroundImage = 'url("/public/images/Medical-icons/calender.png")';
                            front[3].style.backgroundImage = 'url("/public/images/Medical-icons/Calendar-selected-day.png")';
                            front[4].style.backgroundImage = 'url("/public/images/Medical-icons/polyclinic-doctor.png")';
                            front[5].style.backgroundImage = 'url("/public/images/diet_3.png")';
                            front[6].style.backgroundImage = 'url("/public/images/new_announcements.png")';
                            front[7].style.backgroundImage = 'url("/public/images/Medical-icons/nurse.png")';
                            front[8].style.backgroundImage = 'url("/public/images/Medical-icons/microscope.png")';
                            front[9].style.backgroundImage = 'url("/public/images/Medical-icons/X-Ray_Hand.ico")';
                            front[10].style.backgroundImage = 'url("/public/images/settings-1.png")';
                        }
                    } else if (myStableColorIndex == 3) { // mavi - blue
                        for (var i = 0; i < columns.length; i++) {
                            columns[i].style.background = 'linear-gradient(90deg, cornflowerblue, transparent)';
                            columns[i].style.borderStyle = 'solid';
                            columns[i].style.borderRadius = '10px';
                        }
                        for (var i = 0; i < cards.length; i++) {
                            front[i].style.background = 'linear-gradient(90deg, cornflowerblue, transparent)';
                            cards[i].style.background = 'linear-gradient(90deg, cornflowerblue, transparent)';
                            if (CheckAndClearMethods.isMobile() == true) {
                                front[i].style.backgroundSize = 'contain';
                                front[i].style.backgroundPosition = 'center top';
                            } else {
                                front[i].style.backgroundSize = '200px';
                                front[i].style.backgroundPosition = 'center center';
                            }
                            front[i].style.backgroundRepeat = 'no-repeat';
                            front[0].style.backgroundImage = 'url("/public/images/id-3.png")';
                            front[1].style.backgroundImage = 'url("/public/images/exam_2.png")';
                            front[2].style.backgroundImage = 'url("/public/images/Medical-icons/calender.png")';
                            front[3].style.backgroundImage = 'url("/public/images/Medical-icons/Calendar-selected-day.png")';
                            front[4].style.backgroundImage = 'url("/public/images/Medical-icons/polyclinic-doctor.png")';
                            front[5].style.backgroundImage = 'url("/public/images/diet_3.png")';
                            front[6].style.backgroundImage = 'url("/public/images/new_announcements.png")';
                            front[7].style.backgroundImage = 'url("/public/images/Medical-icons/nurse.png")';
                            front[8].style.backgroundImage = 'url("/public/images/Medical-icons/microscope.png")';
                            front[9].style.backgroundImage = 'url("/public/images/Medical-icons/X-Ray_Hand.ico")';
                            front[10].style.backgroundImage = 'url("/public/images/settings-1.png")';
                        }
                    }
                }, true);
            } catch (error) {
                console.log(error)
            }
        },

        randomDarkColor: function randomDarkColor() {
            var lum = -0.25;
            var hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            var rgb = "#",
                c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00" + c).substr(c.length);
            }
            return rgb;
        },

        nightModeColors: function nightModeColors() {
            document.getElementById('colorChk').checked = false;
            var elements = document.querySelectorAll(".column"), // for columns
                footerName = document.querySelectorAll('.shadows'),
                myHeadTitle = document.getElementById('title');

            document.getElementById('clock').style.color = 'white';
            document.getElementById('nav-wrapper').style.backgroundColor = 'grey';
            myHeadTitle.style.background = 'url(/public/images/grey-paint-brush-stroke-15.png)';
            myHeadTitle.style.backgroundRepeat = 'no-repeat';
            myHeadTitle.style.backgroundSize = '100% 120%';

            for (var i = 0; i < elements.length; i++) {
                elements[i].style.backgroundColor = '#737373';
                elements[i].style.background = '#737373';
                elements[i].style.borderColor = 'lightgrey';
                elements[i].style.borderStyle = 'solid';
                elements[i].style.borderRadius = '10px';
                elements[i].style.margin = '4px 4px 4px 4px';
            }

            var elements = document.querySelectorAll(".front"); // for cards
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.backgroundColor = '#737373';
            }

            // iframe
            var iframe = document.getElementById('iframe1');
            var elements = iframe.contentWindow.document.querySelectorAll("input");

            for (let i = 0; i < elements.length; i++) {
                elements[i].style.backgroundColor = '#737373';
                elements[i].style.color = 'lightyellow';
            }
            var sel = iframe.contentWindow.document.querySelectorAll("select");
            var textar = iframe.contentWindow.document.querySelectorAll("textarea");
            for (let i2 = 0; i2 < sel.length; i2++) {
                sel[i2].style.backgroundColor = '#737373';
                textar[i2].style.backgroundColor = '#737373';
                sel[i2].style.color = 'lightyellow';
                textar[i2].style.color = 'lightyellow';
            }
            for (let mi3 = 0; mi3 < footerName.length; mi3++) {
                footerName[mi3].style.color = 'gray';
            }
        },

        nightModeBySysTime: function nightModeBySysTime() { // night mode for colors after 19:00 system time 
            var mydate = new Date();
            var myhour = mydate.getHours();
            if (myhour >= 19 || myhour <= 7) {
                ColorAndAdjustmentMethods.nightModeColors();
                document.body.style.backgroundColor = 'grey';
                document.body.style.background = 'grey';
                document.getElementById('colorChk').checked = false;
                document.getElementById("chooseClassColor").selectedIndex = "3";
            }
        },

        adjustClassColor: function adjustClassColor(elementId) {
            var element, bgColor, brightness;
            element = document.getElementById(elementId);

            // Get the element's background color
            bgColor = window.getComputedStyle(element, null).getPropertyValue('background-color');

            // Call lightOrDark function to get the brightness (light or dark)
            brightness = ColorAndAdjustmentMethods.lightOrDark(bgColor);
            // If the background color is dark, add the light-text class to it
            if (brightness == 'dark') {
                element.style.backgroundColor = 'cornflowerblue';
                // alert('dark ' + element.style.backgroundColor);
            } else {

            }
        },

        lightOrDark: function lightOrDark(color) {
            var r, g, b, hsp;
            // Check the format of the color, HEX or RGB?
            if (color.match(/^rgb/)) {

                // If HEX --> store the red, green, blue values in separate variables
                color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

                r = color[1];
                g = color[2];
                b = color[3];
            } else {

                // If RGB --> Convert it to HEX:
                color = +("0x" + color.slice(1).replace(
                    color.length < 5 && /./g, '$&$&'
                ));

                r = color >> 16;
                g = color >> 8 & 255;
                b = color & 255;
            }
            // HSP (Highly Sensitive Poo) 
            hsp = Math.sqrt(
                0.299 * (r * r) +
                0.587 * (g * g) +
                0.114 * (b * b)
            );

            // Using the HSP value, determine whether the color is light or dark
            if (hsp > 70) {
                return 'light';
            } else {
                return 'dark';
            }
        },

        scrollPage: function scrollPage() {
            window.scrollBy(0, 200);
        },

        scaleForMobile: function scaleForMobile() { //change elements style for mobile devices
            var
                myLanguageChangeSelect = document.getElementById('languageChange'),
                myDiv = document.getElementById('headContainer'),
                subContainer = document.getElementById('subContainer'),
                myNavWrapper = document.getElementById('nav-wrapper'),
                mySubRightSide = document.getElementById('subRightSide'),
                mySubLeftSide = document.getElementById('subLeftSide'),
                myNavTitle = document.getElementById('nav-title'),
                myTitle = document.getElementById('title'),
                myEngTitle = document.getElementById('engTitle'),
                mytopScroolP = document.getElementById('topScroolP'),
                myAnnouncements = document.getElementById('announcements'),
                mytopScroolAnnouncement = document.getElementById('topScroolAnnouncement'),
                myBtns = document.querySelectorAll('.btn'),
                myLogo = document.getElementById('myLogo'),
                myClock = document.getElementById('clock'),
                myLeftNavBarDiv = document.getElementById('mySpan'),
                myLeftNavBarName = document.getElementById('leftSideNavName'),
                myNavCloseBtn = document.querySelector('.sidenav .closebtn'),
                myLeftNavIcon = document.querySelectorAll('.bar'),
                myChooseClassColor = document.getElementById('chooseClassColor'),
                mylanguageChange = document.getElementById('languageChange'),
                myLoginBtn = document.getElementById('loginBtn'),
                myloginContainer = document.getElementById('loginContainer'),
                myModalContent = document.getElementById('modal-content'),
                myImgcontainer = document.getElementById('imgcontainer'),
                myloginContainerBottom = document.getElementById('loginContainerBottom'),
                myloginUserName = document.getElementById('loginUserName'),
                myloginUserNameLbl = document.getElementById('loginUserNameLbl'),
                myloginPassword = document.getElementById('loginPassword'),
                myloginPasswordLbl = document.getElementById('loginPasswordLbl'),
                myinnerLoginBtn = document.getElementById('innerLoginBtn'),
                myrememberChkbxlbl = document.getElementById('rememberChkbxlbl'),
                myrememberChkbx = document.getElementById('rememberChkbx'),
                myforgotPass = document.getElementById('forgotPass'),
                myAvatar = document.getElementById('myAvatar'),
                myloginCloseBtn = document.getElementById('loginCloseBtn'),
                myRows = document.querySelectorAll('.row'),
                myColumns = document.querySelectorAll('.column'),
                myCardContainers = document.querySelectorAll('.card-container,.card-container2,.card-container3'),
                myCards = document.querySelectorAll('.card'),
                myBaseCards = document.querySelectorAll('.baseCard'),
                myCardFront = document.querySelectorAll('.front'),
                myCardBack = document.querySelectorAll('.back'),
                mycardLink = document.querySelectorAll('.cardLink'),
                myLikeBtns = document.querySelectorAll('.like-button'),
                mySocialBtns = document.querySelectorAll('.fa-2x'),
                myCopyright = document.querySelectorAll('.footer-copyright'),
                myH2 = document.querySelectorAll('h2'),
                myH4 = document.querySelectorAll('h4'),
                // =======================for iframes==========================
                myIframe = document.querySelectorAll('iframe'),
                // =============================================================
                myCloseBtns = document.querySelectorAll('.closeBtn'),
                myFixedCloseBtns = document.querySelectorAll('.fixedCloseBtn'),
                myBottomScrool = document.querySelector('#bottomScrollP4'),
                myModulAvatar = document.querySelectorAll('.modulAvatar'),
                mymodulLinks = document.querySelectorAll('.modulLink'),
                myColorandLogo = document.getElementById('colorAndLogo'),
                myLikeButton = document.querySelectorAll('.like-button'),
                myhelpButtons = document.querySelectorAll('.helpButtons');


            if (CheckAndClearMethods.isMobile() == true) {
                for (let myi1 = 0; myi1 < myLikeBtns.length; myi1++) {
                    myLikeBtns[myi1].style.top = '5px';
                    myLikeBtns[myi1].style.margin = '0px 0px 5px 0px';
                }
                myLanguageChangeSelect.style.display = 'flex';

                myDiv.style.maxWidth = '100%';
                myDiv.style.height = '90px';
                subContainer.style.height = '285px';
                subContainer.style.marginTop = '-35px';
                myNavWrapper.style.height = '70px';
                mySubRightSide.style.margin = '5px 20px 10px 20px';
                mySubRightSide.style.width = '50%';
                mySubLeftSide.style.marginLeft = '5px';
                myNavTitle.style.width = '110%';
                myTitle.style.fontSize = '15px';
                myTitle.style.padding = '0px';
                myTitle.style.margin = '30px 0px 10px 30px';
                myEngTitle.style.fontSize = '12px';
                myEngTitle.style.padding = '0px 15px 0px 20px';
                myEngTitle.style.borderRadius = 'unset';
                mytopScroolP.style.fontSize = '12px';
                mytopScroolP.style.width = '200px';
                mytopScroolP.style.margin = '5px 0px 0px 0px';
                myAnnouncements.style.fontSize = '10px';
                myAnnouncements.style.margin = '10px 0px 10px 0px';
                mytopScroolAnnouncement.style.fontSize = '12px';
                mytopScroolAnnouncement.style.lineHeight = '15px';
                mytopScroolAnnouncement.style.width = '90%';
                myLeftNavBarDiv.style.right = '10px';
                myLeftNavBarDiv.style.width = '60px';
                myLeftNavBarDiv.style.top = '-40px';
                myLeftNavBarDiv.style.paddingTop = '0px';
                myLeftNavBarName.style.color = 'transparent';
                myNavCloseBtn.style.top = '20px';
                myNavCloseBtn.style.right = '25px';
                for (let i5 = 0; i5 < myLeftNavIcon.length; i5++) {
                    myLeftNavIcon[i5].style.margin = '5px auto';
                    myLeftNavIcon[i5].style.width = '35px';
                    myLeftNavIcon[i5].style.height = '3px';
                }
                myChooseClassColor.style.fontSize = '12px';
                myChooseClassColor.style.width = '145px';
                mylanguageChange.style.width = '145px';
                myColorandLogo.style.marginTop = '10px';
                myLogo.style.width = '150px';
                myLogo.style.height = '120px';
                myLogo.style.marginTop = '5px';
                myLogo.style.marginBottom = '10px';
                myLoginBtn.style.width = '70px';
                myLoginBtn.style.height = '30px';
                myLoginBtn.style.padding = '0px';
                myLoginBtn.style.margin = '10px 12px 5px 0px';

                myClock.style.fontSize = '10px';
                myClock.style.margin = '-20px 50px 10px 210px';

                for (let i2 = 0; i2 < myColumns.length; i2++) {
                    myColumns[i2].style.fontSize = '10px';
                    myH2[i2].style.fontSize = '10px';
                    myModulAvatar[i2].style.width = '60px';
                    myModulAvatar[i2].style.height = '60px';
                    myModulAvatar[i2].style.marginTop = '40%';

                    mymodulLinks[i2].style.fontSize = '7px';
                }

                for (let i = 0; i < myhelpButtons.length; i++) {

                    if (myhelpButtons[i].parentElement.classList.contains('back')) {
                        myhelpButtons[i].style.margin = '0px 0px 5px 0px';
                    } else { myhelpButtons[i].style.margin = '0px 0px 5px -15px'; }

                }

                for (let myi2 = 0; myi2 < myRows.length; myi2++) {
                    myRows[myi2].style.margin = '0px 0px 0px 5px';

                }

                myloginContainer.style.margin = '10px 10px';
                myImgcontainer.style.margin = '0px 0px 12px 0px';
                myModalContent.style.margin = '10% auto 20% 17%';
                myAvatar.style.width = '90px';
                myAvatar.style.height = '90px';
                myAvatar.style.margin = '-40px 0px 0px 20px';

                myloginContainerBottom.style.width = '203px';
                myloginContainerBottom.style.height = '80px';
                myloginContainerBottom.style.padding = '10px 10px 20px 30px';

                myloginCloseBtn.style.bottom = '5px';
                myinnerLoginBtn.style.width = '70px';
                myinnerLoginBtn.style.height = '30px';
                myinnerLoginBtn.style.fontSize = '10px';
                myinnerLoginBtn.style.margin = '5px 0px 5px 0px';

                myloginUserName.style.width = '155px';
                myloginUserName.style.height = '20px';
                myloginUserName.style.fontSize = '10px';
                myloginUserName.style.margin = '0px';
                myloginUserName.style.padding = '0px';
                myloginUserNameLbl.style.fontSize = '12px';

                myloginPassword.style.width = '155px';
                myloginPassword.style.height = '20px';
                myloginPassword.style.fontSize = '10px';
                myloginPassword.style.margin = '0px';
                myloginPassword.style.padding = '0px';
                myloginPasswordLbl.style.fontSize = '12px';

                myrememberChkbxlbl.style.fontSize = '7px';
                myrememberChkbxlbl.style.margin = '5px 0px 0px 5px';
                myrememberChkbx.style.width = '10px';
                myrememberChkbx.style.height = '10px';
                myrememberChkbx.style.margin = '0px 0px 0px 5px';
                myforgotPass.style.fontSize = '10px';
                myforgotPass.style.backgroundColor = 'cornflowerblue';
                myforgotPass.style.color = 'white';
                myforgotPass.style.margin = '0px 30px 0px 30px';

                // cards adjustment
                for (let icard2 = 0; icard2 < myCardContainers.length; icard2++) {
                    myCardContainers[icard2].style.justifyContent = 'space-around';
                    myCardContainers[icard2].style.margin = '0px 0px 10px 0px';
                }


                for (let icard = 0; icard < myCardFront.length; icard++) {
                    myCardFront[icard].style.width = '70px';
                    myCardFront[icard].style.height = '150px';
                    myCardFront[icard].style.backgroundSize = 'contain';
                    myCardFront[icard].style.backgroundPosition = 'top';

                    myCards[icard].style.width = '70px';
                    myCards[icard].style.height = '150px';

                    myBaseCards[icard].style.width = '70px';
                    myBaseCards[icard].style.height = '150px';


                    myH4[icard].style.fontSize = '8px';
                    myH4[icard].style.margin = '0px';
                    myH4[icard].style.textAlign = 'left';
                    myH4[icard].style.padding = '10px 0px';

                    myCardBack[icard].style.fontSize = '5px';
                    myCardBack[icard].style.padding = '3px 0px 0px 3px';

                    myLikeButton[icard].style.left = '40%';

                    mycardLink[icard].style.margin = '10px 0px 0px 5px';
                }

                // end of cards

                for (let isoc = 0; isoc < mySocialBtns.length; isoc++) {
                    mySocialBtns[isoc].style.fontSize = '1em';
                }

                for (let icop = 0; icop < myCopyright.length; icop++) {
                    myCopyright[icop].style.fontSize = 'small';
                    myCopyright[icop].style.borderRadius = 'unset';
                    // myNameRecep.style.borderRadius = 'unset';

                }

                for (let i = 0; i < myBtns.length; i++) {
                    myBtns[0].style.width = '37px';
                    myBtns[1].style.width = '45px';
                    myBtns[2].style.width = '40px';
                    myBtns[i].style.fontSize = '9px';
                    myBtns[i].style.textAlign = 'left';
                }

                for (let i = 0; i < myCloseBtns.length; i++) {
                    myCloseBtns[i].style.display = 'none';
                    // myCloseBtns[i].style.top = '100px';
                    // myCloseBtns[i].style.right = '0px';
                    // myCloseBtns[i].style.left = '140px';
                    // myCloseBtns[i].style.fontSize = '10px';
                }

                for (let i = 0; i < myFixedCloseBtns.length; i++) {

                    myFixedCloseBtns[i].style.margin = '-680px 0px 0px 70px';
                }

                // =======================for iframes=======================

                for (let i = 0; i < myIframe.length; i++) {
                    myIframe[i].style.left = '-80px';
                    myIframe[i].style.top = '-50px';
                    myIframe[i].style.width = '170px';
                    myIframe[i].style.height = '610px';
                    var myLabels = myIframe[i].contentWindow.document.getElementsByClassName("labels");
                    var myInputs = myIframe[i].contentWindow.document.getElementsByClassName("inputs");

                    var myAdressGenderDate = myIframe[i].contentWindow.document.querySelectorAll("#adress,#cinsiyetiId,#dogumTarihi");
                    for (let i = 0; i < myAdressGenderDate.length; i++) {
                        myAdressGenderDate[i].style.width = '100px';
                    }

                    var myIframeBtns = myIframe[i].contentWindow.document.querySelectorAll("#hastaAra,#kaydet,#guncelle,#yeniHasta");
                    for (let i = 0; i < myIframeBtns.length; i++) {
                        myIframeBtns[i].classList.add('btn-xs');
                        myIframeBtns[i].style.width = '70px';
                        myIframeBtns[i].style.margin = '5px';
                    }
                    for (let i = 0; i < myLabels.length; i++) {
                        myLabels[i].style.fontSize = '9px';
                        myInputs[i].style.width = '95px';
                        myInputs[i].style.fontSize = 'xx-small';
                    }

                    var myAnnouncementBtns = myIframe[i].contentWindow.document.querySelectorAll("#kaydet1,#guncelle1,#yeniDuyuru");
                    for (let i2 = 0; i2 < myAnnouncementBtns.length; i2++) {
                        myAnnouncementBtns[i2].style.width = '105px';
                        myAnnouncementBtns[i2].classList.add('btn-xs');
                        myAnnouncementBtns[i2].style.margin = '5px';
                    }
                    var myAnnouncementBody = myIframe[i].contentWindow.document.querySelectorAll("textarea");
                    for (let i3 = 0; i3 < myAnnouncementBody.length; i3++) {
                        myAnnouncementBody[i3].style.width = '100px';
                    }
                    var myInputs2 = myIframe[i].contentWindow.document.querySelectorAll("#announcementId,#announcementTitle");
                    for (let i4 = 0; i4 < myInputs2.length; i4++) {
                        myInputs2[i4].style.width = '100px';
                    }

                    myBottomScrool.innerHTML = "It's a mobile device.";
                }
            }
            // else {// add google translate script
            //     var script = document.createElement('script');
            //     script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            //     var myBody = document.getElementsByTagName("body")[0];
            //     myBody.appendChild(script);
            // }


        }
    },

    DietMethods = {
        bodyMassIndex: function bodyMassIndex() {

            var patientGender = $.cookie('patientGender');
            console.log(patientGender)
            if (patientGender == 'Male') {
                document.getElementById('bodyMassIndexMan').style.display = 'block'
                document.getElementById('bodyMassIndexMan').style.margin = '-37px 10px'
                document.getElementById('bodyMassIndexMan').style.width = '290px'
                document.getElementById('bodyMassIndexWoman').style.display = 'none'
            } else {
                document.getElementById('bodyMassIndexWoman').style.display = 'block'
                document.getElementById('bodyMassIndexMan').style.display = 'none'
            }
        },

        findPatientList: function findPatientList() {
            jQueryMethods.toastrOptions();
            if ($.cookie('username') == null ||
                $.cookie('username') == 'null' ||
                $.cookie('username') == undefined ||
                $.cookie('username') == 'undefined') {
                toastr.error('Please login from Main page!', 'Login error!')
            } else {
                var polExamDate = $('#examDate').val(),
                    myPolyclinicSelectValue = $("#polyclinicSelector option:selected").val();

                $('#patientTable > tbody').empty();

                $.ajax({
                    type: "GET",
                    url: "/diet/findPatientList",
                    data: { polyclinicSelect: myPolyclinicSelectValue, statusSelect: 'Valid', patientPolExamDate: polExamDate },
                    success: function(result) {
                        $.each(result, function(i, patientData) {
                            i++;
                            var patientAppStatusId = 'patientAppStatus' + i;
                            $("#patientTable> tbody").append(
                                "<tr class='patientList' id='patient" + i +
                                "' title='' onclick='PolyclinicMethods.getPatientPersonalIdNo(\"patient" + i + "\");PolyclinicMethods.findPatientDiagnosisHistory();PolyclinicMethods.findPatientAnamnesisByProtocol();PolyclinicMethods.fillPatientExamHistoryTable();PolyclinicMethods.fillPatientLabRadHistoryTable();DietMethods.bodyMassIndex();' onmouseover ='PolyclinicMethods.getPatientPersonalIdNo(\"patient" + i + "\");jQueryMethods.getPatientPhotoAndInfos(\"patient" + i + "\")'><td style='color:white'>" +
                                patientData.patientProtocolNo + "</td><td>" +
                                patientData.patientNameSurname + "</td><td id='patientAppStatus" + i +
                                "' style='background-color:#e77474;'>Without Appointment</td></tr>");
                            PolyclinicMethods.checkPatientAppointmentStatus(patientAppStatusId, patientData.patientIdNo)
                        });
                    },
                    error: function(e) {
                        toastr.error('Patient list couldnt find! \n\n\n' + e.responseText, 'Error!')
                        console.log("ERROR: ", e.responseText);
                    }
                });
            }
        }
    },

    HastaKimlikMethods = {

        changePatientPhoto: function changePatientPhoto(inputFileId, patientPhotoId) {
            var selectedFileName = document.getElementById(inputFileId),
                myPatientPhotoId = document.getElementById(patientPhotoId);
            myPatientPhotoId.src = '/public/images/' + selectedFileName.files.item(0).name

        },

        clearFormDataForNewPatient: function clearFormDataForNewPatient() {
            jQueryMethods.toastrOptions();
            var myPatientId = $("#patientId").val(),
                savePatient = document.getElementById('savePatient');

            if (myPatientId != '' || myPatientId > 0) {
                toastr.warning(
                    "<br/><h21>You will lose your entered data if you click yes!<h21/><br/><br/><button type='button' id='clearConfirmBtn' class='inpatientBtn btn-danger' style='width: 315px !important;height:35px;border-radius:8px;'>Yes</button>", 'Do you want to CLEAR form?', {
                        allowHtml: true,
                        progressBar: true,
                        timeOut: 10000,
                        onShown: function(toast) {
                            $("#clearConfirmBtn").on('click', function() {
                                HastaKimlikMethods.getMaxPatientId();
                                $("#patientIdNo").val('');
                                $("#patientName").val('');
                                $("#patientSurname").val('');
                                $("#patientFatherName").val('');
                                $("#patientMotherName").val('');
                                $("#patientGender").val('');
                                $("#patientBirthPlace").val('');
                                $("#patientBirthDate").val('');
                                $("#patientPhone").val('');
                                $("#patientAdress").val('');
                                $('#patientPhotoId')[0].src = 'http://localhost:1609/public/images/Patient_Female.ico';
                                savePatient.innerHTML = 'Save';
                                toastr.info('Form cleared for new patient!', 'Form Cleared');
                            });
                        }
                    });
            }
        },

        patientPhotoSrcByGender: function patientPhotoSrcByGender() {
            var photoId = document.getElementById('patientPhotoId'),
                patientGender = document.getElementById('patientGender'),
                win = document.getElementById('patientIdBody');

            if (patientGender.selectedIndex == 2) {
                photoId.src = '/public/images/Patient_Female.ico';
                win.style.background = 'linear-gradient(90deg,' +
                    '#76217c' + ',' + ColorAndAdjustmentMethods.getSoftColor() + ')';
            } else {
                photoId.src = '/public/images/Patient_Male.ico';
                win.style.background = 'linear-gradient(90deg,' +
                    '#262694' + ',' + ColorAndAdjustmentMethods.getSoftColor() + ')';
            }
        },

        getMaxPatientId: function getMaxPatientId() {
            $.ajax({
                type: "GET",
                url: "/hastakimlik/getMaxPatientId",
                success: function(patient) {
                    if (patient.length < 1) {
                        $("#patientId").val(1);
                    } else {
                        $("#patientId").val(patient.patientId + 1);
                    }
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error("Couldn't get max id!", "Error!")
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        updateOrSavePatientBtn: function updateOrSavePatientBtn() {
            var btn = document.getElementById('savePatient');
            if (btn.innerHTML == 'Update') {
                HastaKimlikMethods.updatePatientData();
            } else {
                HastaKimlikMethods.savePatient();
            }
        },

        savePatient: function savePatient() {
            jQueryMethods.toastrOptions();
            var btn = document.getElementById('savePatient');

            if ($.cookie('username') == null ||
                $.cookie('username') == '' ||
                $.cookie('username') == undefined ||
                $.cookie('username') == 'undefined') {
                toastr.error('Please Login from main page! ! \n' + e, 'Error!')
            } else {
                if (btn.innerHTML == 'Update') {
                    AdministrationMethods.updateUserData();
                } else {
                    var myPatientGender = document.getElementById('patientGender'),
                        myData = {
                            patientId: $("#patientId").val(),
                            patientIdNo: $("#patientIdNo").val(),
                            patientName: $("#patientName").val(),
                            patientSurname: $("#patientSurname").val(),
                            patientFatherName: $("#patientFatherName").val(),
                            patientMotherName: $("#patientMotherName").val(),
                            patientGender: myPatientGender.options[myPatientGender.selectedIndex].value,
                            patientBirthPlace: $("#patientBirthPlace").val(),
                            patientBirthDate: $("#patientBirthDate").val(),
                            patientPhone: $("#patientPhone").val(),
                            patientAdress: $("#patientAdress").val(),
                            patientPhotoSrc: $('#patientPhotoId')[0].src,
                            patientSavedUser: $.cookie('username')
                        };

                    $.ajax({
                        type: 'POST',
                        data: JSON.stringify(myData),
                        cache: false,
                        contentType: 'application/json',
                        datatype: "json",
                        url: '/hastakimlik/savePatient',
                        success: function() {
                            toastr.success('Patient successfully saved!', 'Patient Save');
                            // AdministrationMethods.findOneUser();
                            // AdministrationMethods.getMaxUserId();

                            // reset form data
                            $("#patientIdNo").val('');
                            $("#patientName").val('');
                            $("#patientSurname").val('');
                            $("#patientFatherName").val('');
                            $("#patientMotherName").val('');
                            $("#patientBirthPlace").val('');
                            $("#patientBirthDate").val('');
                            $("#patientPhone").val('');
                            $("#patientAdress").val('');
                        },
                        error: function(e) {
                            jQueryMethods.toastrOptions();
                            toastr.error('User couldnt list! \n' + e, 'Error!');
                            console.log("ERROR: ", e);
                        }
                    });
                }
            }
        },

        findOnePatient: function findOnePatient() {
            jQueryMethods.toastrOptions();

            var savePatientBtn = document.getElementById('savePatient');

            $('#patientHistoryTable > tbody').empty();

            if ($("#patientIdNo").val() == '') {
                toastr.error('Please enter patient personal ID number! \n\n\n', 'Error!')
            } else {
                $.ajax({
                    type: "GET",
                    url: "/hastakimlik/findOnePatient",
                    data: { patientIdNo: $("#patientIdNo").val() },
                    success: function(patient) {
                        var x = '----------';
                        if (patient.patientBirthDate == '' ||
                            patient.patientBirthDate == undefined ||
                            patient.patientBirthDate == 'undefined') {
                            patient.patientBirthDate = x;
                            patient.patientBirthDate = x;
                        }


                        if (patient.length <= 0) {
                            toastr.error('Patient couldnt find! \n\n\n', 'Error!')
                        } else {
                            $("#patientId").val(patient.patientId);
                            $("#patientIdNo").val(patient.patientIdNo);
                            $("#patientName").val(patient.patientName);
                            $("#patientSurname").val(patient.patientSurname);
                            $("#patientFatherName").val(patient.patientFatherName);
                            $("#patientMotherName").val(patient.patientMotherName);
                            $("#patientGender").val(patient.patientGender);
                            $("#patientBirthPlace").val(patient.patientBirthPlace);
                            $("#patientBirthDate").val(patient.patientBirthDate.substring(0, 10));
                            $("#patientPhone").val(patient.patientPhone);
                            $("#patientAdress").val(patient.patientAdress);
                            $('#patientPhotoId')[0].src = patient.patientPhotoSrc;
                            savePatientBtn.innerHTML = 'Update'

                            toastr.info('Patient - ' + patient.patientIdNo + ' -  found!', 'Patient Search');
                        }
                    },
                    error: function(e) {
                        jQueryMethods.toastrOptions();
                        toastr.error('Patient couldnt find! \n\n\n' + e.responseText, 'Error!')
                        console.log("ERROR: ", e.responseText);
                    }
                });
            }
        },

        updatePatientData: function updatePatientData() {
            jQueryMethods.toastrOptions();
            var myData = {
                patientId: $("#patientId").val(),
                patientIdNo: $("#patientIdNo").val(),
                patientName: $("#patientName").val(),
                patientSurname: $("#patientSurname").val(),
                patientFatherName: $("#patientFatherName").val(),
                patientMotherName: $("#patientMotherName").val(),
                patientGender: $("#patientGender").val(),
                patientBirthPlace: $("#patientBirthPlace").val(),
                patientBirthDate: $("#patientBirthDate").val(),
                patientPhone: $("#patientPhone").val(),
                patientAdress: $("#patientAdress").val(),
                patientPhotoSrc: $('#patientPhotoId')[0].src
            };

            $('#patientHistoryTable > tbody').empty();

            if ($("#patientIdNo").val() == '') {
                toastr.error('Please enter patient personal ID number! \n\n\n', 'Error!')
            } else {
                $.ajax({
                    type: 'PUT',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/hastakimlik/updatePatientData',
                    success: function(patient) {
                        toastr.success('Patient updated! \n\n\n', 'Patient Update');
                        HastaKimlikMethods.findOnePatient();
                    },
                    error: function(e) {
                        jQueryMethods.toastrOptions();
                        toastr.error('Patient couldnt update! \n\n\n' + e.responseText, 'Error!')
                        console.log("ERROR: ", e.responseText);
                    }
                });
            }
        }
    },

    InpatientMethods = {
        animateTabDiv: function animateTabDiv() {
            $(function() {
                $('.tab-content:not(:first)').hide();
                $('#tabs-nav a').bind('click', function(e) {
                    e.preventDefault();
                    $this = $(this);
                    $target = $(this.hash);
                    $('#tabs-nav a.current').removeClass('current');
                    $('.tab-content:visible').fadeOut("medium", function() {
                        $this.addClass('current');
                        $target.fadeIn("medium");
                    });
                }).filter(':first').click();
            });
        },

        addNewTab: function addNewTab() {
            var tabName = prompt("Please enter name for new tab", "My Tab"),
                count = $("#tabs-nav li").children().length,
                tabContentClass = document.querySelectorAll('.tab-content');

            if (count == 5) {
                for (let i = 0; i < tabContentClass.length; i++) {
                    tabContentClass[i].style.display = 'none';
                    tabContentClass[i].ariaHidden = 'true';
                }

                $('#tabs-nav').find(' > li:nth-last-child(1)').before('<li><a href="#th-tab-five"><img src="/public/images/Medical-icons/Caduceus.ico" alt="" style="width: 30px;height: 30px;" onclick="InpatientMethods.yourOwnTabShow();">' + tabName + '</a></li>');
                $('#tab-content-tabs').find(' > li:nth-last-child(1)').before('<li id="th-tab-five" class="tab-content ui-tabs-panel ui-corner-bottom ui-widget-content" aria-labelledby="ui-id-5" role="tabpanel" aria-hidden="false" style="display:block;" >You have just created your own tab! Bravo!</li>');

                InpatientMethods.yourOwnTabShow('th-tab-five');

            } else if (count == 6) {
                for (let i = 0; i < tabContentClass.length; i++) {
                    tabContentClass[i].style.display = 'none';
                }
                $('#tabs-nav').find(' > li:nth-last-child(1)').before('<li><a href="#th-tab-six"><img src="/public/images/Medical-icons/Caduceus.ico" alt="" style="width: 30px;height: 30px;">' + tabName + '</a></li>');
                $('#tab-content-tabs').find(' > li:nth-last-child(1)').before('<li id="th-tab-six" class="tab-content ui-tabs-panel ui-corner-bottom ui-widget-content" aria-labelledby="ui-id-6" role="tabpanel" aria-hidden="false">You have just created your own tab again! Bravo!</li>');

                document.getElementById('th-tab-five').style.display = 'none';
                InpatientMethods.yourOwnTabShow('th-tab-six');
                document.getElementById('inpatientTabDiv').style.width = '70%'
            } else {
                alert('Daha fazla tab ekleyemezsiniz!')
            }
        },

        yourOwnTabShow: function yourOwnTabShow(yourTabId) {
            var tabId = document.getElementById(yourTabId),
                tabContentClass = document.querySelectorAll('.tab-content');

            for (let i = 0; i < tabContentClass.length; i++) {
                tabContentClass[i].style.display = 'none';
            }
            tabId.style.display = 'block';
        },

        colorSelectedPatient: function colorSelectedPatient() {
            $("tr").click(function() {
                $(this).addClass("selected").siblings().removeClass("selected");
            });
        },

        showDropDownInside: function showDropDownInside(dropdownId) {
            document.getElementById(dropdownId).classList.toggle("show");
        },

        filterTaniDropdown: function filterTaniDropdown(searchInputId, dropdownId) {
            var input, filter, ul, li, a, i;
            input = document.getElementById(searchInputId);
            filter = input.value.toUpperCase();
            div = document.getElementById(dropdownId);
            a = div.getElementsByTagName("a");
            for (i = 0; i < a.length; i++) {
                txtValue = a[i].textContent || a[i].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    a[i].style.display = "";
                } else {
                    a[i].style.display = "none";
                }
            }
        },

        showDetailTable: function showDetailTable(showDetailDivId, hideOtherDetailDiv) {
            var detailTable = document.getElementById(showDetailDivId),
                hideDetailTable = document.getElementById(hideOtherDetailDiv);
            $(hideDetailTable).fadeOut('slow', function() {
                $(detailTable).fadeIn('slow');
            });
        }
    },

    LaboratoryMethods = {
        openPatientListTab: function openPatientListTab(evt, tabName) {
            var i, x, tablinks;
            x = document.getElementsByClassName("patientListTab");
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablink");
            for (i = 0; i < x.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
            }
            document.getElementById(tabName).style.display = "block";
            evt.currentTarget.className += " w3-red";
        },

        addExtraInformationForTest: function name(rowId) {
            var testname = document.getElementById(rowId).cells[3].innerHTML,
                extraInformation = prompt("Please enter extra information for = " + testname, ".......");
            if (extraInformation == null || extraInformation == '' || extraInformation == ".......") {
                document.getElementById(rowId).title = 'No extra information!';
                document.styleSheets[9].addRule('.laboratoryFailure:before', 'content: "No Extra information added!";');
                ShowOrHideMethods.laboratoryShowRemoveAlert();
            } else {
                document.getElementById(rowId).title = extraInformation;
                document.styleSheets[9].addRule('.laboratorySuccess:before', 'content: "Extra information added!";');
                ShowOrHideMethods.laboratoryShowSuccesAlert();
            }
        },

        textOrNumberResult: function textOrNumberResult(rowId, numberCell, textCell) {
            var numberResult = document.getElementById(numberCell),
                resulText = document.getElementById(textCell),
                myRow = document.getElementById(rowId).id;
            $('#' + myRow).on('contextmenu', function(e) {
                var top = e.pageY - 10;
                var left = e.pageX - 0;

                $("#context-menu").css({
                    display: "block",
                    top: top,
                    left: left
                }).addClass("show");
                return false;
            })

            $(".custom-menu li").on('click', function() {

                // This is the triggered action name
                switch ($(this).attr("data-action")) {

                    // A case for each action. Your actions here
                    case "number":
                        numberResult.style.display = 'block'
                        resulText.style.display = 'none';
                        $("#context-menu").removeClass("show").hide();
                        break;

                    case "text":
                        numberResult.style.display = 'none'
                        resulText.style.display = 'block';
                        $("#context-menu").removeClass("show").hide();
                        break;
                }
            });

        },

        showSelectedTable: function showSelectedTable(selectedTableId) {
            var testTable = document.getElementById('testTable'),
                acceptedTestTable = document.getElementById('acceptedTestTable'),
                resultedTestTable = document.getElementById('resultedTestTable'),
                confirmedTestTable = document.getElementById('confirmedTestTable'),
                tableName = document.getElementById('labTestTableName');

            if (selectedTableId == 'testTable') {
                tableName.innerHTML = 'Awaiting Tests';
                testTable.style.display = 'block';
                acceptedTestTable.style.display = 'none';
                resultedTestTable.style.display = 'none';
                confirmedTestTable.style.display = 'none';

            } else if (selectedTableId == 'acceptedTestTable') {
                tableName.innerHTML = 'Accepted Tests';
                acceptedTestTable.style.marginTop = '-20px';
                acceptedTestTable.style.display = 'block';
                testTable.style.display = 'none';
                resultedTestTable.style.display = 'none';
                confirmedTestTable.style.display = 'none';

            } else if (selectedTableId == 'resultedTestTable') {
                tableName.innerHTML = 'Resulted Tests';
                resultedTestTable.style.marginTop = '-37px';
                resultedTestTable.style.display = 'block';
                testTable.style.display = 'none';
                acceptedTestTable.style.display = 'none';
                confirmedTestTable.style.display = 'none';

            } else if (selectedTableId == 'confirmedTestTable') {
                tableName.innerHTML = 'Confirmed Tests';
                confirmedTestTable.style.marginTop = '-57px';
                confirmedTestTable.style.display = 'block';
                testTable.style.display = 'none';
                acceptedTestTable.style.display = 'none';
                resultedTestTable.style.display = 'none';
            }
        },

        lowerOrHigherThanNormalRange: function lowerOrHigherThanNormalRange(inputId, minRangeId, maxRangeId) {
            var selectedInput = document.getElementById(inputId),
                selectedInputId = document.getElementById(inputId).id,
                selectedInputNum = selectedInputId.substring(10, 11),
                minRangeNum = minRangeId.substring(8, 9),
                maxRangeNum = maxRangeId.substring(8, 9),
                minRangeInnerText = parseInt(document.getElementById(minRangeId).innerText),
                maxRangeInnerText = parseInt(document.getElementById(maxRangeId).innerText);

            if (selectedInputNum == minRangeNum &&
                selectedInputNum == minRangeNum &&
                selectedInput.value == minRangeInnerText ||
                selectedInput.value == maxRangeInnerText) {
                selectedInput.style.backgroundColor = 'lightgreen';
            } else if (selectedInputNum == minRangeNum && selectedInput.value < minRangeInnerText) {
                selectedInput.style.backgroundColor = 'red';
            } else if (selectedInputNum == maxRangeNum && selectedInput.value > maxRangeInnerText) {
                selectedInput.style.backgroundColor = 'red';
            } else {
                selectedInput.style.backgroundColor = 'white';
            }
        },

        labSearchInTables: function labSearchInTables(inputId) {
            var tables = document.querySelectorAll('#testTable, #acceptedTestTable, #resultedTestTable, #confirmedTestTable');
            for (let i1 = 0; i1 < tables.length; i1++) {
                if (tables[i1].style.display == 'block') {
                    var input, filter, found, table, tr, td, i, j,
                        input = document.getElementById(inputId),
                        filter = input.value.toUpperCase(),
                        table = document.getElementById(tables[i1].id),
                        tr = table.getElementsByTagName("tr");
                    for (i = 0; i < tr.length; i++) {
                        td = tr[i].getElementsByTagName("td");
                        for (j = 0; j < td.length; j++) {
                            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                                found = true;
                            }
                        }
                        if (found) {
                            tr[i].style.display = "";
                            found = false;
                        } else if (!tr[i].id.match('^tableHeader')) {
                            tr[i].style.display = "none";
                        }
                    }
                }
            }
        },

        selectAndUnselectAllCheckboxes: function selectAndUnselectAllCheckboxes(checkboxSelectAllId) {
            var selectedCheckboxSelectAll = document.getElementById(checkboxSelectAllId).checked,
                checkboxSelectAllTable = document.getElementById(checkboxSelectAllId),
                parentTable = checkboxSelectAllTable.parentElement,
                grandParentTable = parentTable.parentElement,
                greatGrandParentTable = grandParentTable.parentElement,
                testCheckbox = document.querySelectorAll('.testCheckbox'),
                tables = document.querySelectorAll('#testTable, #acceptedTestTable, #resultedTestTable, #confirmedTestTable');

            for (let i1 = 0; i1 < tables.length; i1++) {
                if (tables[i1].style.display == 'block') {
                    if (selectedCheckboxSelectAll == true) {
                        for (let i = 0; i < testCheckbox.length; i++) {
                            var testCheckboxParent = testCheckbox[i].parentElement,
                                testCheckboxGrandParent = testCheckboxParent.parentElement,
                                testCheckboxGreatGrandParent = testCheckboxGrandParent.parentElement;
                            if (testCheckboxGreatGrandParent == greatGrandParentTable) {
                                testCheckbox[i].checked = true;
                            }
                        }
                    } else {
                        for (let i = 0; i < testCheckbox.length; i++) {
                            testCheckbox[i].checked = false;
                        }
                    }
                }
            }
        },

        googleChartFunction: function googleChartFunction() {
            pie();
            comboBar();

            function pie() {
                google.charts.load('current', { 'packages': ['corechart'] });
                google.charts.setOnLoadCallback(drawChart);

                // Draw the chart and set the chart values
                function drawChart() {
                    var data = google.visualization.arrayToDataTable([
                        ['Test', 'Test per Lab Group'],
                        ['BioChemical', 8],
                        ['Hemogram', 2],
                        ['Serology', 4],
                        ['Hormonal', 2],
                        ['Cardiyac', 8]
                    ]);

                    // Optional; add a title and set the width and height of the chart
                    var options = {
                        'title': 'Test per Lab Group',
                        'width': 550,
                        'height': 400,
                        is3D: true,
                        'backgroundColor': 'inherit',
                        animation: {
                            duration: 1000,
                            easing: 'out',
                            startup: true
                        },
                        'width': 800,
                        'height': 500,
                        backgroundColor: 'lightgray'
                    };

                    // Display the chart inside the <div> element with id="piechart"
                    var chart = new google.visualization.PieChart(document.getElementById('googlePieChart'));
                    chart.draw(data, options);
                }
            }

            function comboBar() {
                google.charts.load('current', { 'packages': ['corechart'] });
                google.charts.setOnLoadCallback(drawVisualization);

                function drawVisualization() {
                    // Some raw data (not necessarily accurate)
                    var data = google.visualization.arrayToDataTable([
                        ['Date', 'WBC', 'RBC', 'HGB', 'HCT', 'MCV', 'MCHC', 'RDW', 'PLT', 'ALT'],
                        ['15.01.2019', 165, 938, 522, 998, 450, 614.6, 111, 122, 133],
                        ['13.03.2019', 135, 1120, 599, 1268, 288, 682, 111, 122, 133],
                        ['01.06.2020', 157, 1167, 587, 807, 397, 623, 111, 122, 133],
                        ['18.06.2020', 139, 1110, 615, 968, 215, 609.4, 111, 122, 133],
                        ['17.08.2020', 136, 691, 629, 1026, 366, 569.6, 111, 122, 133]
                    ]);

                    var options = {
                        title: 'Test Result Comparison',
                        vAxis: { title: 'Test' },
                        hAxis: { title: 'Test Date' },
                        seriesType: 'bars',
                        series: 5,
                        'width': 800,
                        'height': 800,
                        backgroundColor: 'lightgray'
                    };

                    var chart = new google.visualization.ComboChart(document.getElementById('googleComboBar'));
                    chart.draw(data, options);
                }
            }
        }
    },

    ListingMethods = {
        Listview: function listView() {
            ShowOrHideMethods.HideColumn('card-container');
            ShowOrHideMethods.HideColumn('card-container2');
            ShowOrHideMethods.HideColumn('card-container3');

            var elements = document.getElementsByClassName("column");
            let id;
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.width = "50%";
                id = elements[i].id;
                document.getElementById(id).style.display = '';
            }
        },

        GridView: function gridView() {
            var elements = document.getElementsByClassName("column");
            let id;
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.width = "33.33%";
                id = elements[i].id;
                document.getElementById(id).style.display = '';
            }
        }
    },

    LoginProcess = {
        popupLoginModal: function popupLoginModal() {
            var loginBtn = document.getElementById('loginBtn').innerHTML;

            if (loginBtn == 'Login') {
                document.getElementById('loginPopup').style.display = 'block';
                document.getElementById('modal-content').style.display = 'block';

                var selectElem = document.getElementById('languageChange'),
                    index = selectElem.selectedIndex,
                    myloginUserNameLbl = document.getElementById('loginUserNameLbl'),
                    myloginUserName = document.getElementById('loginUserName'),
                    myloginPasswordLbl = document.getElementById('loginPasswordLbl'),
                    myloginPassword = document.getElementById('loginPassword'),
                    myinnerLoginBtn = document.getElementById('innerLoginBtn'),
                    myrememberChkbxlbl = document.getElementById('rememberChkbxlbl'),
                    myforgotPass = document.getElementById('forgotPass');
                if (index == 1) {
                    myloginUserNameLbl.innerHTML = 'Kullanıcı adı'
                    myloginUserName.placeholder = 'Kullanıcı adını giriniz'
                    myloginPasswordLbl.innerHTML = 'Şifre'
                    myloginPassword.placeholder = 'Şifrenizi giriniz'
                    myinnerLoginBtn.innerHTML = 'Giriş';
                    myrememberChkbxlbl.innerHTML = '<input id="rememberChkbx" type="checkbox" checked="checked" name="remember" style="color: black;float: right;margin: 3px 0px 0px 15px;"> Beni hatırla';
                    myforgotPass.innerHTML = 'Şifrenizi mi unuttunuz?';
                } else {
                    myloginUserNameLbl.innerHTML = 'Username'
                    myloginUserName.placeholder = 'Enter username'
                    myloginPasswordLbl.innerHTML = 'Password'
                    myloginPassword.placeholder = 'Enter password'
                    myinnerLoginBtn.innerHTML = 'Login';
                    myrememberChkbxlbl.innerHTML = '<input id="rememberChkbx" type="checkbox" checked="checked" name="remember" style="color: black;float: right;margin: 3px 0px 0px 15px;"> Remember me';
                    myforgotPass.innerHTML = 'Forgot password?';
                }
            }
        },

        showUpLogin: function showUpLogin() { // popup login onload

            var loginBtn = document.getElementById('loginBtn').innerHTML;

            if (loginBtn == 'Login') {
                LoginProcess.popupLoginModal();
            } else {
                LoginProcess.closeUserLoginSession();
            }
        },

        closeLoginByClickOut: function closeLoginByClickOut() { // close when user clicks anywhere outside of the login popup
            // window.onclick = function (event) {
            //     var modal = document.getElementById('loginPopup');
            //     if (event.target == modal) {
            //         modal.style.display = "none";
            //     }
            // }
        },

        checkIfUserLoggedInByCookie: function checkIfUserLoggedInByCookie() {
            var remember = $.cookie('remember');
            if (remember == 'true') {
                var userName = $.cookie('username'),
                    name = $.cookie('name'),
                    surname = $.cookie('surname');

                // autofill the fields
                document.getElementById('loginBtn').innerHTML = 'Log out - ' + userName
                document.getElementById('hUserName').innerHTML = name + ' ' + surname + ' - ' + userName;

                // fill userBottomMenu user login statistics
                LoginProcess.userLoginStatistics();
            }
        },

        checkIfThereIsAUserLoggedIn: function checkIfThereIsAUserLoggedIn(saveBtn, searchBtn) {
            var saveButton = document.getElementById(saveBtn),
                searchButton = document.getElementById(searchBtn);

            if ($.cookie('username') == null ||
                $.cookie('username') == 'null' ||
                $.cookie('username') == undefined ||
                $.cookie('username') == 'undefined') {
                saveButton.disabled = true;
                saveButton.title = 'Button disabled. Please Login from main page!';
                saveButton.style.backgroundColor = 'lightgrey';
                searchButton.disabled = true;
                searchButton.title = 'Button disabled. Please Login from main page!';
                searchButton.style.backgroundColor = 'lightgrey';
            }
        },

        findUser: function findUser() {
            var loginUserName = $("#loginUserName").val(),
                loginPassword = $("#loginPassword").val(),
                myChooseClassColor = document.getElementById('chooseClassColor').selectedIndex,
                userNameTextArea = document.getElementById('hUserName'),
                loginPopup = document.getElementById('loginPopup'),
                modalContent = document.getElementById('modal-content'),
                loginBtn = document.getElementById('loginBtn');

            $.ajax({
                type: "GET",
                url: "/findLoginUser",
                data: { userName: loginUserName, password: loginPassword },
                success: function(user) {
                    jQueryMethods.toastrOptions();
                    if (user.userId == '' || user.userId == null || user.userId == 'undefind') {
                        toastr.error('Incorrect username or password, please check your data! \n\n\n', 'Error!')
                    } else {
                        userNameTextArea.innerHTML = user.name + ' ' + user.surname + ' - ' + loginUserName;
                        loginPopup.style.display = 'none';
                        modalContent.style.display = 'none';
                        loginBtn.innerHTML = 'Log out' + ' - ' + loginUserName;
                        toastr.success('Welcome ' + user.name + ' ' + user.surname + ' !', 'User Login');

                        // fill userBottomMenu user login statistics
                        LoginProcess.userLoginStatistics();

                        // save login session
                        var
                            myData = {
                                userId: user.userId,
                                userName: loginUserName
                            };

                        $.ajax({
                            type: 'POST',
                            data: JSON.stringify(myData),
                            cache: false,
                            contentType: 'application/json',
                            datatype: "json",
                            url: '/userLoginSessionSave',
                            success: function() {
                                $("#loginUserName").val('');
                                $("#loginPassword").val('')
                            },
                            error: function(e) {
                                jQueryMethods.toastrOptions();
                                toastr.error('User session couldnt save! \n' + e, 'Error!')
                                console.log("ERROR: ", e);
                            }
                        });

                        // write cookie for remember across entire site and expire in 1 day
                        if ($('#rememberChkbx').attr('checked')) {
                            $.cookie('username', loginUserName, { expires: 1, path: '/' });
                            $.cookie('name', user.name, { expires: 1, path: '/' });
                            $.cookie('surname', user.surname, { expires: 1, path: '/' });
                            $.cookie('personalIdNumber', user.personalIdNumber, { expires: 1, path: '/' });
                            $.cookie('majorDicipline', user.majorDicipline, { expires: 1, path: '/' });
                            $.cookie('userGroup', user.userGroup, { expires: 1, path: '/' });
                            $.cookie('userPhotoSrc', user.userPhotoSrc, { expires: 1, path: '/' });
                            $.cookie('chooseClassColorIndex', myChooseClassColor, { expires: 1, path: '/' });
                            $.cookie('remember', true, { expires: 1, path: '/' });
                        } else {
                            // reset cookies
                            $.cookie('username', null);
                            $.cookie('name', null);
                            $.cookie('surname', null);
                            $.cookie('remember', null);
                        }
                    }
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('User couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        showUserDataOnHover: function showUserDataOnHover() {
            var userNameSurname = $.cookie('name') + ' ' + $.cookie('surname'),
                userPersonalIdNumber = $.cookie('personalIdNumber'),
                userMajorDicipline = $.cookie('majorDicipline'),
                userGroup = $.cookie('userGroup'),
                myPhotoSrc = $.cookie('userPhotoSrc');

            $(function() {
                s = '<table style="border-style:hidden;width:200px;box-shadow:0px 0px 15px 3px white;">';
                s += '<tr style="border-style:ridge;border:5px solid #761c54;"><img src="' + myPhotoSrc + '" style="width:200px; height:200px;align-items:center;box-shadow:"/> </td><td valign="top">' + userNameSurname + '</td></tr>';
                s += '<td class="Text">' + userMajorDicipline + ' - ' + userGroup + ' <br/>' + userPersonalIdNumber + '</td>';
                s += '</table>';
                $('#hUserName').tooltip({
                    content: s,
                    position: {
                        my: "center top",
                        at: "center bottom-5",
                    },
                    show: {
                        effect: "slideDown",
                        delay: 250,
                        track: true
                    }
                });
            });
        },

        closeUserLoginSession: function closeUserLoginSession() {
            jQueryMethods.toastrOptions();
            var hUserName = document.getElementById('hUserName').innerHTML,
                myData = {
                    userName: hUserName.substring(hUserName.lastIndexOf('-') + 2, 50)
                },
                loginBtn = document.getElementById('loginBtn');

            $.ajax({
                type: 'PUT',
                data: JSON.stringify(myData),
                cache: false,
                contentType: 'application/json',
                datatype: "json",
                url: '/closeUserLoginSession',
                success: function() {
                    toastr.warning(
                        "<br/><br/><button type='button' id='logOutConfirmBtn' class='inpatientBtn btn-danger' style='width: 315px !important;'>Yes</button>", 'Do you want to log out? <br><br> You will sign out from entire system if you click YES.', {
                            allowHtml: true,
                            progressBar: false,
                            timeOut: 10000,
                            onShown: function(toast) {
                                $("#logOutConfirmBtn").on('click', function() {
                                    toastr.success('User logged out!', 'User Logout');
                                    loginBtn.innerHTML = 'Login';
                                    document.getElementById('hUserName').innerHTML = 'Please log in!'

                                    // destroy cookie
                                    $.cookie('username', null);
                                    $.cookie('name', null);
                                    $.cookie('surname', null);
                                    $.cookie('personalIdNumber', null);
                                    $.cookie('majorDicipline', null);
                                    $.cookie('userGroup', null);
                                    $.cookie('userPhotoSrc', null);
                                    $.cookie('remember', false);
                                });
                            }
                        });
                },
                error: function(e) {
                    toastr.error('User session couldnt closed! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        userLoginStatistics: function userLoginStatistics() {
            var x = '---------';

            $('#userLoginStatsTable > tbody').empty();

            $.ajax({
                type: "GET",
                data: { userName: $.cookie('username') },
                url: "/userLoginStatistics",
                success: function(result) {
                    $.each(result, function(i, myData) {

                        var endDate = new Date(myData.sessionEndDate),
                            startDate = new Date(myData.sessionStartDate),
                            seconds = Math.floor((endDate - (startDate)) / 1000),
                            minutes = Math.floor(seconds / 60),
                            hours = Math.floor(minutes / 60),
                            days = Math.floor(hours / 24),
                            loginDuration;

                        hours = hours - (days * 24);
                        minutes = minutes - (days * 24 * 60) - (hours * 60);
                        seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

                        if (days <= 0 && hours <= 0 && minutes <= 0) {
                            loginDuration = seconds + ' second(s)';
                        } else if (days <= 0 && hours <= 0) {
                            loginDuration = minutes + ' minute(s) ' + seconds + ' second(s)';
                        } else if (days <= 0) {
                            loginDuration = hours + ' hour(s) ' + minutes + ' minute(s) ' + seconds + ' second(s)';
                        } else {
                            loginDuration = days + ' day(s) ' + hours + ' hour(s) ' + minutes + ' minute(s) ' + seconds + ' second(s)';
                        }

                        if (myData.sessionStartDate == '' ||
                            myData.sessionStartDate == undefined ||
                            myData.sessionStartDate == null ||
                            myData.sessionStartDate == 'undefined') {
                            myData.sessionStartDate = x;
                        } else if (myData.sessionEndDate == '' ||
                            myData.sessionEndDate == undefined ||
                            myData.sessionEndDate == null ||
                            myData.sessionEndDate == 'undefined') {
                            loginDuration = 'still loged..';
                        }

                        i++;
                        $("#userLoginStatsTable> tbody").append(
                            "<tr class='userRow' id='userRowId" + i + "' title=''><td class='idTd' title=''>" +
                            i + "</td><td>" +
                            myData.ipAdress + "</td><td>" +
                            myData.computerName + "</td><td>" +
                            myData.sessionStartDate + "</td><td>" +
                            loginDuration + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Users couldnt list! \n' + message.err, 'Error!')
                    console.log("ERROR: ", e);
                }
            });
        },

        getLastPasswordChangeStatistics: function getLastPasswordChangeStatistics() {
            $.ajax({
                type: "GET",
                data: { userName: $.cookie('username') },
                url: "/getLastPasswordChangeStatistics",
                success: function(result) {
                    document.getElementById('lastPasswordChangeStatistics').innerHTML =
                        'Last password change details = ' +
                        result.passwordChangeDate + ' - ' +
                        result.passwordChangeMachineName + ' - ' +
                        result.passwordChangeMachineIp
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Users couldnt list! \n' + message.err, 'Error!')
                    console.log("ERROR: ", e);
                }
            });
        },

        changeUserPassword: function changeUserPassword() {
            jQueryMethods.toastrOptions();
            var myData = {
                userName: $.cookie('username'),
                userOldPassword: $("#userOldPassword").val(),
                userNewPassword: $("#userNewPassword").val()
            };

            if ($.cookie('username') == null ||
                $.cookie('username') == '' ||
                $.cookie('username') == undefined ||
                $.cookie('username') == 'undefined') {
                toastr.warning('Please login!', 'Login Error');
            } else {
                if ($("#userNewPassword").val() != $("#userNewPasswordRepeat").val()) {
                    toastr.warning('New password and new password repeat are not same, please check your data!', 'Password Match');
                } else {
                    $.ajax({
                        type: "GET",
                        url: "/checkUserPassword",
                        data: { userName: $.cookie('username'), password: $("#userOldPassword").val() },
                        success: function(user) {
                            if (user.length <= 0) {
                                toastr.error('Incorrect user old password! \n\n\n', 'Error!')
                            } else {
                                $.ajax({
                                    type: 'PUT',
                                    data: JSON.stringify(myData),
                                    cache: false,
                                    contentType: 'application/json',
                                    datatype: "json",
                                    url: '/changeUserPassword',
                                    success: function() {
                                        toastr.info('User password has changed!', 'Password Change');
                                        $("#userOldPassword").val('');
                                        $("#userNewPassword").val('');
                                        $("#userNewPasswordRepeat").val('');

                                    },
                                    error: function(e) {
                                        jQueryMethods.toastrOptions();
                                        toastr.error('User password couldnt change! \n\n\n' + e.responseText, 'Error!')
                                        console.log("ERROR: ", e.responseText);
                                    }
                                });
                            }
                        },
                        error: function(e) {
                            jQueryMethods.toastrOptions();
                            toastr.error('User couldnt find! \n\n\n' + e.responseText, 'Error!')
                            console.log("ERROR: ", e.responseText);
                        }
                    });
                }
            }
        }
    },

    myClockMethods = {

        myClock: function myClock() {
            window.myInterval = setInterval(() => {
                var myDate = new Date();
                document.getElementById('clock').innerHTML =
                    myDate.toLocaleDateString() + ' ' + myDate.toLocaleTimeString();
            }, 1);
        },

        stopMyClock: function stopMyClock() {
            window.clearInterval(window.myInterval);
        }
    },

    PolyclinicExamMethods = {

        clearForNewPatient: function clearForNewPatient() {
            jQueryMethods.toastrOptions();
            var myPatientId = $("#patientId").val(),
                savePatient = document.getElementById('polExamSave'),
                myPolyclinicSelect = document.getElementById('polyclinicSelect'),
                myPatientIdNo = document.getElementById('patientIdNo'),
                myPatientId = document.getElementById('patientId');

            if (myPatientId != '' || myPatientId > 0) {
                toastr.warning(
                    "<br/><h21>You will lose your entered data if you click yes!<h21/><br/><br/><button type='button' id='clearConfirmBtn' class='inpatientBtn btn-danger' style='width: 315px !important;height:35px;border-radius:8px;'>Yes</button>", 'Do you want to CLEAR form?', {
                        allowHtml: true,
                        progressBar: true,
                        timeOut: 10000,
                        onShown: function(toast) {
                            $("#clearConfirmBtn").on('click', function() {
                                PolyclinicExamMethods.getMaxProtocolNo();
                                jQueryMethods.setCalenderValueToday('patientBirthDate');
                                jQueryMethods.setCalenderValueToday('patientPolExamDate');
                                $('#polExamPatientHistoryTable > tbody').empty();
                                $('#patientVisitStatisticsTable > tbody').empty();
                                $('#patientAppointmentStatusTable > tbody').empty();
                                $('#patientUpcominAppointmentTable > tbody').empty();
                                $('#polyclinicPatientCountTable > tbody').empty();
                                $('#patientHealtInsuranceTable > tbody').empty();
                                $('#patientGenderTable > tbody').empty();

                                $("#patientId").val('');
                                $("#patientIdNo").val('');
                                $("#patientNameSurname").val('');
                                $("#patientFatherName").val('');
                                $("#patientMotherName").val('');
                                $("#patientGender").val('');
                                $("#patientBirthPlace").val('');
                                $('#patientPhotoId')[0].src = 'http://localhost:1609/public/images/Patient_Male.ico';
                                savePatient.innerHTML = 'Save';
                                myPatientIdNo.readOnly = false;
                                myPatientId.readOnly = false;
                                myPolyclinicSelect.readOnly = false;
                                $("#polyclinicSelect").css("pointer-events", "all");
                                $("#polyclinicSelect").css("background-color", "white");

                                toastr.info('Form cleared for new patient!', 'Form Cleared');
                            });
                        }
                    });
            }
        },

        searchByEnter: function searchByEnter(inputId) {
            const node = document.getElementById(inputId);
            node.addEventListener("keyup", function(event) {
                if (event.key === "Enter") {
                    document.getElementById('polSearch').click();
                }
            });
        },

        findPatient: function findPatient() {
            var searchQuery = 0,
                myQuery = {},
                myStatusSelect = document.getElementById('statusSelect'),
                statusSelect = myStatusSelect.options[myStatusSelect.selectedIndex];

            if ($("#patientIdNo").val() == '') {
                searchQuery = $("#patientId").val();
                myQuery = {
                    patientId: searchQuery
                }
            } else {
                searchQuery = $("#patientIdNo").val();
                myQuery = {
                    patientIdNo: searchQuery
                }
            };

            if ($("#patientIdNo").val() == '' && $("#patientId").val() == '') {
                toastr.error('Patient Id or Patient Id No cant be empty! \n\n\n', 'Error!')
            } else {
                $.ajax({
                    type: "GET",
                    url: "/polExam/findPatient",
                    data: myQuery,
                    success: function(patient) {
                        jQueryMethods.toastrOptions();
                        if (patient.patientId == '' || patient.patientId == null || patient.patientId == 'undefind') {
                            toastr.error('Patient couldnt find! \n\n\n', 'Error!')
                        } else {
                            $("#patientId").val(patient.patientId);
                            $("#patientIdNo").val(patient.patientIdNo);
                            $("#patientNameSurname").val(patient.patientName + '  ' + patient.patientSurname);
                            $("#patientFatherName").val(patient.patientFatherName);
                            $("#patientMotherName").val(patient.patientMotherName);
                            $("#patientGender").val(patient.patientGender);
                            $("#patientBirthPlace").val(patient.patientBirthPlace);
                            $("#patientBirthDate").val(patient.patientBirthDate);
                            $('#patientPhotoId')[0].src = patient.patientPhotoSrc;
                            statusSelect = patient.statusSelect;
                            $.cookie('patientIdNo');

                            PolyclinicExamMethods.fillPatientAppointmentStatusTable();
                            PolyclinicExamMethods.fillPatientUpcomingAppointmentTable();
                            PolyclinicExamMethods.findPatientHistory();
                            PolyclinicExamMethods.fillPatientVisitStatisticsTable();
                            PolyclinicExamMethods.fillPolyclinicPatientCountTable();
                            PolyclinicExamMethods.fillPatientHealtInsuranceTable();
                            PolyclinicExamMethods.fillPatientGenderTable();
                            PolyclinicExamMethods.fillDoctorPatientTable();
                            PolyclinicExamMethods.fillDoctorAppointmentTable();
                            PolyclinicExamMethods.fillDoctorOnLeaveTable();
                            // findPatientLabRadHistory function will come here

                            toastr.info('Patient - ' + $("#patientNameSurname").val() + ' - found!', 'Patient Search');
                        }
                    },
                    error: function(e) {
                        jQueryMethods.toastrOptions();
                        toastr.error('Patient couldnt find! \n\n\n' + e.responseText, 'Error!')
                        console.log("ERROR: ", e.responseText);
                    }
                });
            }
        },

        getPatientIdFromPreviousPage: function getPatientIdFromPreviousPage() { // for hastaKimlik iframe
            var input = document.getElementById('patientIdNo'),
                myIframe = document.getElementById('polExamIframe').contentWindow;

            myIframe.document.getElementById("patientIdNo").value = input.value;
            myIframe.document.getElementById("searchPatient").click();
        },

        savePolExam: function savePolExam() {
            jQueryMethods.toastrOptions();
            var myPolyclinicSelect = document.getElementById('polyclinicSelect'),
                myDoctorSelector = document.getElementById('doctorSelector'),
                myStatusSelect = document.getElementById('statusSelect'),
                myInsuranceSelect = document.getElementById('insuranceSelect'),
                myData = {
                    patientProtocolNo: $("#patientProtocolNo").val(),
                    patientId: $("#patientId").val(),
                    patientIdNo: $("#patientIdNo").val(),
                    patientNameSurname: $("#patientNameSurname").val(),
                    patientFatherName: $("#patientFatherName").val(),
                    patientMotherName: $("#patientMotherName").val(),
                    patientGender: $("#patientGender").val(),
                    patientBirthPlace: $("#patientBirthPlace").val(),
                    patientBirthDate: $("#patientBirthDate").val(),
                    patientPolExamDate: $("#patientPolExamDate").val(),
                    insuranceSelect: myInsuranceSelect.options[myInsuranceSelect.selectedIndex].value,
                    polyclinicSelect: myPolyclinicSelect.options[myPolyclinicSelect.selectedIndex].value,
                    doctorSelector: myDoctorSelector.options[myDoctorSelector.selectedIndex].value,
                    statusSelect: myStatusSelect.options[myStatusSelect.selectedIndex].value,
                    patientSavedUser: $.cookie('username')
                };

            if (polExamSave.innerHTML == 'Update') {
                PolyclinicExamMethods.updatePatientData()
            } else {
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/polExam/savePolExam',
                    success: function() {
                        toastr.success('Patient polyclinic exam successfully saved!', 'Save');
                        PolyclinicExamMethods.findPatient();
                        PolyclinicExamMethods.getMaxProtocolNo();
                        // findPatientLabRadHistory function will come here
                    },
                    error: function(e) {
                        toastr.error('Patient polyclinic exam couldnt save! \n' + e, 'Error!')
                        console.log("ERROR: ", e);
                    }
                });
            }
        },

        getMaxProtocolNo: function getMaxProtocolNo() {
            $.ajax({
                type: "GET",
                url: "/polExam/getMaxProtocolNo",
                success: function(patient) {
                    if (patient.length < 1) {
                        $("#patientProtocolNo").val(1);
                    } else {
                        $("#patientProtocolNo").val(patient.patientProtocolNo + 1);
                    }

                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error("Couldn't get max protocol no!", "Error!")
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        findPatientHistory: function findPatientHistory() {
            $('#polExamPatientHistoryTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/polExam/findPatientHistory",
                data: { patientIdNo: $("#patientIdNo").val() },
                success: function(result) {
                    $.each(result, function(i, patientData) {
                        i++;
                        $("#polExamPatientHistoryTable> tbody").append(
                            "<tr class='patientHistory' id='patientHistory" + i + "' title=''><td >" +
                            i + "</td><td>" + patientData.patientProtocolNo + "</td><td>" +
                            patientData.patientPolExamDate + "</td><td>" +
                            patientData.polyclinicSelect + "</td><td>" +
                            patientData.doctorSelector + "</td><td>" +
                            patientData.statusSelect + "</td><td><button class='inpatientBtn btn-success' title='Click for select protocol.' onclick=\"PolyclinicExamMethods.findByProtocol(\'patientHistory" + i + "\')\">Select</button></td></tr>");
                    });
                    PolyclinicExamMethods.colorRedCanceledPolExams();
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Patient history couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillPatientLabRadHistoryTable: function fillPatientLabRadHistoryTable() {
            $('#patientLabRadHistoryTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/fillPatientLabRadHistoryTable",
                data: { patientIdNo: $("#patientIdNo").val() },
                success: function(result) {
                    $.each(result, function(i, testData) {
                        i++;
                        if (testData.result == '') {
                            testData.result = 'No Result';
                        }
                        $("#patientLabRadHistoryTable> tbody").append(
                            "<tr class='patientLabRadHistory' id='patientLabRadHistory" + i + "' title='" +
                            testData.result + "' ><td >" +
                            i + "</td><td>" + testData.patientProtocolNo + "</td><td>" +
                            testData.testName + "</td><td>" +
                            testData.saveDate + "</td><td>" +
                            testData.testLab + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Lab. / Rad. history couldn\'t find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        colorRedCanceledPolExams: function colorRedCanceledPolExams() {
            var table = document.getElementById('polExamPatientHistoryTable');
            for (var r = 0, n = table.rows.length; r < n; r++) {
                for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
                    if (table.rows[r].cells[5].innerHTML == 'Canceled') {
                        table.rows[r].style.background = 'linear-gradient(90deg,rgb(229 48 62),lightgrey)';
                        table.rows[r].style.color = 'white  ';
                    }
                }
            }
        },

        findByProtocol: function findByProtocol(rowId) {
            jQueryMethods.toastrOptions();
            var myRow = document.getElementById(rowId),
                myPolyclinicSelect = document.getElementById('polyclinicSelect'),
                polyclinicSelect = myPolyclinicSelect.options[myPolyclinicSelect.selectedIndex],
                myDoctorSelector = document.getElementById('doctorSelector'),
                doctorSelector = myDoctorSelector.options[myDoctorSelector.selectedIndex],
                myStatusSelect = document.getElementById('statusSelect'),
                statusSelect = myStatusSelect.options[myStatusSelect.selectedIndex],
                myProtocol = myRow.cells[1].innerHTML,
                myPatientIdNo = document.getElementById('patientIdNo'),
                myPatientId = document.getElementById('patientId'),
                polExamSaveBtn = document.getElementById('polExamSave');

            $.ajax({
                type: "GET",
                url: "/polExam/findByProtocol",
                data: { patientProtocolNo: myProtocol },
                success: function(patient) {
                    jQueryMethods.toastrOptions();
                    if (patient.patientProtocolNo == '' || patient.patientProtocolNo == null ||
                        patient.patientProtocolNo == 'undefind') {
                        toastr.error('Patient found by data couldnt set to form! \n\n\n', 'Error!')
                    } else {
                        $("#patientId").val(patient.patientId);
                        $("#patientProtocolNo").val(patient.patientProtocolNo);
                        $("#patientIdNo").val(patient.patientIdNo);
                        $("#patientNameSurname").val(patient.patientNameSurname);
                        $("#patientFatherName").val(patient.patientFatherName);
                        $("#patientMotherName").val(patient.patientMotherName);
                        $("#patientGender").val(patient.patientGender);
                        $("#patientBirthPlace").val(patient.patientBirthPlace);
                        $("#patientBirthDate").val(patient.patientBirthDate);
                        polyclinicSelect = patient.polyclinicSelect;
                        doctorSelector = patient.doctorSelector;
                        statusSelect = patient.statusSelect;
                        polExamSaveBtn.innerHTML = 'Update';

                        myPatientIdNo.readOnly = true;
                        myPatientId.readOnly = true;
                        myPolyclinicSelect.readOnly = true;
                        $("#polyclinicSelect").css("pointer-events", "none");
                        $("#polyclinicSelect").css("background-color", "lightgrey");

                        toastr.info('Patient - ' + patient.patientNameSurname + ' - found!', 'Patient Protocol Search');
                    }
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Patient protocol couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        updatePatientData: function updatePatientData() {
            jQueryMethods.toastrOptions();
            var myDoctorSelector = document.getElementById('doctorSelector'),
                myStatusSelect = document.getElementById('statusSelect'),
                myInsuranceSelect = document.getElementById('insuranceSelect'),
                myPatientProtocolNo = document.getElementById('patientProtocolNo').value,
                myData = {
                    patientProtocolNo: myPatientProtocolNo,
                    insuranceSelect: myInsuranceSelect.options[myInsuranceSelect.selectedIndex].value,
                    doctorSelector: myDoctorSelector.options[myDoctorSelector.selectedIndex].value,
                    statusSelect: myStatusSelect.options[myStatusSelect.selectedIndex].value
                };

            $('#polExamPatientHistoryTable > tbody').empty();

            if ($("#patientIdNo").val() == '') {
                toastr.error('Please enter patient personal ID number! \n\n\n', 'Error!')
            } else {
                $.ajax({
                    type: 'PUT',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/polExam/updatePolExam',
                    success: function(patient) {
                        toastr.success('Polyclinic exam updated! \n\n\n', 'Polyclinic Exam Update');
                        PolyclinicExamMethods.findPatientHistory();
                        PolyclinicExamMethods.fillPatientVisitStatisticsTable();
                        PolyclinicExamMethods.fillPolyclinicPatientCountTable();
                        PolyclinicExamMethods.fillPatientHealtInsuranceTable();
                        PolyclinicExamMethods.fillPatientGenderTable();
                        PolyclinicExamMethods.fillDoctorPatientTable();
                        PolyclinicExamMethods.fillDoctorOnLeaveTable();
                    },
                    error: function(e) {
                        jQueryMethods.toastrOptions();
                        toastr.error('Polyclinic exam couldnt update! \n\n\n' + e.responseText, 'Error!')
                        console.log("ERROR: ", e.responseText);
                    }
                });
            }
        },

        fillPatientAppointmentStatusTable: function fillPatientAppointmentStatusTable() {
            $('#patientAppointmentStatusTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/polExam/fillPatientAppointmentStatusTable",
                data: { patientId: $("#patientId").val() },
                success: function(result) {
                    $.each(result, function(i) {
                        $("#patientAppointmentStatusTable> tbody").append(
                            "<tr class='appData'><td class='appPol'>" +
                            result[i].appointmentPolyclinic +
                            "</td><td class='appDate'>" + result[i].appointmentDate + ' <br> ' + result[i].appointmentHour +
                            "</td><td class='appStatus'>" + result[i].appointmentStatus + "</td></tr>");
                    });
                    AppointmentMethods.colorRedCanceledAppointmentId('patientAppointmentStatusTable', 2);
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Patient appointment history couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillPatientUpcomingAppointmentTable: function fillPatientUpcomingAppointmentTable() {
            $('#patientUpcomingAppointmentTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/polExam/fillPatientUpcomingAppointmentTable",
                data: { patientId: $("#patientId").val() },
                success: function(result) {
                    $.each(result, function(i) {
                        $("#patientUpcomingAppointmentTable> tbody").append(
                            "<tr class='appData'><td class='appDoctor'>" +
                            result[i].appointmentDoctor +
                            "</td><td class='appDate'>" + result[i].appointmentDate + ' <br> ' + result[i].appointmentHour +
                            "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Patient appointment history couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillPatientVisitStatisticsTable: function fillPatientVisitStatisticsTable() {
            var patientId = $('#patientId').val();

            $('#patientVisitStatisticsTable > tbody').empty();

            $.ajax({
                type: "GET",
                data: { patientId: patientId },
                url: "/polExam/fillPatientVisitStatisticsTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#patientVisitStatisticsTable> tbody").append(
                            "<tr class='userStatisticsRow'><td class='patientData'>" +
                            docs[i]["_id"] + "</td><td class='polyclinicCount'>" + docs[i]["count"] + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Patient polyclinic visits couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillPolyclinicPatientCountTable: function fillPolyclinicPatientCountTable() {
            var polExamDate = $('#patientPolExamDate').val();

            $('#polyclinicPatientCountTable > tbody').empty();

            $.ajax({
                type: "GET",
                data: { patientPolExamDate: polExamDate },
                url: "/polExam/fillPolyclinicPatientCountTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#polyclinicPatientCountTable> tbody").append(
                            "<tr class='userStatisticsRow'><td class='patientData'>" +
                            docs[i]["_id"] + "</td><td class='polyclinicCount'>" + docs[i]["count"] + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Polyclinic patients couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillPatientHealtInsuranceTable: function fillPatientHealtInsuranceTable() {
            var polExamDate = $('#patientPolExamDate').val();

            $('#patientHealtInsuranceTable > tbody').empty();

            $.ajax({
                type: "GET",
                data: { patientPolExamDate: polExamDate },
                url: "/polExam/fillPatientHealtInsuranceTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#patientHealtInsuranceTable> tbody").append(
                            "<tr class='userStatisticsRow'><td class='patientData'>" +
                            docs[i]["_id"]["polyclinicSelect"] +
                            "</td><td class='patientInsurance'>" + docs[i]["_id"]["insuranceSelect"] +
                            "</td><td class='polyclinicCount'>" + docs[i]["count"] + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Polyclinic patients couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillPatientGenderTable: function fillPatientGenderTable() {
            var polExamDate = $('#patientPolExamDate').val();

            $('#patientGenderTable > tbody').empty();

            $.ajax({
                type: "GET",
                data: { patientPolExamDate: polExamDate },
                url: "/polExam/fillPatientGenderTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#patientGenderTable> tbody").append(
                            "<tr class='userStatisticsRow'><td class='patientData'>" +
                            docs[i]["_id"]["polyclinicSelect"] +
                            "</td><td class='patientGender'>" + docs[i]["_id"]["patientGender"] +
                            "</td><td class='polyclinicCount'>" + docs[i]["count"] + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Polyclinic patients couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillDoctorPatientTable: function fillDoctorPatientTable() {
            var polExamDate = $('#patientPolExamDate').val();

            $('#doctorPatientTable > tbody').empty();

            $.ajax({
                type: "GET",
                data: { patientPolExamDate: polExamDate },
                url: "/polExam/fillDoctorPatientTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#doctorPatientTable> tbody").append(
                            "<tr class='userStatisticsRow'><td class='doctorSelector'>" +
                            docs[i]["_id"]["doctorSelector"] +
                            "</td><td class='polyclinicSelect'>" + docs[i]["_id"]["polyclinicSelect"] +
                            "</td><td class='patientCount'>" + docs[i]["count"] + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Polyclinic patients couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillDoctorAppointmentTable: function fillDoctorAppointmentTable() {
            var polExamDate = $('#patientPolExamDate').val();
            $('#doctorAppointmentTable > tbody').empty();

            $.ajax({
                type: "GET",
                data: { patientPolExamDate: polExamDate },
                url: "/polExam/fillDoctorAppointmentTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#doctorAppointmentTable> tbody").append(
                            "<tr class='userStatisticsRow'><td class='doctorSelector'>" +
                            docs[i]["_id"] +
                            "</td><td class='patientCount'>" + docs[i]["count"] + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Doctor appointments couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillDoctorOnLeaveTable: function fillDoctorOnLeaveTable() {
            var polExamDate = $('#patientPolExamDate').val();

            $('#doctorOnLeaveTable > tbody').empty();

            $.ajax({
                type: "GET",
                data: { patientPolExamDate: polExamDate },
                url: "/polExam/fillDoctorOnLeaveTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $("#doctorOnLeaveTable> tbody").append(
                            "<tr class='userStatisticsRow'><td class='doctorSelector'>" +
                            docs[i]["staffName"] + ' ' + docs[i]["staffSurname"] +
                            "</td><td class='patientCount'>" + docs[i]["staffLeaveEndDate"].substring(0, 10) + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Polyclinic patients couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        }
    },

    PolyclinicMethods = {

        searchInTable: function searchInTable(inputId, TableId) {
            var input, filter, found, table, tr, td, i, j,
                input = document.getElementById(inputId),
                filter = input.value.toUpperCase(),
                table = document.getElementById(TableId),
                tr = table.getElementsByTagName("tr");
            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td");
                for (j = 0; j < td.length; j++) {
                    if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                        found = true;
                    }
                }
                if (found) {
                    tr[i].style.display = "";
                    found = false;
                } else if (!tr[i].id.match('^tableHeader')) {
                    tr[i].style.display = "none";
                }
            }
        },

        flipCardsByTime: function flipCardsByTime(cardId1, cardId2, cardId3, cardId4, cardId5) {
            window.myFlipInterval = setInterval(() => {
                var myCards =
                    document.querySelectorAll('#' + cardId1 + ',#' + cardId2 + ',#' + cardId3 + ',#' + cardId4 + ',#' + cardId5 + '');
                for (let i = 0; i < myCards.length; i++) {
                    myCards[i].style.transform = 'rotateY(180deg)';
                }
            }, 11000);

            window.myFlipBackInterval = setInterval(() => {
                var myCards =
                    document.querySelectorAll('#' + cardId1 + ',#' + cardId2 + ',#' + cardId3 + ',#' + cardId4 + ',#' + cardId5 + '');
                for (let i = 0; i < myCards.length; i++) {
                    myCards[i].style.transform = 'rotateX(0deg)';
                }

            }, 20000);
        },

        stopAnimationsOnHover: function stopAnimationsOnHover(cardId1, cardId2, cardId3, cardId4, cardId5) {
            window.clearInterval(window.myFlipInterval);
            window.clearInterval(window.myFlipBackInterval);
            var myCards =
                document.querySelectorAll('#' + cardId1 + ',#' + cardId2 + ',#' + cardId3 + ',#' + cardId4 + ',#' + cardId5 + '');
            for (let i = 0; i < myCards.length; i++) {
                myCards[i].style.transform = '';
            }
        },

        hidePopUpModal: function hidePopUpModal(modalId) {
            var modal = document.getElementById(modalId);
            modal.style.display = 'none';
        },

        tetkikSelect: function tetkikSelect(checkboxId, checkboxClass, resultTable, countResult) {
            var selectedCheckbox = document.getElementById(checkboxId),
                checkboxParent = selectedCheckbox.parentElement,
                grandParent = checkboxParent.parentElement,
                checkboxes = document.getElementsByClassName(checkboxClass),
                selectedExam = document.getElementById(resultTable).rows[1].cells,
                y = 0,
                totalExam = document.getElementById(countResult);

            if (selectedCheckbox.checked == true) {
                grandParent.style.backgroundColor = '#5bc0de';

                for (let i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].checked == true) {
                        y++
                    }
                }
                if (y == 0) {
                    totalExam.style.backgroundColor = 'red'
                } else {
                    totalExam.style.backgroundColor = '#5bc0de'
                }
                selectedExam[0].innerHTML = y;

            } else {
                grandParent.style.backgroundColor = '#dddddd';


                for (let i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].checked == true) {
                        y++
                    }
                }
                if (y == 0) {
                    totalExam.style.backgroundColor = 'red'
                } else { totalExam.style.backgroundColor = '#5bc0de' }
                selectedExam[0].innerHTML = y;
            }
        },

        countSelectedCheckboxes: function countSelectedCheckboxes(checkboxClass, examTable, countResult) {
            var checkboxes = document.getElementsByClassName(checkboxClass),
                selectedExam = document.getElementById(examTable).rows[1].cells,
                y = 0,
                totalExam = document.getElementById(countResult);
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked == true) {
                    y++
                }
            }
            if (y == 0) {
                totalExam.style.backgroundColor = 'red'
            } else { totalExam.style.backgroundColor = '#5bc0de' }
            selectedExam[0].innerHTML = y;
        },

        checkAndSaveExaminations: function checkAndSaveExaminations(totalId, clickedButtonId) {
            var totalExam = document.getElementById(totalId);

            if (Number(totalExam.innerHTML) == 0) {
                alert('Please select an examination!');
            } else {
                if (clickedButtonId == 'labTetkikKaydet') {
                    PolyclinicMethods.savePatientRadLabExaminations('labIstemTableTbody', 'Laboratory');
                } else {
                    PolyclinicMethods.savePatientRadLabExaminations('radiologyIstemTableTBody', 'Radiology');
                }
            }
        },

        showPatientDataOnHover: function showPatientDataOnHover() {
            var patientNameSurname = $.cookie('patientNameSurname'),
                patientPersonalIdNumber = $.cookie('patientPersonalIdNumber'),
                patientGender = $.cookie('patientGender'),
                patientBirthDate = $.cookie('patientGroup'),
                myPhotoSrc = $.cookie('patientPhotoSrc');

            $(function() {
                s = '<table style="border-style:hidden;width:200px;box-shadow:0px 0px 15px 3px white;">';
                s += '<tr style="border-style:ridge;border:5px solid #761c54;"><img src="' + myPhotoSrc + '" style="width:200px; height:200px;align-items:center;box-shadow:"/> </td><td valign="top">' + patientNameSurname + '</td></tr>';
                s += '<td class="Text">' + patientGender + ' - ' + patientBirthDate + ' <br/>' + patientPersonalIdNumber + '</td>';
                s += '</table>';
                $('#hUserName').tooltip({
                    content: s,
                    position: {
                        my: "center top",
                        at: "center bottom-5",
                    },
                    show: {
                        effect: "slideDown",
                        delay: 250,
                        track: true
                    }
                });
            });
        },

        getPatientPersonalIdNo: function getPatientPersonalIdNo(patientTableRowId) {
            var clickedPatientProtocol = $('#' + patientTableRowId + '').children("td:first-child").text(),
                clickedPatientNameSurname = $('#' + patientTableRowId + '').children("td:nth-child(2)").text(),
                myData = { patientProtocolNo: clickedPatientProtocol };

            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/getPatientPersonalIdNo",
                data: (myData),
                contentType: 'application/json',
                datatype: "json",
                success: function(result) {
                    $.each(result, function(i, patientData) {
                        i++;
                        $.cookie('patientNameSurname', clickedPatientNameSurname, { expires: 1, path: '/' });

                        $.cookie('patientPersonalIdNumber', patientData.patientIdNo, { expires: 1, path: '/' });

                        $.cookie('patientProtocol', clickedPatientProtocol, { expires: 1, path: '/' });

                    });
                    PolyclinicMethods.getPatientDataToCookie();
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Patient list couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        getPatientDataToCookie: function getPatientDataToCookie() {
            var clickedPatientPersonalIdNo = $.cookie('patientPersonalIdNumber'),
                age,
                myData = { patientIdNo: clickedPatientPersonalIdNo };

            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/getPatientDataToCookie",
                data: (myData),
                contentType: 'application/json',
                datatype: "json",
                success: function(result) {
                    $.each(result, function(i, patientData) {
                        i++;
                        $.cookie('patientPhotoSrc', patientData.patientPhotoSrc, { expires: 1, path: '/' });
                        $.cookie('patientFatherName', patientData.patientFatherName, { expires: 1, path: '/' });
                        $.cookie('patientGender', patientData.patientGender, { expires: 1, path: '/' });
                        $.cookie('patientBirthPlace', patientData.patientBirthPlace, { expires: 1, path: '/' });
                        $.cookie('patientBirthDate', patientData.patientBirthDate, { expires: 1, path: '/' });
                        $.cookie('patientId', patientData.patientId, { expires: 1, path: '/' });
                        dob = $.cookie('patientBirthDate');
                        age = AdministrationMethods.calculateAge(dob);
                        $.cookie('patientAge', age, { expires: 1, path: '/' });
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Patient data couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        checkPatientAppointmentStatus: function checkPatientAppointmentStatus(patientAppStatusId, patientPersonalIdNumber) {
            var date = new Date(),
                day = date.getDate(),
                month = date.getMonth() + 1,
                year = date.getFullYear(),
                today;

            if (month < 10) month = "0" + month;
            if (day < 10) day = "0" + day;
            today = day + "-" + month + "-" + year;

            var patientIdNo = patientPersonalIdNumber,
                appointmentStatusCell = document.getElementById(patientAppStatusId),
                appointmentPolyclinic = $('#polyclinicSelector option:selected').val(),
                myData = {
                    patientIdNo: patientIdNo,
                    appointmentStatus: 'Valid',
                    appointmentDate: today,
                    appointmentPolyclinic: appointmentPolyclinic
                };

            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/checkPatientAppointmentStatus",
                data: (myData),
                contentType: 'application/json',
                datatype: "json",
                success: function(result) {
                    $.each(result, function(i, patientAppStatus) {
                        i++;
                        if (result.length > 0) {
                            appointmentStatusCell.innerHTML = 'With Appointment';
                            appointmentStatusCell.style.backgroundColor = '#4aa54a';
                            appointmentStatusCell.style.color = 'white';
                        } else {
                            appointmentStatusCell.innerHTML = 'No Appointment';
                        }
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Patient appointment status couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        findPatientList: function findPatientList() {
            jQueryMethods.toastrOptions();
            if ($.cookie('username') == null ||
                $.cookie('username') == 'null' ||
                $.cookie('username') == undefined ||
                $.cookie('username') == 'undefined') {
                toastr.error('Please login from Main page!', 'Login error!')
            } else {
                var polExamDate = $('#examDate').val(),
                    myPolyclinicSelectValue = $("#polyclinicSelector option:selected").val();

                $('#patientTable > tbody').empty();

                $.ajax({
                    type: "GET",
                    url: "/polExamAnamnesis/findPatientList",
                    data: { polyclinicSelect: myPolyclinicSelectValue, statusSelect: 'Valid', patientPolExamDate: polExamDate },
                    success: function(result) {
                        $.each(result, function(i, patientData) {
                            i++;
                            var patientAppStatusId = 'patientAppStatus' + i;
                            $("#patientTable> tbody").append(
                                "<tr class='patientList' id='patient" + i +
                                "' title='' onclick='PolyclinicMethods.getPatientPersonalIdNo(\"patient" + i + "\");PolyclinicMethods.findPatientDiagnosisHistory();PolyclinicMethods.findPatientAnamnesisByProtocol();PolyclinicMethods.fillPatientExamHistoryTable();PolyclinicMethods.fillPatientLabRadHistoryTable()' onmouseover ='PolyclinicMethods.getPatientPersonalIdNo(\"patient" + i + "\");jQueryMethods.getPatientPhotoAndInfos(\"patient" + i + "\")'><td style='color:white'>" +
                                patientData.patientProtocolNo + "</td><td>" +
                                patientData.patientNameSurname + "</td><td id='patientAppStatus" + i +
                                "' style='background-color:#e77474;'>Without Appointment</td></tr>");
                            PolyclinicMethods.checkPatientAppointmentStatus(patientAppStatusId, patientData.patientIdNo)
                        });
                    },
                    error: function(e) {
                        toastr.error('Patient list couldnt find! \n\n\n' + e.responseText, 'Error!')
                        console.log("ERROR: ", e.responseText);
                    }
                });
            }
        },

        fillDiagnosisDropDown: function fillDiagnosisDropDown() {
            $('#diagnosisList').empty();

            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/diagnosisList",
                data: {},
                success: function(result) {
                    $.each(result, function(i, diagnosisData) {
                        i++;
                        $("#polDiagnosis").append(
                            "<a class='diagnosisListItems' id='diagnosisListItem" + i +
                            "'href='#taniAdd' onclick='PolyclinicMethods.addDiagnosisToTableAndDatabase(\"diagnosisListItem" + i + "\");'>" + diagnosisData.icd10 + ' - ' + diagnosisData.diagnosisName + "</a>");
                    });
                },
                error: function(e) {
                    toastr.error('Diagnosis list couldnt find! \n\n\n' + e.responseText, 'Error!');
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        deletePatientDiagnosis: function deletePatientDiagnosis(patientTableRowId) {
            var icd10Code = $('#' + patientTableRowId + '').children("td:first-child").text().substr(0, 5),
                icd10FullName = $('#' + patientTableRowId + '').children("td:first-child").text(),
                clickedPatientProtocol = $.cookie('patientProtocol'),
                diagnosisTypeFromSelect = $("#diagnosisSelect option:selected").val(),
                diagnosisTypeFromTable = $('#' + patientTableRowId + ' td:nth-child(2)').text(),
                whichDiagnosisText;

            if (diagnosisTypeFromSelect == null || diagnosisTypeFromSelect == 'null') {
                whichDiagnosisText = diagnosisTypeFromTable;
            } else {
                whichDiagnosisText = diagnosisTypeFromSelect;
            }

            toastr.warning(
                "<br/><br/><button type='button' id='deleteConfirmBtn' class='inpatientBtn btn-danger' style='width: 325px !important;'>Yes</button>", 'Do you want to DELETE diagnosis?', {
                    allowHtml: true,
                    progressBar: false,
                    timeOut: 10000,
                    onShown: function(toast) {
                        $("#deleteConfirmBtn").on('click', function() {
                            $.ajax({
                                type: "GET",
                                url: "/polExamAnamnesis/deletePatientDiagnosis",
                                data: { patientProtocolNo: clickedPatientProtocol, icd10: icd10Code, diagnosisType: whichDiagnosisText },
                                success: function() {
                                    toastr.success(icd10FullName + ' - Deleted!', 'Diagnosis Delete');
                                    PolyclinicMethods.findPatientDiagnosisHistory();
                                },
                                error: function(e) {
                                    jQueryMethods.toastrOptions();
                                    toastr.error('Diagnosis couldnt deleted! \n' + e.body, 'Error!')
                                    console.log("ERROR: ", e);
                                }
                            });
                        });
                    }
                });
        },

        updateDiagnosisType: function updateDiagnosisType(patientTableRowId) {
            var icd10Code = $('#' + patientTableRowId + '').children("td:first-child").text().substr(0, 5),
                icd10FullName = $('#' + patientTableRowId + '').children("td:first-child").text(),
                clickedPatientProtocol = $.cookie('patientProtocol'),
                diagnosisTypeFromSelect = $("#diagnosisSelect option:selected").val(),
                myData = { patientProtocolNo: clickedPatientProtocol, icd10: icd10Code, diagnosisType: diagnosisTypeFromSelect };
            $.ajax({
                type: 'PUT',
                data: JSON.stringify(myData),
                cache: false,
                contentType: 'application/json',
                datatype: "json",
                url: '/polExamAnamnesis/updateDiagnosisType',
                success: function() {
                    toastr.success(icd10FullName + ' diagnosis updated!', 'Diagnosis Update');
                    PolyclinicMethods.findPatientDiagnosisHistory();
                },
                error: function(e) {
                    toastr.error(icd10FullName + ' couldnt update! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        addDiagnosisToTableAndDatabase: function addDiagnosisToTableAndDatabase(diagnosisListItemId) {
            var myDate = new Date(),
                userDate = myDate.toLocaleString("en-US"),
                patientProtocol = $.cookie('patientProtocol'),
                patientId = $.cookie('patientId'),
                patientPersonalIdNumber = $.cookie('patientPersonalIdNumber'),
                icd10Code = $("#" + diagnosisListItemId + "").html().substr(0, 5),
                icd10Name = $("#" + diagnosisListItemId + "").html().substr(8),
                myDiagnosisUser = $.cookie('username'),
                rowCount = $('.polDiagnosisHistoryTable >tbody >tr').length + 1;

            $(".polDiagnosisHistoryTable > tbody").append(
                "<tr class='patientDiagnosis' id='patientDiagnosis" + rowCount + "'><td style='color:white'>" +
                $("#" + diagnosisListItemId + "").html() + "</td>" +
                "<td><select id='diagnosisSelect' style='width:fit-content'><option value='preDiagnosis'>Pre Diagnosis</option><option value='certainDiagnosis'>Certain Diagnosis</option></select></td>" +
                "<td>" + myDiagnosisUser + "</td>" +
                "<td>" + userDate + "</td>" +
                "<td><button class='inpatientBtn btn-danger' onclick='PolyclinicMethods.deletePatientDiagnosis(\"patientDiagnosis" + rowCount + "\")'>Delete</button></td>" +
                "<td><button class='inpatientBtn btn-primary' style='width:62px;height:42px;' onclick='PolyclinicMethods.updateDiagnosisType(\"patientDiagnosis" + rowCount + "\")'>Update</button></td>" +
                "</tr>")

            var myDiagnosisType = $("#diagnosisSelect option:selected").val(),
                myData = {
                    patientProtocolNo: patientProtocol,
                    patientId: patientId,
                    patientIdNo: patientPersonalIdNumber,
                    icd10: icd10Code,
                    diagnosisType1: myDiagnosisType,
                    diagnosisName1: icd10Name,
                    diagnosisUser1: myDiagnosisUser,
                    diagnosisDate1: userDate
                };

            $.ajax({
                type: 'POST',
                data: JSON.stringify(myData),
                cache: false,
                contentType: 'application/json',
                // datatype: "json",
                url: '/polExamAnamnesis/savePolExamDiagnosis',
                success: function() {
                    toastr.success($("#" + diagnosisListItemId + "").html() + ' added!', 'Info!')
                },
                error: function(e) {
                    toastr.error('Patient diagnosis couldnt save! \n' + e, 'Error!')
                    console.log("ERROR: ", e);
                }
            });
        },

        findPatientDiagnosisHistory: function findPatientDiagnosisHistory() {
            jQueryMethods.toastrOptions();

            var patientProtocol = $.cookie('patientProtocol');

            if (patientProtocol == null ||
                patientProtocol == 'null' ||
                patientProtocol == undefined ||
                patientProtocol == 'undefined') {
                toastr.error('Please choose a patient from patient list!', 'Patient Diagnosis List Error!')
            } else {
                $.ajax({
                    type: "GET",
                    url: "/polExamAnamnesis/findPatientDiagnosisHistory",
                    data: { patientProtocolNo: patientProtocol },
                    success: function(result) {
                        $('.polDiagnosisHistoryTable > tbody').empty();
                        $.each(result, function(i, patientDiagnosisData) {
                            i++
                            if (result.length > 0 &&
                                patientDiagnosisData.icd10 != null ||
                                patientDiagnosisData.icd10 != 'null' ||
                                patientDiagnosisData.icd10 != 'undefined' ||
                                patientDiagnosisData.icd10 != undefined) {
                                $(".polDiagnosisHistoryTable > tbody").append(
                                    "<tr class='patientDiagnosis' id='patientDiagnosis" + i + "'><td style='color:white'>" +
                                    patientDiagnosisData.icd10 + ' - ' + patientDiagnosisData.diagnosisName + "</td>" +
                                    "<td>" + patientDiagnosisData.diagnosisType + "</td>" +
                                    "<td>" + patientDiagnosisData.diagnosisUser + "</td>" +
                                    "<td>" + patientDiagnosisData.diagnosisDate + "</td>" +
                                    "<td><button class='inpatientBtn btn-danger' onclick='PolyclinicMethods.deletePatientDiagnosis(\"patientDiagnosis" + i + "\")'>Delete</button></td>" +
                                    "<td>Can\'t Update</td>" +
                                    "</tr>")
                            } else {
                                $('.polDiagnosisHistoryTable > tbody').empty();
                            }
                        });
                    },
                    error: function(e) {
                        toastr.error('Patient diagnosis history couldn\'t find! \n\n\n' + e.responseText, 'Error!')
                        console.log("ERROR: ", e.responseText);
                    }
                });
            }
        },

        savePolExamAnamnesis: function savePolExamAnamnesis() {
            jQueryMethods.toastrOptions();
            var polExamSave = document.getElementById('poylclinicAnamnesisSave'),
                myDate = new Date(),
                mySaveDate = myDate.toLocaleString("en-US"),
                myData = {
                    patientProtocolNo: $.cookie("patientProtocol"),
                    patientId: $.cookie("patientId"),
                    patientIdNo: $.cookie("patientPersonalIdNumber"),
                    patientNameSurname: $.cookie("patientNameSurname"),
                    appointmentStatus: '',
                    patientStory: $("#oykusuArea").val(),
                    patientAnamnesis: $("#anamnezArea").val(),
                    patientExamination: $("#muayeneArea").val(),
                    patientSavedUser: $.cookie('username'),
                    saveDate: mySaveDate,
                    polyclinicSelect: $("#polyclinicSelector option:selected").val()
                };

            if (polExamSave.innerHTML == 'Update') {
                PolyclinicMethods.updatePolExamAnamnesis();
            } else {
                if (myData.patientStory == '' && myData.patientAnamnesis == '' && myData.patientExamination == '') {
                    toastr.warning('Please fill at least one of Story, Anamnesis or Examination area! \n', 'Error!')
                } else {
                    $.ajax({
                        type: 'POST',
                        data: JSON.stringify(myData),
                        cache: false,
                        contentType: 'application/json',
                        datatype: "json",
                        url: '/polExamAnamnesis/savePolExamAnamnesis',
                        success: function() {
                            toastr.success('Patient polyclinic exam successfully saved!', 'Save!');
                            // PolyclinicExamMethods.findPatientHistory();
                            // findPatientLabRadHistory function will come here
                        },
                        error: function(e) {
                            toastr.error('Patient polyclinic exam couldnt save! \n' + e, 'Error!')
                            console.log("ERROR: ", e);
                        }
                    });
                }
            }
        },

        updatePolExamAnamnesis: function updatePolExamAnamnesis() {
            var clickedPatientProtocol = $.cookie('patientProtocol'),
                myData = {
                    patientProtocolNo: clickedPatientProtocol,
                    patientStory: $("#oykusuArea").val(),
                    patientAnamnesis: $("#anamnezArea").val(),
                    patientExamination: $("#muayeneArea").val(),
                };

            $.ajax({
                type: 'PUT',
                data: JSON.stringify(myData),
                cache: false,
                contentType: 'application/json',
                datatype: "json",
                url: '/polExamAnamnesis/updatePolExamAnamnesis',
                success: function() {
                    toastr.success('Anamnesis updated!', 'Anamnesis Update!');
                    PolyclinicMethods.fillPatientExamHistoryTable();
                },
                error: function(e) {
                    toastr.error('Anamnesis couldnt update! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        findPatientAnamnesisByProtocol: function findPatientAnamnesisByProtocol() {
            var polExamSave = document.getElementById('poylclinicAnamnesisSave'),
                patientProtocol = $.cookie('patientProtocol'),
                oykusuArea = $('#oykusuArea').val(),
                anamnezArea = $('#anamnezArea').val(),
                muayeneArea = $('#muayeneArea').val();

            if (patientProtocol == null ||
                patientProtocol == 'null' ||
                patientProtocol == undefined ||
                patientProtocol == 'undefined') {
                toastr.error('Please choose a patient from patient list!', 'Patient Anamnesis Error!')
            } else {
                $.ajax({
                    type: "GET",
                    url: "/polExamAnamnesis/findPatientAnamnesisByProtocol",
                    data: { patientProtocolNo: patientProtocol },
                    success: function(result) {

                        $('#oykusuArea').val('');
                        $('#anamnezArea').val('');
                        $('#muayeneArea').val('');
                        polExamSave.innerHTML = 'Save';
                        $.each(result, function(i, patientAnamnesisData) {
                            i++
                            $('#oykusuArea').val(patientAnamnesisData.patientStory);
                            $('#anamnezArea').val(patientAnamnesisData.patientAnamnesis);
                            $('#muayeneArea').val(patientAnamnesisData.patientExamination);
                            polExamSave.innerHTML = 'Update';
                        });
                    },
                    error: function(e) {
                        toastr.error('Patient Anamnesis By Protocol couldn\'t find! \n\n\n' + e.responseText, 'Error!')
                        console.log("ERROR: ", e.responseText);
                    }
                });
            }
        },

        fillPatientExamHistoryTable: function fillPatientExamHistoryTable() {
            $('#patientHistoryTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/fillPatientExamHistoryTable",
                data: { patientIdNo: $.cookie("patientPersonalIdNumber") },
                success: function(result) {
                    $.each(result, function(i, patientData) {
                        i++;
                        $("#patientHistoryTable> tbody").append(
                            "<tr class='patientHistory' id='patientHistory" + i + "' title='' onmouseover ='PolyclinicMethods.getPatientExamAnamnesisInTooltip(\"patientHistory" + i + "\")'><td >" +
                            i + "</td><td>" + patientData.patientProtocolNo + "</td><td>" +
                            patientData.patientPolExamDate + "</td><td>" +
                            patientData.polyclinicSelect + "</td><td>" +
                            patientData.doctorSelector + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Patient polyclinic history couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillPatientLabRadHistoryTable: function fillPatientLabRadHistoryTable() {
            $('#patientLabRadHistoryTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/fillPatientLabRadHistoryTable",
                data: { patientIdNo: $.cookie("patientPersonalIdNumber") },
                success: function(result) {
                    $.each(result, function(i, testData) {
                        i++;
                        if (testData.result == '') {
                            testData.result = 'No Result';
                        }
                        $("#patientLabRadHistoryTable> tbody").append(
                            "<tr class='patientLabRadHistory' id='patientLabRadHistory" + i + "' title='" +
                            testData.result + "' ><td >" +
                            i + "</td><td>" +
                            testData.patientProtocolNo + "</td><td>" +
                            testData.testName + "</td><td>" +
                            testData.saveDate + "</td><td>" +
                            testData.testLab + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Lab. / Rad. history couldn\'t find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillPatientTodaysLabRadHistoryTable: function fillPatientTodaysLabRadHistoryTable(tableId, testType) {
            $('#' + tableId + ' > tbody').empty();
            $('#labPatientData').text($.cookie("patientProtocol") + ' - ' + $.cookie("patientNameSurname"));
            $('#radPatientData').text($.cookie("patientProtocol") + ' - ' + $.cookie("patientNameSurname"));
            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/fillPatientLabRadHistoryTable",
                data: { patientProtocolNo: $.cookie("patientProtocol"), testType: testType },
                success: function(result) {
                    $.each(result, function(i, testData) {
                        i++;
                        if (testData.result == '') {
                            testData.result = 'No Result';
                        }
                        $('#' + tableId + ' > tbody').append(
                            "<tr class='patientLabRadHistory' id='patientLabRadHistory" + i + "' title='" +
                            testData.result + "' ><td >" +
                            i + "</td><td>" +
                            testData.testCode + "</td><td>" +
                            testData.testName + "</td><td>" +
                            testData.saveDate + "</td><td>" +
                            testData.testLab + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Lab. / Rad. history couldn\'t find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        getPatientExamAnamnesisInTooltip: function getPatientExamAnamnesisInTooltip(examRowId) {
            var patientProtocol = $('#' + examRowId + ' td:nth-child(2)').text();

            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/getPatientExamAnamnesisInTooltip",
                data: { patientProtocolNo: patientProtocol },
                success: function(result) {
                    if (result.length > 0) {
                        s = '<table id="patientAnamnesisTooltipTable" style="text-align: left !important;">' +
                            '<tr><td>Protocol No: ' + patientProtocol + '</td></tr>' +
                            '<tr style="border-style:dotted;"><td valign="top"> Story : ' +
                            result[0].patientStory + '</td></tr>' +
                            '<tr style="border-style:dotted;"><td>Anamnesis : ' + result[0].patientAnamnesis + '</td></tr>' +
                            '<tr><td>Examination : ' + result[0].patientExamination + '</td></tr></table>';

                        $('#' + examRowId + '').tooltip({
                            content: s,
                            position: {
                                my: "center top",
                                at: "center bottom-5",
                            },
                            show: {
                                effect: "slideDown",
                                delay: 250,
                                track: true
                            }
                        });
                    } else {
                        s = '<table id="patientAnamnesisTooltipTable" style="text-align: left !important;"' +
                            ' style="border-style:hidden;width:200px;box-shadow:0px 0px 15px 3px white;">' +
                            '<tr><td>Protocol No: ' + patientProtocol + '</td></tr>' +
                            '<tr style="border-style:dotted;"><td> Story : No Data</td></tr>' +
                            '<tr style="border-style:dotted;"><td>Anamnesis : No Data</td></tr>' +
                            '<tr><td>Examination : No Data</td></tr></table>';

                        $('#' + examRowId + '').tooltip({
                            content: s,
                            position: {
                                my: "center top",
                                at: "center bottom-5",
                            },
                            show: {
                                effect: "slideDown",
                                delay: 250,
                                track: true
                            }
                        });
                    }
                },
                error: function(e) {
                    toastr.error('Patient Anamnesis By Protocol couldn\'t find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        patientDataForHospitalization: function patientDataForHospitalization() {
            var patientProtocol = $.cookie('patientProtocol').substr(1),
                patientNameSurname = $.cookie('patientNameSurname');

            $('#patientProtocol').val(patientProtocol);
            $('#patientNameSurname').val(patientNameSurname);
            PolyclinicMethods.checkProtocolInpatients();
        },

        hospitalizationProcedure: function hospitalizationProcedure() {
            var patientProtocol = $.cookie('patientProtocol').substr(1),
                patientNameSurname = $.cookie('patientNameSurname'),
                myDate = new Date(),
                mySaveDate = myDate.toLocaleString("en-US"),
                myData = {
                    patientProtocolNo: patientProtocol,
                    patientId: $.cookie("patientId"),
                    patientIdNo: $.cookie("patientPersonalIdNumber"),
                    patientNameSurname: patientNameSurname,
                    bedId: $('img[alt="selected"]').attr('id'),
                    doctorSelect: $("#polExamDoctorSelector option:selected").val(),
                    hospitalizationDate: mySaveDate,
                    exitDate: '',
                    clinicSelect: $("#clinicSelector option:selected").val(),
                    patientSavedUser: $.cookie('username'),
                    savedDate: mySaveDate
                };

            if (myData.bedId == 'null' || myData.bedId == null) {
                toastr.warning('Please select a bed! \n', 'Error!')
            } else {
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/polExamAnamnesis/hospitalizationProcedure',
                    success: function() {
                        toastr.success('Patient hospitalization successfully saved!', 'Save!');
                    },
                    error: function(e) {
                        toastr.error('Patient hospitalization couldn\'t save! \n' + e, 'Error!')
                        console.log("ERROR: ", e);
                    }
                });
            }
        },

        checkProtocolInpatients: function checkProtocolInpatients() {
            var hospitalizationSave = document.getElementById('hospitalizationSave'),
                patientProtocol = $.cookie('patientProtocol'),
                patientTable = $('#patientTable > tbody > tr');

            if (patientTable.length < 1) {
                $('#patientProtocol').val('');
                $('#patientNameSurname').val('');
                hospitalizationSave.disabled = true;
                hospitalizationSave.style.backgroundColor = 'grey';
                toastr.error('Please choose a patient from patient list!', 'Patient Data Error!')
            } else {
                $.ajax({
                    type: "GET",
                    url: "/polExamAnamnesis/checkProtocolInpatients",
                    data: { patientProtocolNo: patientProtocol },
                    success: function(result) {
                        if (result.length > 0) {
                            $.each(result, function(i, patientHospitalizationData) {
                                i++
                                console.log(patientHospitalizationData.patientNameSurname, patientHospitalizationData.clinicSelect, patientHospitalizationData.doctorSelect)
                                $('#patientProtocolNo').val(patientHospitalizationData.patientProtocolNo);
                                $('#patientNameSurname').val(patientHospitalizationData.patientNameSurname);
                                $('#polExamDoctorSelector').val(patientHospitalizationData.doctorSelect);
                                $('#hospitalizationDate').val(patientHospitalizationData.hospitalizationDate);
                                $('#clinicSelector').val(patientHospitalizationData.clinicSelect);
                                hospitalizationSave.disabled = true;
                                hospitalizationSave.style.backgroundColor = 'grey';
                            });
                        } else {
                            hospitalizationSave.disabled = false;
                            hospitalizationSave.style.backgroundColor = '#5cb85c';
                        }

                    },
                    error: function(e) {
                        toastr.error('Patient Anamnesis By Protocol couldn\'t find! \n\n\n' + e.responseText, 'Error!')
                        console.log("ERROR: ", e.responseText);
                    }
                });
            }
        },

        patientProtocolandNameFromCookieForConsultation: function patientProtocolandNameFromCookieForConsultation(protocolInputId, nameInputId) {
            var patientProtocol = $.cookie('patientProtocol'),
                patientNameSurname = $.cookie('patientNameSurname');

            if (patientProtocol == '' || patientProtocol == null) {
                document.getElementById('consultationSave').disabled = true;
                document.getElementById('consultationSave').style.backgroundColor = 'gray';
            } else {
                document.getElementById('consultationSave').disabled = false;
                document.getElementById('consultationSave').style.backgroundColor = '#449d44';
                document.getElementById('consultationSave').style.borderColor = '#39843';
            }
            $('#' + protocolInputId).val(patientProtocol);
            $('#' + protocolInputId).prop('disabled', true);
            $('#' + nameInputId).val(patientNameSurname);
            $('#' + nameInputId).prop('disabled', true);
        },

        saveConsultation: function saveConsultation() {
            var patientProtocol = $('#konsPatientProtocol').val(),
                patientNameSurname = $('#konsPatientName').val(),
                myConsDate = $('#konsDate').val(),
                myDate = new Date(),
                mySaveDate = myDate.toLocaleString("en-US"),
                myData = {
                    patientProtocolNo: patientProtocol,
                    patientId: $.cookie("patientId"),
                    patientIdNo: $.cookie("patientPersonalIdNumber"),
                    patientNameSurname: patientNameSurname,
                    doctorSelect: $("#konsDoctorSelector option:selected").val(),
                    consultationDate: myConsDate,
                    acceptDate: '',
                    clinicSelect: $("#konsPolyclinicSelector option:selected").val(),
                    consultationNote: $("#konsNote").val(),
                    patientSavedUser: $.cookie('username'),
                    savedDate: mySaveDate
                };

            if (patientProtocol == 'null' || patientProtocol == null) {
                toastr.warning('Please select a patient! \n', 'Error!')
            } else {
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(myData),
                    cache: false,
                    contentType: 'application/json',
                    datatype: "json",
                    url: '/polExamAnamnesis/saveConsultation',
                    success: function() {
                        toastr.success('Patient consultation successfully saved!', 'Save!');
                        PolyclinicMethods.fillConsultationHistoryTable();
                        $('#konsNote').val('');
                    },
                    error: function(e) {
                        toastr.error('Patient consultation couldn\'t save! \n' + e, 'Error!')
                        console.log("ERROR: ", e);
                    }
                });
            }
        },

        fillConsultationHistoryTable: function fillConsultationHistoryTable() {
            $('#consultationHistoryTable > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/fillConsultationHistoryTable",
                data: { patientIdNo: $.cookie("patientPersonalIdNumber") },
                success: function(result) {
                    $.each(result, function(i, consultationData) {
                        i++;
                        $("#consultationHistoryTable> tbody").append(
                            "<tr class='patientConsHistory' id='patientConsHistory" + i + "'>" +
                            "</td><td>" + consultationData.patientProtocolNo + "</td><td>" +
                            consultationData.doctorSelect + "</td><td>" +
                            consultationData.clinicSelect + "</td><td>" +
                            consultationData.consultationDate + "</td><td>" +
                            consultationData.acceptDate + "</td><td>" +
                            consultationData.consultationNote + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Patient consultation history couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        savePatientRadLabExaminations: function savePatientRadLabExaminations(requestTableTbody, myTestType) {
            var selectedCheckboxesRowIds = [];

            $('#' + requestTableTbody + ' input:checked').each(function() {
                selectedCheckboxesRowIds.push($(this).closest('tr').attr('id'));
            });
            $.each(selectedCheckboxesRowIds, function(i) {
                var myCheckBox = $('#' + selectedCheckboxesRowIds[i] + ' td:first input:checkbox'),
                    myTestCode = $('#' + selectedCheckboxesRowIds[i] + ' td:nth-child(2)').text(),
                    myTestName = $('#' + selectedCheckboxesRowIds[i] + ' td:nth-child(3)').text(),
                    myTestLab = $('#' + selectedCheckboxesRowIds[i] + ' td:nth-child(4)').text(),
                    myTestQuantity = $('#' + selectedCheckboxesRowIds[i] + ' td:last input').val(),
                    patientProtocol = $.cookie('patientProtocol'),
                    patientNameSurname = $.cookie('patientNameSurname'),
                    myDate = new Date(),
                    mySaveDate = myDate.toLocaleString("en-US"),
                    myData = {
                        patientProtocolNo: patientProtocol,
                        patientId: $.cookie("patientId"),
                        patientIdNo: $.cookie("patientPersonalIdNumber"),
                        patientNameSurname: patientNameSurname,
                        testCode: myTestCode,
                        testName: myTestName,
                        testLab: myTestLab,
                        testQuantity: myTestQuantity,
                        testType: myTestType,
                        saveDate: mySaveDate,
                        saveUser: $.cookie('username'),
                        result: '',
                        resultDate: '',
                        resultUser: ''
                    };
                // console.log(myTestCode, myTestName, myTestLab, myTestQuantity, mySaveDate,myData.saveUser)
                if (patientProtocol == 'null' || patientProtocol == null) {
                    toastr.warning('Please select a patient! \n', 'Error!')
                } else {
                    $.ajax({
                        type: 'POST',
                        data: JSON.stringify(myData),
                        cache: false,
                        contentType: 'application/json',
                        datatype: "json",
                        url: '/polExamAnamnesis/savePatientRadLabExaminations',
                        success: function() {
                            toastr.success(myTestCode + ' - ' + myTestName + ' successfully saved!', 'Save!');
                            myCheckBox.removeAttr('checked');
                        },
                        error: function(e) {
                            toastr.error(myTestCode + ' - ' + myTestName + ' couldn\'t save! \n' + e, 'Error!')
                            console.log("ERROR: ", e);
                        }
                    });
                }
                i++;
            });
        },

        fillAppointmentStatusTable: function fillAppointmentStatusTable() {
            $('#patientAppointmentStatusTable > tbody').empty();
            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/fillAppointmentStatusTable",
                data: {
                    appointmentDate: $('#examDate').val(),
                    appointmentPolyclinic: $("#polyclinicSelector option:selected").val()
                },
                success: function(result) {
                    $.each(result, function(i, appData) {
                        i++;
                        $("#patientAppointmentStatusTable> tbody").append(
                            "<tr class='patientApp' id='patientApp" + i + "'>" +
                            "<td>" + appData.patientName + ' ' + appData.patientSurname + "</td><td>" +
                            appData.appointmentDate + ' - ' + appData.appointmentHour + "</td><td>" +
                            appData.appointmentDoctor + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('fillAppointmentStatusTable couldnt find! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillPatientHealtInsuranceTable: function fillPatientHealtInsuranceTable(dateId, polyclinicSelectId, tableId) {
            var polExamDate = $('#' + dateId).val(),
                myPolyclinicSelect = $('#' + polyclinicSelectId + ' option:selected').val();

            $('#' + tableId + ' > tbody').empty();

            $.ajax({
                type: "GET",
                data: { patientPolExamDate: polExamDate, polyclinicSelect: myPolyclinicSelect },
                url: "/polExamAnamnesis/fillPatientHealtInsuranceTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $('#' + tableId + ' > tbody').append(
                            "<tr class='userStatisticsRow'><td class='patientData'>" +
                            docs[i]["_id"]["insuranceSelect"] +
                            "</td><td class='polyclinicCount'>" + docs[i]["count"] + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('fillPatientHealtInsuranceTable couldnt fetch! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillPatientGenderTable: function fillPatientGenderTable(dateId, polyclinicSelectId, tableId) {
            var polExamDate = $('#' + dateId).val(),
                myPolyclinicSelect = $('#' + polyclinicSelectId + ' option:selected').val();

            $('#' + tableId + ' > tbody').empty();

            $.ajax({
                type: "GET",
                data: { patientPolExamDate: polExamDate, polyclinicSelect: myPolyclinicSelect },
                url: "/polExamAnamnesis/fillPatientGenderTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $('#' + tableId + ' > tbody').append(
                            "<tr class='userStatisticsRow'><td class='patientData'>" +
                            docs[i]["_id"]["patientGender"] +
                            "</td><td class='polyclinicCount'>" + docs[i]["count"] + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('fillPatientGenderTable couldnt fetch! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillDoctorPatientTable: function fillDoctorPatientTable(dateId, polyclinicSelectId, tableId) {
            var polExamDate = $('#' + dateId).val(),
                myPolyclinicSelect = $('#' + polyclinicSelectId + ' option:selected').val();

            $('#' + tableId + ' > tbody').empty();

            $.ajax({
                type: "GET",
                data: { patientPolExamDate: polExamDate, polyclinicSelect: myPolyclinicSelect },
                url: "/polExamAnamnesis/fillDoctorPatientTable",
                success: function(docs) {
                    $.each(docs, function(i) {
                        $('#' + tableId + ' > tbody').append(
                            "<tr class='userStatisticsRow'><td class='doctorSelector'>" +
                            docs[i]["_id"]["doctorSelector"] +
                            "</td><td class='polyclinicSelect'>" + docs[i]["_id"]["polyclinicSelect"] +
                            "</td><td class='patientCount'>" + docs[i]["count"] + "</td></tr>");
                    });
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('Polyclinic patients couldnt count! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        },

        fillAgePercentageTable: function fillAgePercentageTable(dateId, polyclinicSelectId, tableId) {
            var oldPatient = 0,
                total = 0,
                percentageOld = 0,
                patientAge,
                polExamDate = $('#' + dateId).val(),
                myPolyclinicSelect = $('#' + polyclinicSelectId + ' option:selected').val();
            $('#' + tableId + ' > tbody').empty();

            $.ajax({
                type: "GET",
                url: "/polExamAnamnesis/fillAgePercentageTable",
                data: { patientPolExamDate: polExamDate, polyclinicSelect: myPolyclinicSelect },
                success: function(docs) {
                    $.each(docs, function(i) {

                        patientAge = AdministrationMethods.calculateAge(docs[i].patientBirthDate);

                        if (patientAge >= 65) {
                            $('#' + tableId + ' > tbody').append(
                                "<tr class='userStatisticsRow'><td class='oldPatientList'>" +
                                docs[i].patientNameSurname +
                                "</td><td class='patientCount'>" + patientAge + "</td></tr>");
                        }
                        i++
                        total++;

                        if (docs.length <= 1) {
                            total = 1;
                        }

                        if (patientAge >= 65) {
                            oldPatient++;
                        }
                    });

                    percentageOld = (oldPatient * 100) / total;
                    document.getElementById('totalPatient').innerHTML = 'Total patient =  ' + total;
                    document.getElementById('oldPatient').innerHTML = 'Old Patient Total= ' + oldPatient;
                    document.getElementById('oldPatientPercentage').innerHTML = 'Old Patient percentage = % ' + Math.round(percentageOld);
                },
                error: function(e) {
                    jQueryMethods.toastrOptions();
                    toastr.error('fillCanceledValidAppointmentTable couldnt fetch! \n\n\n' + e.responseText, 'Error!')
                    console.log("ERROR: ", e.responseText);
                }
            });
        }
    },

    ShowOrHideMethods = {
        HideColumn: function hideColumnsByClass(par) {
            var myClasses = document.querySelectorAll('.' + par),
                i = 0,
                l = myClasses.length;

            for (i; i < l; i++) {
                myClasses[i].style.display = 'none';
            }
        },

        unHideColumn: function unHideColumnsByClass(par) {
            var myClasses = document.querySelectorAll('.' + par),
                i = 0,
                l = myClasses.length;

            for (i; i < l; i++) {
                myClasses[i].style.display = 'flex';
            }
        },

        showDiv: function showDiv(showDivId, displayMethod) {
            var div = document.getElementById(showDivId);
            div.style.display = displayMethod;
        },

        hideDiv: function hideDiv(hideDivId) {
            var div = document.getElementById(hideDivId);
            div.style.display = 'none';
        },

        showFixedHeaderAfterScrool: function showMyFixedHeaderAfterScrool() { // when user scrool page header position fixes
            window.onscroll = function showFixedHeader() { // when user scrool page header position fixes
                var header = document.getElementById("headContainer"),
                    myLeftNavBarDiv = document.getElementById("mySpan"),
                    cardBtn = document.getElementById("kartlar"),
                    myLoginBtn = document.getElementById("loginBtn"),
                    myLeftSide = document.getElementById('left-side'),
                    myTitle = document.getElementById('title'),
                    myNavTitle = document.getElementById('nav-title'),
                    mySticky = 5,
                    x = window.pageYOffset,
                    top1 = document.body.scrollTop,
                    top2 = document.documentElement.scrollTop;

                if (x > mySticky || top1 != 0 || top2 != 0) {
                    header.classList.add("sticky");
                    header.style.backgroundColor = 'inherit';
                    myLeftNavBarDiv.style.position = 'relative';
                    myLeftNavBarDiv.style.right = '20px';
                    cardBtn.style.width = '70px';
                } else {
                    header.classList.remove("sticky");
                }

                if (CheckAndClearMethods.isMobile() == true && x > mySticky) {
                    header.style.top = '0px';
                    header.style.width = '100%';
                    header.style.overflowX = 'hidden';
                    myLeftNavBarDiv.style.top = '5px';
                    myLeftNavBarDiv.style.right = '10px';
                    cardBtn.style.width = '43px';
                    cardBtn.style.fontSize = '8px';
                    document.getElementById("headContainer").style.overflowY = 'hidden';
                    myLoginBtn.style.margin = '5px 35px 5px 0px';
                    myLoginBtn.style.width = '50px';
                    myLeftSide.style.margin = '0px -25px 10px -10px';
                    myTitle.style.backgroundSize = '90% 100%';
                    myNavTitle.style.width = '100%';
                } else if (CheckAndClearMethods.isMobile() == true && x < mySticky) {
                    myLeftNavBarDiv.style.top = '-40px';
                    myLeftNavBarDiv.style.right = '10px';
                    cardBtn.style.width = '43px';
                    myLoginBtn.style.margin = '5px 14px 5px 0px';
                    myLoginBtn.style.width = '70px';
                    myLeftSide.style.margin = '0px 10px 10px -10px';
                    myTitle.style.backgroundSize = '100% 100%';
                    myNavTitle.style.width = '120%';
                } else {
                    header.style.top = '0';
                    header.style.width = '100%';
                    myLeftNavBarDiv.style.top = '-5px';
                }
            };
        },

        hideFixedHeader: function hideFixedHeader() {
            window.onscroll = null;
            var header = document.getElementById("headContainer");
            var myLeftNavBarDiv = document.getElementById("mySpan");
            header.classList.remove("sticky");
            myLeftNavBarDiv.style.top = '40px';
            myLeftNavBarDiv.style.right = '170px';
            myLeftNavBarDiv.style.position = 'absolute';
        },

        openLeftSideNav: function openNav() {
            document.getElementById("mySidenav").style.width = "250px";
        },

        closeLeftSideNav: function closeNav() {
            document.getElementById("mySidenav").style.width = "0";
        },

        leftSideNavNameInvisible: function leftSideNavNameInvisible() {
            var x = document.querySelector('#leftSideNavName');
            x.style.color = 'transparent';
        },

        leftSideNavNameVisible: function leftSideNavNameVisible() {
            var x = document.querySelector('#leftSideNavName');
            if (CheckAndClearMethods.isMobile() == true) {
                x.style.color = 'transparent';
            } else {
                x.style.color = 'black';
            }
        },

        englishOrTurkishSelection: function englishOrTurkishSelection() {
            // var myLanguageChangeSelect = document.getElementById('languageChange')
            // myGoogleTranslate = document.getElementById('google_translate_element'),
            // myGoogleTranslateSelect = document.getElementsByClassName('goog-te-combo')
            //     ;
            // // if (navigator.onLine == false || CheckAndClearMethods.isMobile() == true) { // if browser is offline or on mobile
            var selectElem = document.getElementById('languageChange'),
                myTitle = document.getElementById('title'),
                myList = document.getElementById('liste'),
                myCards = document.getElementById('kartlar'), // card button
                myLgnBtn = document.getElementById('loginBtn'),
                mySideMenu = document.getElementById('leftSideNavName'),
                myAnnouncements = document.getElementById('announcements'),
                mytopScroolAnnouncement = document.getElementById('topScroolAnnouncement'),
                mylblColorSelect = document.getElementById('lblColorSelect'),
                mylblColorChk = document.getElementById('lblColorChk'),
                mylblLanguageChange = document.getElementById('lblLanguageChange'),
                mycolorPalette = document.querySelector('#chooseClassColor'),
                mySideMenuPopups = document.querySelectorAll('.sidenav-a'),
                mypopAboutHeaderText = document.getElementById('popAboutHeaderText'),
                mypopServicesHeaderText = document.getElementById('popServicesHeaderText'),
                mypopClientsHeaderText = document.getElementById('popClientsHeaderText'),
                mypopContactsHeaderText = document.getElementById('popContactsHeaderText'),
                mymodulLinks = document.querySelectorAll('.modulLink'),
                myModules = document.querySelectorAll('.modulBaslik'),
                mybottomScrollP4Text = document.getElementById('bottomScrollP4'),
                mystabledColors = document.getElementById('stabledColors'),
                mycardP = document.querySelectorAll('.cardP'),
                mycardLink = document.querySelectorAll('.cardLink')
            myColumns = document.querySelectorAll('.column');

            // myLanguageChangeSelect.style.display = 'flex';
            // myGoogleTranslate.style.display = 'none';
            selectElem.addEventListener('change', function() {

                    var index = selectElem.selectedIndex;
                    if (index == 1) { // turkish
                        myTitle.innerHTML = 'Hastane Bilgi Yönetim Sistemi<a id="engTitle" onclick="location.reload()"> - Primum non nocere!</a>';
                        myList.innerHTML = '<i id="listeI" class="fa fa-ellipsis-v"></i> Liste';
                        myCards.innerHTML = '<i class="fa fa-th"></i> Kart';
                        myLgnBtn.innerHTML = 'Giriş';
                        mySideMenu.innerHTML = 'Yan Menu';
                        myAnnouncements.innerHTML = 'Duyurular';
                        mytopScroolAnnouncement.innerHTML = 'Seviyorum seni ekmeği tuza bançinp yer gibi Seviyorum seni ekmeği tuza banıp yer gibi Seviyorum seni ekmeği tuza banıp yer gibi Seviyorum seni ekmeği tuza banıp yer gibi ';
                        mylblColorSelect.innerHTML = 'Renk düzenini seçiniz';
                        mycolorPalette[0].innerHTML = 'Açık renkler';
                        mycolorPalette[1].innerHTML = 'Koyu renkler';
                        mycolorPalette[2].innerHTML = 'Tüm renkler';
                        mycolorPalette[3].innerHTML = 'Gece Modu';
                        mylblColorChk.innerHTML = 'Renk sürekli değişsin';
                        mystabledColors[0].innerHTML = 'Renkli';
                        mystabledColors[1].innerHTML = 'Yeşil';
                        mystabledColors[2].innerHTML = 'Kırmızı';
                        mystabledColors[3].innerHTML = 'Mavi';
                        mylblLanguageChange.innerHTML = 'Dil seçiniz..............';
                        mySideMenuPopups[0].innerHTML = 'Hakkımızda';
                        mySideMenuPopups[1].innerHTML = 'Servislerimiz';
                        mySideMenuPopups[2].innerHTML = 'Müşterilerimiz';
                        mySideMenuPopups[3].innerHTML = 'İletişim';
                        mypopAboutHeaderText.innerHTML = 'Hakkımızda';
                        mypopServicesHeaderText.innerHTML = 'Servislerimiz';
                        mypopClientsHeaderText.innerHTML = 'Müşterilerimiz';
                        mypopContactsHeaderText.innerHTML = 'İletişim';
                        for (let myi = 0; myi < mymodulLinks.length; myi++) {
                            mymodulLinks[myi].innerHTML = 'Modul için tıklayınız';
                        }

                        // module names

                        myModules[0].innerHTML = 'Hasta Kimlik Kayit Modulu';
                        myModules[1].innerHTML = 'Poliklinik Muayene Kayit Modulu';
                        myModules[2].innerHTML = 'Randevu Kayit Modulu';
                        myModules[3].innerHTML = 'Randevu Sorgulama Modulu';
                        myModules[4].innerHTML = 'Poliklinik Defteri ';
                        myModules[5].innerHTML = 'Diyet Modulu';
                        myModules[6].innerHTML = 'Duyuru Modulu';
                        myModules[7].innerHTML = 'Servis Modulu';
                        myModules[8].innerHTML = 'Laboratuar Modulu';
                        myModules[9].innerHTML = 'Radyoloji ve Görüntüleme Modulu';

                        // end of module names

                        // tooltip titles

                        myColumns[0].title = 'Bu modül hastanın Kimlik bilgilerinin girildiği yerdir.'
                        myColumns[1].title = 'Kimlik, muayene bilgilerinin alınarak gerektiğinde tetkik işlenmesi ve muayene kayıtlarının oluşturulması ve hastanın tek bir protokol numarası ile sistemde takibini amaçlar.'
                        myColumns[2].title = 'Bu modülün amacı hastaların muayene ve hastaneye gelişlerini randevu sistemi ile takip edebilmektir.'
                        myColumns[3].title = 'Bu modülün amacı hastaların randevularini takip edebilmektir.'
                        myColumns[4].title = 'Bu modül hasta muayene bilgilerinin kullanicilar tarafından programa girilmesini amaçlar.'
                        myColumns[5].title = 'Bu modül hasta diyet bilgilerinin kullanicilar tarafından programa girilmesini amaçlar.'
                        myColumns[6].title = 'Bu modül duyuru olusturulmasini ve sistemde yayinlanmasini amaçlar.'
                        myColumns[7].title = 'Bu modül, yatan hastaların sisteme kaydı, takibi ve taburcu işlemlerinin yapılmasını amaçlar.'
                        myColumns[8].title = 'Bu modül, Yatarak ve Ayaktan tedavi olan hastalara yapılacak laboratuvar tetkiklerinin takibi, onay, barkod, sonuç yazdırma, rapor ve istatistik işlemlerinin yapılmasını amaçlar.'
                        myColumns[9].title = 'Bu modül, Yatarak ve Ayaktan tedavi olan hastalara yapılacak radyoloji ve görüntüleme tetkiklerinin takibi, onay, barkod, sonuç yazdırma, rapor ve istatistik işlemlerinin yapılmasını amaçlar.'

                        //end of tooltip titles

                        // cards back side explanations
                        mycardP[0].innerHTML = 'Hastalarinizin kimlik bilgilerini bu modul uzerinden girip takip edebilirsiniz.';

                        // end of cards back side explanations

                        // cards link
                        for (let index = 0; index < mycardLink.length; index++) {
                            mycardLink[index].innerHTML = 'Modul için tıklayınız';
                        }
                        // end of cards link

                        mybottomScrollP4Text.innerHTML =
                            "Hastaneniz hakkında haberler burada görünür...... --- Bu bir mobil cihaz değil.";
                    } else { // for english
                        myTitle.innerHTML = 'Hospital Medical Record System<a id="engTitle" onclick="location.reload()"> (Hastane Bilgi Yönetim Sistemi)</a>';
                        myList.innerHTML = '<i id="listeI" class="fa fa-ellipsis-v"></i> List';
                        myCards.innerHTML = '<i class="fa fa-th"></i> Cards';
                        myLgnBtn.innerHTML = 'Login';
                        mySideMenu.innerHTML = 'Side Menu';
                        myAnnouncements.innerHTML = 'Announcements';
                        mytopScroolAnnouncement.innerHTML = '<!-- lorem ipsum --> !!! This is a test announcement !!! <br> __________________________________________ <br> <br>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Integer vel purus finibus, facilisis lectus id, lacinia felis.Etiam et turpis accumsan, dapibus metus rhoncus, scelerisque lacus.Donec sit amet tortor ut orci commodo aliquet eu vitae ligula.Etiam et orci ut ante scelerisque molestie nec nec ligula.Fusce pellentesque lectus sit amet molestie blandit.Ut egestas diam quis velit dapibus iaculis.Nullam id dolor et elit feugiat vehicula eu sed diam. <br>Praesent a nisi et tellus rutrum congue.Pellentesque elementum eros non diam tempus, ut lacinia metus cursus.Nullam eget purus quis enim consequat lacinia.Nulla sit amet sem fringilla, suscipit lacus eget, accumsan tortor.Nulla gravida velit consectetur, consectetur lectus sit amet, lobortis eros.Fusce aliquam ligula eget congue fringilla.Donec accumsan purus ac nunc rutrum, quis cursus neque hendrerit.Nam ut neque nec metus pretium tempor et sit amet lorem.Pellentesque vulputate purus non metus accumsan tempor.Proin ac ipsum viverra, tristique est eu, rhoncus arcu.Praesent congue est sit amet lorem eleifend, ut aliquet velit fringilla.';
                        mylblColorSelect.innerHTML = 'Choose a color palette';
                        mycolorPalette[0].innerHTML = 'Light colors';
                        mycolorPalette[1].innerHTML = 'Dark colors';
                        mycolorPalette[2].innerHTML = 'All colors';
                        mycolorPalette[3].innerHTML = 'Night Mode';
                        mylblColorChk.innerHTML = 'Change color everytime';
                        mystabledColors[0].innerHTML = 'Colorful';
                        mystabledColors[1].innerHTML = 'Green';
                        mystabledColors[2].innerHTML = 'Red';
                        mystabledColors[3].innerHTML = 'Blue';
                        mylblLanguageChange.innerHTML = 'Choose language';
                        mySideMenuPopups[0].innerHTML = 'About us';
                        mySideMenuPopups[1].innerHTML = 'Services';
                        mySideMenuPopups[2].innerHTML = 'Clients';
                        mySideMenuPopups[3].innerHTML = 'Contacts';
                        mypopAboutHeaderText.innerHTML = 'About us';
                        mypopServicesHeaderText.innerHTML = 'Services';
                        mypopClientsHeaderText.innerHTML = 'Clients';
                        mypopContactsHeaderText.innerHTML = 'Contacts';
                        for (let myi = 0; myi < mymodulLinks.length; myi++) {
                            mymodulLinks[myi].innerHTML = 'Click For Module';
                        }

                        // module names

                        myModules[0].innerHTML = 'Patient Info Module';
                        myModules[1].innerHTML = 'Polyclinic Examination Registration Module';
                        myModules[2].innerHTML = 'Appointment Registration Module';
                        myModules[3].innerHTML = 'Appointment Search Module';
                        myModules[4].innerHTML = 'Polyclinic Module';
                        myModules[5].innerHTML = 'Diet Module';
                        myModules[6].innerHTML = 'Announcement Module';
                        myModules[7].innerHTML = 'Inpatient Module';
                        myModules[8].innerHTML = 'Laboratory Module';
                        myModules[9].innerHTML = 'Imagine and Radiology Module';

                        // end of module names

                        // tooltip titles

                        myColumns[0].title = 'Manage all your Inpatients and Outpatients. Patients are quickly accessible by typing parts of their name.'
                        myColumns[1].title = 'This module is the first place where the patient’s information is entered. Identity aims to obtain the information of the examination, to process the examination when necessary and to establish the records of the examination and to follow up the patient with a single protocol number.'
                        myColumns[2].title = 'With this module, it provides the required date and doctor appointment registration by taking necessary information from the patient.'
                        myColumns[3].title = 'Keep track of your appointments. With Checkins, always know which patients are in the Waiting Room and how late they are.Bu modülün amacı hastaların randevularini takip edebilmektir.'
                        myColumns[4].title = 'This module aims to enter patient examination information into the program by doctors.'
                        myColumns[5].title = 'This module aims to enter patient diet information into the program by doctors.'
                        myColumns[6].title = 'Make your own announcemenets and updates for users.'
                        myColumns[7].title = 'Registration, follow-up and discharge of the patients to whom the doctor gives admission.'
                        myColumns[8].title = 'This module aims to follow up laboratory tests, approval, barcodes, print results, reports and statistics of inpatients and outpatients.'
                        myColumns[9].title = 'This module aims to follow up radiology and x-ray tests, approval, barcodes, print results, reports and statistics of inpatients and outpatients.'

                        // end of tooltip titles

                        // cards back side explanations

                        mycardP[0].innerHTML = 'Manage all your Inpatients and Outpatients. Patients are quickly accessible by typing parts of their name.';

                        // end of cards back side explanations

                        // cards link
                        for (let index = 0; index < mycardLink.length; index++) {
                            mycardLink[index].innerHTML = 'Click For Module';
                        }
                        // end of cards link

                        mybottomScrollP4Text.innerHTML = "News about your hospital --- it's not a mobile device.";
                    }
                })
                // }
                // else {// if browser is online or on desktop show google translate
                //     myLanguageChangeSelect.style.display = 'none';
                //     myGoogleTranslate.style.display = 'flex';
                //     myGoogleTranslateSelect[0].style.width = '210px';
                // }
        },

        generalSuccesAlert: function generalSuccesAlert(myContent) {
            document.styleSheets[8].addRule('.generalSuccess:before', 'content: "' + myContent + '";');
            ShowOrHideMethods.generalShowSuccesAlert();
        },

        generalFailureAlert: function generalFailureAlert(myContent) {
            document.styleSheets[8].addRule('.generalFailure:before', 'content: "' + myContent + '";');
            ShowOrHideMethods.generalShowFailureAlert();
        },

        generalShowSuccesAlert: function generalShowSuccesAlert() {
            var myNotify = document.querySelectorAll('.generalNotify'),
                myNotifyType = document.querySelector('#generalNotifyType');

            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("generalActive");
                myNotify[i].style.backgroundColor = '#60b9a0';
            }
            myNotifyType.classList.toggle("generalSuccess");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("generalActive");
                }
                myNotifyType.classList.remove("generalSuccess");
            }, 3000);
        },

        generalShowFailureAlert: function generalShowFailureAlert() {
            var myNotify = document.querySelectorAll('.generalNotify'),
                myNotifyType = document.querySelector('#generalNotifyType');
            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("generalActive");
                myNotify[i].style.backgroundColor = 'red';
            }
            myNotifyType.classList.toggle("generalFailure");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("generalActive");
                }
                myNotifyType.classList.remove("generalFailure");
            }, 3000);
        },

        showSuccesAlert: function showSuccesAlert() {
            var myNotify = document.querySelectorAll('.notify'),
                myNotifyType = document.querySelector('#notifyType');

            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("active");
                myNotify[i].style.backgroundColor = '#60b9a0';
            }
            myNotifyType.classList.toggle("success");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("active");
                }
                myNotifyType.classList.remove("success");
            }, 3000);
        },

        showRemoveAlert: function showRemoveAlert() {
            var myNotify = document.querySelectorAll('.notify'),
                myNotifyType = document.querySelector('#notifyType');
            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("active");
                myNotify[i].style.backgroundColor = 'red';
            }
            myNotifyType.classList.toggle("failure");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("active");
                }
                myNotifyType.classList.remove("failure");
            }, 3000);
        },

        showBackTotopButton: function showBackTotopButton() {
            window.addEventListener('scroll', ShowOrHideMethods.showBackTotopButton, true);
            var mybutton = document.getElementById("goTotop");
            if (CheckAndClearMethods.isMobile() == true) {
                if (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5) {
                    mybutton.style.display = "block";
                    mybutton.style.bottom = "40px";
                    mybutton.style.right = "60px";
                } else {
                    mybutton.style.display = "none";
                }
            } else {
                if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                    mybutton.style.display = "block";
                    mybutton.style.animation = "scaleUp 0.6s";
                    mybutton.style.webkitAnimation = "scaleUp 0.6s";
                } else {
                    mybutton.style.animation = "scaleDown 0.6s";
                    setTimeout(function() {
                        $(mybutton).css('display', 'none');
                    }, 200);
                }
            }
        },

        backtoTopFunction: function backtoTopFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        },

        polyclinicShowSuccesAlert: function polyclinicShowSuccesAlert() {
            var myNotify = document.querySelectorAll('.polyclinicNotify'),
                myNotifyType = document.querySelector('#polyclinicNotifyType');

            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("polyclinicActive");
                myNotify[i].style.backgroundColor = '#60b9a0';
            }
            myNotifyType.classList.toggle("polyclinicSuccess");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("polyclinicActive");
                }
                myNotifyType.classList.remove("polyclinicSuccess");
            }, 3000);
        },

        polyclinicShowRemoveAlert: function polyclinicShowRemoveAlert() {
            var myNotify = document.querySelectorAll('.polyclinicNotify'),
                myNotifyType = document.querySelector('#polyclinicNotifyType');
            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("polyclinicActive");
                myNotify[i].style.backgroundColor = 'red';
            }
            myNotifyType.classList.toggle("polyclinicFailure");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("polyclinicActive");
                }
                myNotifyType.classList.remove("polyclinicFailure");
            }, 3000);
        },

        polyclinicExamShowSuccesAlert: function polyclinicExamShowSuccesAlert() {
            var myNotify = document.querySelectorAll('.polyclinicExamNotify'),
                myNotifyType = document.querySelector('#polyclinicExamNotifyType');

            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("polyclinicExamActive");
                myNotify[i].style.backgroundColor = '#60b9a0';
            }
            myNotifyType.classList.toggle("polyclinicExamSuccess");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("polyclinicExamActive");
                }
                myNotifyType.classList.remove("polyclinicExamSuccess");
            }, 3000);
        },

        polyclinicExamShowRemoveAlert: function polyclinicExamShowRemoveAlert() {
            var myNotify = document.querySelectorAll('.polyclinicExamNotify'),
                myNotifyType = document.querySelector('#polyclinicExamNotifyType');
            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("polyclinicExamActive");
                myNotify[i].style.backgroundColor = 'red';
            }
            myNotifyType.classList.toggle("polyclinicExamFailure");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("polyclinicExamActive");
                }
                myNotifyType.classList.remove("polyclinicExamFailure");
            }, 3000);
        },

        hastaKimlikShowSuccesAlert: function hastaKimlikShowSuccesAlert() {
            var myNotify = document.querySelectorAll('.hastaKimlikNotify'),
                myNotifyType = document.querySelector('#hastaKimlikNotifyType');

            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("hastaKimlikActive");
                myNotify[i].style.backgroundColor = '#60b9a0';
            }
            myNotifyType.classList.toggle("hastaKimlikSuccess");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("hastaKimlikActive");
                }
                myNotifyType.classList.remove("hastaKimlikSuccess");
            }, 3000);
        },

        hastaKimlikShowRemoveAlert: function hastaKimlikShowRemoveAlert() {
            var myNotify = document.querySelectorAll('.hastaKimlikNotify'),
                myNotifyType = document.querySelector('#hastaKimlikNotifyType');
            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("hastaKimlikActive");
                myNotify[i].style.backgroundColor = 'red';
            }
            myNotifyType.classList.toggle("hastaKimlikFailure");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("hastaKimlikActive");
                }
                myNotifyType.classList.remove("hastaKimlikFailure");
            }, 3000);
        },

        appointmentRegShowSuccesAlert: function appointmentRegShowSuccesAlert() {
            var myNotify = document.querySelectorAll('.appointmentRegNotify'),
                myNotifyType = document.querySelector('#appointmentRegNotifyType');

            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("appointmentRegActive");
                myNotify[i].style.backgroundColor = '#60b9a0';
            }
            myNotifyType.classList.toggle("appointmentRegSuccess");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("appointmentRegActive");
                }
                myNotifyType.classList.remove("appointmentRegSuccess");
            }, 3000);
        },

        appointmentRegShowRemoveAlert: function appointmentRegShowRemoveAlert() {
            var myNotify = document.querySelectorAll('.appointmentRegNotify'),
                myNotifyType = document.querySelector('#appointmentRegNotifyType');
            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("appointmentRegActive");
                myNotify[i].style.backgroundColor = 'red';
            }
            myNotifyType.classList.toggle("appointmentRegFailure");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("appointmentRegActive");
                }
                myNotifyType.classList.remove("appointmentRegFailure");
            }, 3000);
        },

        appointmentSearchShowSuccesAlert: function appointmentSearchShowSuccesAlert() {
            var myNotify = document.querySelectorAll('.appointmentSearchNotify'),
                myNotifyType = document.querySelector('#appointmentSearchNotifyType');

            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("appointmentSearchActive");
                myNotify[i].style.backgroundColor = '#60b9a0';
            }
            myNotifyType.classList.toggle("appointmentSearchSuccess");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("appointmentSearchActive");
                }
                myNotifyType.classList.remove("appointmentSearchSuccess");
            }, 3000);
        },

        appointmentSearchShowRemoveAlert: function appointmentSearchShowRemoveAlert() {
            var myNotify = document.querySelectorAll('.appointmentSearchNotify'),
                myNotifyType = document.querySelector('#appointmentSearchNotifyType');
            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("appointmentSearchActive");
                myNotify[i].style.backgroundColor = 'red';
            }
            myNotifyType.classList.toggle("appointmentSearchFailure");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("appointmentSearchActive");
                }
                myNotifyType.classList.remove("appointmentSearchFailure");
            }, 3000);
        },

        inpatientShowSuccesAlert: function inpatientShowSuccesAlert() {
            var myNotify = document.querySelectorAll('.inpatientNotify'),
                myNotifyType = document.querySelector('#inpatientNotifyType');

            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("inpatientActive");
                myNotify[i].style.backgroundColor = '#60b9a0';
            }
            myNotifyType.classList.toggle("inpatientSuccess");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("inpatientActive");
                }
                myNotifyType.classList.remove("inpatientSuccess");
            }, 3000);
        },

        inpatientShowRemoveAlert: function inpatientShowRemoveAlert() {
            var myNotify = document.querySelectorAll('.inpatientNotify'),
                myNotifyType = document.querySelector('#inpatientNotifyType');
            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("inpatientActive");
                myNotify[i].style.backgroundColor = 'red';
            }
            myNotifyType.classList.toggle("inpatientFailure");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("inpatientActive");
                }
                myNotifyType.classList.remove("inpatientFailure");
            }, 3000);
        },

        laboratoryShowSuccesAlert: function laboratoryShowSuccesAlert() {
            var myNotify = document.querySelectorAll('.laboratoryNotify'),
                myNotifyType = document.querySelector('#laboratoryNotifyType');

            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("laboratoryActive");
                myNotify[i].style.backgroundColor = '#60b9a0';
            }
            myNotifyType.classList.toggle("laboratorySuccess");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("laboratoryActive");
                }
                myNotifyType.classList.remove("laboratorySuccess");
            }, 3000);
        },

        laboratoryShowRemoveAlert: function laboratoryShowRemoveAlert() {
            var myNotify = document.querySelectorAll('.laboratoryNotify'),
                myNotifyType = document.querySelector('#laboratoryNotifyType');
            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("laboratoryActive");
                myNotify[i].style.backgroundColor = 'red';
            }
            myNotifyType.classList.toggle("laboratoryFailure");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("laboratoryActive");
                }
                myNotifyType.classList.remove("laboratoryFailure");
            }, 3000);
        },

        announcementShowSuccesAlert: function announcementShowSuccesAlert() {
            var myNotify = document.querySelectorAll('.announcementNotify'),
                myNotifyType = document.querySelector('#announcementNotifyType');

            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("announcementActive");
                myNotify[i].style.backgroundColor = '#60b9a0';
            }
            myNotifyType.classList.toggle("announcementSuccess");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("announcementActive");
                }
                myNotifyType.classList.remove("announcementSuccess");
            }, 3000);
        },

        announcementShowRemoveAlert: function announcementShowRemoveAlert() {
            var myNotify = document.querySelectorAll('.announcementNotify'),
                myNotifyType = document.querySelector('#announcementNotifyType');
            for (let i = 0; i < myNotify.length; i++) {
                myNotify[i].classList.toggle("announcementActive");
                myNotify[i].style.backgroundColor = 'red';
            }
            myNotifyType.classList.toggle("announcementFailure");

            setTimeout(function() {
                for (let i2 = 0; i2 < myNotify.length; i2++) {
                    myNotify[i2].classList.remove("announcementActive");
                }
                myNotifyType.classList.remove("announcementFailure");
            }, 3000);
        },

        openInNewTabAndAdjust: function openInNewTabAndAdjust(pageId) {
            var win = window.open('/public/htmls/' + pageId + '.html');

            win.addEventListener('load', function() {
                win.document.body.style.background = 'linear-gradient(90deg,' +
                    ColorAndAdjustmentMethods.randomDarkColor() +
                    ',' + ColorAndAdjustmentMethods.getSoftColor() + ')';
                win.document.body.style.margin = "0px";
            });
        },

        openInNewTabAndAdjustForViews: function openInNewTabAndAdjustForViews(pageBodyId) {
            var win = document.getElementById(pageBodyId);

            win.style.background = 'linear-gradient(90deg,' +
                ColorAndAdjustmentMethods.randomDarkColor() +
                ',' + ColorAndAdjustmentMethods.getSoftColor() + ')';
            win.style.margin = "0px";
        },

        adjustHtmlsBackground: function adjustHtmlsBackground(pageBodyId) {
            var win = document.getElementById(pageBodyId);

            win.style.background = 'linear-gradient(90deg,' +
                ColorAndAdjustmentMethods.randomDarkColor() +
                ',' + ColorAndAdjustmentMethods.getSoftColor() + ')';
            win.style.margin = "0px";
        },

        myStickHeader: function myStickHeader(subHeadDivId) {
            window.onscroll = function() { stickHeader() };
            var path = window.location.pathname,
                page = path.split("/").pop();

            function stickHeader() {
                var header = document.getElementById(subHeadDivId),
                    sticky = header.offsetTop;
                if (window.pageYOffset > sticky) {
                    header.classList.add("myNewSticky");
                } else {
                    header.classList.remove("myNewSticky");
                }

                if (page == 'index.html') {
                    var classColorIndex = document.getElementById('chooseClassColor').selectedIndex,
                        stickyHeader = document.getElementById('nav-wrapper');
                    if (classColorIndex == '3') {
                        if (stickyHeader.classList.contains('myNewSticky')) {
                            stickyHeader.style.backgroundColor = 'grey';
                        }
                    } else {
                        stickyHeader.style.backgroundColor = 'white';
                    }
                }
            }
        },

        hideMyStickHeader: function hideMyStickHeader(subHeadDivId) {
            window.onscroll = null;
            var header = document.getElementById(subHeadDivId);
            if (header.classList.contains("myNewSticky")) {
                header.classList.remove("myNewSticky");
            }
        },

        socialMediaNewTab: function socialMediaNewTab(btnId) {
            document.getElementById(btnId).addEventListener("click", redirectFunction(btnId));

            function redirectFunction(par) {
                switch (par) {
                    case 'facebookBtn':
                        window.open("https://facebook.yourhospital.com");
                        break;

                    case 'twitterBtn':
                        window.open("https://twitter.yourhospital.com");
                        break;

                    case 'googlePlusBtn':
                        window.open("https://googleplus.yourhospital.com");
                        break;

                    case 'linkedinBtn':
                        window.open("https://www.linkedin.com/in/recep-celik-poland/?locale=en_US");
                        break;

                    default:
                        break;
                }
            }
        },

        showPassword: function showPassword(passInputId, showPasswordIcon) {
            var passwordInput = document.getElementById(passInputId),
                myShowPasswordIcon = document.getElementById(showPasswordIcon);
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                myShowPasswordIcon.title = 'Hide password!';
                myShowPasswordIcon.classList.remove('fa', 'fa-eye');
                myShowPasswordIcon.classList.add('fa', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                myShowPasswordIcon.title = 'Show password!';
                myShowPasswordIcon.classList.remove('fa', 'fa-eye-slash');
                myShowPasswordIcon.classList.add('fa', 'fa-eye');
            }
        },

        showCapsLockOnWarning: function showCapsLockOnWarning(warningTextId, event) {
            var warningText = document.getElementById(warningTextId);

            if (event.getModifierState("CapsLock")) {
                warningText.style.display = "block";
                warningText.innerHTML = "WARNING! Caps lock is ON.";
            } else {
                warningText.style.display = "none"
            }
        },

        showPopUpModal: function showPopUpModal(modalId) {
            var modal = document.getElementById(modalId);
            modal.style.display = 'block';
        }
    },

    TabProcess = {

        openTab: function openTab(tabName) { // Hide all elements with class="containerTab", except for the one that matches the clickable grid column
            var i, x;

            x = document.querySelectorAll(".containerTab");
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            document.getElementById(tabName).style.display = "block";

            // change closebutton top coordinate in style.css

            if (tabName == "b1") {
                ColorAndAdjustmentMethods.closeBtnStyleTopchange("myCloseBtnB1", "540px");
            } else if (tabName == "b2") {
                ColorAndAdjustmentMethods.closeBtnStyleTopchange("myCloseBtnB2", "540px");
            } else if (tabName == "b3") {
                ColorAndAdjustmentMethods.closeBtnStyleTopchange("myCloseBtnB3", "690px");
            } else if (tabName == "b4") {
                ColorAndAdjustmentMethods.closeBtnStyleTopchange("myCloseBtnB4", "690px");
            } else if (tabName == "b5") {
                ColorAndAdjustmentMethods.closeBtnStyleTopchange("myCloseBtnB5", "700px");
            } else if (tabName == "b6") {
                ColorAndAdjustmentMethods.closeBtnStyleTopchange("myCloseBtnB6", "690px");
            }

        },

        closeContainerTab: function closeContainerTab(tabId) {
            var x = document.getElementById(tabId);
            x.style.display = 'none';
        }

    },

    jQueryMethods = {
        toastrOptions: function toastrOptions() {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": true,
                "progressBar": true,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
        },

        toastrOptionsFulWidth: function toastrOptionsFulWidth() {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": true,
                "progressBar": true,
                "positionClass": "toast-bottom-full-width",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
        },

        toolTipFunction: function toolTipFunction() {

            $(function() {
                $(document).tooltip({
                    show: {
                        effect: "slideDown",
                        delay: 250,
                        track: true
                    }
                });

                $(document).tooltip({
                    position: {
                        my: "center bottom-20",
                        at: "center top",
                        using: function(position, feedback) {
                            $(this).css(position);
                            $("<div>")
                                .addClass("arrow")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                        }
                    }
                });
                // $(document).tooltip({
                //     hide: {
                //         effect: "slideDown",
                //         delay: 250
                //     }
                // });
            })
        },

        getPatientPhotoAndInfos: function getPatientPhotoAndInfos(hastaRowId) {
            var patientNameSurname = $.cookie('patientNameSurname'),
                patientPersonalIdNumber = $.cookie('patientPersonalIdNumber'),
                patientGender = $.cookie('patientGender'),
                patientAge = $.cookie('patientAge'),
                patientBirthPlace = $.cookie('patientBirthPlace'),
                patientPhotoSrc = $.cookie('patientPhotoSrc');

            $(function() {
                s = '<table style="border-style:hidden;width:200px;box-shadow:0px 0px 15px 3px white;">';
                s += '<tr style="border-style:ridge;border:5px solid #761c54;"><img src="' + patientPhotoSrc + '" style="width:200px; height:200px;align-items:center;"/> </td><td valign="top">' + patientNameSurname + '</td></tr>';
                s += '<td class="Text">' + patientGender + ' - ' + patientAge + ' <br/>' + patientBirthPlace + ' <br/>' + patientPersonalIdNumber + '</td>';
                s += '</table>';
                $('#' + hastaRowId + '').tooltip({
                    content: s,
                    position: {
                        my: "center top",
                        at: "center bottom-5",
                    },
                    show: {
                        effect: "slideDown",
                        delay: 250,
                        track: true
                    }
                });
            });
        },

        getJqueryDatePicker: function myGetJqueryDatePicker() {
            $(function getJqueryDatePicker() {
                $("#examDate,#clinicDate,#konsDate,#patientBirthDate,#appointmentDate,#randevuTarihi,#randevuTarihi2,#laboratoryDate,#announcementStartDate,#imagingRadiologyDate,#polyclinicExamStatisticsStartDate,#polyclinicExamStatisticsEndDate,#doctorExamStatisticsStartDate,#doctorExamStatisticsEndDate,#staffLeaveStartDate,#staffLeaveEndDate,#patientBirthDate,#announcementEndDate").datepicker({ dateFormat: 'dd-mm-yy' });
            });
        },

        setCalenderValueToday: function setCalenderValueToday(calenderInputId) {
            var date = new Date(),
                day = date.getDate(),
                month = date.getMonth() + 1,
                year = date.getFullYear();

            if (month < 10) month = "0" + month;
            if (day < 10) day = "0" + day;
            var today = day + "-" + month + "-" + year;

            document.getElementById(calenderInputId).value = today;
        },

        setCalenderHour: function setCalenderHour(hourId) {
            new Picker(document.querySelector('#' + hourId + ''), {
                format: 'HH:mm',
                headers: true,
                text: {
                    title: 'Pick a time',
                },
            });
        },

        initializeTabs: function initializeTabs(tabId) {
            // $(function () {
            //     $('#' + tabId + '').tabs();
            // });

            var tabs = $('#' + tabId + '').tabs();
            tabs.find(".ui-tabs-nav").sortable({
                axis: "x",
                stop: function() {
                    tabs.tabs("refresh");
                }
            });
        },

        bottomUserMenuDrag: function bottomUserMenuDrag() {
            $(".bottomUserMenu").draggable();
        }
    };




// window.addEventListener('click', ShowOrHideMethods.closeLeftSideNav, true);

// for google translate

// function googleTranslateElementInit() {
//     new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
// }

// end of for google translat