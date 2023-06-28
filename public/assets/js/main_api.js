const tokenStorage = localStorage.getItem('tokenMicksFrota')
const header = { headers: { "x-access-token": `${tokenStorage}` } }
const mensagem = document.getElementById("mensagem").innerText
const endpoint = document.getElementById("servidor").innerText
let veiculos = []
let ultimasOSs = []
let revisoes = []
let integrator = []

//msg(mensagem)

function msg(msg, tipo="info"){
  if(tipo === 'nao'){
    $.notify(msg, "success")
  }else if(tipo === 'sim'){
    $.notify(msg, "error")
  }else{
    $.notify(msg, "info")
  }
}

function msgWithTime(position, icon, title, button, timer) {
  // EXEMPLO: msgWithTime('center', 'success', 'Apagado!', true, 1000);

  //warning, error, success, info, question
  //'top', 'top-start', 'top-end', 'center', 'center-start', 'center-end', 'bottom', 'bottom-start', 'bottom-end'.
  Swal.fire({
      position: position,
      icon: icon,
      title: title,
      showConfirmButton: button,
      timer: timer
  });
}

function loading(small, position, confirm, timer, icon, text) {
  // EXEMPLO: loading(true, 'center', false, 2000, 'info', 'Aguarde carregar...');

  //warning, error, success, info, question
  //'top', 'top-start', 'top-end', 'center', 'center-start', 'center-end', 'bottom', 'bottom-start', 'bottom-end'.
  Swal.fire({
      toast: small,
      position: position,
      showConfirmButton: confirm,
      timer: timer,
      timerProgressBar: true,
      icon: icon,
      title: text
  })
}

function msgConfirm(title, text, icon, function_yes, function_no) {
  Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Desejo!',
      cancelButtonText: 'Cancelar'
  })
      .then((result) => {
          if (result.isConfirmed) {
              function_yes();
          } else {
              function_no();
          }
      })
}

function constructSelect(id, array, value = '', name = '') {

  let option = '';

  if (name === '' || name === 'null') {
      option += `<option value="" selected disabled>Selecione uma opção</option>`;
  } else {
      option += `<option selected value="${value}">${name}</option>`;
  }

  array.forEach((item, index) => {
      if (name != item.name) {
          option += `<option value="${item.id}">${item.name}</option>`;
      }
  });

  document.getElementById(id).innerHTML = option;

}

function listarVeiculos() {
  return new Promise(function (resolve, reject) {
    axios.get(`${endpoint}veiculos`, header)
    .then(function (response) {
      if (response.data.erroGeral == 'nao') {
        resolve(response)
      } else {
        reject(response)
      }
    })
    .catch(function (error) {
      reject(error)
    })
  })
}

function listarRevisoes() {
  return new Promise(function (resolve, reject) {
    axios.get(`${endpoint}revisoes`, header)
    .then(function (response) {
      if (response.data.erroGeral == 'nao') {
        resolve(response)
      } else {
        reject(response)
      }
    })
    .catch(function (error) {
      reject(error)
    })
  })
}

function apagar_veiculo(id){
  axios.delete(`${endpoint}veiculo/${id}`, header).then(function (response) {
    if (response.data.erroGeral === 'sim') {
      Swal.fire({ icon: 'error', title: 'Oops...', text: response.data.msg })
    } else {
      loading(true, 'center', false, 2000, 'info', response.data.msg)
      setTimeout(function () { location.replace(`${endpoint}main`); }, 2000)
    }
  }).catch(function (error) {
    console.log(error)
    Swal.fire({ icon: 'error', title: 'Oops...', text: error })
  })
}

function apagar_revisao(id){
  axios.delete(`${endpoint}revisao/${id}`, header).then(function (response) {
    if (response.data.erroGeral === 'sim') {
      Swal.fire({ icon: 'error', title: 'Oops...', text: response.data.msg })
    } else {
      loading(true, 'center', false, 2000, 'info', response.data.msg)
      setTimeout(function () { location.replace(`${endpoint}main`); }, 2000)
    }
  }).catch(function (error) { 
    console.log(error)
    Swal.fire({ icon: 'error', title: 'Oops...', text: error })
  })
}

function apagar_ordem_servico(id){
  axios.delete(`${endpoint}os/${id}`, header).then(function (response) {
    if (response.data.erroGeral === 'sim') {
      Swal.fire({ icon: 'error', title: 'Oops...', text: response.data.msg })
    } else {
      loading(true, 'center', false, 2000, 'info', response.data.msg)
      setTimeout(function () { location.replace(`${endpoint}main`); }, 2000)
    }
  }).catch(function (error) { 
    console.log(error)
    Swal.fire({ icon: 'error', title: 'Oops...', text: error })
  })
}

