"use Strict"
function listView() {
    var elements = document.getElementsByClassName("column");
    let id;
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.width = "50%";
        id = elements[i].id;
        document.getElementById(id).style.display = '';
    }
}

function gridView() {
    var elements = document.getElementsByClassName("column");
    let id;
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.width = "33.33%";
        id = elements[i].id;
        document.getElementById(id).style.display = '';
    }
}

function hideColumnsByClass(par) {
    var myClasses = document.querySelectorAll('.' + par),
        i = 0,
        l = myClasses.length;

    for (i; i < l; i++) {
        myClasses[i].style.display = 'none';
    }
}

function unHideColumnsByClass(par) {
    var myClasses = document.querySelectorAll('.' + par),
        i = 0,
        l = myClasses.length;

    for (i; i < l; i++) {
        myClasses[i].style.display = 'flex';
    }
}

function openTab(tabName) { // Hide all elements with class="containerTab", except for the one that matches the clickable grid column
    var i, x;
    x = document.getElementsByClassName("containerTab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";

    // change closebutton top coordinate in style.css

    if (tabName == "b1") {
        closeBtnStyleTopchange("myCloseBtnB1", "540px");
    }
    else if (tabName == "b2") {
        closeBtnStyleTopchange("myCloseBtnB2", "540px");
    }
    else if (tabName == "b3") {
        closeBtnStyleTopchange("myCloseBtnB3", "690px");
    }
    else if (tabName == "b4") {
        closeBtnStyleTopchange("myCloseBtnB4", "690px");
    }
    else if (tabName == "b5") {
        closeBtnStyleTopchange("myCloseBtnB5", "700px");
    }
    else if (tabName == "b6") {
        closeBtnStyleTopchange("myCloseBtnB6", "690px");
    }

}

function closeBtnStyleTopchange(buttonid, pixel) {
    document.getElementById(buttonid).style.top = pixel;
}

function scroolCloseBtn() {
    let mybtn = document.getElementsByClassName("closeBtn");
    window.onscroll = function () { scroolCloseBtn() };
    if (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5) {
        mybtn.style.display = "block";
    }
    else {
        mybtn.style.display = "none";
    }
}

function getSoftColor() {
    // get only soft colors
    return "hsl(" + 360 * Math.random() + ',' +
        (25 + 70 * Math.random()) + '%,' +
        (85 + 10 * Math.random()) + '%)'
}

function colors() {
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
}

function classColor() {//class background color
    var colorStop = document.getElementById('colorChk').checked; // when color change stop checkbox checked
    var nightMode = document.getElementById('chooseClassColor');

    if (colorStop == true && nightMode != '3') {
        var elements = document.getElementsByClassName("column"); // get all elements
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = randomDarkColor();
            adjustClassColor(elements[i].id);
            document.body.style.backgroundColor = 'white';
            elements[i].style.color = 'white';
        }
        // colors selected indexchange -- for columns (list and grid) and cards
        var selectElem = document.getElementById('chooseClassColor');
        selectElem.addEventListener('change', function () {
            var index = selectElem.selectedIndex;
            var elements = document.getElementsByClassName("column"); // for columns
            var cards = document.getElementsByClassName("card"); // for cards

            for (let i = 0; i < elements.length; i++) {// for columns

                if (index == "0") {
                    elements[i].style.backgroundColor = getSoftColor();
                    elements[i].style.borderStyle = 'none';
                    elements[i].style.borderRadius = '';
                    document.body.style.backgroundColor = 'white';
                    elements[i].style.color = 'white';
                    document.getElementById('colorChk').checked = true;
                }
                else if (index == "1") {
                    elements[i].style.backgroundColor = randomDarkColor();
                    adjustClassColor(elements[i].id);
                    elements[i].style.borderStyle = 'none';
                    elements[i].style.borderRadius = '';
                    document.body.style.backgroundColor = 'white';
                    elements[i].style.color = 'white';
                    document.getElementById('colorChk').checked = true;
                }
                else if (index == "2") {
                    elements[i].style.backgroundColor = colors();
                    elements[i].style.borderStyle = 'none';
                    elements[i].style.borderRadius = '';
                    document.body.style.backgroundColor = 'white';
                    elements[i].style.color = 'white';
                    document.getElementById('colorChk').checked = true;
                }
                else if (index == "3") {
                    elements[i].style.backgroundColor = nightModeColors();
                    document.body.style.backgroundColor = 'grey';
                    elements[i].style.color = 'darkgrey';
                    document.getElementById('colorChk').checked = false;
                }
                else {
                    elements[i].style.backgroundColor = colors();
                    elements[i].style.borderStyle = 'none';
                    elements[i].style.borderRadius = '';
                    document.body.style.backgroundColor = 'white';
                    elements[i].style.color = 'white';
                    document.getElementById('colorChk').checked = true;
                }
                for (let i2 = 0; i2 < cards.length; i2++) { // cards background
                    if (index == "0") {
                        cards[i2].style.backgroundColor = getSoftColor();
                        cards[i2].style.borderStyle = 'none';
                        cards[i2].style.borderRadius = '';
                        document.body.style.backgroundColor = 'white';
                        cards[i2].style.color = 'white';
                        document.getElementById('colorChk').checked = true;
                    }
                    else if (index == "1") {
                        cards[i2].style.backgroundColor = randomDarkColor();
                        adjustClassColor(elements[i].id);
                        cards[i2].style.borderStyle = 'none';
                        cards[i2].style.borderRadius = '';
                        document.body.style.backgroundColor = 'white';
                        cards[i2].style.color = 'white';
                        document.getElementById('colorChk').checked = true;
                    }
                    else if (index == "2") {
                        cards[i2].style.backgroundColor = colors();
                        cards[i2].style.borderStyle = 'none';
                        cards[i2].style.borderRadius = '';
                        document.body.style.backgroundColor = 'white';
                        cards[i2].style.color = 'white';
                        document.getElementById('colorChk').checked = true;
                    }
                    else if (index == "3") {
                        cards[i2].style.backgroundColor = nightModeColors();
                        document.body.style.backgroundColor = 'grey';
                        cards[i2].style.color = 'darkgrey';
                        document.getElementById('colorChk').checked = false;
                    }
                    else {
                        cards[i2].style.backgroundColor = colors();
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
}

function cardColor() { // only for cardview load
    var elements = document.getElementsByClassName("front"); // get all elements
    var colorStop = document.getElementById('colorChk').checked; // when color change stop checkbox checked
    var nightMode = document.getElementById('chooseClassColor');
    if (colorStop == true && nightMode != '3') {
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = colors();
            elements[i].style.borderStyle = 'none';
            elements[i].style.borderRadius = '10px';
        }

        // colors selected indexchange
        var selectElem1 = document.getElementById('chooseClassColor');
        // When a new <option> is selected
        selectElem1.addEventListener('change', function () {
            var index = selectElem1.selectedIndex;
            for (let i = 0; i < elements.length; i++) {

                if (index == "0") {
                    elements[i].style.backgroundColor = getSoftColor();
                }
                else if (index == "1") {
                    elements[i].style.backgroundColor = randomDarkColor();
                }
                else if (index == "2") {
                    elements[i].style.backgroundColor = colors();
                }
                else if (index == "3") {
                    elements[i].style.backgroundColor = nightModeColors();
                    document.body.style.backgroundColor = 'grey';
                    elements[i].style.color = 'darkgrey';
                }
                else {
                    elements[i].style.backgroundColor = colors();
                }
            }
        })
    }
}

function classColorSoft() { //
    //class background color
    var elements = document.getElementsByClassName("column"); // get all elements
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = getSoftColor();
        elements[i].style.borderStyle = 'none';
        elements[i].style.borderRadius = '';
    }
}

function colorChangeChkbox() { // change or fix color of classes
    try {
        var columns = document.getElementsByClassName("column"); // get all columns
        var cards = document.getElementsByClassName("card"); // get all cards
        var x = document.getElementById('colorChk').checked;

        if (x == true) {
            alert('Moduls color will change after every change.')
            classColor();
            document.getElementById('chooseClassColor').selectedIndex = '1';
            for (var i = 0; i < columns.length; i++) {
                columns[i].style.borderStyle = 'none';
                columns[i].style.borderRadius = '';
            }
        } else {
            for (var i = 0; i < columns.length; i++) {
                columns[i].style.backgroundColor = 'cornflowerblue';
                columns[i].style.borderStyle = 'solid';
                columns[i].style.borderRadius = '10px';
                cards[i].style.backgroundColor = 'cornflowerblue';
            }
            for (var i = 0; i < cards.length; i++) {
                cards[i].style.backgroundColor = 'cornflowerblue';
            }
            alert("Moduls color fixed and won't change.")
        }
    } catch (error) {
        console.log(error)
    }

}

function randomDarkColor() {
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
}

function nightModeColors() {
    document.getElementById('colorChk').checked = false;
    var elements = document.getElementsByClassName("column"); // for columns
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = '#737373';
        elements[i].style.borderColor = 'lightgrey';
        elements[i].style.borderStyle = 'solid';
        elements[i].style.borderRadius = '10px';
        elements[i].style.margin = '4px 4px 4px 4px';

    }

    var elements = document.getElementsByClassName("front"); // for cards
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = '#737373';
    }

    // iframe
    var iframe = document.getElementById('iframe1');
    var elements = iframe.contentWindow.document.getElementsByTagName("input");

    var y = [];
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = '#737373';
        elements[i].style.color = 'lightyellow';
    }
    var sel = iframe.contentWindow.document.getElementsByTagName("select");
    var textar = iframe.contentWindow.document.getElementsByTagName("textarea");
    for (let i2 = 0; i2 < sel.length; i2++) {
        sel[i2].style.backgroundColor = '#737373';
        textar[i2].style.backgroundColor = '#737373';
        sel[i2].style.color = 'lightyellow';
        textar[i2].style.color = 'lightyellow';
    }
}

function nightModeBySysTime() { // night mode for colors after 19:00 system time 
    var mydate = new Date();
    var myhour = mydate.getHours();
    if (myhour >= 19 || myhour <= 7) {
        nightModeColors();
        document.body.style.backgroundColor = 'grey';
        document.getElementById('colorChk').checked = false;
        document.getElementById("chooseClassColor").selectedIndex = "3";
    }
}

function adjustClassColor(elementId) {
    var element, bgColor, brightness;
    element = document.getElementById(elementId);

    // Get the element's background color
    bgColor = window.getComputedStyle(element, null).getPropertyValue('background-color');

    // Call lightOrDark function to get the brightness (light or dark)
    brightness = lightOrDark(bgColor);
    // If the background color is dark, add the light-text class to it
    if (brightness == 'dark') {
        element.style.backgroundColor = 'cornflowerblue';
        // alert('dark ' + element.style.backgroundColor);
    }
    else {

    }
}

function lightOrDark(color) {
    var r, g, b, hsp;
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

        r = color[1];
        g = color[2];
        b = color[3];
    }
    else {

        // If RGB --> Convert it to HEX:
        color = +("0x" + color.slice(1).replace(
            color.length < 5 && /./g, '$&$&'
        )
        );

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
    }
    else {
        return 'dark';
    }
}

