const controller = {};

controller.updateNewDocument = async function (document) {
    return firebase
        .firestore()
        .collection('documents')
        .add(document);
}

controller.soldDocument = async function (document) {
    let documentId = document.id;
    let now = new Date();
    firebase
        .firestore()
        .collection('documents')
        .doc(documentId)
        .update({
            sellStatus: 'sold',
            endAt: now.toLocaleDateString()
        })
}

controller.upView = async function (document) {
    let documentId = document.id;
    firebase
        .firestore()
        .collection('documents')
        .doc(documentId)
        .update({
            view: `${parseInt(document.view) + 1}`,
        })
}

controller.deleteDocument = async function (document) {
    let documentId = document.id;
    await firebase
        .firestore()
        .collection('documents')
        .doc(documentId)
        .delete()
        .then(function () {
            alert('Xoá thành công!')
        })
        .catch(function (error) {
            alert(error)
        })
}

controller.EditDocument = async function (document) {
    let documentId = document.id;
    firebase
        .firestore()
        .collection('documents')
        .doc(documentId)
        .update({
            name: document.name,
            university: document.university,
            condition: document.condition,
            price: document.price,
            describe: document.describe,
        })
}

controller.getImage = async function (form) {
    try {
        let files = form.image.files;
        let file = files[0];
        if (!file) {
            throw new Error("Please chosse a file");
        }
        link = await controller.upload(file);
    } catch (err) {
        alert(err.message)
    };
    return link;
};

controller.upload = async function (file) {
    let fileName = file.name;
    let filePath = `idUser/${fileName}`;
    let fileRef = firebase.storage().ref().child(filePath);
    await fileRef.put(file);
    let fileLink = controller.getFileUrl(fileRef);
    return fileLink;
}

controller.getFileUrl = async function (fileRef) {
    return `https://firebasestorage.googleapis.com/v0/b/${fileRef.bucket}/o/${encodeURIComponent(fileRef.fullPath)}?alt=media`
}

controller.loadDocuments = async function () {
    //get many conversations
    // let currentEmail = firebase.auth().currentUser.email;
    let results = await firebase
        .firestore()
        .collection('documents')
        // .where('users','array-contains', currentEmail)
        .get();
    let documents = transformDocs(results.docs);
    model.saveDocuments(documents);

    let listUniversity = [];
    for (let i = 0; i < documents.length; i++) {
        const element = documents[i];
        listUniversity.push(element.university);
    };

    let uniqueSet = new Set(listUniversity);
    listUniversityClean = [...uniqueSet];
};

controller.loadConversations = async function () {
    if (model.currentUser) {
        let currentEmail = await firebase.auth().currentUser.email;
        let results = await firebase
            .firestore()
            .collection('conversations')
            .where('users', 'array-contains', currentEmail)
            .get();
        let conversations = transformDocs(results.docs);
        model.saveListConversation(conversations);
        model.saveCurrentConversation(model.listConversation[0])
        controller.countWaitingMessage()
    }
    else {
        model.listConversation = []
    }
};

controller.updateNewMessage = function (conversationId, message) {
    return firebase
        .firestore()
        .collection('conversations')
        .doc(conversationId)
        .update({
            messages: firebase.firestore.FieldValue.arrayUnion(message)
        })
}

controller.setupDatabaseChange = function () {
    let currentEmail = firebase.auth().currentUser.email;
    let isFirstRun = true;

    firebase
        .firestore()
        .collection('conversations')
        .where('users', 'array-contains', currentEmail)
        .onSnapshot(function (snapshot) {
            if (isFirstRun) {
                isFirstRun = false;
                return
            }
            let docChanges = snapshot.docChanges();
            for (docChange of docChanges) {
                if (docChange.type == 'modified') {
                    let conversationChange = transformDoc(docChange.doc);
                    console.log(conversationChange)
                    model.updateConversation(conversationChange);
                    controller.countWaitingMessage(conversationChange)
                    view.showCurrentConversation();
                }
                if (docChanges.type == 'added') {
                    let conversationChange = transformDoc(docChange.doc);
                    model.updateConversation(conversationChange);
                    controller.countWaitingMessage(conversationChange)
                    view.showListConversation();
                }
            }
        })
}

// controller.numberOfMessagesWaiting = function (docChange) {
//     model.numberOfMessagesWaiting;
//     if (docChange.doc._hasPendingWrites == false) {
//         console.log(model.numberOfMessagesWaiting)
//         if (!model.numberOfMessagesWaiting) {
//             console.log('1')
//             model.numberOfMessagesWaiting = [];
//             model.numberOfMessagesWaiting.push({
//                 idConversation: docChange.doc.id,
//                 numberOfMessagesWaiting: 1
//             })
//         } else {
//             for (let i = 0; i < model.numberOfMessagesWaiting.length; i++) {
//                 const element = model.numberOfMessagesWaiting[i];
//                 if (element.idConversation == docChange.doc.id) {
//                     element.numberOfMessagesWaiting++;
//                 }
//                 else {
//                     model.numberOfMessagesWaiting.push({
//                         idConversation: docChange.doc.id,
//                         numberOfMessagesWaiting: 0
//                     })
//                 }
//             }
//         }
//         view.showNumberOfMessagesWaiting();
//     }
//     console.log(model.numberOfMessagesWaiting);
// }

