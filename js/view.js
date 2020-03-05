const view = {
    currentScreen: null,
};

view.showComponents = async function (name) {
    view.currentScreen = name;
    switch (name) {
        case 'main': {
            view.showNav();
            let app = document.getElementById('app');
            app.innerHTML = components.nav + components.main + components.footer;

            view.showContentLeft("content-left")
            view.showListDocument("content-right", 'allUniversity', 1);


            break;
        }
        case 'productDetails': {
            let app = document.getElementById('app');
            app.innerHTML = components.nav + components.productDetails + components.footer;
            view.showProductDetails(model.currentProduct);
            let btnShowContactInfor = document.getElementById('btn-show-contact-infor')
            btnShowContactInfor.onclick = showContactInfor;
            let btnBack = document.getElementById('btn-back');
            btnBack.onclick = backToMain;

            function showContactInfor() {
                view.showContactInfor(model.currentProduct)
            }

            function backToMain() {
                view.showComponents('main');
            }


            break;
        }
        case 'personalInformation': {
            let app = document.getElementById('app');
            app.innerHTML = components.nav + components.personalInformation + components.footer;
            model.saveCurrentProfileTab('Thông tin cá nhân');
            view.showProfileLeft('profile-left-tab');
            view.showPersonalInformation('profile-right', model.currentUser);

            let formUpdateNewPhoneNumber = document.getElementById('formUpdateNewPhoneNumber');
            formUpdateNewPhoneNumber.onsubmit = changePhoneNumber;

            async function changePhoneNumber(e) {
                e.preventDefault();
                let phoneNumber = formUpdateNewPhoneNumber.newPhoneNumber.value;
                console.log(phoneNumber.length)
                let validateResult = [
                    view.validate('change-phone-number-error', [phoneNumber.length == 10, 'Số điện thoại 10 chữ số'])
                ]
                //submit date
                if (view.allPassed(validateResult)) {
                    model.currentUser.phoneNumber = phoneNumber;
                    await controller.uploadPhoneNumberProfile(phoneNumber)
                    $('#modalNewPhoneNumber').modal('hide');
                    view.showPersonalInformation('profile-right', firebase.auth().currentUser);
                }
            };

            let formChangeAvatar = document.getElementById("form-change-avatar");
            formChangeAvatar.onsubmit = changeAvatar;

            async function changeAvatar(e) {
                e.preventDefault();
                let avatar = await controller.getImage(formChangeAvatar);
                $('#modalNewAvatar').modal('hide');
                await controller.uploadAvatarProfile(avatar);
                view.showNav();
                view.showComponents('personalInformation')
            };

            let btnRandomAvatar = document.getElementById('btn-change-avatar-random');
            btnRandomAvatar.onclick = clickHandleBtnRandomAvatar;

            async function clickHandleBtnRandomAvatar() {
                let avatar = controller.randomAvatar();
                let avatarAreaShow = document.getElementById('avatar-profile');
                avatarAreaShow.src = avatar;
                await controller.uploadAvatarProfile(avatar);
                view.showNav();
                view.showComponents('personalInformation')
            };


            break;
        }
        case 'store': {
            let app = document.getElementById('app');
            app.innerHTML = components.nav + components.store + components.footer;
            model.saveCurrentProfileTab('Cửa hàng');
            view.showProfileLeft('store-left-tab');
            view.showStoreRightSelling('store-right-selling');
            view.showStoreRightSold('store-right-sold');

            let formAddDocument = document.getElementById("form-add-document");
            formAddDocument.onsubmit = formAddDocumentSubmit;

            async function formAddDocumentSubmit(e) {
                e.preventDefault();
                let documentInfo = {
                    name: formAddDocument.name.value,
                    condition: formAddDocument.condition.value,
                    price: formAddDocument.price.value,
                    image: [await controller.getImage(formAddDocument)],
                    describe: formAddDocument.describe.value,
                    university: formAddDocument.university.value,
                    createdAt: (new Date()).toLocaleDateString(),
                    owner: {
                        email: model.currentUser.email,
                        name: model.currentUser.displayName.slice(10, model.currentUser.displayName.length),
                        phoneNumber: model.currentUser.displayName.slice(0, 10),
                        photoURL: model.currentUser.photoURL
                    },
                    sellStatus: 'selling',
                    view: 0
                }
                console.log(documentInfo)
                let validateResult = [
                    view.validate('name-document', [documentInfo.name, 'Bạn cần nhập tên giáo trình']),
                    view.validate('condition-document', [
                        documentInfo.condition, 'Bạn cần nhập trạng thái của giáo trình (0->100)%',
                        documentInfo.condition > 0 && documentInfo.condition <= 100, '(0->100)%']),
                    view.validate('price-document', [
                        documentInfo.price, 'bạn cần nhập giá tiền',
                        documentInfo.price >= 1000, 'Giá nhỏ nhất là 1.000',
                    ]),
                    view.validate('university-document', [documentInfo.university, 'Missing university']),
                ];
                if (view.allPassed(validateResult)) {
                    view.disable('main-link');
                    view.disable('btn-add-document');
                    await controller.updateNewDocument(documentInfo);
                    await controller.loadDocuments();
                    view.enable('main-link');
                    view.enable('btn-add-document');
                    $("#modal-add-document").modal('hide');
                    view.showComponents('store')
                };
            };

            break;
        }
        case 'chat': {
            let app = document.getElementById('app');
            app.innerHTML = components.nav + components.chat + components.footer;
            view.showListConversation();
            view.showCurrentConversation();
            let formAddMessage = document.getElementById('form-add-message')
            formAddMessage.onsubmit = formAddMessageSubmit;
            controller.setupDatabaseChange();

            async function formAddMessageSubmit(e) {
                e.preventDefault();
                let content = formAddMessage.message.value.trim();

                if (model.currentConversation && content) {
                    view.disable('form-add-message-btn')
                    let message = {
                        content: content,
                        createAt: new Date().toISOString(),
                        owner: firebase.auth().currentUser.email,
                        isRead: false,
                    }
                    await controller.updateNewMessage(model.currentConversation.id, message);
                    formAddMessage.message.value = '';
                    // controller.setupDatabaseChange();
                    view.enable('form-add-message-btn');
                }
            }

            break;
        }
        case 'loading': {
            let app = document.getElementById('app');
            app.innerHTML = components.loading;

            await controller.loadDocuments();
            await model.saveCurrentUser();
            await view.showNav();
            model.saveCurrentUniversity('allUniversity');
            model.currentPageNumber = 1
            if (model.documents) {
                view.showComponents('main');
                controller.loadConversations();
            }

            break;
        }
        case 'login': {
            let app = document.getElementById('app');
            app.innerHTML = components.nav + components.main + components.footer + components.login;
            $(document).ready(function () {
                $("#modal-login").modal('show');
            });
            view.showContentLeft('content-left');
            view.showListDocument("content-right", model.currentUniversity, 1);

            let register = document.getElementById('register');
            register.onclick = clickHandleRegister;
            function clickHandleRegister() {
                $("#modal-login").modal('hide');
                view.showComponents('register');
            };

            let form = document.getElementById('login');
            form.onsubmit = formSubmitHandler;

            async function formSubmitHandler(e) {
                e.preventDefault();

                let logInInfo = {
                    email: form.email.value,
                    password: form.password.value
                };

                let validateResult = [view.validate('email-error', [logInInfo.email, 'Missing email']),
                view.validate('password-error', [
                    logInInfo.password, 'Missing password',
                    logInInfo.password.length >= 6, 'password must lengthest than 6',
                    logInInfo.password.length <= 32, 'password must shorter than 32'])];
                if (view.allPassed(validateResult)) {
                    $("#modal-login").modal('hide');
                    await controller.logIn(logInInfo);
                };
            };

            break;
        }
        case 'register': {
            let app = document.getElementById('app');
            app.innerHTML = components.nav + components.main + components.footer + components.register;
            $(document).ready(function () {
                $("#modal-register").modal('show');
            });
            view.showContentLeft('content-left')
            view.showListDocument("content-right", model.currentUniversity, 1);

            let returnLogin = document.getElementById('return-login');
            returnLogin.onclick = clickHandleLogin;
            function clickHandleLogin() {
                $("#modal-register").modal('hide');
                view.showComponents('login')
            };

            let form = document.getElementById('register-form')
            form.onsubmit = formSubmitHandler;

            async function formSubmitHandler(e) {
                e.preventDefault()

                let registerInfo = {
                    fullname: form.fullname.value.trim(),
                    email: form.email.value.trim().toLowerCase(),
                    phoneNumber: form.phoneNumber.value.trim(),
                    password: form.password.value.trim(),
                    confirmPassword: form.confirmPassword.value.trim()
                }

                //validate
                let validateResult = [
                    view.validate('fullname-error', [registerInfo.fullname, 'Missing fullname']),
                    view.validate('email-error', [registerInfo.email, 'Missing gmail']),
                    view.validate('phoneNumber-error', [registerInfo.phoneNumber.length == 10, 'Số điện thoại 10 chữ số',
                    registerInfo.phoneNumber, 'Missing phone number']),
                    view.validate('password-error', [
                        registerInfo.password, 'Missing password',
                        (registerInfo.password).length >= 6, 'Password length must greater than or equals 6',
                        registerInfo.password.length <= 32, 'Password length must smaller than or equals 32'
                    ]),
                    view.validate('confirm-password-error', [
                        registerInfo.confirmPassword, 'Missing confirm password',
                        registerInfo.confirmPassword.length == registerInfo.password.length, 'Password and confirm password length must greater than or equals 6'
                    ])
                ]
                if (view.allPassed(validateResult)) {
                    $("#modal-register").modal('hide');
                    await controller.register(registerInfo);
                }
            }

            break;
        }
    }
}

