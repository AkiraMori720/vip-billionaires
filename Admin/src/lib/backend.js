import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/firestore";

export const TBL_USER = "User";
export const TBL_POST = "Post";
export const TBL_REPORTS = "Reports";
export const TBL_PRODUCTS = "Products";
export const TBL_ORDERS = "Orders";
export const TBL_OPTIONS = "Options"

export const OPTION_HEADER_ITEMS = "shop_header_items";
export const OPTION_TAX = "tax";
export const OPTION_SHIPPING_CHARGES = "shipping_charges";

export const DB_ACTION_ADD = 'add';
export const DB_ACTION_UPDATE = 'update';
export const DB_ACTION_DELETE = 'delete';

export const ORDER_STATUS_PENDING = 0;
export const ORDER_STATUS_PAID = 1;
export const ORDER_STATUS_SHIPPING = 2;
export const ORDER_STATUS_COMPLETE = 3;
export const ORDER_STATUS_REFUND = 5;
export const ORDER_STATUS_CANCEL = 9;

export const MAIL_TYPE_CREATE_ORDER = 'create_order';
export const MAIL_TYPE_SHIPPING_ORDER = 'shipping_order';
export const MAIL_TYPE_COMPLETE_ORDER = 'complete_order';
export const MAIL_TYPE_CANCEL_ORDER = 'cancel_order';

export const ASSET_TYPE_PRODUCT = 'product';

class FirebaseAuthBackend {
    constructor(firebaseConfig) {
        if (firebaseConfig) {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
        }
    }

    fetchUser = (token) => {
      return new Promise((resolve, reject) => {
          firebase.auth().onAuthStateChanged(user => {
            if (user) {
              this.getUser(user.uid).then(userInfo => {
                resolve(userInfo);
              }).catch(() => {
                reject("Fetch Failed");
              })
            } else {
              reject("Fetch Failed");
            }
          },
          error => {
            reject(this._handleError(error));
          });
      });
    }

    /**
     * Registers the user with given details
     */
    registerUser = (email, password) => {
        return new Promise((resolve, reject) => {
          firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then(
                    user => {
                        resolve(firebase.auth().currentUser);
                    },
                    error => {
                        reject(this._handleError(error));
                    }
                );
        });
    };

    /**
     * Registers the user with given details
     */
    editProfileAPI = (email, password) => {
        return new Promise((resolve, reject) => {
          firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then(
                    user => {
                        resolve(firebase.auth().currentUser);
                    },
                    error => {
                        reject(this._handleError(error));
                    }
                );
        });
    };
    /**
     * Index user with given details
     */
    loginUserWithEmail = ({email, password}) => {
      return new Promise((resolve, reject) => {
        firebase.auth()
          .signInWithEmailAndPassword(email, password)
          .then(
            confirmationResult => {
              console.log('credential', confirmationResult);
              this.getUser(confirmationResult.user.uid).then(user => {
                if(user.isAdmin){
                  resolve(user)
                } else {
                  reject(new Error('Invalid User'));
                }
              }).catch(err => {
                reject(err);
              })
            },
            error => {
              console.log('user error', error);
              alert('Invalid Email or Password');
              //reject(this._handleError(error));
            }
          );
      });
    };
    /**
     * Index user with given details
     */
    loginUserWithPhone = (phone) => {
        const appVerifier = window.recaptchaVerifier;
        return new Promise((resolve, reject) => {
          firebase.auth()
                .signInWithPhoneNumber(phone, appVerifier)
                .then(
                    confirmationResult => {
                        window.confirmationResult = confirmationResult;
                        resolve(true);
                    },
                    error => {
                        console.log('user error', error);
                        alert('Invalid Phone Number');
                        //reject(this._handleError(error));
                    }
                );
        });
    };

