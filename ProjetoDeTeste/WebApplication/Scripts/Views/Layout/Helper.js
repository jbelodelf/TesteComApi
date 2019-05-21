var minDateGlobal = '-30d';
var message = {};
var rows_selected = [];
var rows_selected_edit = [];

function testetable_1() {
    var list = [];

    $.each(rows_selected, function (index, rowId) {

        var obj = {
            id: rowId
        }

        list.push(obj);
    });
}

var helper = {
    BuscarCEP: function (cep) {
        $("#UF").prop('disabled', false);
        $("#Municipios").prop('disabled', false);

        if (cep === "" || cep === undefined) {
            cep = $("#CEP").val();
        }

        var url = "/Endereco/ObterEndereco";

        if (cep != "" && cep != undefined) {
            $.ajax({
                url: url
                , datatype: "json"
                , type: "GET"
                , data: { cep: cep }
                , cache: false
                , beforeSend: function (data) {
                    waitingDialog.show();
                }
                , complete: function () {
                    waitingDialog.hide();
                    $("#Numero").focus();
                }
            }).done(function (data) {
                if (data != "") {
                    var obj = jQuery.parseJSON(data);

                    // Verifica se encontrou o ENDEREÇO informado
                    if (obj.XMLRETORNO.MENSAGEM_RETORNO != "Endereço não localizado." || obj.XMLRETORNO.CODIGO_RETORNO != "4") {
                        var endereco = obj.XMLRETORNO["LOGRADOURO.TIPO"] + " " + obj.XMLRETORNO["LOGRADOURO.NOME"];

                        $("#Logradouro").val(endereco);
                        Unhighlight($("#Logradouro"));
                        $("#Bairro").val(obj.XMLRETORNO["LOGRADOURO.BAIRRO.NOME"]);

                        var nomeEstado = obj.XMLRETORNO["LOGRADOURO.MUNICIPIO.UF.NOME"].toUpperCase();
                        var codEstado = $("#UF option").filter(function () { return $(this).html() == nomeEstado }).val();

                        document.getElementById('UF').value = codEstado;

                        $("#UF").select2({
                            theme: "bootstrap",
                            language: "pt-BR"
                        });

                        $("#Municipios").select2({
                            theme: "bootstrap",
                            language: "pt-BR"
                        });

                        var sigla = obj.XMLRETORNO["LOGRADOURO.MUNICIPIO.UF.SIGLA"];
                        var codigoCidade = obj.XMLRETORNO["LOGRADOURO.MUNICIPIO.DNE"];

                        var url = "/Localidade/CarregarListaMunicipios?idUF=" + codEstado + "&id=" + codigoCidade;
                        CarregarCombo(url, "Municipios");

                        var element = ("#UF");
                        var id_attr = "#" + $(element).attr("id") + "1";
                        $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
                        $(id_attr).removeClass('glyphicon-remove');
                        $(element).closest('.form-group').find("[role=combobox]").css("border", "1px solid #ccc");

                        $("#Numero").focus();
                        $("#UF").prop('disabled', true);
                        $("#Municipios").prop('disabled', true);
                    } else {
                        $("#Logradouro").val("");
                        $("#Numero").val("");
                        $("#Complemento").val("");
                        $("#Bairro").val("");
                        $("#UF")[0].selectedIndex = 0;
                        $("#Municipios")[0].selectedIndex = 0;
                        $("#UF").prop('disabled', false);
                        $("#Municipios").prop('disabled', false);
                    }
                }
            }).fail(function (jqXHR, exception) {
                TratamentoDeErro(jqXHR, exception);
            });
        }
    }

    , ListarMunicipios: function (sigla, cidade) {
        var url = "/Municipio/ListarMunicipios";
        var id = $("#Municipios").val();
        $("#Municipios").empty();

        $.ajax({
            url: url
            , datatype: "json"
            , type: "GET"
            , cache: false
            , async: false
            , data: { sigla: sigla, id: id }
            , beforeSend: function (data) {
                waitingDialog.show();
            }
            , complete: function () {
                waitingDialog.hide();
            }
            , success: function (data) {
                if (data.Resultado.length > 0) {
                    var dadosGrid = data.Resultado;

                    $("#Municipios").append('<option value="">-- SELECIONE --</option>');

                    $.each(dadosGrid, function (indice, item) {
                        var opt = "";
                        if (item["Value"] === id) {
                            opt = '<option selected="selected">' + item["Text"] + '</option>';
                        } else {
                            opt = "<option value='" + item["Value"] + "'>" + item["Text"] + "</option>";
                        }

                        $("#Municipios").append(opt);
                    });

                    if (cidade != "" && cidade != undefined) {
                        $("#Municipios option").filter(function () {
                            //may want to use $.trim in here
                            return $(this).text() == cidade;
                        }).prop('selected', true);
                    }
                }
                $('#Municipios').select2();
                Unhighlight($("#Municipios"));
            }
            , error: function (jqXHR, exception) {
                TratamentoDeErro(jqXHR, exception)
            }
        });
    }

    , AutoComplete: function (url, component) {
        $.ajax({
            url: url
            , datatype: "json"
            , type: "GET"
        }).done(function (data) {
            $("#" + component).devbridgeAutocomplete({
                lookup: data
                , onSelect: function (suggestion) {
                    $("#error-perfil").remove();
                    $("#IdRetorno").val(suggestion.data);
                }
            });
        });
    }

    , RetornaDados: function (nome, controller) {
        var url = "/" + controller + "/RetornaDados";

        $.ajax({
            url: url
            , datatype: "json"
            , type: "GET"
            , data: { nome: nome }
        }).done(function (data) {
            if (data.Resultado > 0) {
                $("#IdRetorno").val(data.Resultado);
            }
        }).fail(function (jqXHR, exception) {
            TratamentoDeErro(jqXHR, exception);
        });
    }

    , VerificaSessaoBusca: function (component) {
        var busca = $.session.get('Busca');

        if (busca != undefined) {
            $("#" + component).val(busca);
        }
    }

    , SetSessionBusca: function (filtro) {
        $.session.set('Busca', filtro);
    }

    , RetornaAtivoListar: function () {
        if ($("#ativolistar").is(':checked')) {
            return true;
        } else if ($("#inativolistar").is(':checked')) {
            return false;
        } else if ($("#todoslistar").is(':checked')) {
            return null;
        }
    }

    , initFormExtendedDatetimepickers: function () {
        $.datetimepicker.setLocale('pt-BR');
        $('.datetimepicker.date').datetimepicker({
            timepicker: false,
            format: 'd/m/Y',
            formatDate: '99/99/99',
            mask: '99/99/99'
        });

        $('.datetimepicker timer').datetimepicker({
            datepicker: false,
            format: 'H:i',
            step: 5,
            mask: true
        });
    },
    // FUNÇÃO BOTÃO "MINHA CONTA => ALTERAR MEU PERFIL"
    ModalAlterarPerfil: function () {

        var url = "/Usuario/AlterarPerfil";

        $.ajax({
            url: url
            , datatype: "html"
            , type: "POST"
            , cache: false
            , beforeSend: function () {
                waitingDialog.show();
            }
            , complete: function () {
                waitingDialog.hide();
            }
        }).done(function (data) {

            AbrirModal("Meu Perfil", data);

        }).fail(function (jqXHR, exception) {
            TratamentoDeErro(jqXHR, exception)
        });

    }

}

