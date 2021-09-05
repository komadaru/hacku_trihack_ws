import firebase from 'firebase'

export function post (data) {
    const room = 'discussions'
    return firebase.firestore().collection(room).add({
        prop: firebase.auth().currentUser.uid,
        name: data['name'],
        description: data['description'],
        type: data['type'],
        closemanual: data['closemanual'],
        closeconditions: data['closeconditions'],
        timelimit: data['timelimit'],
        ideaamo: data['ideaamo'],
        comamo: data['comamo'],
        scope: data['scope'],
        dpass: data['dpass']
    }, function(error) {
        if (error) {
            console.log(error)
        } else {
            console.log("Data saved successfully!")
        }
    });
}