controller.countWaitingMessage = async function (conversationChange) {
    if (model.numberOfMessagesWaiting) {
        if (conversationChange) {
            for (let i = 0; i < model.numberOfMessagesWaiting.length; i++) {
                if (model.numberOfMessagesWaiting[i].idConversation == conversationChange.id
                    && conversationChange.messages[conversationChange.messages.length - 1].owner != firebase.auth().currentUser.email) {
                    model.numberOfMessagesWaiting[i].numberOfWaiting.push(conversationChange.messages.length - 1);
                }
            }
        }
        console.log(model.numberOfMessagesWaiting)
    }

    else {
        if (conversationChange) {
            let total = []
            for (let i = 0; i < conversationChange.messages.length; i++) {
                const element = array[i];
                if (element.owner != firebase.auth().currentUser.email) {
                    total.push(i)
                }
            }

            model.saveNumberOfMessagesWaiting({ idConversation: conversationChange.id, numberOfWaiting: total });
            console.log(model.numberOfMessagesWaiting)
        }
        else {
            let listConversation = model.listConversation;
            let array = [];
            for (let i = 0; i < listConversation.length; i++) {
                const element = listConversation[i];
                let id = element.id;
                let total = [];
                for (let j=0; j< element.messages.length; j++) {
                    const message = element.messages[j];
                    if (message.owner != firebase.auth().currentUser.email && message.isRead == false) {
                        total.push(j);
                    }
                }
                array.push({ idConversation: id, numberOfWaiting: total })
            }
            model.saveNumberOfMessagesWaiting(array);
            console.log(model.numberOfMessagesWaiting)
        }
    }
    view.showNumberOfMessagesWaiting();
}

controller.logIn = async function (logInInfo) {
    let email = logInInfo.email;
    let password = logInInfo.password;
    try {
        let result = await firebase.auth().signInWithEmailAndPassword(email, password);
        if (!result.user) {
            throw new Error('User must verify email!');
        }
        else {
            alert('Đăng nhập thành công');
            model.saveCurrentUser();
            view.showNav()
            view.showComponents('main')
        }
    } catch (error) {
        alert(error.message);
        view.showComponents('main');
    }
}

controller.register = async function (registerInfo) {
    let email = registerInfo.email;
    let password = registerInfo.password;
    let displayName = registerInfo.fullname;
    let photoURL = controller.randomAvatar();
    let phoneNumber = registerInfo.phoneNumber;
    let string = phoneNumber + displayName;
    view.disable('register-btn');
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        await firebase.auth().currentUser.updateProfile({
            photoURL: photoURL,
            displayName: string,
        });
        alert('Đăng kí thành công, giờ hay đăng nhập')
        view.showComponents('login')
        // await firebase.auth().currentUser.sendEmailVerification();
        // $("#modal-register").modal('hide');

        // alert('An verification email has been sended to your email address');
    } catch (err) {
        view.setText('register-error', err.message)
    }
}

controller.randomAvatar = function () {
    let randomString = Math.random().toString(36).substring(7);
    let randomAvatar = `https://api.adorable.io/avatars/256/${randomString}@adorable.png`;
    return randomAvatar;
}

controller.uploadAvatarProfile = async function (valueOfAttribute) {
    var user = firebase.auth().currentUser;
    await user.updateProfile({
        photoURL: valueOfAttribute
    }).then(function () {
        alert('cập nhập thành công!')
    }).catch(function (error) {
        alert(error)
    });
}

controller.uploadPhoneNumberProfile = async function (valueOfAttribute) {
    var user = model.currentUser;
    await user.updateProfile({
        displayName: valueOfAttribute + model.currentUser.displayName.slice(10, model.currentUser.displayName.length)
    }).then(function () {
        alert('cập nhập thành công!')
    }).catch(function (error) {
        alert(error)
    });
}

controller.updateNewConversation = function (contentNewConversation) {
    return firebase
        .firestore()
        .collection('conversations')
        .add(contentNewConversation)
}

function transformDocs(docs) {
    let datas = [];
    for (let doc of docs) {
        let data = doc.data();
        data.id = doc.id;
        datas.push(data)
    }
    return datas
}

function transformDoc(doc) {
    let data = doc.data();
    data.id = doc.id;
    return data;
}