function CheckBio() {
    var method = 'GET';
    $.ajax({
        url: 'http://localhost:9123/api/ProBiometria',
        type: method,
        success: function (data) {

            return data;
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

var Imagem = {
    base64ToBlob: function (base64, mime) {
        mime = mime || '';
        var sliceSize = 1024;
        var byteChars = base64;
        var byteArrays = [];

        for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
            var slice = byteChars.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: mime });
    }
}

function TratamendodeErro(jqXHR, exception) {
    var msg = '';
    var tipo = 'erro';

    if (jqXHR.status === 0) {
        msg = 'Sem Conexão.\n Verifique rede.';
    } else if (jqXHR.status == 500) {
        msg = 'Erro desconhecido,\n verifique os dados e tente novamente.';
    } else if (exception === 'timeout') {
        msg = 'Time out error.';
    } else if (exception === 'abort') {
        msg = 'Operação cancelada, verifique os dados e tente novamente.';
    } else {
        msg = 'Erro desconhecido.\n verifique os dados e tente novamente.' + jqXHR.responseText;
    }

    Message(msg, tipo);
}

function Message(message, tipo, time, funcionalidade) {
    if (tipo == "" || tipo == undefined) {
        tipo = "erro";
    }

    if (funcionalidade == "LoginAluno") {
        var div = $("#messageAluno");
    }
    else {
        var div = $("#message");
    }

    if (($("#myModalContent").data('bs.modal') || {}).isShown) {
        div = $("#messageModal");
    }

    if ($("#mySidenav").css("width") == "400px") {
        div = $("#messageNav");
    }

    if (($("#myModal").data('bs.modal') || {}).isShown) {
        div = $("#messageModalDelete");
    }

    div.html("");
    div.removeClass();

    switch (tipo.toLowerCase()) {
        case "sucesso":
            div.addClass("alert alert-success");
            break;
        case "info":
            div.addClass("alert alert-info");
            break;
        case "erro":
            div.addClass("alert alert-danger");
            break;
        case "aviso":
            div.addClass("alert alert-warning");
            break;
    }

    if (time === undefined) time = 6000;

    if (time == 0) {
        div.html(message)
            .show();
    } else {
        div.html(message)
            .show()
            .fadeOut(time);
    }

    location.href = "#";
    location.href = "#message";
}

function Excluir(id, controller) {
    var url = "/" + controller + "/Excluir";

    $.ajax({
        url: url
        , datatype: 'json'
        , type: 'POST'
        , cache: false
        , async: false
        , data: { id: id }
        , beforeSend: function () {

        }
        , complete: function () {

        }
    }).done(function (data) {
        if (data.Resultado) {
            FecharModalExcluir('myModal');

            switch (controller) {
                case 'Usuario':
                    ListarUsuario();
                    break;
                case 'Matricula':
                    ListarMatricula();
                    break;
                case 'Pagina':
                    ListarPaginas();
                    break;
                case 'Perfil':
                    Perfil.Listar();
                    break;
                case 'Configuracao':
                    ListarConfiguracoes();
                    break;
                case 'Aula':
                    ListarAulas();
                    break;
                case 'statussituacaoaula':
                    ListarStatus();
                    break;
                case 'SimularErro':
                    ListarSimularErro();
                    break;
                case 'Menu':
                    ListarMenuEdicao();
                    RetornaMenuPrincipal();
                    break;
                case 'Aluno':
                    Aluno.Listar();
                    break;
                case 'Empresa':
                    ListarEmpresa();
                    break;
                case 'CategoriaVideo':
                    ListarCategorias();
                    break;
                case 'GerenciarVideos':
                    ListarVideos();
                    break;
                case 'Setor':
                    ListarSetores();
                    $("#IdSetor option[value='" + id + "']").remove();
                    break;
                case 'TipoDiario':
                    ListarTipoDiario();
                    $("#IdTipoDiario option[value='" + id + "']").remove();
                    break;
                case "Monitor":
                    monitor.Listar();
                    break;
                case "Instrutor":
                    Instrutor.Listar();
                    break;
                case "Curso":
                    Curso.Listar();
                    break;
                case "ModeloAula":
                    ModeloAula.ListarModeloAulas();
                    break;
                case "Turma":
                    Turma.Listar();
                    break;
                default:
                    break;
            }

            var message = "";

            if (data.Message == undefined) {
                message = "Registro excluído com sucesso.";
            } else {
                message = data.Message;
            }

            setTimeout(function () {
                Message(message, "aviso"), 1000
            });
        } else {
            if (data.Mensagem != "" && data.Mensagem != undefined) {
                Message(data.Mensagem, "erro");
            } else {
                Message("Erro", 'erro');
            }
        }
    }).fail(function (jqXHR, exception) {
        TratamentoDeErro(jqXHR, exception);
    });
}

function AbrirModalExcluir(id, controller, novotitulo, mensagem) {
    var titulo = controller;

    if (novotitulo != "" && novotitulo != undefined) {
        titulo = novotitulo;
    }

    if (novotitulo != "Inativar Registro") {
        $("#ModalTitle").html("Excluir " + titulo);
    } else {
        $("#ModalTitle").html(titulo);
    }

    $("#btnExcluir").attr("onclick", "Excluir(" + id + ",'" + controller + "')");

    if (mensagem == undefined) {
        $("#ModalContent").html("<h3>Deseja excluir este registro?</h3>");
    } else {
        $("#ModalContent").html("<h3>" + mensagem + "</h3>");
    }

    $('#myModal').appendTo("body").modal('show');
}

function AbrirModal(titulo, data) {
    $("#ModalTitleContent").html(titulo);
    $("#ModalBodyContent").html("");
    $("#ModalBodyContent").empty();
    $("#ModalBodyContent").html(data);
    $("#myModalContent").modal();

    $(".SomenteLetra").keyup(function () {
        var valor = $("#Nome").val().replace(/[^a-zA-Z ]+/g, '');
        $("#Nome").val(valor);
    });
}

function FecharModal() {
    $("#ModalTitleContent").html("");
    $("#ModalBodyContent").html("");
    $("#ModalBodyContent").empty();
    $("#ModalBodyContent").html("");
    $("#myModalContent").modal('hide');
}

function AbrirModalWide(titulo, data) {
    $("#modal-wide-title").html(titulo);
    $("#tallModal").modal();

    $(".modal-wide").on("show.bs.modal", function () {
        var height = $(window).height() - 200;
        $(this).find(".modal-body").css("max-height", height);
    });

    $("#ModalBodyFont").html(data);
}

function FecharModalExcluir(modal) {
    $("#" + modal).modal("hide");
}

var dataTableLanguage = {
    "sEmptyTable": "Nenhum registro encontrado",
    "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
    "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
    "sInfoFiltered": "(Filtrados de _MAX_ registros)",
    "sInfoPostFix": "",
    "sInfoThousands": ".",
    "sLengthMenu": "_MENU_ resultados por página",
    "sLoadingRecords": "Carregando...",
    "sProcessing": "Aguarde!",
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
    }
};

function AplicarDataTable(nomeTabela, column, order, length, imprimir, image, exportar, func) {
    if (length == "" || length == undefined) {
        length = 20;
    }

    var pages = [[20, 40, 60, -1], [20, 40, 60, "Todos"]]

    //para modal
    if (length != 20)
        pages = [[length], [length]]

    if (imprimir == undefined) imprimir = false;
    if (exportar) exportar = true;

    var extendedColumns = [];
    var cpfColumn = -1;

    if (order == "" || order == undefined) {
        order = 'asc';
    }

    if (column == "" || column == undefined) {
        column = 0;
    }

    $("#" + nomeTabela + " thead th").each(function (index) {
        if ($(this).text().toString().toUpperCase() == "CPF") {
            cpfColumn = index;
        }

        extendedColumns.push(index);
    });

    extendedColumns.pop();

    var buttons = [];

    var exporte = {
        extend: 'excelHtml5',
        text: '<img src="/Content/img/icons/exportar_cinza.png" class="botao-img" /> Exportar',
        className: 'btn botao-pagina',
        orientation: 'landscape'
        , exportOptions: {
            columns: extendedColumns
            , format: {
                body: function (data, columnIndex) {
                    return verificaImagemAtivo(data, columnIndex, cpfColumn);
                }
            }
        }
    };

    if (func !== undefined) {
        exporte.action = function () {
            func();
        }
    }

    if (exportar) {
        buttons.push(exporte);
    }

    if (imprimir) {
        buttons.push(RetornaButtons(image, extendedColumns, cpfColumn));
    }

    var table = $("#" + nomeTabela).DataTable({
        "language": dataTableLanguage
        , searching: false
        , order: [[column, order]]
        , pageLength: length

        , lengthMenu: [[20, 40, 60], [20, 40, 60]]
        , dom: '<"left col-lg-4" l><"middle col-lg-4"><"right col-lg-4" B>frtip'
        , buttons: buttons
    });

    //table.buttons().container().appendTo('#' + nomeTabela + '.col-sm-6:eq(0)');

    $(".btn-radius").css("border-top-right-radius", "5px");
    $(".btn-radius").css("border-bottom-right-radius", "5px");
    $(".btn-radius").css("border-top-left-radius", "5px");
    $(".btn-radius").css("border-bottom-left-radius", "5px");
    $(".btn-radius").css("margin-right", "5px !important");
}

function RetornaButtons(image, extendedColumns, cpfColumn, title) {
    if (title == undefined) {
        title = "";
    }

    if (image != undefined) {
        var print = {
            extend: 'print',
            text: '<img src="/Content/img/icons/imprimir_cinza.png" class="botao-img" /> Imprimir',
            className: 'btn botao-pagina',
            orientation: 'landscape',
            title: title,
            exportOptions: {
                columns: extendedColumns,
                format: {
                    body: function (data, columnIndex) {
                        return verificaImagemAtivo(data, columnIndex, cpfColumn);
                    }
                }
            }
            , customize: function (win) {
                $(win.document.body)
                    .css('font-size', '10pt')
                    .prepend(
                        '<img src="' + image + '" style="position:absolute; top:0; left:0;height:20px;" />'
                    );

                $(win.document.body).find('table')
                    .addClass('compact')
                    .css('font-size', 'inherit');
            }
        };

        return print;
    } else {
        var print = {
            extend: 'print',
            text: '<img src="/Content/img/icons/imprimir_cinza.png" class="botao-img" /> Imprimir',
            className: 'btn botao-pagina',
            orientation: 'landscape',
            title: title,
            exportOptions: {
                columns: extendedColumns,
                format: {
                    body: function (data, columnIndex) {
                        return verificaImagemAtivo(data, columnIndex, cpfColumn);
                    }
                }
            }
        };

        return print;
    }
}

function AplicarDataTableCustomizado(nomeTabela, column, order, length, imprimir, image, exportar, func) {
    AtualizarMensagens();

    if (length == "" || length == undefined) {
        length = 20;
    }

    if (imprimir == undefined) imprimir = false;
    if (exportar == undefined) exportar = true;

    var extendedColumns = [];
    var cpfColumn = -1;

    if (order == "" || order == undefined) {
        order = 'asc';
    }

    if (column == "" || column == undefined) {
        column = 0;
    }

    $("#" + nomeTabela + " thead th").each(function (index) {
        if ($(this).text().toString().toUpperCase() == "CPF") {
            cpfColumn = index;
        }

        extendedColumns.push(index);
    });

    extendedColumns.pop();

    var buttons = [];

    var exporte = {
        extend: 'excelHtml5',
        text: '<img src="/Content/img/icons/exportar_cinza.png" class="botao-img" /> Exportar',
        className: 'btn botao-pagina',
        orientation: 'landscape'
        , exportOptions: {
            columns: extendedColumns
            , format: {
                body: function (data, columnIndex) {
                    return verificaImagemAtivo(data, columnIndex, cpfColumn);
                }
            }
        }
    };

    if (func !== undefined) {
        exporte.action = function () {
            func();
        }
    }

    if (exportar) {
        buttons.push(exporte);
    }

    if (imprimir) {
        buttons.push(RetornaButtons(image, extendedColumns, cpfColumn));
    }

    var table = $("#" + nomeTabela).DataTable({
        "language": {
            "sEmptyTable": "Nenhum registro encontrado",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
            "sInfoFiltered": "(Filtrados de _MAX_ registros)",
            "sInfoPostFix": "",
            "sInfoThousands": ".",
            "sLengthMenu": "_MENU_ resultados por página",
            "sLoadingRecords": "Carregando...",
            "sProcessing": "Aguarde!",
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
            }
        },
        'columnDefs': [{
            'targets': 0,
            'searchable': false,
            'orderable': false,
        }],
        'rowCallback': function (row, data, dataIndex) {
            var rowId = data[0];
        }
        , searching: false
        , order: [[column, order]]
        , pageLength: length
        , lengthMenu: [[20, 40, 60, -1], [20, 40, 60, "Todos"]]
        , dom: 'Blfrtip'
        , buttons: buttons
    });

    table.buttons().container().appendTo('#' + nomeTabela + '.col-sm-6:eq(0)');

    $(".btn-radius").css("border-top-right-radius", "5px");
    $(".btn-radius").css("border-bottom-right-radius", "5px");
    $(".btn-radius").css("border-top-left-radius", "5px");
    $(".btn-radius").css("border-bottom-left-radius", "5px");
    $(".btn-radius").css("margin-right", "5px !important");

    $("#" + nomeTabela + " tbody").on("click", 'input[type=checkbox]', function (e) {
        var $row = $(this).closest("tr");
        var data = table.row($row).data();
        var rowId = data[0];
        var index = $.inArray(rowId, rows_selected);
        var idModeloAula = $(rowId).val();

        if (this.checked && index === -1) {
            rows_selected.push(rowId);

            var index = ModeloDeAulas.map(function (mod) { return mod.idModeloAula; }).indexOf(idModeloAula);
            if (index >= 0) {
                ModeloDeAulas[index]["value"] = true;
            };
        } else if (!this.checked && index !== -1) {
            rows_selected.splice(index, 1);

            var index = ModeloDeAulas.map(function (mod) { return mod.idModeloAula; }).indexOf(idModeloAula);
            if (index >= 0) {
                ModeloDeAulas[index]["value"] = false;
            };
        } else if (!this.checked && index == -1) {
            var index = ModeloDeAulas.map(function (mod) { return mod.idModeloAula; }).indexOf(idModeloAula);
            if (index >= 0) {
                ModeloDeAulas[index]["value"] = false;
            };
        }

        if (this.checked) {
            $row.addClass('selected');
        } else {
            $row.removeClass('selected');
        }

        updateDataTableSelectAllCtrl(table);
        e.stopPropagation();
    });

    // Handle click on table cells with checkboxes
    $("#" + nomeTabela).on('click', 'tbody td, thead th:first-child', function (e) {
        $(this).parent().find('input[type="checkbox"]').trigger('click');
    });

    // Handle click on "Select all" control
    $('thead input[name="select_all"]', table.table().container()).on('click', function (e) {
        if (this.checked) {
            $("#" + nomeTabela + ' tbody input[type="checkbox"]:not(:checked)').trigger('click');
        } else {
            $("#" + nomeTabela + ' tbody input[type="checkbox"]:checked').trigger('click');
        }

        // Prevent click event from propagating to parent
        e.stopPropagation();
    });

    // Handle table draw event
    table.on('draw', function () {
        //Update state of "Select all" control
        updateDataTableSelectAllCtrl(table);
    });
}

