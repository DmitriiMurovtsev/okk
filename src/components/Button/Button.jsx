import style from "./Button.module.css"

function Button({ label, onClick = null, disabled = false, red = false, white = false }) {
    let classN = style.button
    red && (classN = `${classN} ${style.red}`)
    white && (classN = `${classN} ${style.white}`)

    return <>
        <button
            className={classN}
            onClick={onClick}
            disabled={disabled}
        >{label}</button>
    </>

}

export { Button }