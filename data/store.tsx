import React from 'react'
import Reducer from './reducer'
import firebase from './firebase'
import { iState, iContext, iCategory, iPack, iPackPrice, iPasswordRequest, iAdvert, iLocation, iCountry, iProduct, iOrder, iUser, iNotification, iAlarm, iRating, iInvitation, iCustomer, iStore, iStorePayment, iPurchase, iStockTrans, iSpending, iMonthlyTrans, iLog } from './interfaces'

export const StoreContext = React.createContext({} as iContext)

const Store = (props: any) => {
  const initState: iState = {
    categories: [],
    countries: [],
    products: [],
    packs: [],
    packPrices: [],
    passwordRequests: [],
    adverts: [],
    orders: [],
    users: [],
    notifications: [],
    alarms: [],
    ratings: [],
    invitations: [],
    customers: [],
    stores: [],
    storePayments: [],
    purchases: [],
    stockTrans: [],
    spendings: [],
    monthlyTrans: [],
    logs: []
  }
  const [state, dispatch] = React.useReducer(Reducer, initState)
  
  React.useEffect(() => {
    const unsubscribeCategories = firebase.firestore().collection('categories').onSnapshot(docs => {
      let categories: iCategory[] = []
      docs.forEach(doc => {
        categories.push({
          id: doc.id,
          name: doc.data().name,
          parentId: doc.data().parentId,
          ordering: doc.data().ordering,
          isLeaf: doc.data().isLeaf
        })
      })
      dispatch({type: 'SET_CATEGORIES', payload: categories})
    }, err => {
      unsubscribeCategories()
    })
    const unsubscribePacks = firebase.firestore().collection('packs').where('isArchived', '==', false).onSnapshot(docs => {
      let packs: iPack[] = []
      let packPrices: iPackPrice[] = []
      docs.forEach(doc => {
        packs.push({
          id: doc.id,
          name: doc.data().name,
          productId: doc.data().productId,
          productName: doc.data().productName,
          productAlias: doc.data().productAlias,
          productDescription: doc.data().productDescription,
          imageUrl: doc.data().imageUrl,
          price: doc.data().price,
          categoryId: doc.data().categoryId,
          sales: doc.data().sales,
          rating: doc.data().rating,
          ratingCount: doc.data().ratingCount,
          isOffer: doc.data().isOffer,
          offerEnd: doc.data().offerEnd,
          weightedPrice: doc.data().weightedPrice,
          isDivided: doc.data().isDivided,
          trademark: doc.data().trademark,
          country: doc.data().country,
          closeExpired: doc.data().closeExpired
        })
        if (doc.data().prices) {
          doc.data().prices.forEach((p: iPackPrice) => {
            packPrices.push({...p, packId: doc.id})
          })
        }
      })
      dispatch({type: 'SET_PACKS', payload: packs})
      dispatch({type: 'SET_PACK_PRICES', payload: packPrices})
    }, err => {
      unsubscribePacks()
    })
    const unsubscribePasswordRequests = firebase.firestore().collection('password-requests').onSnapshot(docs => {
      let passwordRequests: iPasswordRequest[] = []
      docs.forEach(doc => {
        passwordRequests.push({...doc.data(), id:doc.id})
      })
      dispatch({type: 'SET_PASSWORD_REQUESTS', payload: passwordRequests})
    }, err => {
      unsubscribePasswordRequests()
    })
    const unsubscribeAdverts = firebase.firestore().collection('adverts').onSnapshot(docs => {
      let adverts: iAdvert[] = []
      docs.forEach(doc => {
        adverts.push({...doc.data(), id:doc.id})
      })
      dispatch({type: 'SET_ADVERTS', payload: adverts})
    }, err => {
      unsubscribeAdverts()
    }) 
    firebase.auth().onAuthStateChanged(user => {
      if (user){
        dispatch({type: 'LOGIN', payload: user})
        const unsubscribeLocations = firebase.firestore().collection('lookups').doc('l').onSnapshot(doc => {
          dispatch({type: 'SET_LOCATIONS', payload: doc.data()?.values})
        }, err => {
          unsubscribeLocations()
        })  
        const unsubscribeCountries = firebase.firestore().collection('lookups').doc('c').onSnapshot(doc => {
          dispatch({type: 'SET_COUNTRIES', payload: doc.data()?.values})
        }, err => {
          unsubscribeCountries()
        })
        const unsubscribeProducts = firebase.firestore().collection('products').where('isArchived', '==', false).onSnapshot(docs => {
          let products: iProduct[] = []
          docs.forEach(doc => {
            products.push({
              id: doc.id,
              categoryId: doc.data().categoryId,
              country: doc.data().country,
              name: doc.data().name,
              description: doc.data().description,
              alias: doc.data().alias,
              trademark: doc.data().trademark,
              sales: doc.data().sales,
              rating: doc.data().rating,
              ratingCount: doc.data().ratingCount,
              isArchived: doc.data().isArchived,
              imageUrl: doc.data().imageUrl,
            })
          })
          dispatch({type: 'SET_PRODUCTS', payload: products})
        }, err => {
          unsubscribeProducts()
        })  
        const unsubscribeOrders = firebase.firestore().collection('orders').where('isArchived', '==', false).onSnapshot(docs => {
          let orders: iOrder[] = []
          docs.forEach(doc => {
            orders.push({
              id: doc.id,
              basket: doc.data().basket
            })
          })
          dispatch({type: 'SET_ORDERS', payload: orders})
        }, err => {
          unsubscribeOrders()
        })  
        const unsubscribeUsers = firebase.firestore().collection('users').onSnapshot(docs => {
          let users: iUser[] = []
          let notifications: iNotification[] = []
          let alarms: iAlarm[] = []
          let ratings: iRating[] = []
          let invitations: iInvitation[] = []
          docs.forEach(doc => {
            users.push({...doc.data(), id:doc.id})
            if (doc.data().notifications) {
              doc.data().notifications.forEach((n: iNotification) => {
                notifications.push({...n, userId: doc.id})
              })
            }
            if (doc.data().alarms) {
              doc.data().alarms.forEach((a: iAlarm) => {
                alarms.push({...a, userId: doc.id})
              })
            }
            if (doc.data().ratings) {
              doc.data().ratings.forEach((r: iRating) => {
                ratings.push({...r, userId: doc.id})
              })
            }
            if (doc.data().friends) {
              doc.data().friends.forEach((f: iInvitation) => {
                invitations.push({...f, userId: doc.id})
              })
            }
          })
          dispatch({type: 'SET_USERS', payload: users})
          dispatch({type: 'SET_NOTIFICATIONS', payload: notifications})
          dispatch({type: 'SET_ALARMS', payload: alarms})
          dispatch({type: 'SET_RATINGS', payload: ratings})
          dispatch({type: 'SET_INVITATIONS', payload: invitations})
        }, err => {
          unsubscribeUsers()
        }) 
        const unsubscribeCustomers = firebase.firestore().collection('customers').onSnapshot(docs => {
          let customers: iCustomer[] = []
          docs.forEach(doc => {
            customers.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_CUSTOMERS', payload: customers})
        }, err => {
          unsubscribeCustomers()
        })  
        const unsubscribeStores = firebase.firestore().collection('stores').onSnapshot(docs => {
          let stores: iStore[] = []
          let storePayments: iStorePayment[] = []
          docs.forEach(doc => {
            stores.push({...doc.data(), id:doc.id})
            if (doc.data().payments) {
              doc.data().payments.forEach((p: iStorePayment) => {
                storePayments.push({...p, storeId: doc.id, storeInfo: doc.data()})
              })
            }
          })
          dispatch({type: 'SET_STORES', payload: stores})
          dispatch({type: 'SET_STORE_PAYMENTS', payload: storePayments})
        }, err => {
          unsubscribeStores()
        })
        const unsubscribePurchases = firebase.firestore().collection('purchases').where('isArchived', '==', false).onSnapshot(docs => {
          let purchases: iPurchase[] = []
          docs.forEach(doc => {
            purchases.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_PURCHASES', payload: purchases})
        }, err => {
          unsubscribePurchases()
        })  
        const unsubscribeStockTrans = firebase.firestore().collection('stock-trans').where('isArchived', '==', false).onSnapshot(docs => {
          let stockTrans: iStockTrans[] = []
          docs.forEach(doc => {
            stockTrans.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_STOCK_TRANS', payload: stockTrans})
        }, err => {
          unsubscribeStockTrans()
        }) 
        const unsubscribeSpendings = firebase.firestore().collection('spendings').onSnapshot(docs => {
          let spendings: iSpending[] = []
          docs.forEach(doc => {
            spendings.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_SPENDINGS', payload: spendings})
        }, err => {
          unsubscribeSpendings()
        })  
        const unsubscribeMonthlyTrans = firebase.firestore().collection('monthly-trans').onSnapshot(docs => {
          let monthlyTrans: iMonthlyTrans[] = []
          docs.forEach(doc => {
            monthlyTrans.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_MONTHLY_TRANS', payload: monthlyTrans})
        }, err => {
          unsubscribeMonthlyTrans()
        })  
        const unsubscribeLogs = firebase.firestore().collection('logs').onSnapshot(docs => {
          let logs: iLog[] = []
          docs.forEach(doc => {
            logs.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_LOGS', payload: logs})
        }, err => {
          unsubscribeLogs()
        })  
      } else {
        dispatch({type: 'LOGOUT'})
      }
    })
  }, [])
  return (
    <StoreContext.Provider value={{state, dispatch}}>
      {props.children}
    </StoreContext.Provider>
  )
}
 
export default Store