function updateDataTableSelectAllCtrl(table) {
    var $table = table.table().node();
    var $chkbox_all = $('tbody input[type="checkbox"]', $table);
    var $chkbox_checked = $('tbody input[type="checkbox"]:checked', $table);
    var chkbox_select_all = $('thead input[name="select_all"]', $table).get(0);

    // If none of the checkboxes are checked
    if ($chkbox_checked.length === 0) {
        chkbox_select_all.checked = false;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = false;
        }

        // If all of the checkboxes are checked
    } else if ($chkbox_checked.length === $chkbox_all.length) {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = false;
        }
        // If some of the checkboxes are checked
    } else {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = true;
        }
    }
}

function CarregaDadosModeloAula() {
    var list = [];

    $.each(rows_selected, function (i, index) {
        var compo = $(index);
        var a = { IdModeloAula: compo[0].id };
        list.push(a);
    })

    return list;
}

function verificaImagemAtivo(data, columnIndex, cpfColumn) {
    var returnData = "";

    switch (data) {
        case '<i class="fa fa-check"></i>':
            returnData = "SIM";
            break;
        case '<i class="fa fa-times"></i>':
            returnData = "NÃO";
            break;
        case '<i class="fa fa-car"></i>':
            returnData = "ProSTraining";
            break;
        case '<i class="fa fa-truck"></i>':
            returnData = "ProSTruck";
            break;
        case '<i class="fa fa-motorcycle"></i>':
            returnData = "ProSMoto";
            break;
        case '0':
            returnData = 0;
            break;
        default:
            returnData = data;
            break;
    }

    if (data.substring(0, 2) == "<a") {
        var a = $(data);
        return a.attr("href") == "#" ? a.text() : a.attr("href");
    }

    if (columnIndex == cpfColumn) {
        returnData = mascaraCpf(returnData);
    }

    return returnData;
}

