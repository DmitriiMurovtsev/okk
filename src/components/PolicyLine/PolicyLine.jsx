import style from './PolicyLine.module.css'

import iconGood from '../../assets/icon-status-good.png'
import iconBadly from '../../assets/icon-status-badly.png'
import iconVerify from '../../assets/icon-status-verification.png'
import iconImage from '../../assets/icon-image-green.png'
import iconAudio from '../../assets/icon-audio-green.png'
import iconAddTask from '../../assets/icon-add-task.png'
import iconTasks from '../../assets/icon-tasks.png'
import iconTasksGreen from '../../assets/icon-tasks-green.png'
import iconUploadGreen from '../../assets/icon-upload-green.png'

import * as apiTasks from '../../api/apiTasks'

import { IconTitle } from '../IconTitle/IconTitle'
import { PopUp } from '../PopUp/PopUp'
import { useState } from 'react'


function PolicyLine({ policy, changeStatus, createTask, permissList = [] }) {
    // для открытия popup просмотра файлов
    const [openPopUp, setOpenPopUp] = useState(false)

    // смена статуса на "Проверено"
    function changeStatusLine() {
        changeStatus(policy, 'good')
        if (policy.task) {
            apiTasks.deleteTask(policy.task.id)
        }
    }

    // скачивает прикрепленный файл
    function uploadFile() {
        const url = policy.file;

        const ext = url.split('.').pop();
        const full_name = policy.client_full_name.replace(' ', '_');
        const bso = policy.bso.replace(' ', '_');
        const name = `Кросс_${full_name}_${bso}.${ext}`;

        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return <>
        <div className={style.line + ' ' + style[policy.status]}>

            {
                openPopUp &&
                <PopUp
                    policy={policy}
                    setOpenPopUp={setOpenPopUp}
                    changeStatus={changeStatus}
                    createTask={createTask}
                    permissList={permissList}
                />
            }

            <div className={style.name}>
                <div>{policy.client_full_name}</div>
                <div className={style.contactPerson}>{policy.contact_full_name || ''}</div>
            </div>
            <div className={style.company}>
                <div>{policy.company_name}</div>
                <div className={style.channel}>{policy.channel_name}</div>
            </div>
            <div className={style.type}>
                <div>{policy.bso}</div>
                <div className={style.typeName}>{policy.type_name}</div>
            </div>
            <div className={style.date}>
                <div>{policy.date_start}</div>
                <div>{policy.date_end}</div>
            </div>
            <div className={style.manager}>{policy.manager_full_name}</div>
            <div className={style.status}>{policy.status_display}</div>
            <div className={style.icons}>
                {
                    policy.image &&
                    <IconTitle
                        icon={iconImage}
                        title='Посмотреть скрин'
                        onClick={() => setOpenPopUp(true)}
                    />
                }

                {
                    policy.audio &&
                    <IconTitle
                        icon={iconAudio}
                        title='Прослушать запись'
                        onClick={() => setOpenPopUp(true)}
                    />
                }

                {
                    policy.file &&
                    <IconTitle
                        icon={iconUploadGreen}
                        title='Скачать файл'
                        onClick={uploadFile}
                    />
                }

                {
                    permissList.includes("okk") &&
                    <>
                        {
                            policy.status != 'good' &&
                            <IconTitle
                                icon={iconGood}
                                title='Поставить статус "Проверено"'
                                onClick={changeStatusLine}
                            />
                        }

                        {
                            policy.status != 'on_verification' &&
                            <IconTitle
                                icon={iconVerify}
                                title='Вернуть на проверку'
                                onClick={() => changeStatus(policy, 'on_verification')}
                            />
                        }

                        {
                            policy.status != 'badly' &&
                            <IconTitle
                                icon={iconBadly}
                                title='Отправить на доработку'
                                onClick={() => changeStatus(policy, 'badly')}
                            />
                        }
                    </>
                }

                {
                    policy.status != 'good' &&
                    <>
                        {
                            !policy.task && permissList.includes("okk") &&
                            <IconTitle
                                icon={iconAddTask}
                                title='Поставить задачу менеджеру'
                                onClick={() => createTask(policy)}
                            />
                        }

                        {
                            policy.task && !policy.task.done &&
                            <IconTitle
                                icon={iconTasks}
                                title='Есть задача в работе'
                            />
                        }

                        {
                            policy.task?.done &&
                            <IconTitle
                                icon={iconTasksGreen}
                                title='Менеджер выполнил задачу'
                            />
                        }
                    </>
                }
            </div>
        </div>
    </>
}


export { PolicyLine }