view.logOut = async function () {
    await firebase.auth().signOut();
    model.saveCurrentUser();
    view.showNav();
    view.showComponents('main');
}

view.search = function () {

    let searchInfo = document.getElementById('search-input').value;

    function change_alias(alias) {
        var str = alias;
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/!|@|%|\^|\*||∣|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        str = str.replace(/ + /g, " ");
        str = str.trim();
        return str.replace(/\s+/g, '');
    }

    let listDocument = model.documents;
    let listDocumentBySearch = [];

    for (let i = 0; i < listDocument.length; i++) {
        const element = listDocument[i];
        let changeWord = change_alias(element.name);
        if (element.name.indexOf(searchInfo) >= 0 || changeWord.indexOf(searchInfo) >= 0) {
            listDocumentBySearch.push(element)
        }
    }
    model.saveCurrentProductBySearch(listDocumentBySearch);
    model.saveCurrentUniversity('allUniversity');
    view.showComponents('main')
    view.showContentLeftBySearch("content-left")
    view.showListDocumentBySearch("content-right", model.currentUniversity, 1);
}

view.showProfileLeft = function (idShowArea) {
    let showArea = document.getElementById(idShowArea);
    let nameTab = ['Thông tin cá nhân', 'Cửa hàng', 'Tin nhắn'];
    let classOfNameTab = ['profile-left-tab', 'profile-left-tab', 'profile-left-tab'];
    for (let i = 0; i < nameTab.length; i++) {
        if (nameTab[i] == model.currentProfileTab) {
            classOfNameTab[i] = 'profile-left-tab active'
        }
    }
    showArea.innerHTML = `
    <p id="profile-personalInformation" class="${classOfNameTab[0]}" onclick="view.showProfileLeftBy(this)">${nameTab[0]}</p>
    <p id="profile-store" class="${classOfNameTab[1]}" onclick="view.showProfileLeftBy(this)">${nameTab[1]}</p>
    <p id="profile-message" class="${classOfNameTab[2]}" onclick="view.showProfileLeftBy(this)">${nameTab[2]}</p>`
}

view.showProfileLeftBy = function (e) {
    let id = e.id;
    let nameTab = e.innerText;
    model.saveCurrentProfileTab(nameTab);
    if (id == "profile-personalInformation") {
        view.showComponents('personalInformation');
        view.showProfileLeft('profile-left-tab');
        view.showPersonalInformation('profile-right', model.currentUser)
    }
    if (id == "profile-store") {
        view.showComponents('store');
        view.showProfileLeft('store-left-tab');
    }
    if (id == 'profile-message') {
        view.showComponents('chat');
    }
}

