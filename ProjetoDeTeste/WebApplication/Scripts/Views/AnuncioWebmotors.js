Anuncio = {
    Listar: function () {
        var marca = $("#MarcaPesquisar").val();

        var url = "/AnuncioWebmotors/ListarAnuncios";
        $.ajax({
            url: url
            , datatype: "json"
            , type: "GET"
            , async: false
            , data: { marca: marca }
            , cache: false
        }).done(function (data) {
            $("#DvListarAnuncios").html(data);
            $("#colNome").css("width", "480");
            AplicarDataTable('ListarAnuncios', '0', "asc", 20, false, undefined, true);
            $("#ListarAnuncios_paginate").css("margin-top", "-50px");
            $("#ListarAnuncios_paginate").css("float", "right");
            $("#footer").css("margin-top", "50px");
            $("#footer").css("height", "40px");
            $("#footer").css("padding", "10px");
        }).fail(function (jqXHR, exception) {
            TratamentoDeErro(jqXHR, exception);
        });
    },

    Novo: function () {
        var url = "/AnuncioWebmotors/Create";
        $.ajax({
            url: url
            , datatype: "json"
            , type: "GET"
            , async: false
            , cache: false
        }).done(function (data) {
            if (data.resultado != null) {
                $("#ModoAcao").val("Cadastrar");

                $("#IdAnuncioEditar").val(0);

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

                    $("#ComboMarca").on("change", function () {
                        Anuncio.ComboModeloListar();
                    });
                }
                else {
                    comboMarca = '<select id="ComboMarca" name="ComboMarca" class="form-control requerido" style = "width: 70px;">';
                    comboMarca = comboMarca + '<option value="">-- Selecione --</option>';
                    comboMarca = comboMarca + '</select>';
                    $("#ComboMarca").html(comboMarca);
                    return;
                }

                comboModelo = '<select id="ComboModelo" name="ComboModelo" class="form-control requerido" style = "width: 70px;">';
                comboModelo = comboModelo + '<option value="">-- Selecione --</option>';
                comboModelo = comboModelo + '</select>';
                $("#ComboModelo").html(comboModelo);

                comboVersao = '<select id="ComboVersao" name="ComboVersao" class="form-control requerido" style = "width: 70px;">';
                comboVersao = comboVersao + '<option value="">-- Selecione --</option>';
                comboVersao = comboVersao + '</select>';
                $("#ComboVersao").html(comboVersao);

                $("#Ano").val("");
                $("#Quilometragem").val("");
                $("#Observacao").val("");

                $("#ModalAnuncio").modal('show');
            }
            else {
                return;
            }
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

    ComboModeloListar: function () {
        var IdMaraca = $("#ComboMarca").val();
        var url = "/AnuncioWebmotors/ComboModeloListar";
        $.ajax({
            url: url
            , datatype: "json"
            , type: "POST"
            , async: false
            , data: { MakeID: IdMaraca }
            , cache: false
        }).done(function (data) {
            if (data.resultado != null) {

                var comboModeloNovo = '';
                if (data.resultado.length > 0) {
                    comboModeloNovo = '<select id="ComboModelo" name="ComboModelo" class="form-control requerido" style = "width: 70px;">';
                    comboModeloNovo = comboModeloNovo + '<option value="">-- Selecione --</option>';
                    $.each(data.resultado, function (key, value) {
                        comboModeloNovo = comboModeloNovo + '<option value="' + value.ID + '"> ' + value.Name + '</option >';
                    });
                    comboModeloNovo = comboModeloNovo + '</select>';
                    $("#ComboModelo").html(comboModeloNovo);
                }
                else {
                    comboModeloNovo = '<select id="ComboModelo" name="ComboModelo" class="form-control requerido" style = "width: 70px;">';
                    comboModeloNovo = comboModeloNovo + '<option value="">-- Selecione --</option>';
                    comboModeloNovo = comboModeloNovo + '</select>';
                    $("#ComboModelo").html(comboModeloNovo);
                    return;
                }

                $("#ModalAnuncio").modal('show');

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

    ComboVersaoListar: function () {
        var IdModelo = $("#ComboModelo").val();
        var url = "/AnuncioWebmotors/ComboVersaoListar";
        $.ajax({
            url: url
            , datatype: "json"
            , type: "POST"
            , async: false
            , data: { ModeloID: IdModelo }
            , cache: false
        }).done(function (data) {
            if (data.resultado != null) {

                var comboVersaoNovo = '';
                if (data.resultado.length > 0) {
                    comboVersaoNovo = '<select id="ComboVersao" name="ComboVersao" class="form-control requerido" style = "width: 70px;">';
                    comboVersaoNovo = comboVersaoNovo + '<option value="">-- Selecione --</option>';
                    $.each(data.resultado, function (key, value) {
                        comboVersaoNovo = comboVersaoNovo + '<option value="' + value.ID + '"> ' + value.Name + '</option >';
                    });
                    comboVersaoNovo = comboVersaoNovo + '</select>';
                    $("#ComboVersao").html(comboVersaoNovo);
                }
                else {
                    comboMVersaoNovo = '<select id="ComboVersao" name="ComboVersao" class="form-control requerido" style = "width: 70px;">';
                    comboVersaoNovo = comboVersaoNovo + '<option value="">-- Selecione --</option>';
                    comboVersaoNovo = comboVersaooNovo + '</select>';
                    $("#ComboVersao").html(comboVersaoNovo);
                    return;
                }

                $("#ModalAnuncio").modal('show');
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
        if ($("#ComboMarca").val() == "") {
            isValido = false;
        }
        else if ($("#ComboModelo").val() == "") {
            isValido = false;
        }
        else if ($("#ComboVersao").val() == "") {
            isValido = false;
        }
        else if ($("#Ano").val() == "") {
            isValido = false;
        }
        else if ($("#Quilometragem").val() == "") {
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
                var url = "/AnuncioWebmotors/Salvar";
                anuncio = {
                    ID: $("#IdAnuncioEditar").val(),
                    Marca: $("#ComboMarca option:selected").html(),
                    Modelo: $("#ComboModelo option:selected").html(),
                    Versao: $("#ComboVersao option:selected").html(),
                    Ano: $("#Ano").val().toUpperCase(),
                    Quilometragem: $("#Quilometragem").val(),
                    Observacao: $("#Observacao").val(),
                };
                $.ajax({
                    url: url
                    , datatype: "json"
                    , type: "POST"
                    , async: false
                    , data: { anuncioWebmotorVM: anuncio }
                    , cache: false
                }).done(function (data) {
                    if (data.retorno == "Ok") {
                        $("#mensagemModal").text(data.mensagem).show();
                        window.setTimeout(function () {
                            $("#mensagemModal").text("").hide();
                            window.location.href = "/AnuncioWebmotors/Index";
                        }, 3000);
                    }
                    else {
                        $("#mensagemModal").text('Erro:' + data.mensagem).show();
                        window.setTimeout(function () {
                            $("#mensagemModal").text("").hide();
                            window.location.href = "/AnuncioWebmotors/Index";
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
                var url = "/AnuncioWebmotors/Deletar";
                $.ajax({
                    url: url
                    , datatype: "json"
                    , type: "POST"
                    , async: false
                    , data: { Id: Id }
                    , cache: false
                }).done(function (data) {
                    if (data.retorno == "Ok") {
                        $("#mensagem").text(data.mensagem).show();
                        window.setTimeout(function () {
                            $("#mensagem").text("").hide();
                            window.location.href = "/AnuncioWebmotors/Index";
                        }, 3000);
                    }
                    else {
                        $("#mensagem").text('Erro' + data.mensagem).show();
                        window.setTimeout(function () {
                            $("#mensagem").text("").hide();
                            window.location.href = "/AnuncioWebmotors/Index";
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
    $("#btnSalvarAnuncio").on("click", function () {
        Anuncio.Salvar();
    });

    $('#btPesquisar').on("click", function () {
        Anuncio.Listar();
    });

    var url = window.location.pathname;
    if ((url == "/") || (url == "/AnuncioWebmotors/Index")) {
        $('#btPesquisar').trigger("click", function () {
            Anuncio.Listar();
        });
    }
})
