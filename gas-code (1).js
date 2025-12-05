// ===== TELEMIM - Google Apps Script Backend =====
// Este código deve ser colado no Google Apps Script da sua planilha

const SS = SpreadsheetApp.getActiveSpreadsheet();

// ===== FUNÇÃO PRINCIPAL =====
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const acao = dados.action;
    const tabela = dados.table;
    
    switch(acao) {
      case 'CREATE':
        return criar(tabela, dados.data);
      case 'READ':
        return ler(tabela);
      case 'UPDATE':
        return atualizar(tabela, dados.id, dados.data);
      case 'DELETE':
        return deletar(tabela, dados.id);
      case 'LOGIN':
        return login(dados.email, dados.password);
      default:
        return resposta(false, 'Ação inválida');
    }
  } catch(erro) {
    return resposta(false, 'Erro: ' + erro.message);
  }
}

// ===== CRIAR REGISTRO =====
function criar(tabela, dados) {
  const sheet = SS.getSheetByName(tabela);
  if (!sheet) return resposta(false, 'Tabela não encontrada: ' + tabela);
  
  const id = new Date().getTime();
  const valores = [id];
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Preenche valores conforme headers
  for (let i = 1; i < headers.length; i++) {
    valores.push(dados[headers[i]] || '');
  }
  
  sheet.appendRow(valores);
  return resposta(true, 'Registro criado com sucesso', { id: id });
}

// ===== LER REGISTROS =====
function ler(tabela) {
  const sheet = SS.getSheetByName(tabela);
  if (!sheet) return resposta(false, 'Tabela não encontrada: ' + tabela);
  
  const dados = sheet.getDataRange().getValues();
  const headers = dados[0];
  const resultado = [];
  
  // Converte array em objetos
  for (let i = 1; i < dados.length; i++) {
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = dados[i][j];
    }
    resultado.push(obj);
  }
  
  return resposta(true, 'Dados obtidos com sucesso', resultado);
}

// ===== ATUALIZAR REGISTRO =====
function atualizar(tabela, id, dados) {
  const sheet = SS.getSheetByName(tabela);
  if (!sheet) return resposta(false, 'Tabela não encontrada: ' + tabela);
  
  const range = sheet.getDataRange();
  const values = range.getValues();
  const headers = values[0];
  
  // Procura pelo ID
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      // Atualiza apenas campos fornecidos
      for (let j = 1; j < headers.length; j++) {
        if (dados[headers[j]] !== undefined) {
          sheet.getRange(i + 1, j + 1).setValue(dados[headers[j]]);
        }
      }
      return resposta(true, 'Registro atualizado com sucesso');
    }
  }
  
  return resposta(false, 'Registro não encontrado com ID: ' + id);
}

// ===== DELETAR REGISTRO =====
function deletar(tabela, id) {
  const sheet = SS.getSheetByName(tabela);
  if (!sheet) return resposta(false, 'Tabela não encontrada: ' + tabela);
  
  const dados = sheet.getDataRange().getValues();
  
  // Procura e deleta linha com o ID
  for (let i = 1; i < dados.length; i++) {
    if (String(dados[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return resposta(true, 'Registro deletado com sucesso');
    }
  }
  
  return resposta(false, 'Registro não encontrado com ID: ' + id);
}

// ===== LOGIN/AUTENTICAÇÃO =====
function login(email, password) {
  const sheet = SS.getSheetByName('Funcionarios');
  if (!sheet) return resposta(false, 'Tabela Funcionarios não encontrada');
  
  const dados = sheet.getDataRange().getValues();
  const headers = dados[0];
  
  // Procura usuário com email e senha correspondentes
  for (let i = 1; i < dados.length; i++) {
    const emailCol = headers.indexOf('email');
    const passCol = headers.indexOf('password');
    
    if (dados[i][emailCol] === email && dados[i][passCol] === password) {
      const usuario = {};
      for (let j = 0; j < headers.length; j++) {
        usuario[headers[j]] = dados[i][j];
      }
      return resposta(true, 'Login bem-sucedido', usuario);
    }
  }
  
  return resposta(false, 'Email ou senha incorretos');
}

// ===== FORMATO DE RESPOSTA =====
function resposta(sucesso, mensagem, dados = null) {
  const resultado = {
    success: sucesso,
    message: mensagem,
    data: dados,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(resultado))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== FUNÇÃO DE TESTE =====
function testarLeitura() {
  const resultado = ler('Funcionarios');
  Logger.log(resultado.getContent());
}

// ===== INICIALIZAR PLANILHA =====
function inicializarPlanilha() {
  const abas = ['Moradores', 'Funcionarios', 'OS', 'Bases'];
  
  abas.forEach(nome => {
    let sheet = SS.getSheetByName(nome);
    if (!sheet) {
      sheet = SS.insertSheet(nome);
      Logger.log('Aba criada: ' + nome);
    }
  });
  
  Logger.log('Planilha inicializada com sucesso!');
}