view.showPersonalInformation = function (idShowArea, currentUser) {
    let showArea = document.getElementById(idShowArea);
    showArea.innerHTML = `
    <h5>Thông tin cá nhân</h5>
                    <div class="row" >
                        <div class="col-sm-9">
                            <table class="table table-bordered" >
                                <tbody>
                                    <tr>
                                        <th scope="row" class="title-table">Họ và tên</th>
                                        <td>${currentUser.displayName.slice(10, currentUser.length)}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" class="title-table">Gmail đăng kí</th>
                                        <td>${currentUser.email}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" class="title-table">Số điện thoại</th>
                                        <td style="display: flex; justify-content: space-between;"> ${currentUser.displayName.slice(0, 10)}
                                            <button type="button" class="btn btn-primary"
                                                data-toggle="modal" data-target="#modalNewPhoneNumber">
                                                Thay đổi sdt
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row" class="title-table">Ngày tham gia</th>
                                        <td>${currentUser.metadata.creationTime}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="col-sm-3">
                            <p class="avatar-profile-title">Avatar</p>
                            <div style="display: flex; justify-content: center;">
                                <img class="avatar-profile" id="avatar-profile"
                                    src="${currentUser.photoURL}">
                            </div>
                            <div class="avatar-btn">
                                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalNewAvatar">
                                Thay đổi
                                </button>
                                <button type="button" class="btn btn-warning" id="btn-change-avatar-random">random</button>
                            </div>
                        </div>
                    </div>`
}

view.showStoreRightSelling = function (id) {
    let areaShow = document.getElementById(id);
    let documents = model.documents;
    let currentUser = model.currentUser.email;
    let listDocumentOfUser = [];
    for (let i = 0; i < documents.length; i++) {
        const element = documents[i];
        if (element.owner.email == currentUser && element.sellStatus == 'selling') {
            listDocumentOfUser.push(element);
        }
    }
    let s = `
                    
                        <h3 style="background-color: #efefef; ">Những sản phẩm đang bán(${listDocumentOfUser.length})</h3>
                        <div class="row row--padding-top">
                            <div class="container">
                                <table class="table table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">Tên giáo trình</th>
                                            <th scope="col">lượt xem</th>
                                            
                                            <th scope="col">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        `
    for (let i = 0; i < listDocumentOfUser.length; i++) {
        const element = listDocumentOfUser[i];
        s += `<tr>
        <th scope="row">${element.name}</th>
        <td>${element.view} lượt</td>
        <td style="display: flex;">
            <button type="button" id="edit-${element.id}" class="btn btn-warning" onclick = "view.editDocument(this)"><i
                    class="fas fa-pencil-alt"></i></button>
            <button type="button" id="del-${element.id}" class="btn btn-danger" onclick = "view.delDocument(this)"><i
                    class="fas fa-trash"></i></button>
            <button type="button" id="sold-${element.id}" class="btn btn-success" onclick = "view.soldDocument(this)"><i
                    class="fas fa-coins"></i></button>
        </td>
        </tr>`
    }
    s += `      
            </tbody>
        </table>
    </div>`
    areaShow.innerHTML = s;
};

view.showStoreRightSold = function (id) {
    let areaShow = document.getElementById(id);
    let documents = model.documents;
    let currentUser = model.currentUser.email;
    let listDocumentOfUser = [];
    for (let i = 0; i < documents.length; i++) {
        const element = documents[i];
        if (element.owner.email == currentUser && element.sellStatus == 'sold') {
            listDocumentOfUser.push(element);
        }
    }

    let s = `<h3 style="background-color: #efefef; ">Những sản phẩm đã bán thành công(${listDocumentOfUser.length})</h3>
    <table class="table table-hover table-bordered">
        <thead>
            <tr>
                <th scope="col">Tên giáo trình</th>
                <th scope="col">Ngày bán</th>
            </tr>
        </thead>
        <tbody>`
    for (let i = 0; i < listDocumentOfUser.length; i++) {
        const element = listDocumentOfUser[i];
        s += `<tr>
        <th scope="row">${element.name}</th>
        <td>${element.endAt}</td>
        </tr>`
    }
    areaShow.innerHTML = s;
};

view.delDocument = async function (e) {
    let idDocument = e.id.slice(4, e.id.length);
    let documents = model.documents;
    let documentNeedDel;
    for (let i = 0; i < documents.length; i++) {
        const element = documents[i];
        if (idDocument == element.id) {
            documentNeedDel = element;
        }
    }
    console.log(documentNeedDel)
    await controller.deleteDocument(documentNeedDel);
    await controller.loadDocuments();
    view.showStoreRightSelling('store-right-selling');
};

view.soldDocument = async function (e) {
    let idDocument = e.id.slice(5, e.id.length);
    let documents = model.documents;
    let documentNeedToChange;
    for (let i = 0; i < documents.length; i++) {
        const element = documents[i];
        if (idDocument == element.id) {
            documentNeedToChange = element;
        }
    }
    await controller.soldDocument(documentNeedToChange);
    await controller.loadDocuments();
    view.showStoreRightSelling('store-right-selling');
    view.showStoreRightSold('store-right-sold');
};

