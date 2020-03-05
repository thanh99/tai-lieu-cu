window.onload = init;

async function init() {
    view.showComponents('loading');
    
    firebase.auth().onAuthStateChanged(function (user) {
        if (user && user.emailVerified) {
            view.showComponents('main');
        } else {
            view.showComponents('main');
        }
    })
};

