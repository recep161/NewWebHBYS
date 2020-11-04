<!DOCTYPE html>
<html lang="tr">


<head>
    <meta charset='UTF-8'>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <title>Web HBYS Homepage</title>
    <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src=" https://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript"
        src=" https://cdn.datatables.net/buttons/1.2.4/js/dataTables.buttons.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"></script>
    <script type="text/javascript" src="https://cdn.rawgit.com/bpampuch/pdfmake/0.1.24/build/pdfmake.min.js"></script>
    <script type="text/javascript" src="https://cdn.rawgit.com/bpampuch/pdfmake/0.1.24/build/vfs_fonts.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/buttons/1.2.4/js/buttons.html5.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/buttons/1.2.1/js/buttons.print.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Satisfy">
    <link rel="stylesheet" media="all"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <!-- <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Satisfy">
    <link rel="stylesheet" media="all"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"> -->
    <link id="all-pages-style" rel="stylesheet" href="/public/css/all-pages-style.css">
    <link rel="shortcut icon" href="/public/images/Insomnia.ico">
</head>

<body onload="
            ShowOrHideMethods.myStickHeader('nav-wrapper');
            ShowOrHideMethods.englishOrTurkishSelection();
            ListingMethods.Listview();
            ColorAndAdjustmentMethods.classColor();
            ColorAndAdjustmentMethods.nightModeBySysTime();
            // LoginProcess.showUpLogin();
            myClockMethods.myClock();
            LoginProcess.closeLoginByClickOut();
            ShowOrHideMethods.showBackTotopButton();
            ColorAndAdjustmentMethods.stabledColorsChange();
            jQueryMethods.toolTipFunction();
            // ShowOrHideMethods.showFixedHeaderAfterScrool();
            // ColorAndAdjustmentMethods.scaleForMobile();">


    <div id="headContainer" class="headContainer">
        <!-- for notifications -->
        <div class="notify" id="notify">
            <span id="notifyType" class=""></span>
        </div>

        <div class="generalNotify" id="generalNotify">
            <span id="generalNotifyType" class=""></span>
        </div>

        <!-- end of  notifications -->

        <div id="nav-wrapper" class="nav-wrapper">
            <div class="left-side" id="left-side" title="Click for Refresh the page!">
                <div class="nav-title" id="nav-title">
                    <h1 id="title" class="pageTitle" onclick="location.reload()">
                        Hospital Medical Record System<a id="engTitle" onclick="location.reload()">
                            - Primum non nocere!
                        </a>
                    </h1>

                    <hUserName style="color: black; margin: 10px 0px 20px 30px;font-size: large;">
                        Hosgeldiniz <%=username%> !
                    </hUserName>
                </div>
            </div>
            <div class="right-side">
                <button id="liste" class="btn" onclick="ListingMethods.Listview(),
                    ColorAndAdjustmentMethods.classColor()" title="List view for modules!">
                    <i id="listeI" class="fa fa-ellipsis-v"></i> List
                </button>

                <button id="kartlar" class="btn" onclick="ShowOrHideMethods.HideColumn('column');
                    ShowOrHideMethods.unHideColumn('card-container');
                    ShowOrHideMethods.unHideColumn('card-container2');
                    ShowOrHideMethods.unHideColumn('card-container3');
                    ShowOrHideMethods.unHideColumn('card');
                    CardAnimationAndAdjustmentMethods.cardColor();
                    CardAnimationAndAdjustmentMethods.leftAndRightSlide();" title="Card view for modules!">
                    <i class="fa fa-th"></i> Cards
                </button>

                <button id="grid" class="btn" onclick="ListingMethods.GridView(),ShowOrHideMethods.HideColumn('card'),
                    ColorAndAdjustmentMethods.classColor();" title="Grid view for modules">
                    <i class="fa fa-th-large"></i> Grid
                </button> <br>

                <div id="login-line" class="login-line">
                    <button id="loginBtn" class="loginBtn" title="Login for your modules!" onclick="LoginProcess.showUpLogin(),
                        CardAnimationAndAdjustmentMethods.cardColor(),
                        ColorAndAdjustmentMethods.classColor(),
                        myClockMethods.myClock();">Login</button>

                    <div id="mySpan" class="con" onclick="ShowOrHideMethods.openLeftSideNav();"
                        ondblclick="ShowOrHideMethods.closeLeftSideNav()"
                        onmouseover="ShowOrHideMethods.leftSideNavNameInvisible()"
                        onmouseout="ShowOrHideMethods.leftSideNavNameVisible();" title="Click for side menu!">
                        <div class="leftSideNavName" id="leftSideNavName">Side menu</div>
                        <div id="arrow-top-r" class="bar arrow-top-r"></div>
                        <div id="arrow-middle-r" class="bar arrow-middle-r"></div>
                        <div id="arrow-bottom-r" class="bar arrow-bottom-r"></div>
                    </div>
                </div>
                <br><br><br>
            </div>
        </div>

    </div>
    <br>
    <div id="subContainer" class="subContainer">
        <div id="subWrapper" class="subWrapper">
            <div id="subLeftSide" class="subLeftSide">
                <h3 id="announcements" style="color: black;border-bottom:solid 0.5px;">Announcements
                    <span class="badge badge-pill badge-danger">4 - New</span></h3>
                <div id="topScroolP" class="topScroolP">
                    <p id="topScroolAnnouncement">
                        <!-- lorem ipsum -->
                        !!! This is a test announcement !!! <br>
                        __________________________________________ <br>
                        <br>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Integer vel purus finibus, facilisis lectus id, lacinia felis.
                        Etiam et turpis accumsan, dapibus metus rhoncus, scelerisque lacus.
                        Donec sit amet tortor ut orci commodo aliquet eu vitae ligula.
                        Etiam et orci ut ante scelerisque molestie nec nec ligula.
                        Fusce pellentesque lectus sit amet molestie blandit.
                        Ut egestas diam quis velit dapibus iaculis.
                        Nullam id dolor et elit feugiat vehicula eu sed diam. <br>
                        Praesent a nisi et tellus rutrum congue.
                        Pellentesque elementum eros non diam tempus, ut lacinia metus cursus.
                        Nullam eget purus quis enim consequat lacinia.
                        Nulla sit amet sem fringilla, suscipit lacus eget, accumsan tortor.
                        Nulla gravida velit consectetur, consectetur lectus sit amet, lobortis eros.
                        Fusce aliquam ligula eget congue fringilla.
                        Donec accumsan purus ac nunc rutrum, quis cursus neque hendrerit.
                        Nam ut neque nec metus pretium tempor et sit amet lorem.
                        Pellentesque vulputate purus non metus accumsan tempor.
                        Proin ac ipsum viverra, tristique est eu, rhoncus arcu.
                        Praesent congue est sit amet lorem eleifend, ut aliquet velit fringilla.
                    </p>
                </div>
            </div>
            <div id="subRightSide" class="subRightSide">
                <div id="colorAndLogo" class="marqueeClass">
                    <div>
                        <label id="lblColorSelect" for="colorSelect" style="color: black;font-size: 10px;">Choose a
                            color palette</label>
                        <select name="colorSelect" id="chooseClassColor" class="colorPalette" style="width: 109px;">
                            <option value="lightColors">Light Colors</option>
                            <option value="darkColors" selected>Dark Colors</option>
                            <option value="allColors">All Colors</option>
                            <option value="nightMode">Night Mode</option>
                        </select>
                        <br>
                        <label id="lblColorChk" for="colorChk" style="color: black;font-size: 11px;">Change color
                            everytime </label>
                        <input type="checkbox" name="colorChk" id="colorChk" checked="1"
                            onclick="return ColorAndAdjustmentMethods.colorChangeChkbox();">
                        <span>
                            <select name="stabledColors" id="stabledColors" class="stabledColors"
                                style="width: 75px; color: black; display: none;">
                                <option value="colorful" selected>Colorful</option>
                                <option value="green">Green</option>
                                <option value="red">Red</option>
                                <option value="blue">Blue</option>
                            </select>
                        </span>
                        <br>
                        <label id="lblLanguageChange" for="languageChange" style="color: black;font-size: 11px;">Change
                            Language </label>

                        <!-- <div id="google_translate_element"></div>  google translate  -->

                        <select name="languageChange" id="languageChange" class="languageChange"
                            style="color: black;width: 120px;">
                            <option value="lightColors" selected>English</option>
                            <option value="nightMode">Türkçe</option>
                        </select>
                        <img id="myLogo" src="/public/images/logo.jpg"
                            style="width: 210px;height: 200px; justify-content: center;margin-bottom: 10px;"
                            onclick="location.reload()" data-html="true" title="Click for Refresh the page!">
                    </div>
                </div>
            </div>
        </div>
        <p id="clock">Zaman</p>
        <br>
    </div>
    <br>

    <!-- fixed left sidebar menu -->
    <div>
        <div id="mySidenav" class="sidenav">
            <button id="navCloseBtn" href="javascript:void(0)" class="closebtn"
                onclick="ShowOrHideMethods.closeLeftSideNav()">&times;</button>
            <a class="sidenav-a" href="#popupAbout">About</a>
            <a class="sidenav-a" href="#popupServices">Services</a>
            <a class="sidenav-a" href="#popupClients">Clients</a>
            <a class="sidenav-a" href="#popupContacts">Contacts</a>
        </div>

    </div>
    <!-- end of fixed left sidebar menu -->

    <!-- modal popups for left nav bar -->
    <div>
        <div class="myPopups" id="popupAbout">
            <div class="popup-inner" id="popupAboutInner">
                <div class="popup_photo_black" id="popup_photo_black">
                    <img id="popup_img" src="/public/images/vertical-banner-black.png" alt="">
                </div>
                <div class="popup__text">
                    <h1 id="popAboutHeaderText" class="popHeaderText">About us</h1>
                    <p class="popDetailText">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ex velit,
                        viverra non vulputate vitae, blandit vitae nisl. Nullam fermentum orci et erat viverra bibendum.
                        Aliquam sed varius nibh, vitae mattis purus. Mauris elementum sapien non ullamcorper vulputate.
                        Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed eget
                        felis sit amet eros viverra pulvinar.</p>
                </div>
                <a class="popup__close" href="#">X</a>
            </div>
        </div>

        <div class="myPopups" id="popupServices">
            <div class="popup-inner" id="popupServicesInner">
                <div class="popup_photo_green">
                    <img id="popup_img" src="/public/images/vertical-banner-green.png" alt="">
                </div>
                <div class="popup__text">
                    <h1 id="popServicesHeaderText" class="popHeaderText">Our Services</h1>
                    <p class="popDetailText">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ex velit,
                        viverra non vulputate vitae, blandit vitae nisl. Nullam fermentum orci et erat viverra bibendum.
                        Aliquam sed varius nibh, vitae mattis purus. Mauris elementum sapien non ullamcorper vulputate.
                        Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed eget
                        felis sit amet eros viverra pulvinar.</p>
                </div>
                <a class="popup__close" href="#">X</a>
            </div>
        </div>

        <div class="myPopups" id="popupClients">
            <div class="popup-inner" id="popupClientsInner">
                <div class="popup_photo_red">
                    <img id="popup_img" src="/public/images/vertical-banner-red.png" alt="">
                </div>
                <div class="popup__text">
                    <h1 id="popClientsHeaderText" class="popHeaderText">Our Clients</h1>
                    <p class="popDetailText">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ex velit,
                        viverra non vulputate vitae, blandit vitae nisl. Nullam fermentum orci et erat viverra bibendum.
                        Aliquam sed varius nibh, vitae mattis purus. Mauris elementum sapien non ullamcorper vulputate.
                        Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed eget
                        felis sit amet eros viverra pulvinar.</p>
                </div>
                <a class="popup__close" href="#">X</a>
            </div>
        </div>

        <div class="myPopups" id="popupContacts">
            <div class="popup-inner" id="popupContactsInner">
                <div class="popup_photo_black">
                    <img id="popup_img" src="/public/images/vertical-banner-black.png" alt="">
                </div>
                <div class="popup__text">
                    <h1 id="popContactsHeaderText" class="popHeaderText">Our Contacts</h1>
                    <p class="popDetailText">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ex velit,
                        viverra non vulputate vitae, blandit vitae nisl. Nullam fermentum orci et erat viverra bibendum.
                        Aliquam sed varius nibh, vitae mattis purus. Mauris elementum sapien non ullamcorper vulputate.
                        Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed eget
                        felis sit amet eros viverra pulvinar.</p>
                </div>
                <a class="popup__close" href="#">X</a>
            </div>
        </div>
    </div>
    <!-- end of modal popups -->


    <!--------- columns --------->
    <!-- first row  -->
    <div class="row">

        <div id="hastaKimlik" class="column" style="background-color: blueviolet;"
            title="Manage all your Inpatients and Outpatients. Patients are quickly accessible by typing parts of their name.">
            <div class="columnDivider">
                <div class="modulTitleDiv">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <h2 class="modulBaslik" id="hastaKimlikBaslik">Patient Info Module</h2>
                    <p>
                        <a id="modulLink2" class="modulLink" onclick="TabProcess.openTab('b1');
                            ListingMethods.Listview();
                            ColorAndAdjustmentMethods.scrollPage();
                            ShowOrHideMethods.hideMyStickHeader('nav-wrapper');"
                            style="color: black;border-bottom: solid 0.5px;">
                            Click For Module
                        </a>
                </div>
                <div>
                    <img class="modulAvatar" src="/public/images/id-3.png" alt=""
                        onclick="TabProcess.openTab('b1');ShowOrHideMethods.hideMyStickHeader('nav-wrapper');">
                </div>
            </div>
            </p>

            <div id="b1" class="containerTab" style="display:none;background:inherit">
                <iframe src="/public/htmls/hastaKimlik.html" name="targetframe" id="iframe1" allowTransparency="true"
                    frameborder="1" onload="ColorAndAdjustmentMethods.scaleForMobile();">
                </iframe>
                <button id="myCloseBtnB1" class="closeBtn" style="right: -50px;" onclick="ListingMethods.Listview();
                    ColorAndAdjustmentMethods.classColor();
                    CheckAndClearMethods.checksBeforeExit('iframe1', 'input', 'b1');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
                    Close Module X
                </button>
                <input type="button" class="fixedCloseBtn" value="X" onclick="
                    CheckAndClearMethods.checksBeforeExit('iframe1', 'input', 'b1');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
            </div>
        </div>

        <div id="polMuayene" class="column" style="background-color: cyan;"
            title="This module is the first place where the patient’s information is entered. Identity aims to obtain the information of the examination, to process the examination when necessary and to establish the records of the examination and to follow up the patient with a single protocol number.">
            <div class="columnDivider">
                <div class="modulTitleDiv">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <h2 class="modulBaslik" id="polMuayeneBaslik">Polyclinic Examination Registration Module</h2>
                    <p>
                        <a id="modulLink2" class="modulLink" onclick="TabProcess.openTab('b2');
                                                             ListingMethods.Listview();
                                                             ColorAndAdjustmentMethods.scrollPage();
                                                             ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                            style="color: black;border-bottom: solid 0.5px;">
                            Click For Module
                        </a>
                </div>
                <div>
                    <img class="modulAvatar" src="/public/images/exam_2.png" alt="" onclick="TabProcess.openTab('b2');
                    ShowOrHideMethods.hideMyStickHeader('nav-wrapper');">
                </div>
            </div>
            </p>

            <div id="b2" class="containerTab" style="display:none;background:inherit">
                <button id="myCloseBtnB2" class="closeBtn" onclick="this.parentElement.style.display='none';
                    ListingMethods.Listview();
                    ColorAndAdjustmentMethods.classColor();
                    CheckAndClearMethods.checksBeforeExit('iframe2', 'input', 'b2');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
                    Close Module X
                </button>
                <iframe src="/public/htmls/polyclinic-examination.html" name="targetframe" id="iframe2"
                    allowTransparency="true" frameborder="1" onload="ColorAndAdjustmentMethods.scaleForMobile();">
                </iframe>
                <input type="button" class="fixedCloseBtn" value="X" onclick="
                    CheckAndClearMethods.checksBeforeExit('iframe2', 'input', 'b2');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
            </div>
        </div>

    </div>

    <!-- second row -->
    <div class="row">

        <div id="randevuKayit" class="column" style="display: '';background-color: green;"
            title="With this module, it provides the required date and doctor appointment registration by taking necessary information from the patient.">
            <div class="columnDivider">
                <div class="modulTitleDiv">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <h2 class="modulBaslik" id="randevuKayitBaslik">Appointment Registration Module</h2>
                    <p>
                        <a id="modulLink3" class="modulLink" onclick="TabProcess.openTab('b3');
                            ListingMethods.Listview();
                            ColorAndAdjustmentMethods.scrollPage();
                            ShowOrHideMethods.hideMyStickHeader('nav-wrapper');"
                            style="color: black;border-bottom: solid 0.5px;">
                            Click For Module
                        </a>
                </div>
                <div>
                    <img class="modulAvatar" src="/public/images/Medical-icons/calender.png" alt="" onclick="TabProcess.openTab('b3');
                        ShowOrHideMethods.hideMyStickHeader('nav-wrapper');">
                </div>
            </div>
            </p>

            <div id="b3" class="containerTab" style="display:none;background:inherit">
                <button id="myCloseBtnB3" class="closeBtn" style="right: -50px;" onclick="this.parentElement.style.display= 'none';
                    ListingMethods.Listview();ColorAndAdjustmentMethods.classColor();
                    CheckAndClearMethods.checksBeforeExit('iframe3', 'input', 'b3');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
                    Close Module X
                </button>
                <iframe src="/public/htmls/appointment-save.html" name="targetframe" id="iframe3"
                    allowTransparency="true" frameborder="1" onload="ColorAndAdjustmentMethods.scaleForMobile();">
                </iframe>
                <input type="button" class="fixedCloseBtn" value="X" onclick="
                    CheckAndClearMethods.checksBeforeExit('iframe3', 'input', 'b3');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
            </div>
        </div>

        <div id="randevuSorgu" class="column" style="display: '';background-color: greenyellow;"
            title="Keep track of your appointments. With Checkins, always know which patients are in the Waiting Room and how late they are.">
            <div class="columnDivider">
                <div class="modulTitleDiv">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <h2 class="modulBaslik" id="randevuAraBaslik">Appointment Search Module</h2>
                    <p>
                        <a id="modulLink4" class="modulLink" onclick="TabProcess.openTab('b4');
                            ListingMethods.Listview();
                            ColorAndAdjustmentMethods.scrollPage();
                            ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                            style="color: black;border-bottom: solid 0.5px;">
                            Click For Module
                        </a>
                </div>
                <div>
                    <img class="modulAvatar" src="/public/images/Medical-icons/Calendar-selected-day.png" alt=""
                        onclick="TabProcess.openTab('b4');
                        ShowOrHideMethods.hideMyStickHeader('nav-wrapper');">
                </div>
            </div>
            </p>

            <div id="b4" class="containerTab" style="display:none;background:inherit">
                <button id="myCloseBtnB4" class="closeBtn" onclick="this.parentElement.style.display='none';
                    ListingMethods.Listview();
                    ColorAndAdjustmentMethods.classColor();
                    CheckAndClearMethods.checksBeforeExit('iframe4', 'input', 'b4');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
                    Close Module X
                </button>
                <iframe src="/public/htmls/appointment-search.html" name="targetframe" id="iframe4"
                    allowTransparency="true" frameborder="1" onload="ColorAndAdjustmentMethods.scaleForMobile();">
                </iframe>
                <input type="button" class="fixedCloseBtn" value="X" onclick="
                    CheckAndClearMethods.checksBeforeExit('iframe4', 'input', 'b4');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
            </div>
        </div>

    </div>

    <!-- third row-->
    <div class="row">

        <div id="polDefteri" class="column" style="display: '';background-color: green;"
            title="This module aims to enter patient examination information into the program by doctors.">
            <div class="columnDivider">
                <div class="modulTitleDiv">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <h2 class="modulBaslik" id="polDefteriBaslik">Polyclinic Module</h2>
                    <p>
                        <a id="modulLink5" class="modulLink" onclick="TabProcess.openTab('b5');
                            ListingMethods.Listview();
                            ColorAndAdjustmentMethods.scrollPage();
                            ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                            style="color: black;border-bottom: solid 0.5px;">
                            Click For Module
                        </a>
                </div>
                <div>
                    <img class="modulAvatar" src="/public/images/Medical-icons/Task-Completed-256.png" alt=""
                        onclick="TabProcess.openTab('b5');ShowOrHideMethods.hideMyStickHeader('nav-wrapper');">
                </div>
            </div>
            </p>

            <div id="b5" class="containerTab" style="display:none;background:inherit">
                <button id="myCloseBtnB5" class="closeBtn" style="right: -50px;" onclick="this.parentElement.style.display='none';
                    ListingMethods.Listview();
                    ColorAndAdjustmentMethods.classColor();
                    CheckAndClearMethods.checksBeforeExit('iframe5', 'input', 'b5');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
                    Close Module X
                </button>
                <iframe class="myIframe" src="/public/htmls/polyclinic.html" name="targetframe" id="iframe5"
                    allowTransparency="true" frameborder="1" onload="ColorAndAdjustmentMethods.scaleForMobile();">
                </iframe>
                <input type="button" class="fixedCloseBtn" value="X" onclick="
                    CheckAndClearMethods.checksBeforeExit('iframe5', 'input', 'b5');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
            </div>
        </div>

        <div id="dietModulu" class="column" style="display: '';background-color: greenyellow;"
            title="This module aims to enter patient examination information into the program by doctors.">
            <div class="columnDivider">
                <div class="modulTitleDiv">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <h2 class="modulBaslik">Diet Module</h2>
                    <p>
                        <a id="modulLink6" class="modulLink" onclick="TabProcess.openTab('b6');
                            ListingMethods.Listview();
                            ColorAndAdjustmentMethods.scrollPage();
                            ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                            style="color: black;border-bottom: solid 0.5px;">
                            Click For Module
                        </a>
                </div>
                <div>
                    <img class="modulAvatar" src="/public/images/diet_3.png" alt=""
                        onclick="TabProcess.openTab('b6');ShowOrHideMethods.hideMyStickHeader('nav-wrapper');">
                </div>
            </div>
            </p>

            <div id="b6" class="containerTab" style="display:none;background:inherit">
                <button id="myCloseBtnB6" class="closeBtn" onclick="this.parentElement.style.display='none';
                    ListingMethods.Listview();
                    ColorAndAdjustmentMethods.classColor();C
                    heckAndClearMethods.checksBeforeExit('iframe6', 'input', 'b6');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
                    Close Module X
                </button>
                <iframe src="/public/htmls/diet.html" name="targetframe" id="iframe6" allowTransparency="true"
                    frameborder="1" onload="ColorAndAdjustmentMethods.scaleForMobile();">
                </iframe>
                <input type="button" class="fixedCloseBtn" value="X" onclick="
                    CheckAndClearMethods.checksBeforeExit('iframe6', 'input', 'b6');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
            </div>
        </div>

    </div>

    <!-- fourth row-->
    <div class="row">

        <div id="inpatientModul" class="column" style="display: '';background-color: greenyellow;"
            title="Registration, follow-up and discharge of the patients to whom the doctor gives admission.">
            <div class="columnDivider">
                <div class="modulTitleDiv">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <h2 class="modulBaslik">Inpatient Module</h2>
                    <p>
                        <a id="modulLink8" class="modulLink" onclick="TabProcess.openTab('b8');
                            ListingMethods.Listview();
                            ColorAndAdjustmentMethods.scrollPage();
                            ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                            style="color: black;border-bottom: solid 0.5px;">
                            Click For Module
                        </a>
                </div>
                <div>
                    <img class="modulAvatar" src="/public/images/Medical-icons/nurse.png" alt=""
                        onclick="TabProcess.openTab('b8');ShowOrHideMethods.hideMyStickHeader('nav-wrapper');">
                </div>
            </div>
            </p>

            <div id="b8" class="containerTab" style="display:none;background:inherit">
                <button id="myCloseBtnB8" class="closeBtn" onclick="this.parentElement.style.display='none';
                    ListingMethods.Listview();
                    ColorAndAdjustmentMethods.classColor();
                    TabProcess.closeContainerTab('b8');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
                    Close Module X
                </button>
                <iframe src="/public/htmls/inpatient.html" name="targetframe" id="iframe8" allowTransparency="true"
                    frameborder="1" onload="ColorAndAdjustmentMethods.scaleForMobile();">
                </iframe>
                <input type="button" class="fixedCloseBtn" value="X" onclick="
                TabProcess.closeContainerTab('b8');
               ShowOrHideMethods.myStickHeader('nav-wrapper');">
            </div>
        </div>

        <div id="announcementMod" class="column" style="display: '';background-color: green;"
            title="Make your own announcemenets and updates for users.">
            <div class="columnDivider">
                <div class="modulTitleDiv">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <h2 class="modulBaslik">Announcement Module</h2>
                    <p>
                        <a id="modulLink7" class="modulLink" onclick="TabProcess.openTab('b7');
                            ListingMethods.Listview();
                            ColorAndAdjustmentMethods.scrollPage();
                            ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                            style="color: black;border-bottom: solid 0.5px;">
                            Click For Module
                        </a>
                </div>
                <div>
                    <img class="modulAvatar" src="/public/images/new_announcements.png" alt=""
                        onclick="TabProcess.openTab('b7');ShowOrHideMethods.hideMyStickHeader('nav-wrapper');">
                </div>
            </div>
            </p>

            <div id="b7" class="containerTab" style="display:none;background:inherit">
                <button id="myCloseBtnB7" class="closeBtn" style="right: -50px;" onclick="this.parentElement.style.display='none';
                    ListingMethods.Listview();
                    ColorAndAdjustmentMethods.classColor();
                    TabProcess.closeContainerTab('b7');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
                    Close Module X
                </button>
                <iframe src="/public/htmls/announcement.html" name="targetframe" id="iframe7" allowTransparency="true"
                    frameborder="1" onload="ColorAndAdjustmentMethods.scaleForMobile();">
                </iframe>
                <input type="button" class="fixedCloseBtn" value="X" onclick="
                    TabProcess.closeContainerTab('b7');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
            </div>
        </div>

    </div>

    <!-- fifth row-->
    <div class="row">

        <div id="laboratoryModule" class="column" style="display: '';background-color: green;"
            title="This module aims to follow up laboratory tests, approval, barcodes, print results, reports and statistics of inpatients and outpatients.">
            <div class="columnDivider">
                <div class="modulTitleDiv">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <h2 class="modulBaslik">Laboratory Module</h2>
                    <p>
                        <a id="modulLink9" class="modulLink" onclick="TabProcess.openTab('b9');
                            ListingMethods.Listview();
                            ColorAndAdjustmentMethods.scrollPage();
                            ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                            style="color: black;border-bottom: solid 0.5px;">
                            Click For Module
                        </a>
                </div>
                <div>
                    <img class="modulAvatar" src="/public/images/Medical-icons/microscope.png" alt=""
                        onclick="TabProcess.openTab('b9');ShowOrHideMethods.hideMyStickHeader('nav-wrapper');">
                </div>
            </div>
            </p>

            <div id="b9" class="containerTab" style="display:none;background:inherit">
                <button id="myCloseBtnB9" class="closeBtn" style="right: -50px;" onclick="this.parentElement.style.display='none';
                    ListingMethods.Listview();
                    ColorAndAdjustmentMethods.classColor();
                    TabProcess.closeContainerTab('b9');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
                    Close Module X
                </button>
                <iframe src="/public/htmls/laboratory.html" name="targetframe" id="iframe9" allowTransparency="true"
                    frameborder="1" onload="ColorAndAdjustmentMethods.scaleForMobile();">
                </iframe>
                <input type="button" class="fixedCloseBtn" value="X" onclick="
                    TabProcess.closeContainerTab('b9');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
            </div>
        </div>

        <div id="radiologyModule" class="column" style="display: '';background-color: greenyellow;"
            title="This module aims to follow up radiology and x-ray tests, approval, barcodes, print results, reports and statistics of inpatients and outpatients.">
            <div class="columnDivider">
                <div class="modulTitleDiv">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <h2 class="modulBaslik">Imaging and Radiology Module</h2>
                    <p>
                        <a id="modulLink10" class="modulLink" onclick="TabProcess.openTab('b10');
                            ListingMethods.Listview();
                            ColorAndAdjustmentMethods.scrollPage();
                            ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                            style="color: black;border-bottom: solid 0.5px;">
                            Click For Module
                        </a>
                </div>
                <div>
                    <img class="modulAvatar" src="/public/images/Medical-icons/X-Ray_Hand.ico" alt=""
                        onclick="TabProcess.openTab('b10');ShowOrHideMethods.hideMyStickHeader('nav-wrapper');">
                </div>
            </div>
            </p>

            <div id="b10" class="containerTab" style="display:none;background:inherit">
                <button id="myCloseBtnB10" class="closeBtn" onclick="this.parentElement.style.display='none';
                    ListingMethods.Listview();
                    ColorAndAdjustmentMethods.classColor();
                    TabProcess.closeContainerTab('b10');
                   ShowOrHideMethods.myStickHeader('nav-wrapper');">
                    Close Module X
                </button>
                <iframe src="/public/htmls/radiology.html" name="targetframe" id="iframe10" allowTransparency="true"
                    frameborder="1" onload="ColorAndAdjustmentMethods.scaleForMobile();">
                </iframe>
                <input type="button" class="fixedCloseBtn" value="X" onclick="
                TabProcess.closeContainerTab('b10');
               ShowOrHideMethods.myStickHeader('nav-wrapper');">
            </div>
        </div>

    </div>

    <!-- sixth row-->
    <div class="row">

        <div id="administrationModule" class="column" style="display: '';background-color: green;"
            title="This module is administration portal.">
            <div class="columnDivider">
                <div class="modulTitleDiv">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <h2 class="modulBaslik">Administration Module</h2>
                    <p>
                        <a id="modulLink11" class="modulLink" onclick="TabProcess.openTab('b11');
                            ListingMethods.Listview();
                            ColorAndAdjustmentMethods.scrollPage();
                            ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                            style="color: black;border-bottom: solid 0.5px;">
                            Click For Module
                        </a>
                </div>
                <div>
                    <img class="modulAvatar" src="/public/images/settings-1.png" alt=""
                        onclick="TabProcess.openTab('b11');ShowOrHideMethods.hideMyStickHeader('nav-wrapper');">
                </div>
            </div>
            </p>

            <div id="b11" class="containerTab" style="display:none;background:inherit">
                <button id="myCloseBtnB11" class="closeBtn" style="right: -50px;" onclick="this.parentElement.style.display='none';
                    ListingMethods.Listview();
                    ColorAndAdjustmentMethods.classColor();
                    TabProcess.closeContainerTab('b11');
                    ShowOrHideMethods.myStickHeader('nav-wrapper');">
                    Close Module X
                </button>
                <iframe src="/server/views/adminModule.ejs" name="targetframe" id="iframe11"
                    allowTransparency="true" frameborder="1" onload="ColorAndAdjustmentMethods.scaleForMobile();">
                </iframe>
                <input type="button" class="fixedCloseBtn" value="X" onclick="
                    TabProcess.closeContainerTab('b11');
                    ShowOrHideMethods.myStickHeader('nav-wrapper');">
            </div>
        </div>


    </div>
    <!----------------- end of columns ----------->

    <!----------------------- login -------------->
    <div id="loginPopup" class="modal">

        <form action="/server/views/index" method="POST" id="modal-content" class="modal-content animate">
            <div id="imgcontainer" class="imgcontainer">
                <span onclick="document.getElementById('loginPopup').style.display='none'" id="loginCloseBtn"
                    class="close" title="Close Modal">&times;</span>
                <img id="myLoginAvatar" src="/public/images/login-user-3.png" alt="Avatar" class="avatar">
            </div>

            <div id="loginContainer" class="container">
                <label id="loginUserNameLbl" for="username" style="color: black;">Username:</label>
                <input type="text" id="loginUserName" name="username" style="color: black;" placeholder="Enter Username"
                    autofocus required onkeyup="ShowOrHideMethods.showCapsLockOnWarning('pCapsLockIndicator',event)"
                    onclick="ShowOrHideMethods.showCapsLockOnWarning('pCapsLockIndicator',event)">
                <br>
                <label id="loginPasswordLbl" for="password" style="color: black;">Password :</label>
                <input type="password" id="loginPassword" name="password" style="color: black;"
                    placeholder="Enter Password" required
                    onkeyup="ShowOrHideMethods.showCapsLockOnWarning('pCapsLockIndicator',event)"
                    onclick="ShowOrHideMethods.showCapsLockOnWarning('pCapsLockIndicator',event)">
                <span for='loginPassword' class="p-viewer">
                    <i id="showPasswordIcon" class="fa fa-eye" aria-hidden="true" style="color: black;"
                        title="Show password!"
                        onclick="ShowOrHideMethods.showPassword('loginPassword','showPasswordIcon')">
                    </i>
                </span>
                <pCapsLock id="pCapsLockIndicator">WARNING! Caps lock is ON.</pCapsLock>
            </div>

            <div id="loginContainerBottom" class="containerBottom">
                <button id="innerLoginBtn" type="submit">Login</button>
                <label id="rememberChkbxlbl" style="color: black;margin: 15px;">
                    <input id="rememberChkbx" type="checkbox" checked="checked" name="remember"
                        style="color: black;float: right;margin: 3px 0px 0px 15px;"> Remember me
                </label>
                <a id="forgotPass" onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');">Forgot password?</a>
            </div>
        </form>
    </div>
    <!---------------------- end of login--------->

    <!----------- first row of flip-cards -------->
    <div class="card-container" id="card-container">
        <div class="baseCard" id="hastaKimlikBaseCard">
            <div class="card" id="hastaKimlikParentCard">
                <div id="CardHastaKimlik" class="front"
                    style="background-image: url('/public/images/id-3.png');background-size: 200px;">
                    <div class="card-title">
                        <header>
                            <h4>
                                Patient Info Module
                            </h4>
                        </header>
                    </div>
                </div>
                <div class="back">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <p class="like-button fa fa-heart" title="Add your favourites!" id="myHeart1" onclick="
                    CardAnimationAndAdjustmentMethods.addCardFavourites('hastaKimlikBaseCard','myHeart1');">
                    </p>
                    <p class="cardP">
                        Manage all your Inpatients and Outpatients. Patients are quickly accessible by typing parts of
                        their name.
                    </p>
                    <a id="cardLink1" class="cardLink" onclick="TabProcess.openTab('b1');
                        ListingMethods.Listview();
                        ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                        style="color: black;border-bottom: solid 0.5px;">
                        Click For Module</a>
                </div>
            </div>
        </div>

        <div class="baseCard" id="polMuayeneBaseCard">
            <div class="card" id="polMuayeneParentCard">
                <div id="CardPolMuayene" class="front"
                    style="background-image: url('/public/images/exam_2.png');background-size: 200px;">
                    <div class="card-title">
                        <header>
                            <h4>
                                Polyclinic Examination Registration Module
                            </h4>
                        </header>
                    </div>
                </div>
                <div class="back">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <p class="like-button fa fa-heart" title="Add your favourites!" id="myHeart2" onclick="
                    CardAnimationAndAdjustmentMethods.addCardFavourites('polMuayeneBaseCard','myHeart2');"></p>
                    <p class="cardP">
                        This module is the first place where the patient’s information is entered. Identity aims to
                        obtain the information of the examination, to process the examination when necessary and to
                        establish the records of the examination and to follow up the patient with a single protocol
                        number.
                    </p>
                    <a id="cardLink2" class="cardLink" onclick="TabProcess.openTab('b2');
                        ListingMethods.Listview();
                        ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                        style="color: black;border-bottom: solid 0.5px;">Click
                        For Module</a>
                </div>
            </div>
        </div>

        <div class="baseCard" id="randevuKayitBaseCard">
            <div class="card" id="randevuKayitParentCard">
                <div id="CardRandevuKayit" class="front"
                    style="background-image:url('/public/images/Medical-icons/calender.png');background-size: 200px;">
                    <div class="card-title">
                        <header>
                            <h4>
                                Appointment Registration Module
                            </h4>
                        </header>
                    </div>
                </div>
                <div class="back">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <p class="like-button fa fa-heart" title="Add your favourites!" id="myHeart3" onclick="
                    CardAnimationAndAdjustmentMethods.addCardFavourites('randevuKayitBaseCard','myHeart3');"></p>
                    <p class="cardP">
                        With this module, it provides the required date and doctor appointment registration by taking
                        necessary information from the patient.
                    </p>
                    <a id="cardLink3" class="cardLink" onclick="TabProcess.openTab('b3');
                        ListingMethods.Listview();
                        ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                        style="color: black;border-bottom: solid 0.5px;">Click
                        For Module</a>
                </div>
            </div>
        </div>

        <div class="baseCard" id="randevuSorguBaseCard">
            <div class="card" id="randevuSorguParentCard">
                <div id="CardRandevuSorgu" class="front"
                    style="background-image:url('/public/images/Medical-icons/Calendar-selected-day.png');background-size: 200px;">
                    <div class="card-title">
                        <header>
                            <h4>
                                Appointment Search Module
                            </h4>
                        </header>
                    </div>
                </div>
                <div class="back">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <p class="like-button fa fa-heart" title="Add your favourites!" id="myHeart4" onclick="
                    CardAnimationAndAdjustmentMethods.addCardFavourites('randevuSorguBaseCard','myHeart4');"></p>
                    <p class="cardP">
                        Keep track of your appointments and your team's calendar. With Checkins, always know which
                        patients are in the Waiting Room and how late they are.</p>
                    <a id="cardLink4" class="cardLink" onclick="TabProcess.openTab('b4');
                        ListingMethods.Listview();
                        ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                        style="color: black;border-bottom: solid 0.5px;">Click
                        For Module</a>
                </div>
            </div>
        </div>
    </div>

    <!----------- second row of flip-cards -------->
    <div class="card-container2" id="card-container2">
        <div class="baseCard" id="polDefteriBaseParent">
            <div class="card" id="polDefteriCardParent">
                <div id="CardPolDefteri" class="front"
                    style="background-image: url('/public/images/Medical-icons/Task-Completed-256.png');background-size: 250px;">
                    <div class="card-title">
                        <header>
                            <h4>
                                Polyclinic Module
                            </h4>
                        </header>
                    </div>
                </div>
                <div class="back">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <p class="like-button fa fa-heart" title="Add your favourites!" id="myHeart5" onclick="
                    CardAnimationAndAdjustmentMethods.addCardFavourites('polDefteriBaseParent','myHeart5');"></p>
                    <p class="cardP">
                        This module aims to enter patient examination information into the program by doctors.
                    </p>
                    <a id="cardLink5" class="cardLink" onclick="TabProcess.openTab('b5');
                        ListingMethods.Listview();
                        ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                        style="color: black;border-bottom: solid 0.5px;">Click
                        For Module</a>
                </div>
            </div>
        </div>

        <div class="baseCard" id="diyetModuleBaseParent">
            <div class="card" id="diyetModuleCardParent">
                <div id="CardDiyetModule" class="front"
                    style="background-image: url('/public/images/diet_3.png');background-size: 250px;">
                    <div class="card-title">
                        <header>
                            <h4>
                                Diet Module
                            </h4>
                        </header>
                    </div>
                </div>
                <div class="back">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <p class="like-button fa fa-heart" title="Add your favourites!" id="myHeart6" onclick="
                    CardAnimationAndAdjustmentMethods.addCardFavourites('diyetModuleBaseParent','myHeart6');"></p>
                    <p class="cardP">
                        This module aims to enter patient examination information into the program by doctors.
                    </p>
                    <a id="cardLink6" class="cardLink" onclick="TabProcess.openTab('b6');
                        ListingMethods.Listview();
                        ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                        style="color: black;border-bottom: solid 0.5px;">Click
                        For Module</a>
                </div>
            </div>
        </div>

        <div class="baseCard" id="announcementBaseParent">
            <div class="card" id="announcementCardParent">
                <div id="Cardannouncement" class="front"
                    style="background-image: url('/public/images/new_announcements.png');background-size: 250px;">
                    <div class="card-title">
                        <header>
                            <h4>
                                Announcements Module
                            </h4>
                        </header>
                    </div>
                </div>
                <div class="back">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <p class="like-button fa fa-heart" title="Add your favourites!" id="myHeart7" onclick="
                    CardAnimationAndAdjustmentMethods.addCardFavourites('announcementBaseParent','myHeart7');"></p>
                    <p class="cardP">
                        Make your own announcemenets and updates for users.
                    </p>
                    <a id="cardLink7" class="cardLink" onclick="TabProcess.openTab('b7');
                        ListingMethods.Listview();
                        ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                        style="color: black;border-bottom: solid 0.5px;">Click
                        For Module</a>
                </div>
            </div>
        </div>

        <div class="baseCard" id="inpatientBaseParent">
            <div class="card" id="inpatientCardParent">
                <div id="CardRecx2" class="front"
                    style="background-image: url('/public/images/Medical-icons/nurse.png');background-size: 250px;">
                    <div class="card-title">
                        <header>
                            <h4>
                                Inpatient Module
                            </h4>
                        </header>
                    </div>
                </div>
                <div class="back">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <p class="like-button fa fa-heart" title="Add your favourites!" id="myHeart8" onclick="
                    CardAnimationAndAdjustmentMethods.addCardFavourites('inpatientBaseParent','myHeart8');"></p>
                    <p class="cardP">Registration, follow-up and discharge of the patients to whom the doctor gives
                        admission.</p>
                    <a id="cardLink8" class="cardLink" onclick="TabProcess.openTab('b8');
                        ListingMethods.Listview();
                        ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                        style="color: black;border-bottom: solid 0.5px;">Click
                        For Module</a>
                </div>
            </div>
        </div>
    </div>

    <!----------- third row of flip-cards -------->
    <div class="card-container3" id="card-container3">
        <div class="baseCard" id="laboratoryBaseParent">
            <div class="card" id="laboratoryCardParent">
                <div id="laboratoryCard" class="front"
                    style="background-image: url('/public/images/Medical-icons/microscope.png');background-size: 250px;">
                    <div class="card-title">
                        <header>
                            <h4>
                                Laboratory Module
                            </h4>
                        </header>
                    </div>
                </div>
                <div class="back">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <p class="like-button fa fa-heart" title="Add your favourites!" id="myHeart9" onclick="
                CardAnimationAndAdjustmentMethods.addCardFavourites('laboratoryBaseParent','myHeart9');"></p>
                    <p class="cardP">
                        This module aims to follow up laboratory tests, approval, barcodes, print results, reports and
                        statistics of inpatients and outpatients.
                    </p>
                    <a id="cardLink5" class="cardLink" onclick="TabProcess.openTab('b9');
                        ListingMethods.Listview();
                        ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                        style="color: black;border-bottom: solid 0.5px;">Click
                        For Module</a>
                </div>
            </div>
        </div>

        <div class="baseCard" id="radiologyBaseParent">
            <div class="card" id="radiologyCardParent">
                <div id="radiologyCard" class="front"
                    style="background-image: url('/public/images/Medical-icons/X-Ray_Hand.ico');background-size: 250px;">
                    <div class="card-title">
                        <header>
                            <h4>
                                Imaging and Radiology Module
                            </h4>
                        </header>
                    </div>
                </div>
                <div class="back">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <p class="like-button fa fa-heart" title="Add your favourites!" id="myHeart10" onclick="
                CardAnimationAndAdjustmentMethods.addCardFavourites('radiologyBaseParent','myHeart10');"></p>
                    <p class="cardP">
                        This module aims to follow up radiology and x-ray tests, approval, barcodes, print results,
                        reports and statistics of inpatients and outpatients.
                    </p>
                    <a id="cardLink6" class="cardLink" onclick="TabProcess.openTab('b10');
                        ListingMethods.Listview();
                        ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                        style="color: black;border-bottom: solid 0.5px;">Click
                        For Module</a>
                </div>
            </div>
        </div>

        <div class="baseCard" id="administrationBaseParent">
            <div class="card" id="administrationCardParent">
                <div id="administrationCard" class="front"
                    style="background-image: url('/public/images/settings-1.png');background-size: 250px;">
                    <div class="card-title">
                        <header>
                            <h4>
                                Administration Module
                            </h4>
                        </header>
                    </div>
                </div>
                <div class="back">
                    <button class="helpButtons fa fa-question-circle" title="Help and documents."
                        onclick="ShowOrHideMethods.showPopUpModal('helpAndDocument');"></button>
                    <p class="like-button fa fa-heart" title="Add your favourites!" id="myHeart11" onclick="
                    CardAnimationAndAdjustmentMethods.addCardFavourites('administrationBaseParent','myHeart11');">
                    </p>
                    <p class="cardP">
                        This module is administration portal.
                    </p>
                    <a id="cardLink11" class="cardLink" onclick="TabProcess.openTab('b11');
                        ListingMethods.Listview();
                        ShowOrHideMethods.hideMyStickHeader('nav-wrapper')"
                        style="color: black;border-bottom: solid 0.5px;">Click
                        For Module</a>
                </div>
            </div>
        </div>
    </div>
    <!--------------- end of flip-cards ---------->


    <!------------------- help and documents ------------->
    <div id="helpAndDocument" class="modal" style="padding: 60px;">
        <form id="helpAndDocument-modal-content" class="helpAndDocumentContent animate" action="none" method="none">
            <div id="helpAndDocumentImgcontainer" class="imgcontainer">
                <span onclick="document.getElementById('helpAndDocument').style.display='none'"
                    id="helpAndDocumentCloseBtn" class="close" title="Close Modal">&times;</span>
                <img id="helpAndDocumentAvatar" src="/public/images/help-icon-1.png" alt="Avatar" class="avatar">
            </div>
            <h11 class="historyHeaders" style="margin: 5px;">Help Lines and Documents</h11>
            <br><br>
            <div style="display: flex;">
                <div id="helpAndDocumentExplanation">
                    <pHelp class="helpModulNameText">
                        Phone supportline : +850 000 000 000 <br><br>
                        Mail supportline : help@yourhospital.com <br>
                    </pHelp>
                </div>

                <div id="helpAndDocumentDiv">
                    <img id="helpAndDocumentLogo" src="/public/images/help-icon-3.png" alt="sablon logo">
                </div>
            </div>
            <div id="helpAndDocumentContainer" class="sarfIstemEkraniContainer">
                <table id="helpAndDocumentTable">
                    <tr class="testTableHeader">
                        <th>#</th>
                        <th>Document</th>
                        <th>Open</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Modul Explanation</td>
                        <td>
                            <a id="documentOpenLink1" class="modulLink"
                                href="/ViewerJS/#../public/documents/test-file.pdf" target="_blank">Open File</a>
                        </td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>New instructions</td>
                        <td>
                            <a class="modulLink" href="/ViewerJS/#../public/documents/test-file.pdf"
                                target="_blank">Open File</a>
                        </td>
                    </tr>
                </table>
            </div>


        </form>
    </div>
    <!--------------- end of help and documents ---------->

    <!--------- old cards --------->
    <!-- first row of cards !!! not on use !!! -->
    <!--
      <div class="cardRow">
      <div class="col">
        <div id="card1" class="card">
          <h3>Hasta Kimlik Kayit Modulu <br />(Patient Info Module)</h3>
          <p> <br>
            <a id="modulLink6"
              onclick="ShowOrHideMethods.HideColumn('card');TabProcess.openTab('b1');ListingMethods.Listview();loadOtherPage('hastaKimlik.hmtl');"
              style="color: black;border-bottom: solid 0.5px;">Click For Module
            </a>
          </p>
        </div>
      </div>

      <div class="col">
        <div id="card2" class="card">
          <h3>Poliklinik Muayene Kayit Modulu <br />(Polyclinic Examination Registration Module)</h3>
          <br>
          <p> <a id="modulLink7"
              onclick="ShowOrHideMethods.HideColumn('card');TabProcess.openTab('b2');ListingMethods.Listview();loadOtherPage('hastaKimlik.hmtl');"
              style="color: black;border-bottom: solid 0.5px;">Click For Module</a></p>
        </div>
      </div>


      <div class="col">
      <div id="card3" class="card">
        <h3>Randevu Kayit Modulu <br />(Appointment Registration Module)</h3>
        <p><br /> <a id="modulLink8"
            onclick="ShowOrHideMethods.HideColumn('card');TabProcess.openTab('b3');ListingMethods.Listview();loadOtherPage('hastaKimlik.hmtl');"
            style="color: black;border-bottom: solid 0.5px;">Click For Module</a></p>
      </div>
      </div>

      <div class="col">
      <div id="card4" class="card">
        <h3>Randevu Sorgulama Modulu<br /> (Appointment Search Module) </h3>
        <p> <br /><a id="modulLink9"
            onclick="ShowOrHideMethods.HideColumn('card');TabProcess.openTab('b4');ListingMethods.Listview();loadOtherPage('hastaKimlik.hmtl');"
            style="color: black;border-bottom: solid 0.5px;">Click For Module</a></p>
      </div>
      </div>
    </div>

    <-- second row of cards -
    <div class="cardRow">
      <div class="col">
        <div id="card5" class="card">
          <h3>Poliklinik Defteri <br />(Polyclinic Module)</h3>
          <p> <br><a id="modulLink10"
              onclick="ShowOrHideMethods.HideColumn('card');TabProcess.openTab('b5');ListingMethods.Listview();loadOtherPage('hastaKimlik.hmtl');"
              style="color: black;border-bottom: solid 0.5px;">Click For Module</a></p>
        </div>
      </div>

      <div class="col">
        <div id="card6" class="card">
          <h3>Diyet Modulu<br /> (Diet Module)</h3>
          <p> <br><a id="modulLink11"
              onclick="ShowOrHideMethods.HideColumn('card');TabProcess.openTab('b6');ListingMethods.Listview();loadOtherPage('hastaKimlik.hmtl');"
              style="color: black;border-bottom: solid 0.5px;">Click For Module</a></p>
        </div>
      </div>

      <div class="col">
        <div id="card7" class="card">
          <h3>Recx Modulu <br />(Recx)</h3>
          <p><br /> <a id="modulLink12"
              onclick="ShowOrHideMethods.HideColumn('card');TabProcess.openTab('b7');ListingMethods.Listview();loadOtherPage('hastaKimlik.hmtl');"
              style="color: black;border-bottom: solid 0.5px;">Click For Module</a></p>
        </div>
      </div>

      <div class="col">
        <div id="card8" class="card">
          <h3>Recx 2<br /> (Recx 2) </h3>
          <p> <br /><a id="modulLink13"
              onclick="ShowOrHideMethods.HideColumn('card');TabProcess.openTab('b8');ListingMethods.Listview();loadOtherPage('hastaKimlik.hmtl');"
              style="color: black;border-bottom: solid 0.5px;">Click For Module</a></p>
        </div>
      </div>
    </div>

    <-- thir row of cards
    <div class="cardRow">
      <div class="col">
        <div id="card9" class="card">
          <h3>Poliklinik Defteri <br />(Polyclinic Module)</h3>
          <p> <br><a id="modulLink14"
              onclick="ShowOrHideMethods.HideColumn('card');TabProcess.openTab('b9');ListingMethods.Listview();loadOtherPage('hastaKimlik.hmtl');"
              style="color: black;border-bottom: solid 0.5px;">Click For Module</a></p>
        </div>
      </div>

      <div class="col">
        <div id="card10" class="card">
          <h3>Diyet Modulu<br /> (Diet Module)</h3>
          <p> <br><a id="modulLink15"
              onclick="ShowOrHideMethods.HideColumn('card');TabProcess.openTab('b10');ListingMethods.Listview();loadOtherPage('hastaKimlik.hmtl');"
              style="color: black;border-bottom: solid 0.5px;">Click For Module</a></p>
        </div>
      </div>

      <div class="col">
        <div id="card11" class="card">
          <h3>Recx Modulu <br />(Recx)</h3>
          <p><br /> <a id="modulLink16"
              onclick="ShowOrHideMethods.HideColumn('card');TabProcess.openTab('b11');ListingMethods.Listview();loadOtherPage('hastaKimlik.hmtl');"
              style="color: black;border-bottom: solid 0.5px;">Click For Module</a></p>
        </div>
      </div>

      <div class="col">
        <div id="card12" class="card">
          <h3>Recx 2<br /> (Recx 2) </h3>
          <p> <br /><a id="modulLink17"
              onclick="ShowOrHideMethods.HideColumn('card');TabProcess.openTab('b12');ListingMethods.Listview();loadOtherPage('hastaKimlik.hmtl');"
              style="color: black;border-bottom: solid 0.5px;">Click For Module</a></p>
        </div>
      </div>
    </div> -->


    <!-- Footer -->
    <footer class="page-footer">

        <!-- Footer Elements -->
        <div class="footer-container" style="padding: 10px; margin: 10px;">

            <!-- Social buttons -->
            <ul class="list-unstyled list-inline text-center">
                <li class="list-inline-item">
                    <button id="facebookBtn" class="socialMedBtns" title="Hospital's Facebook Page"
                        onclick="ShowOrHideMethods.socialMediaNewTab('facebookBtn');">
                        <a class="btn-floating btn-fb fa-2x">
                            <i class="fa fa-facebook-square"> </i>
                        </a>
                    </button>
                </li>
                <li class="list-inline-item">
                    <button id="twitterBtn" class="socialMedBtns" title="Hospital's Twitter Page"
                        onclick="ShowOrHideMethods.socialMediaNewTab ('twitterBtn');">
                        <a class="btn-floating btn-tw fa-2x">
                            <i class="fa fa-twitter-square"> </i>
                        </a>
                    </button>
                </li>
                <li class="list-inline-item">
                    <button id="googlePlusBtn" class="socialMedBtns" title="Hospital's Google Plus Page"
                        onclick="ShowOrHideMethods.socialMediaNewTab ('googlePlusBtn');">
                        <a id="googlePlusBtn" class="btn-floating btn-gplus fa-2x">
                            <i class="fa fa-google-plus-square"> </i>
                        </a>
                    </button>
                </li>
                <li class="list-inline-item">
                    <button id="linkedinBtn" class="socialMedBtns" title="Hospital's LinkedIn Page"
                        onclick="ShowOrHideMethods.socialMediaNewTab ('linkedinBtn');">
                        <a id="linkedinBtn" class="btn-floating btn-li fa-2x">
                            <i class=" fa fa-linkedin-square"> </i>
                        </a>
                    </button>
                </li>
            </ul>
            <!-- Social buttons -->

        </div>
        <!-- Footer Elements -->
        <!-- Copyright -->
        <div class="footer-copyright text-center" style="font-size: large;color: black;padding: 10px;">
            © 2020
            Copyright:
            <div class="shadows" onclick="window.open('https://www.linkedin.com/in/recep-celik-poland/?locale=en_US')"
                title="This web application has been created in 2 weeks. Click for developer's LinkedIn page.">
                <span>R</span><span>e</span><span>c</span><span>e</span><span>p</span>
                <span>C</span><span>e</span><span>l</span><span>i</span><span>k</span>
            </div>
        </div>
        </a>
        </div>
        <!-- Copyright -->

    </footer>


    <div id="userStatistics" class="modal" style="padding: 60px;">
        <div id="userStatistics-modal-content" class="userStatisticsContent animate" action="?action=add" method="post">
            <div id="userStatisticsImgcontainer" class="imgcontainer">
                <span onclick="document.getElementById('userStatistics').style.display='none'"
                    id="userStatisticsCloseBtn" class="close" title="Close!">&times;</span>
                <img id="myAvatar" src="/public/images/statistics-12.png" alt="Avatar" class="avatar">
            </div>
            <div id="userStatisticsContainer" class="userStatisticsContainer">
                <h11 class="historyHeaders" style="margin: 5px;color: white;">User Login Statistics</h11>
                <table id="userLoginStatsTable">
                    <tr id="tableHeader">
                        <th>#</th>
                        <th>Ip Adress</th>
                        <th>Login Date</th>
                        <th>Login Duration</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>192.168.1.11</td>
                        <td>03.09.2020 14:10</td>
                        <td>22 minutes 17 seconds</td>
                    </tr>
                </table>
                <br><br>
                <h11 class="historyHeaders" style="margin: 5px;color: white;">Last password change: 14.07.2020 10:02:24
                    - 192.168.1.11</h11>
                <br><br>
                <h11 class="historyHeaders" style="margin: 5px;color: white;">User Message Statistics</h11>
                <br>
                <table id="userMessageStatsTable">
                    <tr id="tableHeader">
                        <th>Inbox Messages</th>
                        <th>Read Messages</th>
                        <th>Unread Messages</th>
                        <th>Sent Messages</th>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>2</td>
                        <td>0</td>
                        <td>2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <div id="userTraining" class="modal" style="padding: 60px;">
        <div id="userTraining-modal-content" class="userTrainingContent animate" action="?action=add" method="post">
            <div id="userTrainingImgcontainer" class="imgcontainer">
                <span onclick="document.getElementById('userTraining').style.display='none'" id="userTrainingCloseBtn"
                    class="close" title="Close!">&times;</span>
                <img id="myAvatar" src="/public/images/training-4.png" alt="Avatar" class="avatar">
            </div>
            <h11 class="historyHeaders" style="margin: 5px;color: white;"> User Incoming Trainings</h11>
            <div id="userTrainingContainer" class="userTrainingContainer">
                <table id="userTrainingTable">
                    <tr class="testTableHeader">
                        <th>#</th>
                        <th>Training</th>
                        <th>Date</th>
                        <th>Place</th>
                        <th>Document</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>CPR Training</td>
                        <td>01.10.2020 14:00</td>
                        <td>Central Conferece Room</td>
                        <td>
                            <a id="documentOpenLink1" class="modulLink"
                                href="/ViewerJS/#../public/documents/test-file.pdf" target="_blank">Open File</a>
                        </td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Safety and Hygen Training</td>
                        <td>12.10.2020 14:00</td>
                        <td>Central Conferece Room</td>
                        <td>
                            <a class="modulLink" href="/ViewerJS/#../public/documents/test-file.pdf"
                                target="_blank">Open File</a>
                        </td>
                    </tr>
                </table>
                <br><br>

                <h11 class="historyHeaders" style="margin: 5px;color: white;"> User Old Trainings</h11><br>
                <table id="userOldTrainingTable">
                    <tr class="testTableHeader">
                        <th>#</th>
                        <th>Training</th>
                        <th>Date</th>
                        <th>Place</th>
                        <th>Document</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>HBYS Training</td>
                        <td>01.03.2020 09:00</td>
                        <td>Central Conferece Room</td>
                        <td>
                            <a id="documentOpenLink1" class="modulLink"
                                href="/ViewerJS/#../public/documents/test-file.pdf" target="_blank">Open File</a>
                        </td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Covid-19 Training</td>
                        <td>12.01.2020 14:00</td>
                        <td>Central Conferece Room</td>
                        <td>
                            <a class="modulLink" href="/ViewerJS/#../public/documents/test-file.pdf"
                                target="_blank">Open File</a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <div id="userSettings" class="modal" style="padding: 60px;">
        <div id="userSettings-modal-content" class="userSettingsContent animate" action="?action=add" method="post">
            <div id="userSettingsImgcontainer" class="imgcontainer">
                <span onclick="document.getElementById('userSettings').style.display='none'" id="userSettingsCloseBtn"
                    class="close" title="Close!">&times;</span>
                <img id="myAvatar" src="/public/images/Bagg-Boxes-Icons-001/configuration-Bagg.png" alt="Avatar"
                    class="avatar">
            </div>
            <h11 class="historyHeaders" style="margin: 5px;color: white;"> User Settings</h11>
            <div id="userSettingsContainer" class="userSettingsContainer">
                Old Password: <br>
                <input type="password" name="userOldPassword" id="userOldPassword"
                    placeholder="Please enter your current password."
                    onclick="ShowOrHideMethods.showCapsLockOnWarning('pCapsLockIndicator1', event)"
                    onkeyup="ShowOrHideMethods.showCapsLockOnWarning('pCapsLockIndicator1', event)">
                <br>
                New Password: <br>
                <input type="password" name="userNewPassword" id="userNewPassword"
                    placeholder="Please enter your new password."
                    onclick="ShowOrHideMethods.showCapsLockOnWarning('pCapsLockIndicator1', event)"
                    onkeyup="ShowOrHideMethods.showCapsLockOnWarning('pCapsLockIndicator1', event)">
                <span for='userNewPassword' class="p-viewer">
                    <i id="showPasswordIcon1" class="fa fa-eye" aria-hidden="true" style="color: black;"
                        title="Show password!"
                        onclick="ShowOrHideMethods.showPassword('userNewPassword','showPasswordIcon1')">
                    </i>
                </span>
                <br>
                New Password Repeat: <br>
                <input type="password" name="userNewPasswordRepeat" id="userNewPasswordRepeat"
                    placeholder="Please re-enter your new password."
                    onclick="ShowOrHideMethods.showCapsLockOnWarning('pCapsLockIndicator1', event)"
                    onkeyup="ShowOrHideMethods.showCapsLockOnWarning('pCapsLockIndicator1', event),
                    CheckAndClearMethods.checkIfTextsAreSame('userNewPassword', 'userNewPasswordRepeat', 'pCapsLockIndicator1')">
                <span for='userNewPasswordRepeat' class="p-viewer">
                    <i id="showPasswordIcon2" class="fa fa-eye" aria-hidden="true" style="color: black;"
                        title="Show password!"
                        onclick="ShowOrHideMethods.showPassword('userNewPasswordRepeat','showPasswordIcon2')">
                    </i>
                </span>
                <br>
                <pCapsLockIndicator1 id="pCapsLockIndicator1">WARNING! Caps lock is ON.</pCapsLockIndicator1>
                <br>
                <button class="inpatientBtn btn-success" id="changePassword"
                    onclick="ShowOrHideMethods.generalSuccesAlert('Successfully Changed!')"
                    title="Change password!">Change
                    Password
                </button>
            </div>
        </div>
    </div>

    <div id="userMessaging" class="modal" style="padding: 60px;">
        <div id="userMessaging-modal-content" class="userMessagingContent animate">
            <div id="userMessagingImgcontainer" class="imgcontainer">
                <span onclick="document.getElementById('userMessaging').style.display='none'" id="userMessagingCloseBtn"
                    class="close" title="Close!">&times;</span>
                <img id="myAvatar" src="/public/images/message-2.png" alt="Avatar" class="avatar">
            </div>
            <div id="userMessageSubContainer">
                <div id="userMessageHistory">
                    <h11 class="historyHeaders" style="margin: 5px;color: white;"> User Inbox</h11>
                    <div id="userMessagingContainer" class="userMessagingContainer">
                        <table id="userInboxTable">
                            <tr class="testTableHeader">
                                <th>#</th>
                                <th>Subject</th>
                                <th>Date</th>
                                <th>From</th>
                                <th>Message</th>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>HBYS Training</td>
                                <td>01.03.2020 09:00</td>
                                <td>Central Conferece Room</td>
                                <td>
                                    <a id="documentOpenLink1" class="modulLink"
                                        href="/ViewerJS/#../public/documents/test-file.pdf" target="_blank">Open
                                        Message</a>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Covid-19 Training</td>
                                <td>12.01.2020 14:00</td>
                                <td>Central Conferece Room</td>
                                <td>
                                    <a class="modulLink" href="/ViewerJS/#../public/documents/test-file.pdf"
                                        target="_blank">Open Message</a>
                                </td>
                            </tr>
                        </table>
                        <br><br>

                        <h11 class="historyHeaders"> User Sent</h11><br>
                        <table id="userSentMessagesTable">
                            <tr class="testTableHeader">
                                <th>#</th>
                                <th>Subject</th>
                                <th>Date</th>
                                <th>From</th>
                                <th>Message</th>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>HBYS Training</td>
                                <td>01.03.2020 09:00</td>
                                <td>Central Conferece Room</td>
                                <td>
                                    <a id="documentOpenLink1" class="modulLink"
                                        href="/ViewerJS/#../public/documents/test-file.pdf" target="_blank">Open
                                        Message</a>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Covid-19 Training</td>
                                <td>12.01.2020 14:00</td>
                                <td>Central Conferece Room</td>
                                <td>
                                    <a class="modulLink" href="/ViewerJS/#../public/documents/test-file.pdf"
                                        target="_blank">Open Message</a>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div id="userNewMessageDiv">
                    <h11 class="historyHeaders" style="margin: 5px;color: white;">Send Message</h11>
                    <br><br>
                    Subject: <br>
                    <input type="text" name="userMessageSubject" id="userMessageSubject">
                    <br>
                    To: <br>
                    <input type="text" name="userMessageTo" id="userMessageTo">
                    <br>
                    <!-- kisiler -->
                    <div class="dropdown">
                        <button onclick="InpatientMethods.showDropDownInside('userMessagePerson')"
                            class="polyclinicButtons btn--swap" id="userMessagePersonBtn">Phone Book <span
                                style="font-size: 16px;">Add person!</span></button>
                        <div id="userMessagePerson" class="dropdown-content"
                            onclick="AdministrationMethods.showSelectedElementInDropdown('userMessagePerson', 'userMessageTo')">
                            <input type="text" placeholder="Search.." id="userMessagePersonSearch" autofocus
                                onkeyup="InpatientMethods.filterTaniDropdown('userMessagePersonSearch', 'userMessagePerson')">
                            <a>Recep CELIK</a>
                            <a>Adnan YILDIRIM</a>
                            <a>Onder KARABULUT</a>
                            <a>Ayse FATMA</a>
                            <a>John QUERY</a>
                        </div>
                    </div>
                    Message: <br>
                    <textarea name="userMessageBody" id="userMessageBody" cols="87" rows="7"></textarea>
                    <br>
                    <button class="inpatientBtn btn-primary" id="userMessageSend"
                        onclick="ShowOrHideMethods.generalSuccesAlert('Successfully Sent!')" title="Send message!">Send
                    </button>
                    <br>
                </div>
            </div>
        </div>
    </div>

    <!-- bottom user menu -->
    <div class="bottomUserMenu">
        <nav class="menu">
            <input type="checkbox" href="#" class="menu-open" name="menu-open" id="menu-open" />
            <label class="menu-open-button" for="menu-open" title="User Menu">
                <span class="hamburger hamburger-1"></span>
                <span class="hamburger hamburger-2"></span>
                <span class="hamburger hamburger-3"></span>
            </label>

            <a href="#" class="menu-item" title="User Statistics."
                onclick="ShowOrHideMethods.showPopUpModal('userStatistics')"> <i class="fa fa-bar-chart"></i> </a>
            <a href="#" class="menu-item" title="User Trainings."
                onclick="ShowOrHideMethods.showPopUpModal('userTraining')"> <i class='fa fa-file-text'></i></a>
            <a href="#" class="menu-item" title="User Settings."
                onclick="ShowOrHideMethods.showPopUpModal('userSettings')"> <i class="fa fa-cog   fa-fw"></i> </a>
            <a href="#" class="menu-item" title="User Messages."
                onclick="ShowOrHideMethods.showPopUpModal('userMessaging')"> <i class="fa fa-envelope"></i> </a>
            <a href="#" class="menu-item"> <i class="fa fa-cog"></i> </a>

        </nav>

        <!-- filters -->
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
            <defs>
                <filter id="shadowed-goo">

                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                        result="goo" />
                    <feGaussianBlur in="goo" stdDeviation="3" result="shadow" />
                    <feColorMatrix in="shadow" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2"
                        result="shadow" />
                    <feOffset in="shadow" dx="1" dy="1" result="shadow" />
                    <feBlend in2="shadow" in="goo" result="goo" />
                    <feBlend in2="goo" in="SourceGraphic" result="mix" />
                </filter>
                <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                        result="goo" />
                    <feBlend in2="goo" in="SourceGraphic" result="mix" />
                </filter>
            </defs>
        </svg>
    </div>
    <!-- end of bottom user menu  -->


    <!--back to top button -->
    <button onclick="ShowOrHideMethods.backtoTopFunction();" id="goTotop" title="Go to top"></button>
    <!--end of back to top button -->

    <div class="bottomScrool">
        <p id="bottomScrollP4">News about your hospital --- it's not a mobile device.</p>
    </div><br>
    <!-- end of Footer -->


    <!-- -----------scripts------------------------------->

    <script type="text/javascript" src="../../public/functions/functions.js"></script>

    <!-- -----------end of scripts------------------------>
    <!-- 
    <script>
        x();
        function x() {
            var x = "Total Width: " + screen.width;
            alert(x)
        }
    </script> -->
</body>


</html>