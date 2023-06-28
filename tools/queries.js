module.exports = query = {
  os_por_veiculo: `SELECT 
                    os.id as id,
                    os.ordem_servico AS OS,
                    veiculos.modelo AS carro,
                    veiculos.numero AS num,
                    DATE_FORMAT(DATE_SUB(os.createdAt, INTERVAL 3 HOUR), '%H:%i %d/%m/%Y') AS hora
                  FROM os
                  INNER JOIN veiculos
                  ON os.id_veiculo = veiculos.id
                  ORDER BY os.createdAt DESC;`,
  ordens_servicos: `SELECT os.ordem_servico FROM os;`,
  ordens_servicos_integrator: `SELECT 
                                os.numero_os as num_os
                                ,so.descri_st as status
                              FROM ordem_servico os
                                JOIN status_os so ON so.status_os=os.status_os
                              WHERE TRUE 
                                AND os.status_os != 'F' 
                                AND os.codtords = 'E9N80Z92EK';`
}