view.editDocument = function (e) {
    let idDocument = e.id.slice(5, e.id.length);
    let documents = model.documents;
    let documentNeedEdit;
    for (let i = 0; i < documents.length; i++) {
        const element = documents[i];
        if (idDocument == element.id) {
            documentNeedEdit = element;
        }
    }
    console.log(documentNeedEdit);
    let formFixDocument = document.getElementById('form-fix-document');
    $('#modal-fix-document').modal('show');
    formFixDocument.innerHTML = `
<div style="border-bottom: 1px solid #ddd">
                                        <div class="form-row" style="padding-top: 1rem;">
                                            <div class="col-sm-6 mb-3">
                                                <input type="text" class="form-control" name="name" value="${documentNeedEdit.name}"
                                                    placeholder="Tên giáo trình">
                                                <span id="name-document-edit" class="message-error"></span>
                                            </div>
                                            <div class="col-sm-6 mb-3">
                                            <select class="custom-select" name="university" >
                                            <option value="${documentNeedEdit.university}">${documentNeedEdit.university}</option>
                                            <option value="Bách khoa Hà Nội">Bách khoa Hà Nội</option>
                                            <option value="Công đoàn">Công đoàn</option>
                                            <option value="Công nghệ giao thông vận tải">Công nghệ giao thông vận tải</option>
                                            <option value="Tài nguyên và môi trường">Tài nguyên và môi trường</option>
                                            <option value="Công nghiệp">Công nghiệp</option>
                                            <option value="Dược Hà Nội">Dược Hà Nội</option>
                                            <option value="Điện lực">Điện lực</option>
                                            <option value="Giao thông vận tải">Giao thông vận tải</option>
                                            <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
                                            <option value="Khoa học xã hội và nhân văn">Khoa học xã hội và nhân văn</option>
                                            <option value="Kiến trúc">Kiến trúc</option>
                                            <option value="Fpt">Fpt</option>
                                            </select> 
                                            <span id="university-document" class="message-error"></span>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-sm-6 mb-3">
                                                <input type="number" class="form-control" name="condition" value="${documentNeedEdit.condition}"
                                                    placeholder="Tình trạng">
                                                <span id="condition-document-edit" class="message-error"></span>
                                            </div>
                                            <div class="col-sm-6 mb-3">
                                                <input type="number" class="form-control" name="price" value="${documentNeedEdit.price}"
                                                    placeholder="Giá">
                                                <span id="price-document-edit" class="message-error"></span>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div id="form-add-image" class="col-sm-6 mb-3">
                                                <div class="card-add-image">
                                                    <input type="file" name="image" id="fileButton" accept="image/*" />
                                                </div>
                                            </div>
                                            <div class="col-sm-6 mb-3">
                                                <textarea class="form-control" rows="3" name="describe"
                                                >${documentNeedEdit.describe}</textarea>
                                            </div>
                                        </div>  
                                    </div>
                                    <button class="btn btn-primary" type="submit">Đăng</button>
                                    <button class="btn btn-danger" id="main-link">Hủy</button>`;

    $("#form-fix-document").submit(async function (event) {
        event.preventDefault();

        let documentInfo = {
            id: documentNeedEdit.id,
            createdAt: documentNeedEdit.createdAt,
            owner: documentNeedEdit.owner,
            sellStatus: documentNeedEdit.owner,
            name: formFixDocument.name.value,
            university: formFixDocument.university.value,
            condition: formFixDocument.condition.value,
            image: documentNeedEdit.image,
            price: formFixDocument.price.value,
            describe: formFixDocument.describe.value,
            view: documentNeedEdit.view
        }
        let validateResult = [
            view.validate('name-document-edit', [documentInfo.name, 'Bạn cần nhập tên giáo trình']),
            view.validate('condition-document-edit', [
                documentInfo.condition, 'Bạn cần nhập trạng thái của giáo trình (0->100)%',
                documentInfo.condition > 0 && documentInfo.condition <= 100, '(0->100)%']),
            view.validate('price-document-edit', [
                documentInfo.price, 'bạn cần nhập giá tiền',
                documentInfo.price >= 1000, 'Giá nhỏ nhất là 1.000',
            ]),
        ];
        if (view.allPassed(validateResult)) {
            await controller.EditDocument(documentInfo);
            $('#modal-fix-document').modal('hide');
            await controller.loadDocuments();
            view.showStoreRightSelling('store-right-selling');
            console.log('a')
        };
    });
};

view.showContentLeft = async function (id) {
    let areaShow = document.getElementById(id);
    let s = '<h4>Danh mục sản phẩm</h4>';
    let listDocumentAll = [];
    let listDocument = [];
    let listUniversity = [];
    let listUniversityClean = []
    if (!model.documents) {
        await controller.loadDocuments();
        listDocumentAll = model.documents;
    }
    else {
        listDocumentAll = model.documents;
    }
    for (let i = 0; i < listDocumentAll.length; i++) {
        const element = listDocumentAll[i];
        if (element.sellStatus == 'selling') {
            listDocument.push(element)
        }
    }

    let classNameOfAll = (model.currentUniversity == 'allUniversity')
        ? 'university current'
        : 'university';
    s += `
        <p id="allUniversity" class="${classNameOfAll}" onclick="view.showListDocumentBy(this)">Tất cả<small>(${listDocument.length})</small></p>`
    for (let i = 0; i < listDocument.length; i++) {
        const element = listDocument[i];
        listUniversity.push(element.university);
    }
    let uniqueSet = new Set(listUniversity);
    listUniversityClean = [...uniqueSet];
    for (let i = 0; i < listUniversityClean.length; i++) {
        let number = 0;
        for (let j = 0; j < listUniversity.length; j++) {
            if (listUniversityClean[i] == listUniversity[j]) {
                number++;
            }
        }
        let className = (model.currentUniversity == listUniversityClean[i])
            ? 'university current'
            : 'university';
        s += `
            <p class="${className}" id="${listUniversityClean[i]}" onclick="view.showListDocumentBy(this)">${listUniversityClean[i]}<small>(${number})</small></p>`

    }
    areaShow.innerHTML = s;
};

view.showListDocumentBy = async function (e) {
    let NameUniversity = e.id;
    model.saveCurrentPageNumber(1)
    model.saveCurrentUniversity(NameUniversity);
    if (NameUniversity == 'allUniversity') {
        view.showContentLeft('content-left');
        view.showListDocument('content-right', NameUniversity, 1);
    } else {
        let listDocument = model.documents;
        for (let i = 0; i < listDocument.length; i++) {
            const element = listDocument[i];
            if (element.university === NameUniversity) {
                view.showContentLeft('content-left')
                view.showListDocument('content-right', NameUniversity, 1)
            };
        };
    };
};

