import { useState } from 'react';
import useInput from '../../hooks/use-input';

import classes from './Checkout.module.css';

const isNotEmpty = (value) => value.trim() !== '';
const isFiveChars = (value) => isNotEmpty(value) && value.trim().length === 5;
const getCssClasses = (valueIsValid) => {
  return `${classes.control} ${valueIsValid ? '' : classes.invalid}`;
};

const Checkout = (props) => {
  let formIsValid = false;
  const [formInputsValidity, setFormInputsValidity] = useState({
    name: true,
    street: true,
    city: true,
    postalCode: true,
  });

  const {
    //name input box
    value: enteredName,
    isValid: nameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    valueBlurHandler: nameBlurHandler,
    reset: nameReset,
  } = useInput(isNotEmpty);

  const {
    //street input box
    value: enteredStreet,
    isValid: streetIsValid,
    hasError: streetHasError,
    valueChangeHandler: streetChangeHandler,
    valueBlurHandler: streetBlurHandler,
    reset: streetReset,
  } = useInput(isNotEmpty);

  const {
    //city input box
    value: enteredCity,
    isValid: cityIsValid,
    hasError: cityHasError,
    valueChangeHandler: cityChangeHandler,
    valueBlurHandler: cityBlurHandler,
    reset: cityReset,
  } = useInput(isNotEmpty);

  const {
    //postal code input box
    value: enteredPostalCode,
    isValid: postalCodeIsValid,
    hasError: postalCodeHasError,
    valueChangeHandler: postalCodeChangeHandler,
    valueBlurHandler: postalCodeBlurHandler,
    reset: postalCodeReset,
  } = useInput(isFiveChars);

  const confirmHandler = (event) => {
    event.preventDefault();

    setFormInputsValidity({
      name: nameIsValid,
      street: streetIsValid,
      city: cityIsValid,
      postalCode: postalCodeIsValid,
    });

    if (!formIsValid) {
      return;
    }

    props.onConfirm({
      name: enteredName,
      street: enteredStreet,
      city: enteredCity,
      postalCode: enteredPostalCode,
    });

    resetForm();
  };

  const onCancelHandler = () => {
    resetForm();
    props.onCancel();
  };

  const resetForm = () => {
    nameReset();
    streetReset();
    postalCodeReset();
    cityReset();
  };

  const nameControlClasses = getCssClasses(formInputsValidity.name),
    streetControlClasses = getCssClasses(formInputsValidity.street),
    postalCodeControlClasses = getCssClasses(formInputsValidity.postalCode),
    cityControlClasses = getCssClasses(formInputsValidity.city);

  formIsValid =
    nameIsValid && streetIsValid && cityIsValid && postalCodeIsValid;

  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className={nameControlClasses}>
        <label htmlFor="name">Your Name</label>
        <input
          type="text"
          id="name"
          onChange={nameChangeHandler}
          onBlur={nameBlurHandler}
          value={enteredName}
        />
        {nameHasError && <p>Please enter a valid name</p>}
      </div>

      <div className={streetControlClasses}>
        <label htmlFor="street">Street</label>
        <input
          type="text"
          id="street"
          onChange={streetChangeHandler}
          onBlur={streetBlurHandler}
          value={enteredStreet}
        />
        {streetHasError && <p>Please enter a valid street</p>}
      </div>

      <div className={postalCodeControlClasses}>
        <label htmlFor="postal">Postal Code</label>
        <input
          type="text"
          id="postal"
          onChange={postalCodeChangeHandler}
          onBlur={postalCodeBlurHandler}
          value={enteredPostalCode}
        />
        {postalCodeHasError && (
          <p>Please enter a valid postal code ( 5 characters long)</p>
        )}
      </div>
      <div className={cityControlClasses}>
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          onChange={cityChangeHandler}
          onBlur={cityBlurHandler}
          value={enteredCity}
        />
        {cityHasError && <p>Please enter a valid City</p>}
      </div>
      <div className={classes.actions}>
        <button type="button" onClick={onCancelHandler}>
          Cancel
        </button>
        <button className={classes.submit} disabled={!formIsValid}>
          Confirm
        </button>
      </div>
    </form>
  );
};

export default Checkout;
