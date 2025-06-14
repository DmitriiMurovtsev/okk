import style from './Pagi.module.css'

import iconNextOff from '../../assets/icon-next-page-off.png'
import iconNext from '../../assets/icon-next-page.png'
import iconPrevious from '../../assets/icon-previos-page.png'
import iconPreviousOff from '../../assets/icon-previos-page-off.png'

import { Loader } from '../Loader/Loader'


function Pagi({
    count,
    currentPage,
    nextPage,
    previousPage,
    loading,
    getNext,
    getPrevious,
}) {
    return <>
        <div className={style.pagi}>
            <div>Всего: {count}</div>
            <div>
                <img
                    src={previousPage ? iconPrevious : iconPreviousOff}
                    onClick={previousPage ? () => getPrevious(null, previousPage) : null}
                />
            </div>
            <div>
                {currentPage}
            </div>
            <div>
                <img
                    src={nextPage ? iconNext : iconNextOff}
                    onClick={nextPage ? () => getNext(nextPage) : null}
                />
            </div>
            <div>
                {loading && <Loader />}
            </div>
        </div>
    </>
}


export { Pagi }