view.showListDocument = async function (id, nameUniversity, numberOfPage) {
    let areaShow = document.getElementById(id);
    let listDocumentAll = [];
    if (!model.documents) {
        await controller.loadDocuments();
        listDocumentAll = model.documents;
    }
    else {
        listDocumentAll = model.documents;
    }
    let listDocument = []
    if (nameUniversity != 'allUniversity') {
        let listDocumentUniversity = [];
        for (let i = 0; i < listDocumentAll.length; i++) {
            const element = listDocumentAll[i];
            if (element.university == nameUniversity && element.sellStatus == 'selling') {
                listDocumentUniversity.push(element);
            };
        };
        listDocument = listDocumentUniversity;
    }
    else {
        for (let i = 0; i < listDocumentAll.length; i++) {
            const element = listDocumentAll[i];
            if (element.sellStatus == 'selling') {
                listDocument.push(element)
            }
        }
    }
    let s = `<div class="title-body">
    <div class="row">
        <div class="col-sm-10">
            <h4>Sản phẩm(${listDocument.length})</h4>
        </div>
        <div class="col-sm-2">
            <button type="button" class="btn btn-info" id="btn-compare" onclick="view.showListDocumentCompare('infor-compare')">So sánh</button>
        </div>
    </div>
    </div>`;
    let start, end, keyNumber, itemCount;
    if (listDocument.length <= 12) {
        start = ((numberOfPage - 1) * 12) + 1;
        end = listDocument.length;
        keyNumber = view.keyNumber();
        itemCount = Math.ceil(listDocument.length / keyNumber);

    }
    else {
        keyNumber = view.keyNumber();
        start = ((numberOfPage - 1) * 12) + 1;
        if (listDocument.length < (start + 12)) {
            end = listDocument.length;
            itemCount = Math.ceil((end - (numberOfPage - 1) * 12) / keyNumber);
        }
        else {
            end = start + 12;
            itemCount = Math.ceil(12 / keyNumber);
        };
    };
    for (let i = start - 1 - (numberOfPage - 1) * 12; i < itemCount; i++) {
        s += `<div class="row row--padding-top">  
                    <div class="card-group" style="min-width: 850px">`
        for (let j = i * keyNumber; j < i * keyNumber + keyNumber; j++)
            if (j < (end - (numberOfPage - 1) * 12)) {
                console.log(j, end - (numberOfPage - 1) * 12)
                const element = listDocument[j + (numberOfPage - 1) * 12];
                s += `<div class="col-md-6 col-lg-4 col-xl-3 card--padding-right">
                    <div class="card card--hover" id="${element.id}" onclick = "view.moveToProductDetails(this)" style="width: 200px;">
                        <img src="${element.image}"
                        class="card-img-top" alt="..." style="height: 200px; min-width: 150px">
                        <div class="card-body">
                            <p class="card-title card-title__name"><Strong>${element.name}</Strong></p>
                            <p>${view.numberWithCommas(element.price)}đ</p>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" style="width: ${element.condition}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${element.condition}%</div>
                            </div>
                        </div>
                    </div>
                </div>`
            }
        s += `</div>
    </div>`
    };
    s += view.showPagination(listDocument)
    areaShow.innerHTML = s
};

view.keyNumber = function () {
    var width = $(window).width();
    if (width < 768) {
        return model.documents.length;
    };
    if (width < 992 && width >= 768) {
        return 2;
    };
    if (width < 1200 && width >= 992) {
        return 3;
    };
    if (width >= 1200) {
        return 4;
    };
};

view.moveToProductDetails = async function (e) {
    $('#modal-compare').modal('hide');
    let id = e.id;
    let listDocument = model.documents;
    let document;
    for (let i = 0; i < listDocument.length; i++) {
        const element = listDocument[i];
        if (id == element.id) {
            model.saveCurrentProduct(element);
            document = element;
        };
    };
    controller.upView(document)
    view.showComponents('productDetails');
};

view.showProductDetails = function (product) {
    let showArea = document.getElementById('tableShowDetailProduct');
    showArea.innerHTML = `
    <table class="table table-bordered">
            <tbody>
              <tr>
                <th scope="row" class="title-table">Tên giáo trình</th>
                <td>${product.name}</td>
              </tr>
              <tr>
                <th scope="row" class="title-table">Tình trạng</th>
                <td>${product.condition}</td>
              </tr>
              <tr>
                <th scope="row" class="title-table">Giá</th>
                <td>${product.price}</td>
              </tr>
              <tr>
                <th scope="row" class="title-table">Thời gian đăng</th>
                <td>${product.createdAt}</td>
              </tr>
              <tr>
                <th scope="row" class="title-table">Người bán</th>
                <td>${product.owner.name}</td>
              </tr>
              <tr>
                <th scope="row" class="title-table">Ghi chú thêm</th>
                <td>${product.describe}</td>
              </tr>
            </tbody>
          </table>
          <div>
            <img style="width: 100px;
              height: 100px; border: 2px solid black" src="${product.image}" />
          </div>`
};

view.showContactInfor = function (product) {
    let ContactInfor = document.getElementById("contactInfor");
    ContactInfor.innerHTML = `
    <table class="table">
          <tbody>
            <tr>
              <th scope="row" class="title-table">Số điện thoại</th>
              <td>${product.owner.phoneNumber}</td>
            </tr>
            <tr>
              <th scope="row" class="title-table">Message</th>
              <td>
                <div id="${product.id}" class='chat-element' onclick="view.moveToChat(this)">
                    <img src="${product.owner.photoURL}"
                    class="avatar" alt="Avatar">
                    ${product.owner.name}
                </div>
            </td>
            </tr>
          </tbody>
        </table>`
};

view.moveToChat = async function (e) {
    if (!model.currentUser) {
        alert('Bạn cần đăng nhập để sử dụng tính năng!')
    }
    else {
        let idOfProduct = e.id;
        let listDocument = model.documents;
        let emailOfOwner, avatarOfOwner;
        for (let index = 0; index < listDocument.length; index++) {
            const element = listDocument[index];
            if (idOfProduct == element.id) {
                emailOfOwner = element.owner.email;
                avatarOfOwner = element.owner.photoURL;
                emailOfCustomer = firebase.auth().currentUser.email;
                avatarOfcustomer = firebase.auth().currentUser.photoURL;
            }
        }
        if (model.currentUser.email == emailOfOwner) {
            alert('Sản phẩm này của bạn!')
        }
        else {
            let first = 'true'
            for (let i = 0; i < model.listConversation.length; i++) {
                const element = model.listConversation[i];
                if ((element.users[0] == model.currentUser.email && element.users[1] == emailOfOwner)
                    || (element.users[0] == emailOfOwner && element.users[1] == model.currentUser.email)) {
                    first = 'false';
                    break;
                }
            }
            if (first == 'true') {
                let newConversation = {
                    createdAt: (new Date()).toLocaleDateString(),
                    messages: [
                        {
                            content: `${model.currentProduct.name + '</br>'}
                            ${view.numberWithCommas(model.currentProduct.price) + 'đ</br>'}
                            ${model.currentProduct.condition + '%</br>'}
                            ${model.currentProduct.university}`,
                            createdAt: (new Date()).toISOString(),
                            owner: model.currentUser.email,
                            isRead: false,
                        },
                    ],
                    title: {
                        emailOwner: emailOfOwner,
                        avatarOwner: avatarOfOwner,
                        emailCustomer: model.currentUser.email,
                        avatarCustomer: model.currentUser.photoURL
                    },
                    users: [firebase.auth().currentUser.email, emailOfOwner]
                }
                await controller.updateNewConversation(newConversation);
                await controller.loadConversations();
                console.log(model.listConversation)
                for (let i = 0; i < model.listConversation.length; i++) {
                    const element = model.listConversation[i];
                    if (element.users.owner == firebase.auth().currentUser.email && element.users.customer == emailOfOwner) {
                        model.saveCurrentConversation(element);
                        console.log(model.currentConversation);
                    }
                }
                view.showComponents('chat');
                view.showListConversation();
                view.showCurrentConversation();
            }
            else {
                let listConversation = model.listConversation;
                for (let i = 0; i < listConversation.length; i++) {
                    const element = listConversation[i];
                    if ((element.users[0] == model.currentUser.email && element.users[1] == emailOfOwner)
                        || (element.users[1] == model.currentUser.email && element.users[0] == emailOfOwner)) {
                        model.saveCurrentConversation(element);
                    }
                }
                view.showComponents('chat')
            }
        }
    }
}