function mascaraCpf(valor) {
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
}

function mascaraCnpj(valor) {
    return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
}

function DefinirEstadoConsulta(funcao) {
    $("#myModalEstados").modal({ show: true });
}

function soNum(obj) {
    var tecla = (window.event) ? event.keyCode : obj.which;
    if ((tecla > 47 && tecla < 58)) {
        return true;
    } else {
        if (tecla != 8) {
            return false;
        } else {
            return true;
        }
    }
}

function soHora(obj) {
    var tecla = (window.event) ? event.keyCode : obj.which;
    if ((tecla > 47 && tecla <= 58)) {
        return true;
    } else {
        if (tecla != 8) {
            return false;
        } else {
            return true;
        }
    }
}

function ValidaCpfExistente(cpf) {
    var termo = $("#" + cpf).val();

    var url = "/Matricula/ValidaCpfExistente";
    var data = { cpf: termo };

    $.ajax({
        url: url
        , type: "POST"
        , datatype: "json"
        , data: data
        , success: function (data) {
            if (data.Resultado) {
                $("#FormCpf").append("<i id='ok' class='glyphicon glyphicon-edit'></i>");
            } else {
                $("#ok").remove();
                $("#" + cpf).val("");
            }
        }
        , beforeSend: function () {

        }
        , complete: function () {

        }
        , error: function (jqXHR, exception) {
            var msg = '';
            var tipo = '';
            if (jqXHR.status === 0) {
                msg = 'Sem Conexão.\n Verifique rede.';
            } else if (jqXHR.status == 404) {
                msg = 'Página não encontrada. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Erro desconhecido.\n' + jqXHR.responseText;
            }
            Message(msg, 'erro', 'messageModal');
        }
    });
}

function ValidaCpf(value, element) {
    value = jQuery.trim(value);
    value = value.replace('.', '');
    value = value.replace('.', '');
    cpf = value.replace('-', '');
    while (cpf.length < 11) cpf = "0" + cpf;
    var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
    var a = [];
    var b = new Number;
    var c = 11;
    for (i = 0; i < 11; i++) {
        a[i] = cpf.charAt(i);
        if (i < 9) b += (a[i] * --c);
    }
    if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11 - x }
    b = 0;
    c = 11;
    for (y = 0; y < 10; y++) b += (a[y] * c--);
    if ((x = b % 11) < 2) { a[10] = 0; } else { a[10] = 11 - x; }

    var retorno = true;
    if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) retorno = false;

    return retorno;
}

function ValidarElementoCustomizadoSimples(element, error, valid) {
    if (valid) {
        $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
    } else {
        var span = $("<span>");
        span.addClass("help-error");
        span.html(error);

        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    }
}

function ValidarElementoCustomizado(element, error, valid, classe) {

    try {

        if (classe === undefined)
            classe = ".form-group";

        $(element).closest(classe).removeClass('has-success').removeClass('has-error');

        var span = $(element + "~span.help-error");

        if (span != null && span != undefined)
            $(span).remove();

        if (!valid) {
            var span = $("<span>");
            span.addClass("help-error");
            span.html(error);

            span.insertAfter(element);

            $(element).closest(classe).removeClass('has-success').addClass('has-error');
        }

    } catch (e) {

    }
}

function RetornaCPFSemPontos(cpf) {
    if (cpf != "" && cpf != undefined) {
        cpf = cpf.replace(/[.-]/g, '');
        cpf = cpf.replace(/[_]/g, '');
        return cpf;
    } else {
        return "";
    }
}

