Cliente = {
    Listar: function () {
        $("body").css("padding-top", "2px", "!important");
        $("#TopoPesquisa").css("margin-left", "5px");
        $("#TopoPesquisa").css("margin-right", "5px");
        $("#TopoPesquisa").css("padding-top", "20px");
        $("#TopoPesquisa").css("padding-bottom", "15px");
        var cliente = $("#ClientePesquisar").val();

        var url = "/Cliente/ListarClientes";
        $.ajax({
            url: url
            , datatype: "json"
            , type: "GET"
            , async: false
            , data: { cliente: cliente }
            , cache: false
        }).done(function (data) {
            $("#DvListarClientes").html(data);
            $("#cabecalho").css("background-color","#5B9BD5")
            $("#cabecalho").css("color", "#FFFFFF")
            $("#colNome").css("width", "480");
            AplicarDataTable('tbListarClientes', '0', "asc", 20, false, undefined, true);
            $("#tbListarClientes_paginate").css("margin-top", "-50px");
            $("#tbListarClientes_paginate").css("float", "right");
            $("#footer").css("margin-top", "50px");
            $("#footer").css("height", "40px");
            $("#footer").css("padding", "10px");
        }).fail(function (jqXHR, exception) {
            TratamentoDeErro(jqXHR, exception);
        });
    },

    Editar: function (idAnuncio) {
        var url = "/AnuncioWebmotors/Editar";
        $.ajax({
            url: url
            , datatype: "json"
            , type: "POST"
            , async: false
            , data: { Id: idAnuncio }
            , cache: false
        }).done(function (data) {
            if (data.resultado != null) {
                $("#ModoAcao").val("Editar");

                $("#IdAnuncioEditar").val(data.resultado.ID);

                var comboMarca = '';
                if (data.resultado.marcas.length > 0) {
                    comboMarca = '<select id="ComboMarca" name="ComboMarca" class="form-control requerido" style = "width: 70px;">';
                    comboMarca = comboMarca + '<option value="">-- Selecione --</option>';
                    $.each(data.resultado.marcas, function (key, value) {
                        var selecionado = "";
                        if (value.Name == data.resultado.Marca) {
                            selecionado = " Selected";
                        }
                        comboMarca = comboMarca + '<option value="' + value.ID + '"' + selecionado + '> ' + value.Name + '</option >';
                    });
                    comboMarca = comboMarca + '</select>';
                    $("#ComboMarca").html(comboMarca);
                }
                else {
                    comboMarca = '<select id="ComboMarca" name="ComboMarca" class="form-control requerido" style = "width: 70px;">';
                    comboMarca = comboMarca + '<option value="">--</option>';
                    comboMarca = comboMarca + '</select>';
                    $("#ComboMarca").html(comboMarca);
                    return;
                }

                var comboModelo = '';
                if (data.resultado.modelos.length > 0) {
                    comboModelo = '<select id="ComboModelo" name="ComboModelo" class="form-control requerido" style = "width: 70px;">';
                    comboModelo = comboModelo + '<option value="">--</option>';
                    $.each(data.resultado.modelos, function (key, value) {
                        var selecionado = "";
                        if (value.Name == data.resultado.Modelo) {
                            selecionado = " Selected";
                        }
                        comboModelo = comboModelo + '<option value="' + value.ID + '"' + selecionado + '> ' + value.Name + '</option >';
                    });
                    comboModelo = comboModelo + '</select>';
                    $("#ComboModelo").html(comboModelo);
                }
                else {
                    comboModelo = '<select id="ComboModelo" name="ComboModelo" class="form-control requerido" style = "width: 70px;">';
                    comboModelo = comboModelo + '<option value="">-- Selecione --</option>';
                    comboModelo = comboModelo + '</select>';
                    $("#ComboModelo").html(comboModelo);
                    return;
                }

                var comboVersao = '';
                if (data.resultado.versoes.length > 0) {
                    comboVersao = '<select id="ComboVersao" name="ComboVersao" class="form-control requerido" style = "width: 70px;">';
                    comboVersao = comboVersao + '<option value="">-- Selecione --</option>';
                    $.each(data.resultado.versoes, function (key, value) {
                        var selecionado = "";
                        if (value.Name == data.resultado.Versao) {
                            selecionado = " Selected";
                        }
                        comboVersao = comboVersao + '<option value="' + value.ID + '"' + selecionado + '> ' + value.Name + '</option >';
                    });
                    comboVersao = comboVersao + '</select>';
                    $("#ComboVersao").html(comboVersao);
                }
                else {
                    comboVersao = '<select id="ComboVersao" name="ComboVersao" class="form-control requerido" style = "width: 70px;">';
                    comboVersao = comboVersao + '<option value="">-- Selecione --</option>';
                    comboVersao = comboVersao + '</select>';
                    $("#ComboVersao").html(comboVersao);
                    return;
                }

                $('#ComboMarca option:contains(' + data.resultado.Marca + ')').attr({ selected: "selected" });
                $('#ComboModelo option:contains(' + data.resultado.Modelo + ')').attr({ selected: "selected" });
                $('#ComboVersao option:contains(' + data.resultado.Versao + ')').attr({ selected: "selected" });
                $("#Ano").val(data.resultado.Ano);
                $("#Quilometragem").val(data.resultado.Quilometragem);
                $("#Observacao").val(data.resultado.Observacao);

                $("#ModalAnuncio").modal('show');

                $("#ComboMarca").on("change", function () {
                    Anuncio.ComboModeloListar();
                });

                $("#ComboModelo").on("change", function () {
                    Anuncio.ComboVersaoListar();
                });
            }
            else {
                return;
            }
        }).fail(function (jqXHR, exception) {
            TratamentoDeErro(jqXHR, exception);
        });
    },

    Salvar: function () {
        var isValido = true;
        if ($("#CNPJ_CPF").val() == "") {
            isValido = false;
        }
        else if ($("#RazaoSocial_Nome").val() == "") {
            isValido = false;
        }
        else if ($("#CEP").val() == "") {
            isValido = false;
        }
        else if ($("#Logradouro").val() == "") {
            isValido = false;
        }
        else if ($("#Logradouro_Numero").val() == "") {
            isValido = false;
        }
        else if ($("#Logradouro_Complemento").val() == "") {
            isValido = false;
        }
        else if ($("#Logradouro_Bairro").val() == "") {
            isValido = false;
        }
        else if ($("#Logradouro_Cidade").val() == "") {
            isValido = false;
        }
        else if ($("#Logradouro_UF").val() == "") {
            isValido = false;
        }
        else if ($("#Telefone").val() == "") {
            isValido = false;
        }
        else if ($("#SLA_RespostaTempo").val() == "") {
            isValido = false;
        }

        if (!isValido) {
            $("#mensagemModal").text("Favor preencher os campos obrigatórios!!!").show();
            window.setTimeout(function () {
                $("#mensagemModal").text("").hide();
            }, 6000);
            return;
        }

        bootbox.confirm({
            message: 'Deseja realmente salvar este registro?',
            buttons: {
                confirm: {
                    label: 'Sim',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Não',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (!result) {
                    controle = true;
                    return;
                }
                var url = "/Cliente/SavarCliente";
                cliente = {
                    ID: $("#IdCliente").val(),
                    CNPJ_CPF: $("#CNPJ_CPF").val(),
                    RazaoSocial_Nome: $("#RazaoSocial_Nome").val(),
                    CEP: $("#CEP").val(),
                    Logradouro: $("#Logradouro").val(),
                    Logradouro_Numero: $("#Logradouro_Numero").val(),
                    Logradouro_Complemento: $("#Logradouro_Complemento").val(),
                    Logradouro_Bairro: $("#Logradouro_Bairro").val(),
                    Logradouro_Cidade: $("#Logradouro_Cidade").val(),
                    Logradouro_UF: $("#Logradouro_UF").val(),
                    Telefone: $("#Telefone").val(),
                    SLA_RespostaTempo: $("#SLA_RespostaTempo").val()
                };
                $.ajax({
                    url: url
                    , datatype: "json"
                    , type: "POST"
                    , async: false
                    , data: { cliente: cliente }
                    , cache: false
                }).done(function (data) {
                    if (data.retorno == "200") {
                        $("#mensagemModal").text(data.mensagem).show();
                        window.setTimeout(function () {
                            $("#mensagemModal").text("").hide();
                            window.location.href = "/Cliente/Index";
                        }, 3000);
                    }
                    else {
                        $("#mensagemModal").text('Erro:' + data.mensagem).show();
                        window.setTimeout(function () {
                            $("#mensagemModal").text("").hide();
                            window.location.href = "/Cliente/Index";
                        }, 3000);
                        return;
                    }
                }).fail(function (jqXHR, exception) {
                    TratamentoDeErro(jqXHR, exception);
                });
            }
        });
    },

    Excluir: function (Id) {
        bootbox.confirm({
            message: 'Deseja realmente deletar este registro?',
            buttons: {
                confirm: {
                    label: 'Sim',
                    className: 'btn-success',
                },
                cancel: {
                    label: 'Não',
                    className: 'btn-danger',
                }
            },
            callback: function (result) {
                if (!result) {
                    return;
                }
                var url = "/Cliente/DeleterCliente";
                $.ajax({
                    url: url
                    , datatype: "json"
                    , type: "POST"
                    , async: false
                    , data: { Id: Id }
                    , cache: false
                }).done(function (data) {
                    if (data.retorno == "200") {
                        $("#mensagem").text(data.mensagem).show();
                        window.setTimeout(function () {
                            $("#mensagem").text("").hide();
                            window.location.href = "/Cliente/Index";
                        }, 3000);
                    }
                    else {
                        $("#mensagem").text('Erro' + data.mensagem).show();
                        window.setTimeout(function () {
                            $("#mensagem").text("").hide();
                            window.location.href = "/Cliente/Index";
                        }, 3000);
                        return;
                    }
                }).fail(function (jqXHR, exception) {
                    TratamentoDeErro(jqXHR, exception);
                });
            }
        });
    },

}