view.showListConversation = async function () {
    let bossAvatar = document.getElementById('avatar-boss');
    bossAvatar.src = firebase.auth().currentUser.photoURL;
    if (model.listConversation.length > 0) {
        let listconversation = model.listConversation;
        let idListConversation = document.getElementById('list-conversation');
        for (let conversation of listconversation) {
            let id = conversation.id;
            if (model.currentUser) {
                let className = (model.currentConversation && model.currentConversation.id == conversation.id)
                    ? 'chat-element current'
                    : 'chat-element';
                if (model.currentUser.email == conversation.title.emailOwner) {
                    idListConversation.innerHTML += `
                        <div class='${className}' id="${id}">
                            <img src="${conversation.title.avatarCustomer}"
                            class="avatar" alt="Avatar">
                            ${conversation.title.emailCustomer}
                        </div>
            `
                }
                else {
                    idListConversation.innerHTML += `
            <div class='${className}' id="${id}">
            <img src="${conversation.title.avatarOwner}"
                    class="avatar" alt="Avatar">
                ${conversation.title.emailOwner}
            </div>
            `;
                }
            }
        }
        for (let conversation of listconversation) {
            let conversationId = conversation.id;
            let conversationCard = document.getElementById(conversationId);

            conversationCard.onclick = function () {
                model.saveCurrentConversation(conversation);
                idListConversation.innerHTML = ''
                view.showListConversation();
                view.showCurrentConversation();
            }
        }
    }

    else {
        alert('Bạn chưa có cuộc hội thoại nào!');
        view.showComponents('main')
    }
}

view.showCurrentConversation = function () {
    if (model.currentConversation) {
        // get all messages
        let messages = model.currentConversation.messages;
        let listMessage = document.getElementById('list-message');
        listMessage.innerHTML = "";
        for (let message of messages) {
            let content = message.content;
            let owner = message.owner;
            let currentEmail = firebase.auth().currentUser.email;
            let className = '';
            if (owner == currentEmail) {
                className = "message your"
            }
            else {
                className = "message"
            }
            let html = `
            <div class="${className}">
                <span>${content}</span>
            </div>
            `
            listMessage.innerHTML += html;
        }
        listMessage.scrollTop = listMessage.scrollHeight;
    }
}

view.showNumberOfMessagesWaiting = function () {
    let idShowInNav = document.getElementById('nav-message-btn');
    let totalOfNumber = 0;
    for (let i = 0; i < model.numberOfMessagesWaiting.length; i++) {
        const element = model.numberOfMessagesWaiting[i];
        totalOfNumber = totalOfNumber + element.numberOfWaiting.length;
    }
    idShowInNav.innerHTML = `<i class="fab fa-facebook-messenger"></i><span class="badge badge-danger">${totalOfNumber}</span>`
}

view.showNav = async function () {
    if (model.currentUser) {
        components.nav = `<section class="mynav">
        <div class="container">
            <div class="row">
                <div class="col-sm-2">
                    <img src="img/logo.png" alt="logo" class="logo" id="logo" onclick="view.showComponents('main')"/>
                </div>
                <div class="col-sm-4 nav-center">
                    <form id="search">
                        <div class="input-group mb-3">
                            <input id="search-input" type="text" onsubmit="" class="form-control" style="width: 300px"
                                placeholder="Tìm kiếm giáo trình mong muốn...">
                            <div class="input-group-append">
                                <button class="btn btn-outline-info" type="submit" id="search-button" onclick="view.search()"><i
                                        class="fas fa-search"></i></button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="col-sm-4">
                    <div class="nav-right">
                        <div class="row">
                            <div class="col-6" style="padding: 0px">
                                <div class="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" id="nav-for-sale-btn" class="btn btn-outline-primary" onclick="view.showComponents('store')"><i class="fas fa-store"></i></button>
                                    <button type="button" id="nav-message-btn" class="btn btn-outline-primary" onclick="view.showComponents('chat')"><i class="fab fa-facebook-messenger"></i></button>
                                  </div>
                            </div>
                            <div class="col-6">
                                <ul class="nav navbar-nav navbar-right ml-auto">
                                    <li class="nav-item dropdown">
                                        <a style="color: rgb(206, 212, 218); padding: 0px" data-toggle="dropdown" class="nav-link dropdown-toggle user-action" >
                                            <img src="${model.currentUser.photoURL}"
                                                class="avatar" alt="Avatar"> ${model.currentUser.displayName.slice(10, model.currentUser.displayName.length)}
                                            <b class="caret"></b>
                                        </a>
                                        <ul class="dropdown-menu">
                                            <li><a href="#" id="dropdown-profile-btn" onclick="view.showComponents('personalInformation')" class="dropdown-item"><i class="fa fa-user-o"></i>
                                                    Thông tin cá nhân</a></li>
                                            <li><a href="#" id="dropdown-for-sale-btn" onclick="view.showComponents('store')" class="dropdown-item"><i class="fa fa-calendar-o"></i>
                                                    Cửa hàng</a></li>
                                            <li><a href="#" id="dropdown-message-btn" onclick="view.showComponents('chat')"  class="dropdown-item"><i class="fab fa-facebook-messenger"></i>
                                                    Tin nhắn</a></li>
                                            <li class="divider dropdown-divider"></li>
                                            <li><a href="#" id="dropdown-signout-btn" onclick="view.logOut()" class="dropdown-item"><i class="fas fa-sign-out-alt"></i>
                                                    Đăng xuất</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>`
    }
    else {
        components.nav = components.navBarNoActive;
    };
};