function RetornaCNPJSemPontos(cnpj) {
    if (cnpj != "" && cnpj != undefined) {
        cnpj = cnpj.replace(".", "")
            .replace(".", "")
            .replace("/", "")
            .replace("-", "");
    }
    return cnpj;
}

function RetornaDataNowToString(separator) {
    if (separator === undefined) {
        separator = "/";
    }

    var d = new Date();

    var ano = d.getFullYear();
    var mes = (d.getMonth() + 1);
    var dia = d.getDate();

    return ano.toString() + separator + mes.toString() + separator + dia.toString();
}

function RetornaDataToString(date, separator) {
    if (separator === undefined) {
        separator = "/";
    }

    var d = RetornaNewDateSimples(date);

    var ano = d.getFullYear();
    var mes = (d.getMonth() + 1);
    var dia = d.getDate();

    if (mes < 10) {
        month = "0" + mes;
    }

    if (dia < 10) {
        dia = "0" + dia;
    }

    return ano.toString() + separator + mes.toString() + separator + dia.toString();
}

function RetornaDataNowBRToString() {

    var d = new Date();

    var ano = d.getFullYear();
    var mes = (d.getMonth() + 1);
    var dia = d.getDate();
    var month = mes.toString();

    if (mes < 10) {
        month = "0" + mes;
    }

    if (dia < 10) {
        dia = "0" + dia;
    }

    return dia.toString() + "/" + month.toString() + "/" + ano.toString();
}

function RetornaDataUSToString(value) {
    var d = RetornaNewDateSimples(value);

    var ano = d.getFullYear();
    var mes = (d.getMonth() + 1);
    var dia = d.getDate();

    return ano.toString() + "-" + ("0" + mes.toString()).slice(-2) + "-" + ("0" + dia.toString()).slice(-2);
}

function DateDiffNow(value) {
    var days = 0;
    var newValue = value.split('-');
    var novadata = newValue[0] + "/" + newValue[1] + "/" + newValue[2];
    var anohora = newValue[2].split(" ");


    var time = anohora[1].split(":");

    var dia = parseInt(newValue[0]);
    var mes = parseInt(newValue[1]);
    var ano = parseInt(anohora[0]);
    var hour = parseInt(time[0]);
    var minute = parseInt(time[1]);

    try {
        var end = new Date(ano, (mes - 1), dia, hour, minute);
        var start = new Date();
        var diff = new Date(end - start);
        days = diff / 1000 / 60 / 60 / 24;
    } catch (e) {

    }
    return days;
}

function DateDiff(dtInicio, dtFim, separator) {

    if (separator === undefined) {
        separator = "/";
    }

    var days = 0;
    var newValue = dtInicio.split('-');
    var novadata = newValue[0] + separator + newValue[1] + separator + newValue[2];
    var anohora = newValue[2].split(" ");
    var time = anohora[1].split(":");

    var dia = parseInt(newValue[0]);
    var mes = parseInt(newValue[1]);
    var ano = parseInt(anohora[0]);
    var hour = parseInt(time[0]);
    var minute = parseInt(time[1]);

    try {
        var end = new Date(ano, (mes - 1), dia, hour, minute);
        var start = dtFim;
        var diff = new Date(end - start);
        days = diff / 1000 / 60 / 60 / 24;
    } catch (e) {

    }
    return days;
}

function ShortDateDiff(dtInicio, dtFim, separator) {

    if (separator === undefined) {
        separator = "/";
    }

    var days = 0;
    var newDtInicio = dtInicio.split('-');
    var novadata = newDtInicio[0] + separator + newDtInicio[1] + separator + newDtInicio[2];
    var anohora = newDtInicio[2].split(" ");

    var diaIni = parseInt(newDtInicio[0]);
    var mesIni = parseInt(newDtInicio[1]);
    var anoIni = parseInt(anohora[0]);

    var newdtFim = dtFim.split('-');
    var novadata = newdtFim[0] + separator + newdtFim[1] + separator + newdtFim[2];
    var anohora = newdtFim[2].split(" ");

    var diaFim = parseInt(newdtFim[0]);
    var mesFim = parseInt(newdtFim[1]);
    var anoFim = parseInt(anohora[0]);

    var hour = parseInt("00");
    var minute = parseInt("00");

    try {
        var end = new Date(anoFim, (mesFim - 1), diaFim, hour, minute);
        var start = new Date(anoIni, (mesIni - 1), diaIni, hour, minute);

        var diff = new Date(end - start);
        days = diff / 1000 / 60 / 60 / 24;
    } catch (e) {

    }
    return days;
}

//*** This code is copyright 2002-2003 by Gavin Kistner, !@phrogz.net
//*** It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt

/*

token:     description:             example:
#YYYY#     4-digit year             1999
#YY#       2-digit year             99
#MMMM#     full month name          February
#MMM#      3-letter month name      Feb
#MM#       2-digit month number     02
#M#        month number             2
#DDDD#     full weekday name        Wednesday
#DDD#      3-letter weekday name    Wed
#DD#       2-digit day number       09
#D#        day number               9
#th#       day ordinal suffix       nd
#hhhh#     2-digit 24-based hour    17
#hhh#      military/24-based hour   17
#hh#       2-digit hour             05
#h#        hour                     5
#mm#       2-digit minute           07
#m#        minute                   7
#ss#       2-digit second           09
#s#        second                   9
#ampm#     "am" or "pm"             pm
#AMPM#     "AM" or "PM"             PM

var now = new Date;
console.log( now.customFormat( "#DD#/#MM#/#YYYY# #hh#:#mm#:#ss#" ) );

*/

Date.prototype.customFormat = function (formatString) {
    var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhhh, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th;
    YY = ((YYYY = this.getFullYear()) + "").slice(-2);
    MM = (M = this.getMonth() + 1) < 10 ? ('0' + M) : M;
    MMM = (MMMM = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][M - 1]).substring(0, 3);
    DD = (D = this.getDate()) < 10 ? ('0' + D) : D;
    DDD = (DDDD = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][this.getDay()]).substring(0, 3);
    th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
    formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);
    h = (hhh = this.getHours());
    if (h == 0) h = 24;
    if (h > 12) h -= 12;
    hh = h < 10 ? ('0' + h) : h;
    hhhh = h < 10 ? ('0' + hhh) : hhh;
    AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
    mm = (m = this.getMinutes()) < 10 ? ('0' + m) : m;
    ss = (s = this.getSeconds()) < 10 ? ('0' + s) : s;
    return formatString.replace("#hhhh#", hhhh).replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM);
};

// Página de ICONES
function CheatSheet() {
    var url = "/Home/CheatSheet";
    $.ajax({
        url: url
        , datatype: "html"
        , type: "GET"
        , success: function (data) {
            $("#tallModal").modal();
            $(".modal-wide").on("show.bs.modal", function () {
                var height = $(window).height() - 200;
                $(this).find(".modal-body").css("max-height", height);
            });
            $("#ModalBodyFont").html(data);
        }
    })
}

function isDate(date) {
    var currVal = date;

    if (currVal == '')
        return false;

    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null)
        return false;

    dtMonth = dtArray[3];
    dtDay = dtArray[1];
    dtYear = dtArray[5];

    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay > 31)
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            return false;
    }
    return true;
}