function editar_veiculo(id, modelo, placa, motorista, cod_os, numero, km_atual, km_revisao, obs, ativo){
  document.getElementById('edit_id').innerHTML = id
  document.getElementById('edit_modelo').value = modelo
  document.getElementById('edit_placa').value = placa
  document.getElementById('edit_motorista').value = motorista
  document.getElementById('edit_cod_os').value = cod_os
  document.getElementById('edit_numero').value = numero
  document.getElementById('edit_km_atual').value = km_atual
  document.getElementById('edit_km_atual').value = km_atual
  document.getElementById('edit_km_revisao').value = km_revisao
  document.getElementById('edit_obs').value = obs
  constructSelect('edit_ativo', [{id:'sim', name:'Sim'}, {id:'nao', name:'Não'}], ativo, ativo)
}

function editar_revisao(id, id_veiculo, modelo, valor, km_revisa_feita, obs){

  const array = veiculos.map((item, index)=>{ return { id: item.id, name: `${item.modelo}-${item.numero}` }})
  constructSelect('edit_rev_veiculo', array, id_veiculo, modelo)

  document.getElementById('edit_rev_id').innerHTML = id
  document.getElementById('edit_rev_valor').value = valor
  document.getElementById('edit_rev_km_revisao').value = km_revisa_feita
  document.getElementById('edit_rev_obs').value = obs

}

function abrir_inserir_revisao(){
  const array = veiculos.map((item, index)=>{ return { id: item.id, name: `${item.modelo}-${item.numero}` }})
  constructSelect("rev_veiculo", array)
}

function alterar_revisao(){
  let obj_edit = {
    id: document.getElementById("edit_rev_id").innerHTML,
    id_veiculo: document.getElementById("edit_rev_veiculo").value,
    valor: document.getElementById("edit_rev_valor").value,
    km_revisa_feita: document.getElementById("edit_rev_km_revisao").value,
    obs: document.getElementById("edit_rev_obs").value
  }

  if (obj_edit.id === '' || obj_edit.id_veiculo === '' || obj_edit.valor === '' || obj_edit.km_revisa_feita === '') {
    Swal.fire({ icon: 'info', title: 'Oops...', text: 'Preencha os campos principais: Veículo, Valor e KM Revisão' });
  } else {
    axios.put(`${endpoint}revisao`, obj_edit, header).then(function (response) {
      if (response.data.erroGeral === 'sim') {
        Swal.fire({ icon: 'error', title: 'Oops...', text: response.data.msg })
      } else {
        loading(true, 'center', false, 2000, 'info', 'Revisão atualizada com Sucesso!')
        setTimeout(function () { location.replace(`${endpoint}main`); }, 2000)
      }
    }).catch(function (error) { 
      console.log(error)
      Swal.fire({ icon: 'error', title: 'Oops...', text: error })
    })
  }

}

function alterar_veiculo(){
  let obj_insert = {
    id:         document.getElementById("edit_id").innerHTML,
    modelo:     document.getElementById("edit_modelo").value,
    placa:      document.getElementById("edit_placa").value,
    motorista:  document.getElementById("edit_motorista").value,
    cod_os:     document.getElementById("edit_cod_os").value,
    numero:     document.getElementById("edit_numero").value,
    km_atual:   document.getElementById("edit_km_atual").value,
    km_revisao: document.getElementById('edit_km_revisao').value,
    ativo:      document.getElementById('edit_ativo').value,
    obs:        document.getElementById('edit_obs').value,
  }
  if (obj_insert.modelo === '' || obj_insert.placa === '' || obj_insert.numero === '') {
    Swal.fire({ icon: 'info', title: 'Oops...', text: 'Preencha os campos principais: Modelo, placa e número' });
  } else {
    axios.put(`${endpoint}veiculo`, obj_insert, header)
    .then((response)=>{
      if (response.data.erroGeral === 'sim') {
        Swal.fire({ icon: 'error', title: 'Oops...', text: response.data.msg })
      }else{
        loading(true, 'center', false, 1000, 'info', 'Veículo alterado com Sucesso!')
        setTimeout(function () { location.replace(`${endpoint}main`); }, 1000)
      }
    })
    .catch((err)=>{ 
      console.log(err)
      Swal.fire({ icon: 'error', title: 'Oops...', text: err })
    })
  }
}

function ultimasOS() {
  return new Promise(function (resolve, reject) {
    axios.get(`${endpoint}os_vei`, header)
    .then(function (response) {
      if (response.data.erroGeral == 'nao') {
        resolve(response)
      } else {
        reject(response)
      }
    })
    .catch(function (error) {
      reject(error)
    })
  })
}

