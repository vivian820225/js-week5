import zh from './zh_TW.js';

// 自定義設定，錯誤的 className
VeeValidate.configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
  },
});

// 載入自訂規則檔
VeeValidate.localize('tw', zh);

// 全域註冊，載入 VeeValidate input 驗證工具
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
// 全域註冊，載入 VeeValidate 完整表單 驗證工具
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);
// 掛載 Vue-Loading 套件
Vue.use(VueLoading);
// 全域註冊 VueLoading 並將標籤設定為 loading
Vue.component('loading', VueLoading);

const apiPath = "https://course-ec-api.hexschool.io/";

new Vue({
  el: '#app',
  data: {
    products: [],
    tempProduct: {
      num: 0,
    },
    status: {
      loadingItem: '',
    },
    form: {
      name: '',
      email: '',
      tel: '',
      address: '',
      payment: '',
      message: '',
    },
    cart: {},
    cartTotal: 0,
    isLoading: false,
    user: {
      token: "",
      uuid: "21acf264-850e-4f92-95d0-23bf823dd286",
    },
  },
  created() {
    // 取得全部商品
    this.getProducts();
    this.getCart();
  },
  methods: {
    getProducts(page = 1) {
      const api = `${apiPath}api/${this.user.uuid}/ec/products?page=${page}`;
      
      this.isLoading = true;
      axios.get(api).then((res) => {
        // console.log(res);
        this.products = res.data.data;
        this.isLoading = false;
      })
    },
    addToCart(item, quantity = 1) {
      const api = `${apiPath}api/${this.user.uuid}/ec/shopping`;
      const cart = {
        product: item.id,
        quantity,
      };

      axios.post(api, cart).then(() => {
        this.getCart(); 
      }).catch((err) => {
        console.log(err.res.data.errors);
      });
    },
    getCart() {
      const api = `${apiPath}api/${this.user.uuid}/ec/shopping`;
      
      this.isLoading = true;
      axios.get(api).then((res) => {
        this.cart = res.data.data;
        // console.log(this.cart);

        this.cartTotal = 0;
        this.cart.forEach((item) => {
          this.cartTotal += (item.product.price * item.quantity);
          // console.log(this.cartTotal);
        });
        this.isLoading = false;
      });
    },
    quantityUpdate(id, num) {
      // 避免商品數量低於 0
      if(num < 0) {
        return; 
      };

      const api = `${apiPath}api/${this.user.uuid}/ec/shopping`;

      const data = {
        product: id,
        quantity: num,
      };

      this.isLoading = true;
      axios.patch(api, data).then(() => {
        this.isLoading = false;
        this.getCart();
      });
    },
    removeCartItem(id) {
      const api = `${apiPath}api/${this.user.uuid}/ec/shopping/${id}`;
      
      this.isLoading = true;
      axios.delete(api).then(() => {
        this.isLoading = false;
        this.getCart();
      });
    },
    removeAllCartItem() {
      const api = `${apiPath}api/${this.user.uuid}/ec/shopping/all/product`;
      
      this.isLoading = true;
      axios.delete(api).then(() => {
        this.isLoading = false;
        this.getCart();
      });
    },
    createOrder() {
      this.isLoading = true;

      const api = `${apiPath}api/${this.user.uuid}/ec/orders`;

      axios.post(api, this.form).then((res) => {
        if (res.data.data.id) {
          this.isLoading = false;
          $('#orderModal').modal('show');

          this.getCart();
          this.form
        };
      }).catch((err) => {
        this.isLoading = false;
        console.log(err.res.data.errors);
      });
    },
  },
  
});


