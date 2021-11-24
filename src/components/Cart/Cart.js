import React, { useContext, useState } from 'react';
import Modal from '../UI/Modal';
import CartItem from './CartItem';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';

import classes from './Cart.module.css';

const Cart = (props) => {
  const cartCtx = useContext(CartContext),
    [isCheckout, setIsCheckout] = useState(false),
    [isSubmitting, setIsSubmitting] = useState(false),
    [didSubmit, setDidSubmit] = useState(false),
    totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`,
    hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
      cartCtx.removeItem(id);
    },
    cartItemAddHandler = (item) => {
      cartCtx.addItem({ ...item, amount: 1 });
    },
    orderHandler = () => {
      setIsCheckout(true);
    },
    submitOrderHandler = async (userData) => {
      setIsSubmitting(true);
      await fetch('firebase/orders.json', {
        method: 'POST',
        body: JSON.stringify({
          user: userData,
          orderedItems: cartCtx.items,
        }),
      });

      setIsSubmitting(false);
      setDidSubmit(true);
      cartCtx.clearCart();
    };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => {
        return (
          <CartItem
            key={item.id}
            name={item.name}
            amount={item.amount}
            price={item.price}
            onRemove={cartItemRemoveHandler.bind(null, item.id)}
            onAdd={cartItemAddHandler.bind(null, item)}
          />
        );
      })}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes['button--alt']} onClick={props.onHideCart}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onCancel={props.onHideCart} onConfirm={submitOrderHandler} />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending order data....</p>;
  const didSubmitModalContent = (
    <React.Fragment>
      <p>Successfully sent the order!</p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.onHideCart}>
          Close
        </button>
      </div>
    </React.Fragment>
  );
  return (
    <Modal onCloseCart={props.onHideCart}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
