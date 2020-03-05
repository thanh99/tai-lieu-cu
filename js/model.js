const model = {};

model.saveDocuments = async function (documents) {
    model.documents = documents;
};

model.saveCurrentUser = async function () {
    model.currentUser = firebase.auth().currentUser;
};

model.saveCurrentUniversity = function (university) {
    model.currentUniversity = university;
};

model.saveCurrentProduct = async function (product) {
    model.currentProduct = product;
};

model.saveCurrentProfileTab = function (nameTab) {
    model.currentProfileTab = nameTab;
}

model.saveListConversation = function (conversations) {
    model.listConversation = conversations
}

model.saveCurrentConversation = function (conversation) {
    model.currentConversation = conversation;
}

model.saveCurrentProductBySearch = function (documents) {
    model.currentProductBySearch = documents;
}

model.updateConversation = function (conversation) {
    if (model.currentConversation && model.currentConversation.id == conversation.id) {
        model.saveCurrentConversation(conversation)
    }
    let existedIndex = model.listConversation.findIndex(function (element) {
        return element.id == conversation.id
    })
    if (existedIndex >= 0) {
        model.listConversation[existedIndex] = conversation;
    }
    else {
        model.listConversation.push(conversation)
    }
}

model.saveNumberOfMessagesWaiting = function (array) {
    model.numberOfMessagesWaiting = array
}

model.saveCurrentPageNumber = function (pageNumber) {
    model.currentPageNumber = pageNumber;
}