import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchProducts, getCoupon } from './superAPI';
import { buyCart } from './superAPI';
import { Message } from '../../Message';


export interface SProductDetails {
  id: number;
  category: number;
  name: string;
  desc: string;
  price: number;
  img: string;
  count: number
}

export interface SCategoryDetails {
  id: number;
  desc: string;
}

export interface CouponDetails {
  id: number;
  percent: number;
  min_price: number;
  desc: string;
}


export interface SuperInterface {
  products:SProductDetails[],
  categories:SCategoryDetails[],
  status: string,
  coupon: CouponDetails,
}


interface RootState {
    super: SuperInterface;
    // ... other reducers or slices
}

const initialState:SuperInterface = {
  products:[],
  categories:[],
  status:"",
  coupon:{ id: 0, percent: 0, min_price: 0, desc: "" }
};

export const getDataAsync = createAsyncThunk(
    'super/fetchProducts',
    async () => {
      const response = await fetchProducts();
      return response.data;
    }
);

export const purchaseCartAsync = createAsyncThunk(
  'super/purchaseCart',
   async(details:{cart:SProductDetails[],price:number,token:string, coupon:CouponDetails, orderid:string}) => {
    const response = await buyCart(details);
    return response.data;
   }
);

export const getCouponAsync = createAsyncThunk(
  'super/getCoupon',
  async(details:{token:string,coupon:string}) => {
   const response = await getCoupon(details);
   return response.data;
  }
);



export const superSlice = createSlice({
  name: 'super',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // purchaseCart:(state,payload)=>{
    //   const pl = payload.payload
    //   const cart = pl.cart
    //   const token = pl.token
    //   const price = pl.price
    //   const data = {
    //     "cart":cart,
    //     "token":token,
    //     "price":price
    //   }
    //   const result = buyCart(data)
    // },
    clearCoupon:(state)=>{
      if(state.coupon){
        state.coupon = { id: 0, percent: 0, min_price: 0, desc: "" };
        Message("Coupon Cleared","success")
      }
      
    }


    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDataAsync.fulfilled, (state, action) => {
        state.products =action.payload.products
        state.categories = action.payload.categories
        state.status ='done'
      })
      .addCase(getDataAsync.rejected, (state) => {
        state.status ='rejected'
      })
      .addCase(getDataAsync.pending, (state) => {
        state.status = "loading";
      })

      .addCase(purchaseCartAsync.fulfilled, (state) => {
        Message("Cart Purchased Successfully","success")
        state.coupon = { id: 0, percent: 0, min_price: 0, desc: "" }
        // Cart Cleared in cartSlice.ts
      })

      .addCase(getCouponAsync.fulfilled, (state,action) => {
        const payload = action.payload
        if(payload){
          if(payload.success){
            Message(payload.message,"success")
            
            if(state.coupon){
              Message("Replacing Current Coupon","info")
            }
           
            state.coupon = payload.coupon
          }else{
            Message(payload.message,"error")
          }
        }
      })
  },
  
});

export const { clearCoupon } = superSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.super.value)`
export const selectproducts = (state: RootState) => state.super.products;
export const selectcategories = (state: RootState) => state.super.categories;
export const selectstatus = (state: RootState) => state.super.status;
export const selectcoupon = (state: RootState) => state.super.coupon;
export default superSlice.reducer;
