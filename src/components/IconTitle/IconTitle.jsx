import { useState } from 'react'
import style from './IconTitle.module.css'


function IconTitle({ icon, title, onClick }) {
    const [titleIcon, setTitleIcon] = useState('')

    return <>
        <div
            className={style.icon}
        >
            <img
                src={icon}
                onClick={onClick ? onClick : null}
                onMouseOver={() => setTitleIcon(title)}
                onMouseLeave={() => setTitleIcon('')}
            />

            {titleIcon && <div className={style.title}>{titleIcon}</div>}

        </div>
    </>
}


export { IconTitle }