function RetornaDataBR(date) {

    var currVal = date;

    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null)
        return false;

    dtMonth = dtArray[3];
    dtDay = dtArray[1];
    dtYear = dtArray[5];

    return new Date(dtYear, (dtMonth) - 1, dtDay);
}

function RetornaNewDate(value) {
    var first = value.split('/');

    var day = first[0];
    var month = first[1];
    var second = first[2].split(' ');
    var year = second[0];
    var horas = second[1].split(':');
    var hour = horas[0];
    var minute = horas[1];
    var second = horas[2];

    return new Date(year, month, day, hour, minute, second);
}

function RetornaNewDateSimples(value) {
    var dmy = value.split('/');

    return new Date(parseInt(dmy[2], 10), parseInt(dmy[1], 10) - 1, parseInt(dmy[0], 10));
}

function TratamentoDeErro(jqXHR, exception) {
    var msg = '';

    var tipo = 'erro';

    if (jqXHR.status === 0) {
        msg = 'Sem Conexão.\n Verifique rede.';
    } else if (jqXHR.status == 500) {
        msg = 'Erro desconhecido,\n verifique os dados e tente novamante.';
    } else if (exception === 'timeout') {
        msg = 'Time out error.';
    } else if (exception === 'abort') {
        msg = 'Operação cancelada, verifique os dados e tente novamente.';
    } else {
        msg = 'Erro desconhecido.\n verifique os dados e tente novamente.' + jqXHR.responseText;
    }

    Message(msg, tipo);

    waitingDialog.hide();
}

