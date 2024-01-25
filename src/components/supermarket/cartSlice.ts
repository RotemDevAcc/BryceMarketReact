import { createSlice } from '@reduxjs/toolkit';
import { Message } from '../../Message';
import { WritableDraft } from 'immer/dist/internal';
import { SProductDetails, purchaseCartAsync } from './superSlice';


export interface ProductDetails {
    id: number;
    name: string;
    price: number;
    count: number
}

export interface CartInterface {
    products:ProductDetails[],
    totalPrice: number,
}

interface RootState {
    cart: CartInterface;
    // ... other reducers or slices
}

const initialState:CartInterface = {
  products: [],
  totalPrice:0.0
};

function CalculatePrice(state: WritableDraft<CartInterface>){
    let calcprice = 0.0
    state.products.forEach(product => {
        calcprice += product.price * product.count
    });
    state.totalPrice = Number(calcprice.toFixed(2))
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addProduct: (state,payload) => {
        const pl = payload.payload
        const productname = pl.name
        const price = pl.price
        const prodid = pl.id
        let cartitem = state.products.find(product => product.name === productname);

        if (cartitem) {
            cartitem.count += 1;
        } else {
            state.products.push({ id: prodid, name: productname, price: price, count: 1 });
        }
        
        CalculatePrice(state)
    },
    removeProduct: (state,payload)=>{
        const pl = payload.payload
        const prodid = pl.prodid
        let cartitem = state.products.find(product => product.id === prodid);
        if(cartitem){
            if(cartitem.count > 1){
                cartitem.count-=1
            }else{
                state.products = state.products.filter(product => product.id !== prodid);
            }
        }

        CalculatePrice(state)
        
    },
    clearCart:(state)=>{
        if(state.products && state.products?.length > 0){
            state.products = []
            state.totalPrice = 0.0
            Message("Cart Cleared","success")
        }
        
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(purchaseCartAsync.fulfilled, (state,action) => {
        state.products = []
        state.totalPrice = 0.0
    })
  },
});

export const { addProduct,removeProduct,clearCart } = cartSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.cart.value)`
export const selectCart = (state: RootState) => state.cart.products as SProductDetails[];
export const selectPrice = (state: RootState) => state.cart.totalPrice;

export default cartSlice.reducer;
