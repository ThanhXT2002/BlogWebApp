// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// export  const firebaseConfig = {
//   apiKey: "AIzaSyBiQ7TXgDvEhnbtR4nLDYcVJX1TNpxNdv8",
//   authDomain: "uploadfile-angular.firebaseapp.com",
//   databaseURL: "https://uploadfile-angular-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "uploadfile-angular",
//   storageBucket: "uploadfile-angular.appspot.com",
//   messagingSenderId: "817072235909",
//   appId: "1:817072235909:web:ea37ce9c85a643644550ec",
//   measurementId: "G-HZXFH8M1R9"
// };

export const firebaseConfig = {
  apiKey: "AIzaSyBz7kQrQhi-sHVouPhpcyfNy0f7_SuVExk",
  authDomain: "angularproject-4d1e3.firebaseapp.com",
  databaseURL: "https://angularproject-4d1e3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "angularproject-4d1e3",
  storageBucket: "angularproject-4d1e3.appspot.com",
  messagingSenderId: "910579210134",
  appId: "1:910579210134:web:1464f920403f17d1b0afb7",
  measurementId: "G-R2TQMJF92M"
};


export const Constant = {
  API_END_POINT: '/api/amazon/', // Sử dụng proxy URL
  METHODS: {
    //product
    GET_ALL_PRODUCT: 'GetAllProducts',
    CREATE_PRODUCT: 'CreateProduct',
    UPDATE_PRODUCT: 'UpdateProduct',
    GET_PRODUCT_BY_ID: 'GetProductById?id=',
    DELETE_PRODUCT: 'DeleteProductById?id=',
    GET_ALL_PRODUCT_BY_CATEGORY_ID: 'GetAllProductsByCategoryId?id=',
    //product category
    GET_ALL_CATEGORY: 'GetAllCategory',
    CREATE_NEW_CATEGORY: 'CreateNewCategory',
    DELETE_CATEGORY: 'DeleteCategoryById?id=',

    //


  }
}