function validarCPF(cpf) {
    var filtro = /^\d{3}.\d{3}.\d{3}-\d{2}$/i;

    if (!filtro.test(cpf)) {
        return false;
    }

    cpf = RetornaCPFSemPontos(cpf);

    if (cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" ||
        cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" ||
        cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" ||
        cpf == "88888888888" || cpf == "99999999999") {
        return false;
    }

    soma = 0;
    for (i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    resto = 11 - (soma % 11);
    if (resto == 10 || resto == 11) {
        resto = 0;
    }
    if (resto != parseInt(cpf.charAt(9))) {
        return false;
    }

    soma = 0;
    for (i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto == 10 || resto == 11) {
        resto = 0;
    }

    if (resto != parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
}

function ValidarCNPJ(ObjCnpj) {
    if (ObjCnpj == "" || ObjCnpj == undefined) {
        return true;
    }

    var result = true;

    var cnpj = ObjCnpj;
    var valida = new Array(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2);
    var dig1 = new Number;
    var dig2 = new Number;

    exp = /\.|\-|\//g
    cnpj = cnpj.toString().replace(exp, "");
    var digito = new Number(eval(cnpj.charAt(12) + cnpj.charAt(13)));

    for (i = 0; i < valida.length; i++) {
        dig1 += (i > 0 ? (cnpj.charAt(i - 1) * valida[i]) : 0);
        dig2 += cnpj.charAt(i) * valida[i];
    }
    dig1 = (((dig1 % 11) < 2) ? 0 : (11 - (dig1 % 11)));
    dig2 = (((dig2 % 11) < 2) ? 0 : (11 - (dig2 % 11)));

    if (((dig1 * 10) + dig2) != digito)
        result = false;

    return result;
}

function AplicarDatePicker() {
    $(".datepicker").datepicker({
        dateFormat: 'dd/mm/yy',
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        constrainInput: true,
        buttonImageOnly: true,
    });
}

function RetornaMenuPrincipal() {
    var url = "/Menu/ListarMenu";

    $.ajax({
        url: url
        , type: "GET"
        , datatype: "json"
        , success: function (data) {
            $("#navbar").empty();
            $("#navbar").html(data);
        }
        , error: function (jqXHR, exception) {
            var msg = '';
            var tipo = '';
            if (jqXHR.status === 0) {
                msg = 'Sem Conexão.\n Verifique rede.';
            } else if (jqXHR.status == 404) {
                msg = 'Página não encontrada. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Erro desconhecido.\n' + jqXHR.responseText;
            }
        }
    })
}

function rand(min, max, interval) {
    if (typeof (interval) === 'undefined') interval = 1;
    var r = Math.floor(Math.random() * (max - min + interval) / interval);
    return r * interval + min;
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
    return pattern.test(emailAddress);
};

function LoginParceiro(funcao) {
    var url = "/ParceiroLogin/Acesso";

    var metodo = 'ValidarLoginParceiro("' + funcao + '")';

    $.ajax({
        url: url
        , datatype: "html"
        , type: 'POST'
        , cache: false
        , complete: function () {
            waitingDialog.hide();
        },
        beforeSend: function () {
            waitingDialog.show();
        }
    }).done(function (data) {
        AbrirModal('Autenticação', data);
        $("#btnSalvarLogin").attr('onclick', metodo);
    }).fail(function (jqXHR, exception) {
        TratamentoDeErro(jqXHR, exception);
    });
}

function ValidarLoginParceiro(funcao) {
    var codigo = $("#Codigo").val();
    var login = $("#LParceiro").val();
    var senha = $("#SParceiro").val();

    var result = true;

    if (codigo == "") {
        Message("*" + message.validations.UserCode);
        result = false;
    }

    if (login == "") {
        Message("*" + message.validations.UserLogin);
        result = false;
    }

    if (senha == "") {
        Message("*" + message.validations.UserPassword);
        result = false;
    }

    if (result) {
        var ret = eval(funcao);
    }
}

function OpenProtocol(idElement, url, successCB, failCB) {
    try {
        var iframe = document.getElementById(idElement);
        document.getElementById(idElement).contentWindow.location.href = url;

        if (successCB) {
            successCB();
        };
    } catch (e) {
        if (e.name == "NS_ERROR_UNKNOWN_PROTOCOL") {
            if (failCB) { failCB(); };
        };
    };
}

function abrirModalModeloAula(nomeCurso, modeloAulas) {
    var html = '';

    html += "<label class='' style='font-size:30px;'> CURSO: " + nomeCurso.toUpperCase() + " </label><br/>";
    html += "<table class='table table-hover table-striped'><thead><tr><th class='text-center' style='background-color:#ccc;color:#000'>NOME DO EXERCÍCIO</th></tr><thead><tbody>";

    for (var i = 0; i < modeloAulas.length; i++) {
        html += '<tr><td>' + modeloAulas[i] + '</td></tr>';
    }

    html += '</tbody></table>';

    AbrirModal('EXERCÍCIOS', html);
}

function abrirModalAlunos(nomeCurso, alunos) {
    var html = '';

    html += "<label class=''style='font-size:30px;' > CURSO:" + nomeCurso.toUpperCase() + " </label> <br/>";
    html += "<table class='table table-hover table-striped'><thead>" +
        "<tr style='background-color:#ccc;color:#000'>" +
        "<th style='color:#000 !important;'>INSCRIÇÃO</th>" +
        "<th style='color:#000 !important;'>CPF</th>" +
        "<th style='color:#000 !important;'>NOME DO ALUNO</th>" +
        "<th style='color:#000 !important;'>TURMA</th>" +
        "</tr></thead><tbody>";

    for (var i = 0; i < alunos.length; i++) {

        html += '<tr>';
        html += '<td>' + alunos[i].Inscricao + '</td>';
        html += '<td>' + alunos[i].CPF + '</td>';
        html += '<td>' + alunos[i].Nome + '</td>';
        html += '<td>' + alunos[i].Turma + '</td>';
        html += '</tr>';
    }
    html += '<tbody></table>';

    AbrirModal('ALUNOS INSCRITOS', html);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function AtualizarMensagens() {

    var url = "/Resources/GetResourceMessages";

    var files = "Messages.resx"; //nome do arquivo de resources em _appLocalResources/

    $.ajax({
        url: url,
        datatype: "json",
        type: "GET",
        async: false,
        cache: false,
        data: { files: files }
    }).done(function (dados) {
        dados = JSON.parse(dados);
        message = dados;
    })
}

function conta(campo, limite) {

    if (limite == "0" || limite == undefined) limite = 100;

    //armazena na variável texto o conteúdo que está no campo
    texto = document.getElementById(campo).value;

    // pega o tamanho da string que está sendo digitada e armazena na variável tamanho
    tamanho = document.getElementById(campo).value.length;

    // testa se o tamanho é maior que o limite para não permitir que o usuário adcione mais que o permitido
    if (tamanho > limite) {

        // retira os caracteres que passaram do limite permitido
        document.getElementById(campo).value = texto.substr(0, limite);

        // iguala os valores das variáveis para escrever na div
        tamanho = limite;
    }
    // conta a quantidade que ainda falta para ao usuário digitar
    restante = limite - tamanho;
    // escreve na div qtd, que mostrará as informações para o usuário
    document.getElementById('qtd').innerHTML = restante + " caracteres restantes";
}

function Unhighlight(element) {
    var id_attr = "#" + $(element).attr("id") + "1";
    $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
    $(id_attr).removeClass('glyphicon-remove');

}

function ClearValidate() {
    $('.form-group').each(function () { $(this).removeClass('has-success'); });
    $('.form-group').each(function () { $(this).removeClass('has-error'); });
    $('.form-group').each(function () { $(this).removeClass('has-feedback'); });
    $('.help-block').each(function () { $(this).remove(); });
    $('.form-control-feedback').each(function () { $(this).remove(); });

}

function AplicarSelect2(nome, numCaracteres, aplicarTooltip) {
    $("#" + nome).select2({
        theme: "bootstrap"
        , language: "pt-BR"
    });

    if (aplicarTooltip) {
        //criar tooltip
        $("#" + nome).on("change", function () {
            AplicarTooltipSelect2(nome, numCaracteres);
        });

        AplicarTooltipSelect2(nome, numCaracteres);
    }
}

function AplicarTooltipSelect2(nome, numCaracteres) {
    if ($("#" + nome) != "") {
        $("#select2-" + nome + "-container").attr("title", $('#' + nome + ' option:selected').text());
        if ($("#" + nome + " option:selected").text().length > numCaracteres) {
            $("#select2-" + nome + "-container").text($("#" + nome + " option:selected").text().substring(0, (numCaracteres - 3)) + "...") + "...";
        }
        $("#select2-" + nome + "-container").css("white-space", "nowrap");
    }
}

function CarregarCombo(url, controle, custom) {
    $('#' + controle).html("");

    $('#' + controle).attr("disabled", "disabled");
    $('#' + controle).append($('<option>', {
        value: "",
        text: "CARREGANDO...",
        selected: true
    }));

    $.ajax({
        url: url,
        type: 'GET',
        cache: false,
        async: false,
        success: function (data) {
            $('#' + controle).html("");
            $('#' + controle).removeAttr("disabled");
            $('#' + controle).append($('<option>', {
                value: "",
                text: "-- " + message.ViewModels.Select.toUpperCase() + " --"
            }));

            for (var i in data) {
                var opt = $('<option>', {
                    value: data[i].Value,
                    text: data[i].Text,
                    selected: data[i].Selected,
                });

                if (custom != null && custom != undefined && custom != "") {
                    var customs = custom.split(';');
                    for (var c in customs) {
                        $(opt).attr('data-' + customs[c], data[i].Custom[customs[c]]);
                    }
                }

                $('#' + controle).append(opt);
            }
        }
    });
}

function CarregarComboComParametroId(url, controle, id) {
    if (id == undefined)
        id = "";

    $.ajax({
        url: url,
        type: 'GET',
        cache: false,
        async: false,
        success: function (data) {
            $('#' + controle).append($('<option>', {
                value: "",
                text: "-- " + message.ViewModels.Select.toUpperCase() + " --",
                selected: selected
            }));
            for (var i in data) {
                var idS = data[i].Value;
                var selected = false;

                if (idS == id)
                    selected = true;

                $('#' + controle).append($('<option>', {
                    value: data[i].Value,
                    text: data[i].Text,
                    selected: selected
                }));
            }

            if (id === "")
                $("#" + controle).select2().select2("val", null);
        }
    });
}

function CarregarComboComParametroIdCustomDefault(url, controle, id, defaultOptionName) {

    if (id == undefined) {
        id = "";
    }

    $.ajax({
        url: url,
        type: 'GET',
        cache: false,
        async: false,
        success: function (data) {

            $('#' + controle).empty();

            $('#' + controle).append($('<option>', {
                value: "",
                text: defaultOptionName,
                selected: selected
            }));
            for (var i in data) {
                var idS = data[i].Value;
                var selected = false;

                if (idS === id)
                    selected = true;

                $('#' + controle).append($('<option>', {
                    value: data[i].Value,
                    text: data[i].Text,
                    selected: selected
                }));
            }

            if (id === "")
                $("#" + controle).select2().select2("val", null);
        }
    });
}

function AjaxRequest(url, data, type, datatype, callback, async, cache) {
    if (async == undefined)
        async = true;

    if (cache == undefined)
        cache = true;

    $.ajax({
        url: url
        , datatype: datatype
        , type: type
        , async: async
        , cache: cache
        , data: data
        , beforeSend: function () {
            waitingDialog.show();
        }
    }).done(function (data) {
        callback(data);
    }).fail(function (jqXHR, exception) {
        TratamentoDeErro(jqXHR, exception)
    })
        .always(function () {
            waitingDialog.hide();
        });
}

function AplicarToopTipLink(seletor) {
    $(seletor).qtip({
        position: {
            my: 'bottom right',  // Position my top left...
            at: 'top left', // at the bottom right of...
            target: 'mouse',
        },
        style: {
            classes: 'qtip-light qtip-shadow'
        }
    });
}

function getQueryStringVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
}

function ConfigurarDatas(dtInicial, dtFinal, periodo) {

    var result = false;

    if (periodo === undefined) {
        periodo = 365;
    }

    //Data Inicial
    $("#" + dtInicial).blur(function () {

        var dtInicio = $("#" + dtInicial).val();
        var result = false;

        if (dtInicio !== "" && dtInicio !== undefined) {
            if (!isDate(dtInicio)) {
                ValidarElementoCustomizado("#" + dtInicial, "Data Inválida", false);
            } else {

                var dtInicioFormat = $("#" + dtInicial).val().substring(6, 10) + "/" + $("#" + dtInicial).val().substring(3, 5) + "/" + $("#" + dtInicial).val().substring(0, 2);
                var dtFimFormat = $("#" + dtFinal).val().substring(6, 10) + "/" + $("#" + dtFinal).val().substring(3, 5) + "/" + $("#" + dtFinal).val().substring(0, 2);

                var dtInicio = moment(dtInicioFormat, "YYYY/MM/DD");
                var dtFim = moment(dtFimFormat, "YYYY/MM/DD");

                if (dtFim._d.toString() !== "Invalid Date") {

                    var days = dtFim.diff(dtInicio, 'days');
                    if (days > 30) {
                        ValidarElementoCustomizado($(this), "O intervalo máximo de pesquisa permitido é de 30 dias", false);
                    }
                }
            }
        }

        return result;
    });

    //Data Inicial
    $("#" + dtInicial).focus(function () {
        ValidarElementoCustomizado("#" + dtInicial, "", true);
    });

    //Data Final
    $("#" + dtFinal).focus(function () {

        var dtInicio = $("#" + dtInicial).val();

        var result = false;

        if (dtInicio !== "" && dtInicio !== undefined) {
            if (!isDate(dtInicio)) {
                ValidarElementoCustomizado("#" + dtInicial, "Data Inválida", false);
            } else {
                var dtInicioFormat = $("#" + dtInicial).val().substring(6, 10) + "/" + $("#" + dtInicial).val().substring(3, 5) + "/" + $("#" + dtInicial).val().substring(0, 2);
                var dtFimFormat = $("#" + dtFinal).val().substring(6, 10) + "/" + $("#" + dtFinal).val().substring(3, 5) + "/" + $("#" + dtFinal).val().substring(0, 2);

                var dtInicio = moment(dtInicioFormat, "YYYY/MM/DD");
                var dtFim = moment(dtFimFormat, "YYYY/MM/DD");

                if (dtFim._d.toString() !== "Invalid Date") {

                    var days = dtFim.diff(dtInicio, 'days');
                    if (days > periodo) {
                        ValidarElementoCustomizado("#" + dtInicial, "O intervalo máximo de pesquisa permitido é de " + periodo + " dias", false);
                    }
                }

                result = true;
            }
        }
        return result;
    });

    //Data Final
    $("#" + dtFinal).blur(function () {

        var dt = $("#" + dtFinal).val();

        if (dt === "") {
            ValidarElementoCustomizado("#" + dtFinal, "", true);
            result = false;
        }

        var dtInicioFormat = $("#" + dtInicial).val().substring(6, 10) + "/" + $("#" + dtInicial).val().substring(3, 5) + "/" + $("#" + dtInicial).val().substring(0, 2);
        var dtFimFormat = $("#" + dtFinal).val().substring(6, 10) + "/" + $("#" + dtFinal).val().substring(3, 5) + "/" + $("#" + dtFinal).val().substring(0, 2);

        var dtInicio = moment(dtInicioFormat, "YYYY/MM/DD");
        var dtFim = moment(dtFimFormat, "YYYY/MM/DD");

        if ($("#" + dtFinal).val() !== "" && $("#" + dtFinal).val() !== undefined) {

            if (!isDate($("#" + dtFinal).val())) {
                ValidarElementoCustomizado("#" + dtFinal, "Data Inválida", false);
            } else {

                ValidarElementoCustomizado("#" + dtFinal, "", true);
                ValidarElementoCustomizado("#" + dtInicial, "", true);
                if (moment(dtInicio).isAfter(dtFim)) {
                    ValidarElementoCustomizado("#dtFinal", "", false);
                    Message("A data final deve ser maior do que a data inicial", "erro");
                } else {
                    var days = dtFim.diff(dtInicio, 'days');
                    if (days > periodo) {
                        ValidarElementoCustomizado("#" + dtInicial, "O intervalo máximo de pesquisa permitido é de " + periodo + " dias", false);
                    }
                }
            }
        } else {

            var dtInicio = $("#" + dtInicial).val();

            if (!isDate(dtInicio)) {

                if ($("#" + dtInicial).val() !== "" && $("#" + dtFinal).val() !== "") {
                    ValidarElementoCustomizado("#" + dtInicial, "Data Inválida", false);
                } else {
                    ValidarElementoCustomizado("#" + dtInicial, "", false);
                    Message("Por favor, preencha os campos obrigatórios destacados", "erro");
                }

            } else {

                var dtInicioFormat = $("#" + dtInicial).val().substring(6, 10) + "/" + $("#" + dtInicial).val().substring(3, 5) + "/" + $("#" + dtInicial).val().substring(0, 2);
                var dtFimFormat = $("#" + dtFinal).val().substring(6, 10) + "/" + $("#" + dtFinal).val().substring(3, 5) + "/" + $("#" + dtFinal).val().substring(0, 2);

                var dtInicio = moment(dtInicioFormat, "YYYY/MM/DD");
                var dtFim = moment(dtFimFormat, "YYYY/MM/DD");

                if (dtFim._d.toString() !== "Invalid Date") {

                    var days = dtFim.diff(dtInicio, 'days');
                    if (days > 30) {
                        ValidarElementoCustomizado($(this), "O intervalo máximo de pesquisa permitido é de 30 dias", false);
                    } else {
                        ValidarElementoCustomizado("#" + dtInicial, "", true);
                        result = true;
                    }
                }
            }
        }
    });

    return result;
}

function CallBackWebWorker(request, callback) {
    var worker = new Worker("/Scripts/WebWorkerAjax.js");
    worker.postMessage(request);
    worker.onmessage = function (e) {
        callback(e);
    }
}

function RetornaDataSubtract(days) {
    var d = moment();

    if ($.isNumeric(days)) {
        d = moment().subtract(days, 'days');
    }
    return d.format("DD/MM/YYYY");
}

function checkDate(day, month, year) {
    var num = ((parseInt(year) - 1920) / 4);
    var anoBissexto = parseInt(num) === parseFloat(num);

    if (anoBissexto) {
        if (month == 2 && day <= 29)
            return true;
    } else {
        if (month == 2 && day <= 28)
            return true;
    }

    if ((month == 4 || month == 6 || month == 9 || month == 11) && day <= 30) {
        return true;
    }
    else if ((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) && day <= 31) {
        return true;
    }
    else {
        return false;
    }
}


function SelectAll(id) {
    document.getElementById(id).focus();
    document.getElementById(id).select();
}


function ValidarDDD(value) {

    //var ddd = telefone.substring(1, telefone.indexOf(')'));

    //var result =true;

    //if (ddd.indexOf("0") == 1)
    //    result = false;

    //return result;



    var ddd = value.substring(1, value.indexOf(')'));
    if (ddd.substring(0, 1) === '0' || ddd.substring(1, 2) === '0')
        return false;
    else
        return true;
}