view.numberWithCommas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

view.validate = function (idErrorTag, validateInfos) {

    for (let i = 0; i < validateInfos.length; i += 2) {
        let condition = validateInfos[i];
        let message = validateInfos[i + 1];
        if (!condition) {
            view.setText(idErrorTag, message);
            return false;
        }
    };
    return true;
};

view.setText = function (id, text) {
    document.getElementById(id).innerHTML = text;
};

view.allPassed = function (validateResult) {
    for (let result of validateResult) {
        if (!result) {
            return false;
        };
    };
    return true;
};

view.disable = function (id) {
    document.getElementById(id).setAttribute('disabled', true)
};

view.enable = function (id) {
    document.getElementById(id).removeAttribute('disabled')
};

view.showPagination = function (listDocument, bySearch) {
    let numberPage = Math.ceil(listDocument.length / 12);
    let s = `<div class="pagination">
    <nav aria-label="Page navigation example">
        <ul class="pagination">`;
    for (let i = 0; i < numberPage; i++) {
        let className = (model.currentPageNumber == i + 1)
            ? 'page-item active'
            : 'page-item';
        if (bySearch == 'bySearch') {
            s += `<li class="${className}" onclick="view.showListDocumentByPaginationBySearch(this)"><a class="page-link" >${i + 1}</a></li>`
        }
        else {
            s += `<li class="${className}" onclick="view.showListDocumentByPagination(this)"><a class="page-link" >${i + 1}</a></li>`
        }
    };
    s += `      </ul>
            </nav>
        </div>`
    return s;
};

view.showListDocumentByPagination = function (e) {
    let pageNumber = e.innerText;
    model.currentPageNumber = pageNumber
    view.showListDocument('content-right', model.currentUniversity, pageNumber);
};

view.showListDocumentByPaginationBySearch = function (e) {
    let pageNumber = e.innerText;
    model.currentPageNumber = pageNumber
    view.showListDocumentBySearch('content-right', model.currentUniversity, pageNumber);
};

view.showContentLeftBySearch = async function (id) {
    let areaShow = document.getElementById(id);
    let s = '<h4>Danh mục sản phẩm</h4>';
    let listDocumentAll = [];
    let listDocument = [];
    let listUniversity = [];
    let listUniversityClean = []
    if (model.currentProductBySearch) {
        listDocumentAll = model.currentProductBySearch;
    }
    for (let i = 0; i < listDocumentAll.length; i++) {
        const element = listDocumentAll[i];
        if (element.sellStatus == 'selling') {
            listDocument.push(element)
        }

    }
    let classNameOfAll = (model.currentUniversity == 'allUniversity')
        ? 'university current'
        : 'university';
    s += `<p  id='allUniversity' onclick="view.showListDocumentBySearchBy(this)" class="${classNameOfAll}">Tất cả<small>(${listDocument.length})</small></p>`
    for (let i = 0; i < listDocument.length; i++) {
        const element = listDocument[i];
        listUniversity.push(element.university);
    }
    let uniqueSet = new Set(listUniversity);
    listUniversityClean = [...uniqueSet];
    for (let i = 0; i < listUniversityClean.length; i++) {
        let number = 0;
        for (let j = 0; j < listUniversity.length; j++) {
            if (listUniversityClean[i] == listUniversity[j]) {
                number++;
            }
        }
        let className = (model.currentUniversity == listUniversityClean[i])
            ? 'university current'
            : 'university';
        s += `<p onclick="view.showListDocumentBySearchBy(this)" id="${listUniversityClean[i]}" class="${className}">${listUniversityClean[i]}<small>(${number})</small></p>`
    }
    areaShow.innerHTML = s;
}

view.showListDocumentBySearchBy = async function (e) {
    let nameUniversity = e.id;
    model.saveCurrentPageNumber(1)
    model.saveCurrentUniversity(nameUniversity);
    if (nameUniversity == 'allUniversity') {
        view.showContentLeftBySearch('content-left');
        view.showListDocumentBySearch('content-right', nameUniversity, 1);
    } else {
        let listDocument = model.documents;
        for (let i = 0; i < listDocument.length; i++) {
            const element = listDocument[i];
            if (element.university === nameUniversity) {
                view.showContentLeftBySearch('content-left')
                view.showListDocumentBySearch('content-right', nameUniversity, 1)
            };
        };
    };
};

view.showListDocumentBySearch = async function (id, nameUniversity, numberOfPage) {
    let areaShow = document.getElementById(id);
    let listDocumentAll = []
    let listDocument = [];
    if (model.currentProductBySearch) {
        listDocumentAll = model.currentProductBySearch;
    }
    for (let i = 0; i < listDocumentAll.length; i++) {
        const element = listDocumentAll[i];
        if (element.sellStatus == 'selling') {
            listDocument.push(element)
        }
    }
    if (nameUniversity != 'allUniversity') {
        let listDocumentUniversity = [];
        for (let i = 0; i < listDocument.length; i++) {
            const element = listDocument[i];
            if (element.university == nameUniversity) {
                listDocumentUniversity.push(element);
            }
        }
        listDocument = listDocumentUniversity;
    }
    let s = `<div class="title-body">
    <div class="row">
        <div class="col-sm-10">
            <h4>Sản phẩm(${listDocument.length})</h4>
        </div>
        <div class="col-sm-2">
            <button type="button" class="btn btn-info" id="btn-compare-by-search" onclick="view.showListDocumentCompare('infor-compare',1)">So sánh</button>
        </div>
    </div>
    </div>`;
    let start, end, keyNumber, itemCount;
    if (listDocument.length <= 12) {
        start = ((numberOfPage - 1) * 12) + 1;
        end = listDocument.length;
        keyNumber = view.keyNumber();
        itemCount = Math.ceil(listDocument.length / keyNumber);
    }
    else {
        keyNumber = view.keyNumber();
        start = ((numberOfPage - 1) * 12) + 1;
        if (listDocument.length < (start + 12)) {
            end = listDocument.length;
            itemCount = Math.ceil((end - (numberOfPage - 1) * 12) / keyNumber)
        }
        else {
            end = start + 12;
            itemCount = Math.ceil(12 / keyNumber)
        }
    }
    for (let i = start - 1 - (numberOfPage - 1) * 12; i < itemCount; i++) {
        s += `<div class="row row--padding-top">  
                    <div class="card-group" style="min-width: 850px">`
        for (let j = i * keyNumber; j < i * keyNumber + keyNumber; j++)
            if (j < (end - (numberOfPage - 1) * 12)) {
                const element = listDocument[j + (numberOfPage - 1) * 12];
                s += `<div class="col-md-6 col-lg-4 col-xl-3 card--padding-right">
                        <div class="card card--hover" id="${element.id}" onclick = "view.moveToProductDetails(this)" style="min-width: 200px">
                        <img src="${element.image}"
                        class="card-img-top" alt="..." style="height: 200px; min-width: 150px">
                        <div class="card-body">
                            <p class="card-title card-title__name"><Strong>${element.name}</Strong></p>
                            <p>${view.numberWithCommas(element.price)}đ</p>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" style="width: ${element.condition}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${element.condition}%</div>
                            </div>
                        </div>
                    </div>
                </div>`
            }
        s += `</div>
    </div>`
    }
    s += view.showPagination(listDocument, 'bySearch')
    areaShow.innerHTML = s
}

