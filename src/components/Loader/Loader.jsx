import style from "./Loader.module.css"

function Loader({ mini = false }) {
    return <div className={mini ? `${style.loading} ${style.mini}` : style.loading}></div>
}

export { Loader }