    createUser = (userInfo) => {
        return new Promise((resolve, reject) => {
          firebase.firestore()
                .collection(TBL_USER)
                .add(userInfo)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                })
        })
    };

    deleteUser = (id) => {
        return new Promise((resolve, reject) => {
          firebase.firestore()
                .collection(TBL_USER)
                .doc(id)
                .delete()
                .then(() => {
                    console.log('delete user on doc success');
                })
                .catch((err) => {
                    console.log('delete user on doc error', err)
                });

          firebase.auth().currentUser.delete()
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err)
                });
        })
    };

    getUser = (id) => {
        return new Promise((resolve, reject) => {
            firebase.firestore()
                .collection(TBL_USER)
                .get()
                .then(snapshot => {
                  let user = null;
                  snapshot.forEach(doc => {
                    const obj = doc.data();
                    if(obj.userId === id){
                      user = {
                          id: doc.id,
                          ...obj
                      }
                    }
                  })
                  if(user){
                    resolve(user);
                  } else {
                    reject('no exist');
                  }
                })
                .catch(err => {
                    reject(err)
                })
        })
    };

    getData = (kind = '') => {
        return new Promise((resolve, reject) => {
            firebase.firestore()
                .collection(kind)
                .get()
                .then(snapshot => {
                    let data = [];
                    snapshot.forEach(doc => {
                        let obj = doc.data();
                        Object.assign(obj, {id: doc.id});
                        data.push(obj);
                    })
                    console.log('getData : ' + kind + ' Data: ', data);
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        })
    };

    setData = (kind = '', act, item) => {
        return new Promise((resolve, reject) => {
            if (act === DB_ACTION_ADD) {
                firebase.firestore()
                    .collection(kind)
                    .add(item)
                    .then((res) => {
                        let itemWithID = {...item, id: res.id};
                        firebase.firestore()
                            .collection(kind)
                            .doc(res.id)
                            .update(itemWithID)
                            .then((response) => {
                                resolve(itemWithID)
                            })
                            .catch((err) => {
                                reject(err);
                            })
                    })
                    .catch(err => {
                        reject(err);
                    })
            } else if (act === DB_ACTION_UPDATE) {
                firebase.firestore()
                    .collection(kind)
                    .doc(item.id)
                    .update(item)
                    .then(() => {
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    })
            } else if (act === DB_ACTION_DELETE) {
                firebase.firestore()
                    .collection(kind)
                    .doc(item.id)
                    .delete()
                    .then(() => {
                        console.log(kind, act)
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    })
            }
        })
    };

    getOptionData = (kind = '') => {
      return new Promise((resolve, reject) => {
        firebase.firestore()
          .collection(TBL_OPTIONS)
          .doc(kind)
          .get()
          .then(snapshot => {
            const data = snapshot.data();
            console.log('getOptionData : ' + kind + ' Data: ', data);
            resolve(data);
          })
          .catch(err => {
            reject(err);
          })
      })
    };

    setOptionData = (kind = '', item) => {
      return new Promise((resolve, reject) => {
        firebase.firestore()
          .collection(TBL_OPTIONS)
          .doc(kind)
          .set(item)
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          })
      })
    };

    equalPhoneNumber = (number1, number2) => {
       const pNumber1 = number1.replace('+', '');
       const pNumber2 = number2.replace('+', '');
       return pNumber1 === pNumber2
    };

    /**
     * forget Password user with given details
     */
    forgetPassword = email => {
        return new Promise((resolve, reject) => {
            firebase
                .auth()
                .sendPasswordResetEmail(email)
                .then(() => {
                    resolve(true);
                })
                .catch(error => {
                    reject(this._handleError(error));
                });
        });
    };

    /**
     * Logout the user
     */
    logout = () => {
        return new Promise((resolve, reject) => {
            firebase
                .auth()
                .signOut()
                .then(() => {
                    resolve(true);
                })
                .catch(error => {
                    reject(this._handleError(error));
                });
        });
    };

    setLoggeedInUser = user => {
        localStorage.setItem("authUser", JSON.stringify(user));
    };

    /**
     * Returns the authenticated user
     */
    getAuthenticatedUser = () => {
        if (!localStorage.getItem("authUser")) return null;
        return JSON.parse(localStorage.getItem("authUser"));
    };

    /**
     * Handle the error
     * @param {*} error
     */
    _handleError(error) {
        // var errorCode = error.code;
      return error.message;
    };

    uploadMedia = (type, path) => {
        const milliSeconds = Date.now();
        return new Promise((resolve, reject) => {

            let ref = firebase.storage().ref(`${type}_${milliSeconds}`);

            ref.put(path)
                .then(async (res) => {
                    const downloadURL = await ref.getDownloadURL();
                    resolve(downloadURL);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    };
}

let _fireBaseBackend = null;

/**
 * Returns the firebase backend
 */

let firebaseConfig = {};

firebaseConfig = {
  apiKey: "AIzaSyDOsK1hSk9A3-7_Npl2Yca2bxdjXkDThu4",
  authDomain: "vip-billionaires-c07df.firebaseapp.com",
  databaseURL: "https://vip-billionaires-c07df.firebaseio.com",
  projectId: "vip-billionaires-c07df",
  storageBucket: "vip-billionaires-c07df.appspot.com",
  messagingSenderId: "729621830311",
  appId: "1:729621830311:web:13005c13f9f5f774fd9982",
  measurementId: "G-99YJVYRP8G"
};


/**
 * Initilize the backend
 * @param {*} config
 */
const initBackendAPI = () => {
    if (!_fireBaseBackend) {
        _fireBaseBackend = new FirebaseAuthBackend(firebaseConfig);
    }
    return _fireBaseBackend;
};

/**
 * Returns the backend
 */
const getBackendAPI = () => {
    return initBackendAPI(firebaseConfig)
};

export {initBackendAPI, getBackendAPI};