view.showListDocumentCompare = async function (id, listDocumentCompare) {
    $('#modal-compare').modal('show');
    let areaShow = document.getElementById(id);
    let listDocumentAll = [];
    let listDocument = [];
    let s = `<table class="table table-striped table-dark" >
    <thead>
       <tr>
        <th scope="col">STT</th>
        <th scope="col">Tên Sản Phẩm</th>
        <th scope="col">Ngày Đăng</th>
        <th scope="col">Giá</th>
        <th scope="col">Tình trạng</th>
      </tr>
    </thead>
    <tbody>`
    if (!listDocumentCompare) {
        if (!model.documents) {
            await controller.loadDocuments();
            listDocumentAll = model.documents;
        }
        else {
            listDocumentAll = model.documents;
        }
    }
    else {
        listDocumentAll = model.currentProductBySearch;
    }
    for (let i = 0; i < listDocumentAll.length; i++) {
        const element = listDocumentAll[i];
        if (element.sellStatus == 'selling') {
            listDocument.push(element)
        }

    }
    let listDocumentUniversity = [];
    if (model.currentUniversity != 'allUniversity') {
        for (let i = 0; i < listDocument.length; i++) {
            const element = listDocument[i];
            if (element.university == model.currentUniversity) {
                listDocumentUniversity.push(element)
            }
        };
    }
    else {
        listDocumentUniversity = listDocument;
    }
    function compareValues(key, order = 'asc') {
        return function (a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // không tồn tại tính chất trên cả hai object
                return 0;
            }

            const varA = (typeof a[key] === 'string') ?
                a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ?
                b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA < varB) {
                comparison = 1;
            } else if (varA > varB) {
                comparison = -1;
            }
            return (
                (order == 'desc') ? (comparison * -1) : comparison
            );
        };
    }

    listDocumentUniversity.sort(compareValues('condition'));


    for (let i = 0; i < listDocumentUniversity.length; i++) {
        const element = listDocumentUniversity[i];
        s += `
          <tr class="row-compare" id="${element.id}" onclick="view.moveToProductDetails(this)">
            <th scope="row">${i + 1}</th>
            <th scope="row">${element.name}</th>       
            <th scope="row">${element.createdAt}</th>
            <th scope="row">${view.numberWithCommas(element.price)}</th>  
            <th scope="row"><div class="progress">
            <div class="progress-bar" role="progressbar" style="width: ${element.condition}%;"  aria-valuemin="0" aria-valuemax="100">${element.condition}%</div>
          </div></th>       
          </tr>  `
    }
    s += `</tbody>
    </table>`
    areaShow.innerHTML = s;
}

view.toAdmin = async function (nameOfOwner) {

    if (!model.currentUser) {
        alert('Bạn cần đăng nhập để sử dụng tính năng!')
    }
    else {

        let first = 'true'
        for (let i = 0; i < model.listConversation.length; i++) {
            const element = model.listConversation[i];
            if ((element.users[0] == model.currentUser.email && element.users[1] == nameOfOwner)
                || (element.users[0] == nameOfOwner && element.users[1] == model.currentUser.email)) {
                first = 'false';
                break;
            }
        }
        if (first == 'true') {
            let message = {};
            if (nameOfOwner == 'Admin') {
                message = {
                    content: 'Chúng tôi có thể giúp gì bạn!',
                    createdAt: (new Date).toLocaleDateString(),
                    isRead: false,
                    owner: `${nameOfOwner}`,
                }
            }
            else {
                message = {
                    content: 'Sản phẩm đang trong quá trình thử nghiêm!</br>Mọi góp ý và báo lỗi của bạn sẽ giúp chúng tôi hoàn thiện sản phẩm hơn.',
                    createdAt: (new Date).toLocaleDateString(),
                    isRead: false,
                    owner: `${nameOfOwner}`,
                }
            }
            let conversationInfo = {
                createdAt: (new Date()).toLocaleDateString(),
                messages: [
                    message
                ],
                title: {
                    avatarCustomer: firebase.auth().currentUser.photoURL,
                    avatarOwner: 'https://firebasestorage.googleapis.com/v0/b/old-documents-ddfe9.appspot.com/o/idUser%2Flogo.png?alt=media',
                    emailCustomer: firebase.auth().currentUser.email,
                    emailOwner: `${nameOfOwner}`
                },
                users: [
                    firebase.auth().currentUser.email,
                    `${nameOfOwner}`
                ]
            }
            console.log(conversationInfo);
            await controller.updateNewConversation(conversationInfo);
            await controller.loadConversations();
            view.showComponents('chat');
        }
        else {
            let listConversation = model.listConversation;
            for (let i = 0; i < listConversation.length; i++) {
                const element = listConversation[i];
                if ((element.users[0] == model.currentUser.email && element.users[1] == nameOfOwner)
                    || (element.users[1] == model.currentUser.email && element.users[0] == nameOfOwner)) {
                    model.saveCurrentConversation(element);
                }
            }
            view.showComponents('chat')
        }
    }
}