function PageRedirectedByGridButton() { //not on use
    var x = document.referrer;
    var y = document.getElementById("grid");
    var z = x.search('index-cardview.html');
    y.clicked = true; // if grid button clicked on index-cardview.html
    var t = y.clicked;

    if (t == true && z > 0) {
        gridView();
    }
    else {
        // alert('grid disinda');
        listView();
    }
}

function scrollPage() {
    window.scrollBy(0, 200);
}

function isNull(text) {
    if (text == null || text === '') {
        return true;
    }
}

function closeContainerTab(tabId) {
    var x = document.getElementById(tabId);
    x.style.display = 'none';
}

function checksBeforeExit(iframeId, Tagname, containerTabId) {// checks if there is any value on iframe 
    var x = document.getElementById(iframeId).contentDocument
        .getElementsByTagName(Tagname);
    var hasvalue = [];
    for (let i = 0; i < x.length; i++) {
        if (x[i].value.length > 0) {
            hasvalue += x[i].value;
        }
    }
    if (hasvalue.length > 0) {
        var conf = confirm('Girdiginiz verileri kaydetmeden cikmak istediginize emin misiniz?');
        if (conf == true) {
            closeContainerTab(containerTabId);
            cleanIframeContentValues(iframeId);
        }
    } else {
        closeContainerTab(containerTabId);
        cleanIframeContentValues(iframeId);
    }

}