$(document).ready(function () {
    $(".cepClass").mask("99999-999");
    $(".celularClass").mask("(99)99999-9999");

    $("#btnSalvarCliente").on("click", function () {
        Cliente.Salvar();
    });

    $('#btPesquisar').on("click", function () {
        Anuncio.Listar();
    });

    $('#btNovo').on("click", function () {
        $("#ModalCadastrarCliente").modal('show');
    });

    $('#btnFecharCliente').on("click", function () {
        $("#IdCliente").val("0");
        $("#RazaoSocial_Nome").val("");
        $("#CNPJ_CPF").val("");
        $("#Telefone").val("");
        $("#Logradouro").val("");
        $("#Logradouro_Complemento").val("");
        $("#CEP").val("");
        $("#Logradouro_Bairro").val("");
        $("#Logradouro_Cidade").val("");
        $("#Logradouro_UF").val("");
        $("#SLA_RespostaTempo").val("");

        $("#ModalCadastrarCliente").modal('hide');
    });

    var url = window.location.pathname;
    if ((url == "/") || (url == "/Cliente/Index")) {
        //$('#btPesquisar').trigger("click", function () {
        //    Cliente.Listar();
        //});
        Cliente.Listar();
    };

    $("#CEP").blur(function () {
        var cep = $("#CEP").val().replace(/\D/g, '');
        if (cep.length == 0) {
            return
        }
        else if (cep.length != 8) {
            $("#mensagemModal").text("CEP inválido.").show();
            limpa_formulário_cep();

            window.setTimeout(function () {
                $("#mensagemModal").text("").hide();
            }, 2000);
            return
        };
        
        $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

            if (!("erro" in dados)) {
                $("#Logradouro").val(dados.logradouro);
                $("#Logradouro_Bairro").val(dados.bairro);
                $("#Logradouro_Cidade").val(dados.localidade);
                $("#Logradouro_UF").val(dados.uf);
            }
            else {
                $("#mensagemModal").text("CEP não encontrado.").show();
                limpa_formulário_cep();

                window.setTimeout(function () {
                    $("#mensagemModal").text("").hide();
                }, 2000);
            }
        });
    });

    $("#CNPJ_CPF").unmask();
    $("#CNPJ_CPF").focusout(function () {
        $("#CNPJ_CPF").unmask();
        var tamanho = $("#CNPJ_CPF").val().replace(/\D/g, '').length;
        if (tamanho == 11) {
            $("#CNPJ_CPF").mask("999.999.999-99");
        } else if (tamanho == 14) {
            $("#CNPJ_CPF").mask("99.999.999/9999-99");
        }
    });
    $("#CNPJ_CPF").focusin(function () {
        $("#CNPJ_CPF").unmask();
    });

    function limpa_formulário_cep() {
        $("#Logradouro").val("");
        $("#Logradouro_Bairro").val("");
        $("#Logradouro_Cidade").val("");
        $("#Logradouro_UF").val("");
    }
})
