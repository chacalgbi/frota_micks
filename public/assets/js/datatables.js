
//RENDERIZA DATATABLES NO FRONTEND
function dataTables(id){

    $(document).ready(function() {
        $(`#${id}`).DataTable( {
            pageLength: 100,
            language: {
                //url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/pt_br.json",
                "sEmptyTable": "Nenhum registro encontrado",
                "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
                "sInfoFiltered": "(Filtrados de _MAX_ registros)",
                "sInfoPostFix": "",
                "sInfoThousands": ".",
                "sLengthMenu": "Mostrando _MENU_ resultados por página",
                "sLoadingRecords": "Carregando...",
                "sProcessing": "Processando...",
                "sZeroRecords": "Nenhum registro encontrado",
                "sSearch": "Pesquisar",
                "oPaginate": {
                    "sNext": "Próximo",
                    "sPrevious": "Anterior",
                    "sFirst": "Primeiro",
                    "sLast": "Último"
                },
                   "oAria": {
                    "sSortAscending": ": Ordenar colunas de forma ascendente",
                    "sSortDescending": ": Ordenar colunas de forma descendente"
                },
                "select": {
                    "rows": {
                        "_": "Selecionado %d linhas",
                        "0": "Nenhuma linha selecionada",
                        "1": "Selecionado 1 linha"
                    }
                },
                "buttons": {
                    "copy": "Copiar",
                    "copyTitle": "Cópia bem sucedida",
                    "copySuccess": {
                        "1": "Uma linha copiada com sucesso",
                        "_": "%d linhas copiadas com sucesso"
                    }
                },
                searchBuilder: {
                    add: "Adicionar Condição",
                    button: {
                        "0": "Filtrar ",
                        "_": "Filtrar  (%d)"
                    },
                    clearAll: "Limpar Tudo",
                    condition: "Condição",
                    conditions: {
                        date: {
                            "after": "Depois",
                            "before": "Antes",
                            "between": "Entre",
                            "empty": "Vazio",
                            "equals": "Igual",
                            "not": "Não",
                            "notBetween": "Não Entre",
                            "notEmpty": "Não Vazio"
                        },
                        number: {
                            "between": "Entre",
                            "empty": "Vazio",
                            "equals": "Igual",
                            "gt": "Maior Que",
                            "gte": "Maior ou Igual a",
                            "lt": "Menor Que",
                            "lte": "Menor ou Igual a",
                            "not": "Não",
                            "notBetween": "Não Entre",
                            "notEmpty": "Não Vazio"
                        },
                        string: {
                            "contains": "Contém",
                            "empty": "Vazio",
                            "endsWith": "Termina Com",
                            "equals": "Igual",
                            "not": "Não",
                            "notEmpty": "Não Vazio",
                            "startsWith": "Começa Com"
                        },
                        array: {
                            "contains": "Contém",
                            "empty": "Vazio",
                            "equals": "Igual à",
                            "not": "Não",
                            "notEmpty": "Não vazio",
                            "without": "Não possui"
                        }
                    },
                    data: "Dados",
                    deleteTitle: "Excluir regra de filtragem",
                    logicAnd: "E",
                    logicOr: "Ou",
                    title: {
                        "0": "Filtrar ",
                        "_": "Filtrar  (%d)"
                    },
                    value: "Valor",
                    leftTitle: "Critérios Externos",
                    rightTitle: "Critérios Internos"
                },
            },
            buttons:[
                'searchBuilder'
            ],
            dom: 'Bfrtip',
            responsive: {
                details: {
                type: 'column'
                }
            },
            columnDefs: [{
                className: 'control',
                orderable: false,
                targets: 0
            }],
            order: [1, 'asc']
        });
    });

}