function checkNullFieldsInIframe(iframeId) { // good for check before save or update
    var iframe = document.getElementById(iframeId);
    var elements = iframe.contentWindow.document.getElementsByTagName("input");

    var y = [];
    for (let i = 0; i < elements.length; i++) { // check all ipnut text 
        y += elements[i].id;

        if (isNull(elements[i].value) == true) {
            alert(elements[i].id + ' alani bos olamaz.');
        }
    }
    var x = iframe.contentWindow.document.getElementsByTagName("select");
    if (x[0].value == 'bos') { // check gender
        alert('cinsiyet secin.');
    }

    var adresss = iframe.contentWindow.document.getElementsByTagName("textarea");
    if (adresss[0].value.length <= 0) { // check adress
        alert('adress alani bos olamaz.');
    }

    // alert(y+' ,');
}

function cleanIframeContentValues(iframeId) {
    var iframe = document.getElementById(iframeId);
    iframe.src = iframe.src;
}

window.onclick = function (event) { // When the user clicks anywhere outside of the login pop up, close it
    var modal = document.getElementById('loginPopup');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function showUpLogin() { // popup login onload
    document.getElementById('loginPopup').style.display = 'block';
}

function scaleForMobile() { //change elements style for mobile devices
    var
        myDiv = document.getElementById('btnContainer'),
        myTitle = document.getElementById('title'),
        myMarquee = document.getElementById('myMarquee'),
        myBtns = document.getElementsByClassName('btn'),
        myLogo = document.getElementById('myLogo'),
        myLoginBtn = document.getElementById('loginBtn'),
        myAnnouncements = document.getElementById('announcements'),
        myloginContainer = document.getElementById('loginContainer'),
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
        myColumns = document.getElementsByClassName('column'),
        myCards = document.getElementsByClassName('flip-card'),
        myCardRow = document.getElementsByClassName('flip-card-inner'),
        myH2 = document.getElementsByTagName('h2'),
        myH3 = document.getElementsByTagName('h3');


    if (isMobile() == true) {
        myDiv.style.maxWidth = '80%';
        myTitle.style.fontSize = '15px';
        myTitle.style.margin = '20px 0px 10px 10px';
        myMarquee.style.fontSize = '15px';
        myMarquee.style.width = '200px';
        myMarquee.style.margin = '-5px 0px 0px 10px';
        myAnnouncements.style.fontSize = '10px';
        myAnnouncements.style.margin = '20px 0px 10px 10px';
        myLogo.style.width = '150px';
        myLogo.style.height = '159px';
        myLoginBtn.style.width = '145px';


        for (let i2 = 0; i2 < myColumns.length; i2++) {
            myColumns[i2].style.fontSize = '10px';
            myH2[i2].style.fontSize = '10px';
            // myH3[i2].style.fontSize = '10px';
        }



        myloginContainer.style.margin = '10px 10px';

        myImgcontainer.style.margin = '0px 0px 12px 0px';
        myAvatar.style.width = '90px';
        myAvatar.style.height = '90px';
        myAvatar.style.margin = '-40px 0px 0px 20px';

        myloginContainerBottom.style.width = '180px';
        myloginContainerBottom.style.height = '80px';

        myloginCloseBtn.style.bottom = '5px';
        myinnerLoginBtn.style.width = '70px';
        myinnerLoginBtn.style.height = '30px';
        myinnerLoginBtn.style.fontSize = '10px';
        myinnerLoginBtn.style.margin = '5px 0px 5px 0px';

        myloginUserName.style.width = '140px';
        myloginUserName.style.height = '20px';
        myloginUserName.style.fontSize = '10px';
        myloginUserName.style.margin = '0px';
        myloginUserName.style.padding = '0px';
        myloginUserNameLbl.style.fontSize = '12px';

        myloginPassword.style.width = '140px';
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

        for (let i = 0; i < myBtns.length; i++) {
            myBtns[i].style.width = '47px';
            myBtns[i].style.fontSize = '9px';
        }
    }
}

function isMobile() { // check if user device is mobile or not
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}
