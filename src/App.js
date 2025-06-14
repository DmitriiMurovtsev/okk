import * as apiPolicies from './api/apiPolicies';
import * as apiUsers from './api/apiUsers'

import { useEffect, useState } from "react";

import { Input } from "./components/Input/Input";
import { Loader } from "./components/Loader/Loader";
import { PolicyLine } from "./components/PolicyLine/PolicyLine";
import { Pagi } from "./components/Pagi/Pagi";


function App() {
  // основной loader
  const [loading, setLoading] = useState(false);

  const [permissList, setPermissList] = useState([]);

  const [socket, setSocket] = useState(null);
  const [messageSocket, setMessageSocket] = useState('')

  const [loadingOnVerifiction, setLoadingOnVerification] = useState(false);
  const [loadingGood, setLoadingGood] = useState(false);
  const [loadingBadly, setLoadingBadly] = useState(false);

  const [search, setSearch] = useState('')

  // массив полисов, прошедших проверку
  const [policiesGoodResponse, setPoliciesGoodResponse] = useState();
  const [policiesGoodCount, setPoliciesGoodCount] = useState(0);
  const [PoliciesGoodCurrentPage, setPoliciesGoodCurrentPage] = useState('');
  const [policiesGood, setPoliciesGood] = useState([])
  const [nextPagePoliciesGood, setNextPagePoliciesGood] = useState('')
  const [previousPagePoliciesGood, setPreviousPagePoliciesGood] = useState('')

  // массив полисов, на доработке
  const [policiesBadlyResponse, setPoliciesBadlyResponse] = useState();
  const [policiesBadlyCount, setPoliciesBadlyCount] = useState(0);
  const [PoliciesBadlyCurrentPage, setPoliciesBadlyCurrentPage] = useState('');
  const [policiesBadly, setPoliciesBadly] = useState([])
  const [nextPagePoliciesBadly, setNextPagePoliciesBadly] = useState('')
  const [previousPagePoliciesBadly, setPreviousPagePoliciesBadly] = useState('')

  // массив полисов, на проверке
  const [policiesOnVerificationResponse, setPoliciesOnVerificationResponse] = useState();
  const [policiesOnVerificationCount, setPoliciesOnVerificationCount] = useState(0);
  const [PoliciesOnVerificationCurrentPage, setPoliciesOnVerificationCurrentPage] = useState('');
  const [policiesOnVerification, setPoliciesOnVerification] = useState([])
  const [nextPagePoliciesOnVerification, setNextPagePoliciesOnVerification] = useState('')
  const [previousPagePoliciesOnVerification, setPreviousPagePoliciesOnVerification] = useState('')

  // получает полисы, прошедшие проверку
  function getPoliciesGood(nextPage, previousPage){
    if (nextPage || previousPage) {
      setLoadingOnVerification(true)
    } else {
      setLoading(true)
    }
    apiPolicies.getPolicies('good', nextPage || previousPage, search).then(response => {
      setLoading(false)
      setLoadingOnVerification(false)
      if (response.status !== 200) {
        console.log('Ошибка запроса массива полисов ' + response.status)
        return
      }

      setPoliciesGoodResponse(response.data);
    })
  }

  // получает полисы на доработке
  function getPoliciesBadly(nextPage, previousPage){
    if (nextPage || previousPage) {
      setLoadingBadly(true)
    } else {
      setLoading(true)
    }    
    apiPolicies.getPolicies('badly', nextPage || previousPage, search).then(response => {
      setLoading(false)
      setLoadingBadly(false)
      if (response.status !== 200) {
        console.log('Ошибка запроса массива полисов ' + response.status)
        return
      }

      setPoliciesBadlyResponse(response.data);
    })
  }

  // получает полисы на проверке
  function getPoliciesOnVerification(nextPage, previousPage){
    if (nextPage || previousPage) {
      setLoadingGood(true)
    } else {
      setLoading(true)
    }    
    apiPolicies.getPolicies('on_verification', nextPage || previousPage, search).then(response => {
      setLoading(false)
      setLoadingGood(false)
      if (response.status !== 200) {
        console.log('Ошибка запроса массива полисов ' + response.status)
        return
      }

      setPoliciesOnVerificationResponse(response.data);
    })
  }

  // смена статуса по полису
  function changeStatus(policy, status) {
    setLoading(true)
    apiPolicies.changeStatus(policy.id, status).then(response => {
      setLoading(false)

      if (response.status !== 200) {
        console.log('Ошибка смены статуса полиса, код ' + response.status)
        return
      }
      if (policy.status == 'good' || response.data.status == 'good') {
        getPoliciesGood() 
      }
      if (policy.status == 'badly' || response.data.status == 'badly') {
        getPoliciesBadly() 
      }
      if (policy.status == 'on_verification' || response.data.status == 'on_verification') {
        getPoliciesOnVerification() 
      }

    })
  }

  // постановка задачи
  function createTask(policy) {
    setLoading(true)
    apiPolicies.createTask(policy.id).then(response => {
      setLoading(false)
      if (response.status !== 200) {
        console.log('Ошибка постановки задачи ' + response.status)
        return
      }      

      getPoliciesBadly()
      if (policy.status == 'on_verification') {
        getPoliciesOnVerification()
      }
    })
  }

  // запрос всех полисов
  function getPolicies() {
    getPoliciesOnVerification()
    getPoliciesBadly()
    getPoliciesGood()
  }

  function update_task(task) {    
    setPoliciesOnVerification(p => {
      p = p.map(policy => {
        if (policy.task && policy.task.id == task.id) {
          policy.task = task
          task.done && setMessageSocket(`Менеджер выполнил задачу по полису ${policy.bso} (${policy.client_full_name})`)
          !task.done && setMessageSocket(`По полису ${policy.bso} (${policy.client_full_name}) поставлена задача`)
        }
        return policy
      })
      return p
    })

    setPoliciesBadly(p => {
      p = p.map(policy => {
        if (policy.task && policy.task.id == task.id) {
          policy.task = task          
          task.done && setMessageSocket(`Менеджер выполнил задачу по полису ${policy.bso} (${policy.client_full_name})`)
          !task.done && setMessageSocket(`По полису ${policy.bso} (${policy.client_full_name}) поставлена задача`)          
        }
        return policy
      })
      return p
    })    
  }

  function delete_task(policyId) {    
    setPoliciesOnVerification(p => {
      p = p.map(policy => {
        if (policy.id == policyId) {
          policy.task = null
          setMessageSocket(`Удалена задача по полису ${policy.bso} (${policy.client_full_name})`)          
        }
        return policy
      })
      return p
    })

    setPoliciesBadly(p => {
      p = p.map(policy => {
        if (policy.id == policyId) {
          policy.task = null
          setMessageSocket(`Удалена задача по полису ${policy.bso} (${policy.client_full_name})`)          
        }
        return policy
      })
      return p
    })    
  }

  function add_task(task, policyId) {
    setPoliciesOnVerification(p => {
      p = p.map(policy => {
        if (policy.id == policyId) {
          policy.task = task
          setMessageSocket(`По полису ${policy.bso} (${policy.client_full_name}) поставлена задача менеджеру`)          
        }
        return policy
      })
      return p
    })

    setPoliciesBadly(p => {
      p = p.map(policy => {
        if (policy.id == policyId) {
          policy.task = task
          setMessageSocket(`По полису ${policy.bso} (${policy.client_full_name}) поставлена задача менеджеру`)          
        }
        return policy
      })
      return p
    })    
  }

  function delete_policy(policy_id, bso, client_full_name) {
    setPoliciesOnVerification((p) => p.filter((policy) => policy.id != policy_id))
    setPoliciesBadly((p) => p.filter((policy) => policy.id != policy_id))
    setPoliciesGood((p) => p.filter((policy) => policy.id != policy_id))
    setMessageSocket(`Удалён полис ${bso} (${client_full_name})`)
  }

  function add_new_policy(policy) {
    setMessageSocket(`Добавлен полис ${policy.bso} (${policy.client_full_name})`)
    setPoliciesOnVerificationCount(p => p + 1)
  }

  useEffect(() => {
    getPolicies()
  }, [])

  useEffect(() => {
    if(!socket) {
      // const newSocket = new WebSocket(`wss://app.insfamily.ru:8001/ws/okk/policies/?${localStorage.getItem('access')}`)
      const newSocket = new WebSocket(`wss://app.insfamily.ru:8001/ws/okk/policies/`)

      newSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        
        data.type == 'status_task_update' && update_task(data.task)
        data.type == 'delete_task' && delete_task(data.policy_id)
        data.type == 'create_task' && add_task(data.task, data.policy_id)
        data.type == 'create_policy' && add_new_policy(data.policy)
        data.type == 'delete_policy' && delete_policy(data.policy_id, data.bso, data.client_full_name)
      }

      setSocket(newSocket)
    }

    return () => {      
      socket && socket.close();
      setSocket(null);
  }
  }, [])

  useEffect(() => {
    setPoliciesGood(policiesGoodResponse?.results || [])
    setPoliciesGoodCount(policiesGoodResponse?.count)
    setPoliciesGoodCurrentPage(policiesGoodResponse?.current_page)
    setNextPagePoliciesGood(policiesGoodResponse?.next)
    setPreviousPagePoliciesGood(policiesGoodResponse?.previos)
  }, [policiesGoodResponse])

  useEffect(() => {
    setPoliciesBadly(policiesBadlyResponse?.results || [])
    setPoliciesBadlyCount(policiesBadlyResponse?.count)
    setPoliciesBadlyCurrentPage(policiesBadlyResponse?.current_page)
    setNextPagePoliciesBadly(policiesBadlyResponse?.next)
    setPreviousPagePoliciesBadly(policiesBadlyResponse?.previos)
  }, [policiesBadlyResponse])
  
  useEffect(() => {
    setPoliciesOnVerification(policiesOnVerificationResponse?.results || [])
    setPoliciesOnVerificationCount(policiesOnVerificationResponse?.count)
    setPoliciesOnVerificationCurrentPage(policiesOnVerificationResponse?.current_page)
    setNextPagePoliciesOnVerification(policiesOnVerificationResponse?.next)
    setPreviousPagePoliciesOnVerification(policiesOnVerificationResponse?.previos)
  }, [policiesOnVerificationResponse])

  useEffect(() => {
    if (messageSocket) {
      const timerMessage = setTimeout(() => {
        setMessageSocket('')
      }, 10000)
    }
  }, [messageSocket])

  useEffect(() => {
    apiUsers.getPermiss().then(response => setPermissList(response?.data || []))
  }, [])

  return <>
    <div className="container">

      {
        messageSocket &&
        <div
          className={messageSocket ? `snackbar show` : 'snackbar'}
          onClick={() => setMessageSocket('')}
        >
          {messageSocket}
        </div>
      }

      <div className="on-verification">

        <div className="top-line">
          <div className="input-search">
            <Input
              label="Поиск"
              value={search}
              onInput={(e) => setSearch(e.target.value)}
              onBlur={getPolicies}
              onKeyDown={getPolicies}
              search
            />
          </div>
          { loading && <Loader /> }
        </div>

        <div className="table">
          {
            policiesOnVerification.map(policy => (
              <PolicyLine
                policy={policy}
                changeStatus={changeStatus}
                createTask={createTask}
                permissList={permissList}
              />
            ))
          }
        </div>

        <Pagi
          count={policiesOnVerificationCount}
          currentPage={PoliciesOnVerificationCurrentPage}
          nextPage={nextPagePoliciesOnVerification}
          previousPage={previousPagePoliciesOnVerification}
          loading={loadingOnVerifiction}
          getNext={getPoliciesOnVerification}
          getPrevious={getPoliciesOnVerification}
        />
        
      </div>
      
      {
        policiesBadly.length > 0 &&
        <div className="badly">
          <div className="table">
            {
              policiesBadly.map(policy => (
                <PolicyLine
                  policy={policy}
                  changeStatus={changeStatus}
                  createTask={createTask}
                  permissList={permissList}
                />
              ))
            }
          </div>

          <Pagi
            count={policiesBadlyCount}
            currentPage={PoliciesBadlyCurrentPage}
            nextPage={nextPagePoliciesBadly}
            previousPage={previousPagePoliciesBadly}
            loading={loadingBadly}
            getNext={getPoliciesBadly}
            getPrevious={getPoliciesBadly}
          />

        </div>
      }

      {
        policiesGood.length > 0 &&
        <div className="good">
          <div className="table">
            {
              policiesGood.map(policy => (
                <PolicyLine
                  policy={policy}
                  changeStatus={changeStatus}
                  createTask={createTask}
                  permissList={permissList}
                />
              ))
            }
          </div>

          <Pagi
            count={policiesGoodCount}
            currentPage={PoliciesGoodCurrentPage}
            nextPage={nextPagePoliciesGood}
            previousPage={previousPagePoliciesGood}
            loading={loadingGood} 
            getNext={getPoliciesGood}
            getPrevious={getPoliciesGood}
          />        
          
        </div>
      }
      
    </div>
  </>
}

export default App;
