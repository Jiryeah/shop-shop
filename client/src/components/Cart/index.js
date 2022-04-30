import React, { useEffect } from 'react';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';

import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';

const Cart = () => {
  const [state, dispatch] = useStoreContext();

  useEffect(() => {
    const getCart = async () => {
      // cart variable will contain all of the retrieved info from the 'cart' store.
      const cart = await idbPromise('cart', 'get');
      // we will then add the new cart info to the global state object using the add_multiple_to_cart action.
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
    };
    // if there's nothing in the carts current state, we'll populate the the cart with the cart info from the IndexedDB cache
    if (!state.cart.length) {
      getCart();
    }
    // dependency array. Hook will trigger automatically on load, but will re-render if the dependency data value has changed since the last time it ran.
  }, [state.cart.length, dispatch]);

  const toggleCart = () => {
    dispatch({
      type: TOGGLE_CART,
    });
  };

  const calculateTotal = () => {
    let sum = 0;
    state.cart.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  };

  // if cartOpen is false
  if (!state.cartOpen) {
    // the component will return a smaller div
    return (
      // clicking this div, will set cartOpen to true due to toggleCart and return the expanded shopping cart
      <div className='cart-closed' onClick={toggleCart}>
        {/* //* emoji's should always be wrapped in a span element with 'role' and 'aria-label' attributes to better assist screen readers in understanding the context of the emoji */}
        <span role='img' aria-label='trash'>
          🛒
        </span>
      </div>
    );
  }

  return (
    <div className='cart'>
      <div className='close' onClick={toggleCart}>
        [close]
      </div>
      <h2>Shopping Cart</h2>
      {state.cart.length ? (
        <div>
          {state.cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}

          <div className='flex-row space between'>
            <strong>Total: ${calculateTotal()}</strong>
            {Auth.loggedIn() ? <button>Checkout</button> : <span>(log in to check out)</span>}
          </div>
        </div>
      ) : (
        <h3>
          <span role='img' aria-label='shocked'>
            😱
          </span>
          You haven't added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart;
