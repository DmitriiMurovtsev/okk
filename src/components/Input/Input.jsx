import style from './Input.module.css'
import searchImg from "../../assets/search.png"
import { useEffect, useRef, useState } from 'react';
import iconAddGreen from "../../assets/icon-add-green.png"
import iconDeleteRed from "../../assets/icon-delete-red.png"


function Input({
    label = "label-input",
    onInput = null,
    onChange = null,
    onKeyDown = null,
    onBlur = null,
    search = false,
    required = false,
    validate = null,
    password = false,
    setValid = null,
    value = null,
    defaultValue = null,
    pushClick = null,
    removeClick = null,
}) {
    const [errorText, setErrorText] = useState('');                         // текст ошибки

    const inputId = `input-${Math.random().toString(36).substring(2, 9)}`;

    const inputRef = useRef(null);

    // валидация суммы 00.00
    function validatePriceInput(e) {
        if (!e.target.value) {
            onInput && onInput(e);
            return;
        };

        e.target.value = e.target.value.replace(",", ".");
        e.target.value = e.target.value.replace(/[^0-9\.]/g, "");

        const priceSplit = e.target.value.split(".");

        if (priceSplit.length > 1) {
            e.target.value = `${priceSplit[0]}.${priceSplit[1].substring(0, 2)}`
        };

        onInput && onInput(e);
    };

    // валидация даты в формат дд.мм.гггг
    function validateDateInput(e) {

        e.target.value = e.target.value.replace(/[^0-9]/g, "");

        if (!e.target.value) {
            setValid(false);
            onInput && onInput(e);
            return;
        };

        const value = e.target.value;
        const length = value.length;

        if (2 < length && length < 5) {
            const d = value.slice(0, 2) < 31 ? value.slice(0, 2) : 31;
            const m = value.slice(2, 4) < 12 ? value.slice(2, 4) : 12;
            e.target.value = d + "." + m;
        } else if (length > 4) {
            const d = value.slice(0, 2) < 31 ? value.slice(0, 2) : 31;
            const m = value.slice(2, 4) < 12 ? value.slice(2, 4) : 12;
            const y = value.slice(4, 8);
            e.target.value = d + "." + m + "." + y;
        };

        setValid(e.target.value.length == 10);
        onInput && onInput(e);
    };

    // валидация корректности даты
    function validateDateChange(e) {

        if (!e.target.value) {
            setErrorText('');
            setValid(false);
            return;
        };

        // длина меньше 10
        if (e.target.value.length < 10) {
            setErrorText('Неполная дата');
            setValid(false);
            return;
        };

        // год раньше 1900
        if (Number(e.target.value.substring(6, 10)) < 1900) {
            setErrorText('Неверная дата');
            setValid(false);
            return;
        };

        setErrorText('');
        setValid(true);
    };

    // валидация телефона в формат 79000000000 // 89000000000
    function validatePhoneInput(e) {

        e.target.value = e.target.value.replace(/[^0-9]/g, "");

        if (!e.target.value) {
            setErrorText('');
            setValid(false);
            onInput && onInput(e);
            return;
        };

        if (e.target.value.length < 10) {
            setValid(false);
        };

        if (e.target.value.substring(0, 1) == '7' || e.target.value.substring(0, 1) == '8') {
            e.target.value = e.target.value.substring(1, 11);
        };

        if (e.target.value.length == 11) {
            e.target.value = e.target.value.substring(0, 10);
        };

        onInput && onInput(e);
    };

    // валидация корректности телефона
    function validatePhoneChange(e) {

        if (!e.target.value) {
            setErrorText('');
            setValid(false);
            return;
        };

        if (e.target.value.length < 10) {
            setErrorText('Неполный номер телефона');
            setValid(false);
            return;
        };

        if (e.target.value.substring(0, 1) == '7' || e.target.value.substring(0, 1) == '8') {
            e.target.value = e.target.value.substring(1, 11);
        };

        if (e.target.value.length == 11) {
            e.target.value = e.target.value.substring(0, 10);
        };

        if (e.target.value.substring(0, 1) != '9') {
            setErrorText('Неверный номер телефона');
            setValid(false);
            return;
        };

        setErrorText('');
        setValid(true);
    };

    // убирает пробелы
    function validateEmailInput(e) {
        e.target.value = e.target.value.replace(" ", "");
        onInput && onInput(e);
    };

    // валидация корректности email, формат *@*.*
    function validateEmailChange(e) {

        if (!e.target.value) {
            setErrorText('');
            setValid(false);
            return;
        };

        const reg = new RegExp(/\S+@\S+\.\S+/g);

        if (!reg.test(e.target.value)) {
            setErrorText('Некорректный email');
            setValid(false);
            return;
        };

        setErrorText('');
        setValid(true);
    };

    // убирает двойные пробелы и пробелы с начала и с конца строки
    function trims(e) {
        if (!e.target.value) {
            return;
        };

        e.target.value = e.target.value.trim();

        const reg = new RegExp(/\s+/g);

        e.target.value = e.target.value.replace(reg, ' ');
    };

    // валидация номера ОСАГО
    function validateOsagoInput(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
        e.target.value = e.target.value.substring(0, 10);

        if (!e.target.value) {
            setErrorText('');
            setValid(false);
            onInput && onInput(e);
            return;
        };

        onInput && onInput(e);
    };

    // валидация номера ОСАГО
    function validateOsagoChange(e) {

        if (!e.target.value) {
            setErrorText('');
            setValid(false);
            return;
        };

        if (e.target.value.length < 10) {
            setErrorText("Нужно 10 символов");
            setValid(false);
            return;
        };

        setErrorText('');
        setValid(true);

    };

    useEffect(() => {

        inputRef.current.addEventListener("change", trims);

        if (validate == 'date') {
            inputRef.current.addEventListener("input", validateDateInput);
            inputRef.current.addEventListener("change", validateDateChange);
        };

        if (validate == 'phone') {
            inputRef.current.addEventListener("input", validatePhoneInput);
            inputRef.current.addEventListener("change", validatePhoneChange);
        };

        if (validate == 'email') {
            inputRef.current.addEventListener("input", validateEmailInput);
            inputRef.current.addEventListener("change", validateEmailChange);
        };

        if (validate == 'price') {
            inputRef.current.addEventListener("input", validatePriceInput);
        };

        if (validate == 'osago') {
            inputRef.current.addEventListener("input", validateOsagoInput);
            inputRef.current.addEventListener("change", validateOsagoChange);
        };

    }, []);

    useEffect(() => {
        if (validate == 'date' && value?.length == 10 && errorText == 'Неполная дата') {
            setErrorText("");
        };
    }, [value]);

    return <>
        <div className={errorText ? `${style.input} ${style.errorInput}` : (value && !onInput) ? `${style.input} ${style.disabled}` : style.input}>

            <input
                ref={inputRef}
                onChange={onChange}
                onInput={!validate ? onInput : null}
                onKeyDown={(e) => { onKeyDown && e.key === 'Enter' && onKeyDown(e) }}
                onBlur={onBlur}
                id={inputId}
                type={password ? "password" : "text"}
                required
                value={value}
                defaultValue={defaultValue}
            />

            <label htmlFor={inputId}>
                {required && <span className={style.required}>*</span>}
                {label}
            </label>

            {errorText && <div className={style.errorText}>{errorText}</div>}

            {search && <img className={style.searchImg} src={searchImg} />}
            {pushClick && <img className={style.pushClick} src={iconAddGreen} onClick={pushClick} />}
            {removeClick && <img className={style.removeClick} src={iconDeleteRed} onClick={removeClick} />}
        </div>
    </>
}

export { Input }