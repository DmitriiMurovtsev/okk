import { useEffect, useRef, useState } from "react"
import style from "./SelectCustom.module.css"
import selectIcon from "../../assets/selectIcon.png"

function SelectCustom({
    options = [],
    label = "label-select",
    onChange = null,
    startValue = null,
    defaultValue = null,
    required = false,
}) {
    const [openOptions, setOpenOptions] = useState(false);
    const [target, setTarget] = useState(null);
    const [targetValue, setTargetValue] = useState(startValue ? startValue : defaultValue ? defaultValue : null);

    const selectRef = useRef(null);

    // закрытие options кликом за его пределами
    function closeOptions(e) {
        selectRef.current && !selectRef.current.contains(e.target) && setOpenOptions(false);
    };

    // выбор значения
    function checkTarget(e) {
        setTargetValue(e.target.getAttribute("value"));
    };

    useEffect(() => {

        onChange && onChange(targetValue);
        setTarget(() => {
            const targetOption = options.filter(i => i.id == targetValue);
            if (targetOption.length > 0) {
                return targetOption[0].name;
            } else {
                return null;
            };
        });

    }, [targetValue]);

    useEffect(() => {

        setTarget(() => {
            const targetOption = options.filter(i => i.id == targetValue);
            if (targetOption.length > 0) {
                return targetOption[0].name;
            } else {
                return null;
            };
        });

        !options.length && setTargetValue(null);

    }, [options]);

    useEffect(() => {
        if (defaultValue) {
            setTargetValue(defaultValue);
        } else if (startValue) {
            setTargetValue(startValue);
        } else {
            setTargetValue(null);
        };
    }, [defaultValue, startValue]);

    useEffect(() => {
        if (openOptions) {
            document.body.addEventListener("click", closeOptions);
        } else {
            document.body.removeEventListener("click", closeOptions);
        }
    }, [openOptions]);

    return <div
        ref={selectRef}
        onClick={() => { setOpenOptions(p => !p) }}
        className={openOptions || target ? `${style.select} ${style.focus}` : style.select}
    >

        <div className={style.value}>

            <div className={target ? `${style.label} ${style.labelTarget}` : style.label}>
                {required && <span className={style.required}>*</span>}
                {label}
            </div>

            <div className={style.target}>
                {target && target}
            </div>
        </div>

        <img className={openOptions ? style.focus : ""} src={selectIcon} />

        <div
            className={openOptions ? `${style.options} ${style.active}` : style.options}
        >
            {/* стартовый прочерк, select без выбора */}
            {!startValue && !defaultValue && <div value="" className={style.option} onClick={checkTarget}>-</div>}

            {/* стартовый прочерк, select с выбором */}
            {defaultValue && <div value="" className={style.option} onClick={checkTarget}>-</div>}

            {
                options.map((item) => (
                    <div
                        key={item.id}
                        value={item.id}
                        className={style.option}
                        onClick={checkTarget}
                    >
                        {item.name}
                    </div>
                ))
            }

        </div>
    </div>
}

export { SelectCustom }