async function iniciar(){
  let autenticate = false
  await listarVeiculos().then((res)=>{
    autenticate = res.status == 200 ? true : false 
    msg(`${res.data.msg} - ${res.statusText}`, res.data.erroGeral)
    if (res.data.erroGeral == 'nao') { veiculos = res.data.dados }
  }).catch((err)=>{
    console.log("Erro ao listar veículos")
    console.error(err.response)
    if(err.response.status == 401){
      msg("Sem autorização. Faça login novamente!", "sim")
      localStorage.clear()
      setTimeout(function () { location.replace(`${endpoint}index`); }, 3000)
    }
  })

  if(autenticate){

    await ultimasOS().then((res)=>{
      if (res.data.erroGeral == 'nao') { 
        ultimasOSs = res.data.dados
        integrator = res.data.integrator
      }
    }).catch((err)=>{
      console.log("Erro ao listar Ordens de Serviço")
      console.error(err.response)
    })
 
    await listarRevisoes().then((res)=>{
      if (res.data.erroGeral == 'nao') { 
        revisoes = res.data.dados
      }
    }).catch((err)=>{
      console.log("Erro ao listar as Revisões")
      console.error(err.response)
    })    
    
    if(veiculos.length > 0){
      let tbody = ''
  
      veiculos.forEach((item, index)=>{
        const cor = item.km_revisao - item.km_atual <= 500 ? 'red' : 'green'
        const edit = `'${item.id}', '${item.modelo}', '${item.placa}', '${item.motorista}', '${item.cod_os}', '${item.numero}', '${item.km_atual}', '${item.km_revisao}', '${item.obs}', '${item.ativo}'`
        tbody += `<tr>
                    <td>${index+1}</td>
                    <td>${item.modelo}-${item.numero}</td>
                    <td>${item.placa}</td>
                    <td>${item.motorista}</td>
                    <td>${item.cod_os}</td>
                    <td style="color: ${cor};">${item.km_atual}</td>
                    <td>${item.km_revisao}</td>
                    <td>${new Date(item.updatedAt).toLocaleString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Sao_Paulo'})}</td>
                    <td title="Editar Veiculo">
                      <button class="btn btn-unstyled" data-bs-toggle="modal" data-bs-target="#editar_carro" onclick="editar_veiculo(${edit})">
                        <i class='bx bx-edit bx-sm'></i>
                      </button>
                    </td>
                    <td title="Apagar Veículo">
                      <button class="btn btn-unstyled" onclick="msgConfirm('Deseja apagar o veículo: ${item.modelo}-${item.numero} ?', 'Esta operação não pode ser desfeita', 'question', ()=>{apagar_veiculo(${item.id})}, ()=>{msgWithTime('center', 'info', 'Cancelado!', false, 1500);})">
                        <i class='bx bx-trash bx-sm'></i>
                      </button>
                    </td>
                  </tr>`
      })
  
      const table = `<table id="tabela1" style="font-size:13px">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Carro</th>
                        <th>Placa</th>
                        <th>Motorista</th>
                        <th>OS</th>
                        <th>Km Atual</th>
                        <th>Km Revisão</th>
                        <th>Atualizado em</th>
                        <th>Editar</th>
                        <th>Excluir</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${tbody}
                    </tbody>
                  </table>
    `
    document.getElementById('table_veiculos').innerHTML = table
    }

    if(revisoes.length > 0){
      let tbody = ''
  
      revisoes.forEach((item, index)=>{
        let carro = ''
        veiculos.map((i)=>{ if (i.id == item.id_veiculo){ carro = `${i.modelo}-${i.numero}` } })
        const edit = `'${item.id}', '${item.id_veiculo}', '${carro}', '${item.valor}', '${item.km_revisa_feita}', '${item.obs}'`
        tbody += `<tr>
                    <td>${index+1}</td>
                    <td>${carro}</td>
                    <td>${item.valor}</td>
                    <td>${item.km_revisa_feita}</td>
                    <td>${item.obs}</td>
                    <td>${new Date(item.updatedAt).toLocaleString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Sao_Paulo'})}</td>
                    <td title="Editar Revisão">
                      <button class="btn btn-unstyled" data-bs-toggle="modal" data-bs-target="#editar_revisao" onclick="editar_revisao(${edit})">
                        <i class='bx bx-edit bx-sm'></i>
                      </button>
                    </td>
                    <td title="Apagar Revisão">
                      <button class="btn btn-unstyled" onclick="msgConfirm('Deseja apagar a revisão do ${carro} de valor: ${item.valor}?', 'Esta operação não pode ser desfeita', 'question', ()=>{apagar_revisao(${item.id})}, ()=>{msgWithTime('center', 'info', 'Cancelado!', false, 1500);})">
                        <i class='bx bx-trash bx-sm'></i>
                      </button>
                    </td>
                  </tr>`
      })
  
      const table = `<table id="tabela2" style="font-size:13px">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Veículo</th>
                          <th>Valor</th>
                          <th>KM Revisão</th>
                          <th>OBS</th>
                          <th>Atualizado em</th>
                          <th>Editar</th>
                          <th>Excluir</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${tbody}
                      </tbody>
                    </table>`
      document.getElementById('table_revisoes').innerHTML = table
    }
  
    if(ultimasOSs.length > 0){
      let tbody = ''
      ultimasOSs.forEach((item, index)=>{
        tbody += `<tr>
                    <td>${index+1}</td>
                    <td>${item.OS}</td>
                    <td>${item.carro}</td>
                    <td>${item.num}</td>
                    <td>${item.hora}</td>
                    <td title="Apagar OS">
                      <button class="btn btn-unstyled" onclick="msgConfirm('Deseja apagar a Ordem de Serviço: ${item.OS} referente ao veículo ${item.carro}-${item.num}?', 'Esta operação não pode ser desfeita', 'question', ()=>{apagar_ordem_servico(${item.id})}, ()=>{msgWithTime('center', 'info', 'Cancelado!', false, 1500);})">
                        <i class='bx bx-trash bx-sm'></i>
                      </button>
                    </td>
                  </tr>`
      })
      
      const table = `
      <table id="tabela3" style="font-size:13px">
        <thead>
          <tr>
            <th></th>
            <th>OS</th>
            <th>Veículo</th>
            <th>Número</th>
            <th>Criado em</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          ${tbody}
        </tbody>
      </table>`
      document.getElementById('table_os').innerHTML = table
    }

    if(integrator.length > 0){
      let tbody = ''
      integrator.forEach((item, index)=>{
        tbody += `<span style="font-size: 14px">${index+1}&nbsp&nbsp <strong style="color:black">${item.num_os}</strong> &nbsp&nbsp <strong style="color:red">${item.status}</strong></span><br/>`
      })
      document.getElementById('table_integrator').innerHTML = tbody
    }

    let table1 = new DataTable('#tabela1');
    let table2 = new DataTable('#tabela2');
    let table3 = new DataTable('#tabela3');
  }
}

