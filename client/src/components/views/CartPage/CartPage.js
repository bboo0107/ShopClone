import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy } from '../../../_actions/user_actions';
//import { getCartItems, removeCartItem, } from '../../../_actions/user_actions';
import UserCardBlock from './UserCardBlock';
import { Empty, Result } from 'antd';
import Paypal from '../Utils/Paypal';

export default function CartPage(props) { //user
    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        let cartItems = []

        // 리덕스  User State안에 cart 안에 상품이 들어있는지 확인
        if(props.user.userData && props.user.userData.cart){ //앞에꺼가 있으면 뒤에꺼 있는지 봄
            if(props.user.userData.cart.length > 0){ //카트안에 하나이상 상품이 있다면
                props.user.userData.cart.forEach(item => {
                    //console.log(cartItems)
                    cartItems.push(item.id)
                    //console.log(cartItems)
                })    

                dispatch(getCartItems(cartItems, props.user.userData.cart)) //상품아이디랑, 들어있는 상품 내용
                .then(res=>{
                    calculateTotal(res.payload)
                })
            }
        }
    }, [props.user.userData]) //userData가 변하면 리렌딩

    let calculateTotal = (cartDetail) => {
        let total = 0;

        //console.log("cartDetail",cartDetail)
        cartDetail.map(item => {
            total += parseInt(item.price,10) * item.quantity
        })

        setTotal(total)
        setShowTotal(true)
    }

    const removeFromCart = (productId) => {
        dispatch(removeCartItem(productId))
        .then(res=>{
            if(res.payload.productInfo.length <= 0){
                setShowTotal(false)
            }
        })
    }

    //결제 성공
    const transactionSuccess = (data) => {       
        
        dispatch(onSuccessBuy({
            paymentData: data,
            cartDetail: props.user.cartDetail
        }))
        .then(res => {
            if(res.payload.success){
                setShowTotal(false)
                setShowSuccess(true)
            }
        })
    }


    return (
        <div style={{width: '85%', margin: '3rem auto'}}>
            <h1>My Cart</h1>
            <div>
                <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart}/>
            </div>

            {ShowTotal ?
                <div style={{marginTop: '3rem'}}>
                    <h2>Total Amount: ${Total}</h2>
                </div>
                : ShowSuccess?
                    <Result
                        status="success"
                        title="Successfully Purchased Items!"
                    />
                :
                <>
                <br />
                <Empty description={false}/>
                </>
        }
        
        {ShowTotal &&
            <Paypal 
                total={Total}
                onSuccess={transactionSuccess}
            />            
    }

        </div>
    )
}
