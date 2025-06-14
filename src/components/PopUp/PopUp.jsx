import style from './PopUp.module.css'

import iconGood from '../../assets/icon-status-good.png'
import iconBadly from '../../assets/icon-status-badly.png'
import iconVerify from '../../assets/icon-status-verification.png'
import iconAddTask from '../../assets/icon-add-task.png'

import * as apiTasks from '../../api/apiTasks'

import { useRef } from 'react'

import { IconTitle } from '../IconTitle/IconTitle'


function PopUp({ policy, setOpenPopUp, changeStatus, createTask, permissList }) {
    const popRef = useRef(null)

    function close(e) {
        !popRef.current?.contains(e.target) && setOpenPopUp(false)
    }

    // запрос на смену статуса и закрытие popup
    function changeStatusPopUp(status) {
        changeStatus(policy, status)
        setOpenPopUp(false)
    }

    // запрос на постановку задачи
    function createTaskPopUp() {
        createTask(policy)
        setOpenPopUp(false)
    }

    // смена статуса на "Проверено"
    function changeStatusPopUp() {
        changeStatus(policy, 'good')
        if (policy.task) {
            apiTasks.deleteTask(policy.task.id)
        }
    }

    return <>
        <div className={style.container} onClick={close} >
            <div className={style.body} ref={popRef} >
                {
                    permissList.includes("okk") &&
                    <div className={style.icons}>
                        {
                            policy.status != 'good' &&
                            <IconTitle
                                icon={iconGood}
                                title='Поставить статус "Проверено"'
                                onClick={changeStatusPopUp}
                            />
                        }

                        {
                            policy.status != 'on_verification' &&
                            <IconTitle
                                icon={iconVerify}
                                title='Вернуть на проверку'
                                onClick={() => changeStatusPopUp('on_verification')}
                            />
                        }

                        {
                            policy.status != 'badly' &&
                            <IconTitle
                                icon={iconBadly}
                                title='Отправить на доработку'
                                onClick={() => changeStatusPopUp('badly')}
                            />
                        }

                        {
                            policy.status != 'good' && !policy.task &&
                            <IconTitle
                                icon={iconAddTask}
                                title='Поставить задачу менеджеру'
                                onClick={createTaskPopUp}
                            />
                        }
                    </div>
                }
                <div className={style.content}>
                    {
                        policy.audio && <audio autoplay='autoplay' src={policy.audio} controls></audio>
                    }

                    {
                        policy.image && <img src={policy.image} />
                    }
                </div>
            </div>
        </div>
    </>
}


export { PopUp }
