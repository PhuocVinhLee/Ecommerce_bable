import React, { useState, useEffect } from "react";
import myContext from "./myContext";
import uuid from "react-uuid";
import moment from "moment";
import { fireDB } from "../../fireabase/FirebaseConfig";
import { getAuth } from "firebase/auth";
import {
  Timestamp,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  setDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  arrayUnion,
} from "firebase/firestore";
import { toast } from "react-toastify";

function MyState(props) {
  const [mode, setMode] = useState("light");
  const toggleMode = () => {
    if (mode === "light") {
      setMode("dark");
      document.body.style.backgroundColor = "rgb(17,24,39)";
    } else {
      setMode("light");
      document.body.style.backgroundColor = "white";
    }
  };

  const [loading, setLoading] = useState(false);
  const product_initState = {
    title: "test10000",
    price: "2000",
    inventory_quantity: 20,
    imageUrl: [],
    category: null,
    description: "vuejs111",
    quantity_sold: 0,
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),

    selling_strategy: 0,
    start_number: 0,
  };

  const [products, setProducts] = useState(product_initState);
  const [message, setMessage] = useState("");

  const [user_infor, setUser_infor] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [user_from_db, set_user_from_db] = useState(null);
  const find_user_from_db = async (id_user) => {
    console.log(id_user);
    const snap = await getDoc(doc(fireDB, "users", id_user));

    if (snap.exists()) {
      console.log("co data");
      console.log(snap.data());
      set_user_from_db({ ...snap.data(), id: snap.id });
      return true;
    } else {
      console.log("No such document");
      return false;
    }
  };
  const update_user_from_db = async (user) => {
    console.log(user);
    setLoading(true);
    try {
      await setDoc(doc(fireDB, "users", user?.id), user);
      toast.success("User Updated successfully");
      // getProductData();
      setLoading(false);
      // setProducts(product_initState);
      return true;
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const [userChatting, setUserChatting] = useState({});

  const [messages, setMessages] = useState();
  const createMessageForAdmin = async (id_user_chating) => {
    const data = {
      isAdmin: true,
      message: [],
      timestamp: serverTimestamp(),
    };
    console.log(id_user_chating);

    const messageRef = doc(fireDB, "message", id_user_chating);
    setLoading(true);

    try {
      await setDoc(messageRef, data);
      //toast.success("Data Add successfully");

      // getProductData();
      setMessage("");
      setLoading(false);
      //  return respon;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    // return respon;
  };

  const find_Messge = async (id_user_chating) => {
    const snap = await getDoc(doc(fireDB, "message", id_user_chating));

    if (snap.exists()) {
      console.log("co data");
      console.log(snap.data());
      setMessages(snap.data());
      return true;
    } else {
      console.log("No such document");
      return false;
    }
  };
  const updateMessage = async (isAdmin) => {
    const data = {
      message: arrayUnion({
        id: uuid(),
        isAdmin: isAdmin,
        text: message,
        time: Timestamp.now(),
      }),
    };

    await updateDoc(doc(fireDB, "message", userChatting.id), data);
    console.log(" da update message");
  };

  const [AllMessageFromDb, setAllMessageFromDb] = useState([]);
  const getAllMesaageForAdmin = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "message"));
      const data = onSnapshot(q, (QuerySnapshot) => {
        let messagersArray = [];
        QuerySnapshot.forEach((doc) => {
          messagersArray.push({ ...doc.data(), id: doc.id });
        });

        setLoading(false);
        setAllMessageFromDb(messagersArray);
      });
      return () => data;
    } catch (error) {
      console.log(error);
      setLoading(false);
      return [];
    }
  };
  const getMessageData = async () => {
    try {
      if (userChatting?.id) {
        const unsub = onSnapshot(
          doc(fireDB, "message", userChatting?.id),
          (doc) => {
            if (doc.exists()) {
              setMessages(doc.data());
            }
          }
        );
        return unsub;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addProduct = async (products) => {
    const products_local = { ...product_initState, ...products };
    const productRef = collection(fireDB, "products");
    setLoading(true);

    try {
      console.log(products_local);
      const respon = await addDoc(productRef, products_local);
      toast.success("Product Add successfully");

      getProductData();
      // setProducts(product_initState);
      setLoading(false);
      return respon;
    } catch (error) {
      toast.error("Product Add Error");
      console.log(error);
      setLoading(false);
    }

    return false;
  };

  const edithandle = (item) => {
    setProducts(item);
  };

  const updateProduct = async (product) => {
    setLoading(true);
    try {
      await updateDoc(doc(fireDB, "products", product.id), product);
      toast.success("Product Updated successfully");
      getProductData();
      setLoading(false);

      return true;
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const update_inventoryAndSelling_Product = async (product) => {
    setLoading(true);
    try {
      console.log(product);
      await updateDoc(doc(fireDB, "products", product.id), product);
      toast.success("Product Updated successfully");

      setLoading(false);

      return true;
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const deleteProduct = async (item) => {
    try {
      setLoading(true);
      await deleteDoc(doc(fireDB, "products", item.id));
      toast.success("Product Deleted successfully");
      setLoading(false);
      getProductData();
    } catch (error) {
      // toast.success('Product Deleted Falied')
      setLoading(false);
    }
  };

  const get_OneProductData = async (id_product) => {
    console.log(id_product);
    setLoading(true);
    try {
      const docRef = doc(
        fireDB,
        "products",
        id_product.toString()
        // where("capital", "==", true)
      );
      //const q = query(collection(db, "cities"), where("capital", "==", true));

      const docSnapshot = await getDoc(docRef);
      let product = null;
      if (docSnapshot.exists()) {
        // querySnapshot.data();

        product = { ...docSnapshot.data(), id: docSnapshot.id };
      }
      console.log(docSnapshot.data());
      console.log(product);
      setProducts(product);
      return product;
    } catch (error) {
      console.log(error);
      setLoading(false);
      return product;
    }
  };

  const [product, setProduct] = useState([]);

  // ****** get product
  const getProductData = async () => {
    setLoading(true);
    try {
      // const q = query(
      //   collection(fireDB, "products"),
      //   // orderBy("id")
      //   // limit(5)
      // );
      const result = await getDocs(collection(fireDB, "products"));
      let productsArray = [];
      result.forEach((doc) => {
        productsArray.push({ ...doc.data(), id: doc.id });
      });

      const productsSort = productsArray?.toSorted((a, b) => {
        console.log(
          Number(a?.time.seconds) +
            Number(a?.time.nanoseconds) -
            (Number(b?.time.seconds) + Number(b?.time.nanoseconds))
        );
        let c = Number(a?.time.seconds);
        let d = Number(b?.time.seconds);
        return c > d ? -1 : c < d ? 1 : 0;
      });

      console.table(productsSort);
      setProduct(productsSort);

      setLoading(false);

      return productsSort;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const category_initState = {
    title: null,
    imageUrl: null,
    time: Timestamp.now(),
  };
  const [category, setCategory] = useState(category_initState);
  const addCategory = async (category) => {
    try {
      const caterogy_local = { ...category_initState, ...category };
      const categoryRef = collection(fireDB, "categorys");
      console.log(caterogy_local);
      setLoading(true);
      const respon = await addDoc(categoryRef, caterogy_local);
      toast.success("Category Add successfully");
      getCategorysData();
      //closeModal();
      setLoading(false);

      return true;
    } catch (error) {
      console.log(error);
      setLoading(false);
      //  setCategory("");
      return false;
    }
  };

  const get_OneCategorytData = async (id_catory) => {
    console.log(id_catory);
    setLoading(true);
    try {
      const docRef = doc(fireDB, "categorys", id_catory.toString());
      const docSnapshot = await getDoc(docRef);
      let catory = null;
      if (docSnapshot.exists()) {
        // querySnapshot.data();

        catory = { ...docSnapshot.data(), id: docSnapshot.id };
      }
      setLoading(false);
      return catory;
    } catch (error) {
      console.log(error);
      setLoading(false);
      return {};
    }
  };

  const updateCategory = async (values) => {
    setLoading(true);
    try {
      await setDoc(doc(fireDB, "categorys", values.id), values);

      toast.success("Category Updated successfully");
      getCategorysData();

      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      console.log(error);
      return false;
    }
  };

  const [categorys, setCategorys] = useState([]);

  // ****** get product
  const getCategorysData = async () => {
    console.log("load category");
    setLoading(true);
    try {
      // const q = query(
      //   collection(fireDB, "categorys")

      // );
      // const data = onSnapshot(q, (QuerySnapshot) => {
      //   let categorysArray = [];
      //   QuerySnapshot.forEach((doc) => {
      //     categorysArray.push({ ...doc.data(), id: doc.id });
      //   });
      //   setCategorys(categorysArray);
      //   console.log(categorysArray)
      //   setLoading(false);
      // });

      const result = await getDocs(collection(fireDB, "categorys"));
      let categorysArray = [];
      result.forEach((doc) => {
        categorysArray.push({ ...doc.data(), id: doc.id });
      });
      setLoading(false);
      setCategorys(categorysArray);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const [orders, setOrders] = useState([]);
  const getOrderData = async () => {
    setLoading(true);
    try {
      const result = await getDocs(collection(fireDB, "orders"));
      const ordersArray = [];
      result.forEach((doc) => {
        ordersArray.push({ ...doc.data(), id: doc.id });
        setLoading(false);
      });
      
      const ordersArraySorted = ordersArray.toSorted((a, b) => {
        
        const c = moment(a?.date, "hh:mm:ss YYYY/M/DD a");
        const d = moment(b?.date, "hh:mm:ss YYYY/M/DD a");
       
        console.log(c)
        return c > d ? -1 : c < d ? 1 : 0;
      });
      setOrders(ordersArraySorted);
     
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const upDateOrderFromAdmin = async (id_order, data) => {
    setLoading(true);
    const orderRef = doc(fireDB, "orders", id_order);
    try {
      console.log(data);
      await updateDoc(orderRef, data);
      getOrderData();
      toast.success("Order Updated successfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const [order, setOrder] = useState([]);
  const getOrdertDataFromUser = async (uid) => {
    console.log(uid);
    setLoading(true);
    try {
      const q = query(
        collection(fireDB, "orders"),
        where("uid", "==", uid?.toString())
      );
      const querySnapshot = await getDocs(q);
      let order = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        order.push({ ...doc.data(), id: doc.id });
      });
      const ordersArraySorted = order.toSorted((a, b) => {
        
        const c = moment(a?.date, "hh:mm:ss YYYY/M/DD a");
        const d = moment(b?.date, "hh:mm:ss YYYY/M/DD a");
       
      
        return c > d ? -1 : c < d ? 1 : 0;
      });
      setOrder(ordersArraySorted);
      setLoading(false);
      console.table(order);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const get_OneOrdertData = async (id_order) => {
    setLoading(true);
    try {
      const docRef = doc(fireDB, "orders", id_order.toString());
      const docSnapshot = await getDoc(docRef);
      let order = null;
      if (docSnapshot.exists()) {
        // querySnapshot.data();

        order = { ...docSnapshot.data(), id: docSnapshot.id };
      }
      setLoading(false);
      return order;
    } catch (error) {
      console.log(error);
      setLoading(false);
      return {};
    }
  };
  const [user, setUser] = useState([]);

  const getUserData = async () => {
    setLoading(true);
    try {
      const result = await getDocs(collection(fireDB, "users"));
      const usersArray = [];
      result.forEach((doc) => {
        usersArray.push({ ...doc.data(), id: doc.id });
        setLoading(false);
      });
      setUser(usersArray);
      console.log(usersArray);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const [reviews, setReviews] = useState([]);
  const getReviewDate = async (id_product) => {
    setLoading(true);
    try {
      const q = query(
        collection(fireDB, "reviews"),
        where("idProduct", "==", id_product?.toString())
        // orderBy("time")
      );
      // const q = query(citiesRef, where("population", ">", 100000), orderBy("population"));
      const querySnapshot = await getDocs(q);
      let reviews = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        reviews.push({ ...doc.data(), id: doc.id });
      });
      setReviews(reviews);

      setLoading(false);
      return reviews;
    } catch (error) {
      console.log(error);
      setLoading(false);
      return [];
    }
  };
  const addReview = async (review_local) => {
    if (review_local.idProduct == null || review_local.uid == null) {
      return toast.error("Please fill all fields");
    }

    const reviewRef = collection(fireDB, "reviews");
    setLoading(true);

    try {
      const respon = await addDoc(reviewRef, review_local);
      toast.success("Review Add successfully");
      setLoading(false);

      // return respon;
    } catch (error) {
      console.log(error);
      setLoading(false);
      //   return respon;
    }
  };

  useEffect(() => {
    // getProductData();
    getCategorysData();
    // getOrderData();
    getUserData();
    if (user_infor?.uid) {
      find_user_from_db(user_infor?.uid);
    }
  }, []);
  useEffect(() => {
    if (user_infor?.uid) {
      find_user_from_db(user_infor?.uid);
    }
    console.log("reload ne ba");
  }, [user_infor]);

  const [searchkey, setSearchkey] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [sortBy, setsortBy] = useState("best_sellers");
  const [show, setShow] = useState("all");

  return (
    <myContext.Provider
      value={{
        sortBy,
        setsortBy,
        show,
        setShow,
        mode,
        toggleMode,
        loading,
        setLoading,
        getMessageData,
        createMessageForAdmin,
        updateMessage,
        find_Messge,
        message,
        messages,
        setMessage,
        products,
        setProducts,
        addProduct,
        get_OneProductData,
        update_inventoryAndSelling_Product,
        product,
        category,
        setCategory,
        categorys,
        get_OneCategorytData,
        getCategorysData,
        updateCategory,
        addCategory,
        edithandle,
        updateProduct,
        getProductData,
        deleteProduct,
        order,
        orders,
        getOrderData,
        get_OneOrdertData,
        getOrdertDataFromUser,
        upDateOrderFromAdmin,
        user,
        setSearchkey,
        searchkey,
        filterType,
        setFilterType,
        filterPrice,
        setFilterPrice,
        userChatting,
        setUserChatting,
        getAllMesaageForAdmin,
        AllMessageFromDb,
        user_infor,
        setUser_infor,
        find_user_from_db,
        user_from_db,
        set_user_from_db,
        update_user_from_db,

        addReview,
        getReviewDate,
        reviews,
      }}
    >
      {props.children}
    </myContext.Provider>
  );
}

export default MyState;