function logoff(){
  localStorage.clear()
  msg("Fazendo Logoff...")
  setTimeout(function () { location.replace(`${endpoint}index`); }, 2000)
}

function inserir_veiculo(){
  let obj_insert = {
    modelo: document.getElementById("modelo").value,
    placa: document.getElementById("placa").value,
    motorista: document.getElementById("motorista").value,
    numero: document.getElementById("numero").value,
    km_atual: document.getElementById("km_atual").value,
    km_revisao: document.getElementById('km_revisao').value,
    ativo: document.getElementById('ativo').value,
    obs: document.getElementById('obs').value,
    cod_os: "",
  }
  if (obj_insert.modelo === '' || obj_insert.placa === '' || obj_insert.numero === '') {
    Swal.fire({ icon: 'info', title: 'Oops...', text: 'Preencha os campos principais: Modelo, placa e número' });
  } else {
    axios.post(`${endpoint}veiculo`, obj_insert, header).then(function (response) {
      if (response.data.erroGeral === 'sim') {
        Swal.fire({ icon: 'error', title: 'Oops...', text: response.data.msg })
      } else {
        loading(true, 'center', false, 2000, 'info', 'Veículo inserido com Sucesso!')
        setTimeout(function () { location.replace(`${endpoint}main`); }, 2000)
      }
    }).catch(function (error) { 
      console.log(error)
      Swal.fire({ icon: 'error', title: 'Oops...', text: error })
    })
  }
}

function inserir_revisao(){
  let obj_insert = {
    id_veiculo: document.getElementById("rev_veiculo").value,
    valor: document.getElementById("rev_valor").value,
    km_revisa_feita: document.getElementById("rev_km_revisao").value,
    obs: document.getElementById("rev_obs").value
  }

  if (obj_insert.id_veiculo === '' || obj_insert.valor === '' || obj_insert.km_revisa_feita === '') {
    Swal.fire({ icon: 'info', title: 'Oops...', text: 'Preencha os campos principais: Veículo, Valor e KM Revisão' });
  } else {
    axios.post(`${endpoint}revisao`, obj_insert, header).then(function (response) {
      if (response.data.erroGeral === 'sim') {
        Swal.fire({ icon: 'error', title: 'Oops...', text: response.data.msg })
      } else {
        loading(true, 'center', false, 2000, 'info', 'Revisão inserida com Sucesso!')
        setTimeout(function () { location.replace(`${endpoint}main`); }, 2000)
      }
    }).catch(function (error) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: error })
      console.log(error)
    })
  }
}

iniciar()