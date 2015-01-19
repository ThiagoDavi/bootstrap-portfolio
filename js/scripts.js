

////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////CONTATO//////////////////////////////////////

stopSend = false;

function sendForm(idForm, address) {
    if (!stopSend) {
        var stopSubmit = validarCampos(idForm);
        var validadeSubmit = validate(idForm);

        $('#' + idForm + ' input:submit').blur();

        if (!stopSubmit && !validadeSubmit)
        {
            stopSend = true;
            $('#' + idForm + ' .msg').text('enviando...');
            $('#' + idForm + ' .loader').fadeIn();

            $.ajax({
                url: address,
                type: "POST",
                dataType: "json",
                data: $("#" + idForm).serialize(),
                error: function (data) {
                    $('#' + idForm + ' .msg').text('erro interno no servidor (1000)!');
                },
                success: function (data) {
					if(idForm == "formNicotina" || idForm == "formIMC" || idForm == "formAlcool" || idForm == "formSono" || idForm == "formRisco")
                    {
						$('#' + idForm + ' .msg').text('Calculado');
						$('.content-ajax').html(data.html);
						$(".content-ajax .lightbox").css({"visibility": "hidden", "display":"block"});
						resizeLightboxTeste()
						$(".content-ajax .lightbox-bg").fadeIn();
						$(".content-ajax .lightbox").css({"visibility": "visible", "display":"none"}).fadeIn();

						$('.lightbox .resultado span a').click(
                            function(e)
                            {
    							$('.lightbox').fadeOut();
    							$('.lightbox-bg').fadeOut();
    							e.preventDefault();
						      }
                        )
					}

                    switch (data.status)
                    {
                        case 'true':
                            if (idForm == "formCadastrar" || idForm == "formProgramas" || idForm == "formSolicitarTurismo" || idForm == "formContato" || idForm == "form-login")
                            {
                                $('#' + idForm + ' .msg').css("color", "#333333");
                            }
                            else
                            {
                                $('#' + idForm + ' .msg').css("color", "#555");
                            }

                            $('#' + idForm + ' .clearValue').val('');
                            $('#' + idForm + ' .dropdown_toggle strong').html('');
                            $('#' + idForm + ' .resetSelect').removeAttr("selected");

                            $('#' + idForm + ' .resetValue').each(
                                function () {
                                    $(this).val($(this).attr('rel'));
                                }
                            );
                            $('#' + idForm + ' .resetSelect').each(
                                function () {
                                    $('.dk_options_inner li:first-child', $(this).parent()).addClass('dk_option_current');
                                    $('.dk_label', $(this).parent()).text($('.dk_options_inner li:first-child span', $(this).parent()).text());
                                    $('select option', $(this).parent()).removeAttr('selected');
                                }
                            );

                            //callSendFormTrack($("#" + idForm));
                            break;

                        case 'false':
                            $('#' + idForm + ' .msg').css("color", "#B10000");
                            break;
                    }

                    $('#' + idForm + ' .msg').text(data.msg);
                },
                complete: function (data) {
                    stopSend = false;
                    $('#' + idForm + ' .loader').fadeOut();
                }
            });
        }
        else
        {
            if (validadeSubmit) {
                $('#' + idForm + ' .msg').html('* preencha os campos corretamente!').css("color", "#B10000");
            }

            if (stopSubmit) {
                $('#' + idForm + ' .msg').html('* preencha os campos obrigat&oacute;rios!').css("color", "#B10000");
            }
        }
    }
}

function validarCampos(formId) {
    var stopSubmit;

    if ($("#" + formId + " .campoObrigatorio").size()) {
        for (i = 0; i < $("#" + formId + " .campoObrigatorio").size(); i++) {
            var objectInput = $("#" + formId + " .campoObrigatorio:eq(" + i + ")");

            switch ($("#" + formId + " .campoObrigatorio").get(i).tagName) {
                case "INPUT":
                    switch (objectInput.attr('type')) {
                        case "text":
                        case "password":
                            if (!objectInput.val() || objectInput.attr('rel') && objectInput.attr('rel') == objectInput.val()) {
                                objectInput.parent().addClass("focusCampo");
                                objectInput.blur(function () {
                                    if ($(this).val() || $(this).attr('rel') && $(this).val() && $(this).attr('rel') != $(this).val()) {
                                        $(this).parent().removeClass("focusCampo");
                                        //$(this).unbind();
                                    }
                                });

                                stopSubmit = true;
                            }
                            break;

                        case "hidden":
                            var objectRel = $("#" + objectInput.attr('rel'));

                            if (!objectInput.val()) {
                                objectRel.addClass("focusCampo");
                                objectRel.blur(function () {
                                    $(this).removeClass("focusCampo");
                                    //$(this).unbind();
                                });

                                stopSubmit = true;
                            }
                            break;
                    }
                    break;
                case "SELECT":
                    if (!objectInput.val()) {
                        objectInput.parent().addClass("focusCampoSelect");
                        objectInput.change(function () {
                            $(this).parent().removeClass("focusCampoSelect");
                            $(this).unbind();
                        });

                        stopSubmit = true;
                    }
                    break;
                case "TEXTAREA":
                    if (!objectInput.val() || objectInput.attr('rel') && objectInput.attr('rel') == objectInput.val()) {
                        objectInput.parent().addClass("focusCampo");
                        objectInput.blur(function () {
                            if ($(this).val() || $(this).attr('rel') && $(this).val() && $(this).attr('rel') != $(this).val()) {
                                $(this).parent().removeClass("focusCampo");
                                //$(this).unbind();
                            }
                        });

                        stopSubmit = true;
                    }
                    break;
            }
        }

        if (stopSubmit == true) {
            return true;
        }
    }
}

function validate(idForm) {
    var stopSubmit;

    //////////VALIDATE DATA

    function isDate(value, maxDate) {
        try {

            var DayIndex = 0;
            var MonthIndex = 1;
            var YearIndex = 2;

            value = value.replace(/-/g, "/").replace(/\./g, "/");
            var SplitValue = value.split("/");
            var OK = true;

            if (!(SplitValue[DayIndex].length == 1 || SplitValue[DayIndex].length == 2)) {
                OK = false;
            }
            if (OK && !(SplitValue[MonthIndex].length == 1 || SplitValue[MonthIndex].length == 2)) {
                OK = false;
            }
            if (OK && SplitValue[YearIndex].length != 4) {
                OK = false;
            }
            if (OK) {
                var Day = parseInt(SplitValue[DayIndex], 10);
                var Month = parseInt(SplitValue[MonthIndex], 10);
                var Year = parseInt(SplitValue[YearIndex], 10);

                if (OK = ((Year > 1900) && (Year <= new Date().getFullYear()) || ((Year > 1900) && (maxDate == false)))) {
                    if (OK = ((Month <= 12 && Month > 0 && maxDate == false) || ((Year < new Date().getFullYear() && Month <= 12 && Month > 0) || (Year = new Date().getFullYear() && Month <= new Date().getMonth() + 1 && Month > 0)))) {
                        if (OK = ((maxDate == false) || (Day > 0 && Day <= new Date().getDate()))) {
                            var LeapYear = (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0));

                            if (Month == 2) {
                                OK = LeapYear ? Day <= 29 : Day <= 28;
                            }
                            else {
                                if ((Month == 4) || (Month == 6) || (Month == 9) || (Month == 11)) {
                                    OK = (Day > 0 && Day <= 30);
                                }
                                else {
                                    OK = (Day > 0 && Day <= 31);
                                }
                            }
                        }
                    }
                }
            }
            return OK;
        }
        catch (e) {
            return false;
        }
    }


    //////////VALIDATE EMAIL

    function isEmail(elementValue) {
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(elementValue);
    }


    //////////VALIDATE TIME

    function isTime(elementValue) {
        return elementValue.match(new RegExp(/^((\d)|(0\d)|(1\d)|(2[0-3]))\:((\d)|([0-5]\d))$/));
    }


    //////////VALIDATE INTEIRO

    function isInteger(s) {
        var isInteger_re = /^\s*(\+|-)?\d+\s*$/;
        return String(s).search(isInteger_re) != -1;
    }


    //////////VALIDATE CPF

    function isCPF(obj) {
        var numeros, digitos, soma, i, resultado, digitos_iguais;
        digitos_iguais = 1;

        var cpf = obj.replace(/[\./-]/g, "");

        if (cpf.length < 11) {
            return false;
        }
        for (i = 0; i < cpf.length - 1; i++) {
            if (cpf.charAt(i) != cpf.charAt(i + 1)) {
                digitos_iguais = 0;
                break;
            }
        }
        if (!digitos_iguais) {
            numeros = cpf.substring(0, 9);
            digitos = cpf.substring(9);
            soma = 0;

            for (i = 10; i > 1; i--) {
                soma += numeros.charAt(10 - i) * i;
            }

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

            if (resultado != digitos.charAt(0)) {
                return false;
            }

            numeros = cpf.substring(0, 10);
            soma = 0;

            for (i = 11; i > 1; i--) {
                soma += numeros.charAt(11 - i) * i;
            }

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

            if (resultado != digitos.charAt(1)) {
                return false;
            }

            return true;
        }
        else {
            return false;
        }
    }

    function checar_cpf(obj) {
        if (!valida_cpf(obj) && obj != "   .   .   -  ") {
            alert("cpf: " + obj + " incorreto!");
            $("input.cpf").focus();
        }
    }

    /////////VALIDATE CNPJ

    function isCNPJ(obj) {
        var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
        digitos_iguais = 1;

        var cnpj = obj.replace(/[\./-]/g, "");

        if (cnpj.length != 14) {
            return false;
        }
        for (i = 0; i < cnpj.length - 1; i++) {
            if (cnpj.charAt(i) != cnpj.charAt(i + 1)) {
                digitos_iguais = 0;
                break;
            }
        }
        if (!digitos_iguais) {
            tamanho = cnpj.length - 2;
            numeros = cnpj.substring(0, tamanho);
            digitos = cnpj.substring(tamanho);
            soma = 0;
            pos = tamanho - 7;

            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

            if (resultado != digitos.charAt(0)) {
                return false;
            }

            tamanho = tamanho + 1;
            numeros = cnpj.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;

            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

            if (resultado != digitos.charAt(1)) {
                return false;
            }
            return true;
        }
        else {
            return false;
        }
    }

    function checar_cnpj(obj) {
        if (!valida_cnpj(obj) && obj != "  .   .   /    -  ") {
            alert("cnpj: " + obj + " incorreto!");
            $("input.cnpj").focus();
        }
    }

    /////////VALIDATE

    function addKeyEvent(objectInput, removeEvent) {
        objectInput.parent().addClass("focusCampo");
        objectInput.change(function () {
            $(this).parent().removeClass("focusCampo");
            if (removeEvent) {
                $(this).unbind();
            }
        });
    }

    $('#' + idForm + ' .vdata,#' + idForm + ' .vemail,#' + idForm + ' .vinteiro,#' + idForm + ' .vhora,#' + idForm + ' .vcpf,#' + idForm + ' .vcnpj').each(
        function (index, element) {
            if ($(this).hasClass('vdata') && $(this).val() && $(this).hasClass('campoObrigatorio')) {
                var maxDate = ($(this).hasClass('maxdata')) ? true : false;

                if (!isDate($(this).val(), maxDate)) {
                    stopSubmit = true;
                    addKeyEvent($(this), false);
                }
            }

            if ($(this).hasClass('vemail') && $(this).val() && $(this).hasClass('campoObrigatorio')) {
                if (!isEmail($(this).val())) {
                    stopSubmit = true;
                    addKeyEvent($(this), false);
                }
            }

            if ($(this).hasClass('vhora') && $(this).val() && $(this).hasClass('campoObrigatorio')) {
                if (!isTime($(this).val())) {
                    stopSubmit = true;
                    addKeyEvent($(this), false);
                }
            }

            if ($(this).hasClass('vinteiro') && $(this).val() && $(this).hasClass('campoObrigatorio')) {
                if (!isInteger($(this).val())) {
                    stopSubmit = true;
                    addKeyEvent($(this), false);
                }
            }

            if ($(this).hasClass('vcpf') && $(this).val() && $(this).hasClass('campoObrigatorio')) {
                if (!isCPF($(this).val())) {
                    stopSubmit = true;
                    addKeyEvent($(this), false);
                }
            }

            if ($(this).hasClass('vcnpj') && $(this).val() && $(this).hasClass('campoObrigatorio')) {
                if (!isCNPJ($(this).val())) {
                    stopSubmit = true;
                    addKeyEvent($(this), false);
                }
            }
        }
    );

    if (stopSubmit == true) {
        return true;
    }
}

function camposSenha() {
    if ($('input[name=senha]').size()) {
        $('input[name=senha]').unbind().focus(
            function () {
                if ($(this).val() == "*Senha:") {
                    $('.labelSenha').html("<input tabindex='" + $('.labelSenha input').attr('tabindex') + "' name='senha' value='' type='password' rel='*Senha:' class='campoObrigatorio' />");
                    camposSenha();
                    setTimeout("$('input[name=senha]').focus();", 10);
                }
            }
        ).blur(
            function () {
                $('.labelSenha').removeClass('focusCampo');
                if ($(this).val() == "") {
                    $('.labelSenha').html("<input tabindex='" + $('.labelSenha input').attr('tabindex') + "' name='senha' value='*Senha:' type='text' rel='*Senha:' class='campoObrigatorio' />");
                    camposSenha();
                }
            }
        );
    }

    if ($('input[name=confirmSenha]').size()) {
        $('input[name=confirmSenha]').unbind().focus(
            function () {
                if ($(this).val() == "*Confirmar Senha:") {
                    $('.labelConfirmarSenha').html("<input tabindex='" + $('.abas.ativo .labelConfirmarSenha input').attr('tabindex') + "' name='confirmSenha' value='' type='password' rel='*Confirmar Senha:' class='campoObrigatorio' />");
                    camposSenha();
                    setTimeout("$('input[name=confirmSenha]').focus();", 10);
                }
            }
        ).blur(
            function () {
                $('.labelConfirmarSenha').removeClass('focusCampo');
                if ($(this).val() == "") {
                    $('.labelConfirmarSenha').html("<input tabindex='" + $('.abas.ativo .labelConfirmarSenha input').attr('tabindex') + "' name='confirmSenha' value='*Confirmar Senha:' type='text' rel='*Confirmar Senha:' class='campoObrigatorio' />");
                    camposSenha();
                }
            }
        );
    }
}

////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////BANNER///////////////////////////////////////

function setBanner() {
    var time, timeFade, statusTransition, containerBanner, contentBanner, containerNav, contentNav;

    function configBanner() {
        time = 10;
        timeFade = .5;
        statusTransition = false;
        containerBanner = $('.banner .content-banner');
        contentBanner = $('> .item', containerBanner);
        containerNav = $('.content-banner .nav');
        contentNav = $('a', containerNav);
        btNext = $('.setaDir', containerNav);
        btPrevious = $('.setaEsq', containerNav);
    }

    function initBanner() {
        autoBanner();
    }

    function initNav() {
        contentNav.click
        (
            function () {
                if (!$(this).hasClass('ativo') && !statusTransition) {
                    containerBanner.stopTime();
                    bannerTransition(contentNav.index($(this)));
                }

                return false;
            }
        );

        btNext.click
        (
            function () {
                if (!statusTransition) {
                    containerBanner.stopTime();
                    changeBanner('next');
                }
                return false;
            }
        );

        btPrevious.click
        (
            function () {
                if (!statusTransition) {
                    containerBanner.stopTime();
                    changeBanner('previous');
                }
                return false;
            }
        );

        if (contentBanner.size() <= 1) {
            btNext.hide();
            btPrevious.hide();
        }
    }

    function autoBanner() {
        var timeItem = ($('.ativo', containerBanner).attr('data-time')) ? $('.ativo', containerBanner).attr('data-time') - timeFade : time;

        containerBanner.oneTime(1000 * timeItem, function () {
            changeBanner('next');
        });
    }

    function changeBanner(type) {
        var _new;
        var _current = contentBanner.index($('> .ativo', containerBanner));
        var _total = contentBanner.size();

        switch (type) {
            case "next":
                _new = (_current == _total - 1) ? 0 : _current + 1;
                break;
            case "previous":
                _new = (_current == 0) ? _total - 1 : _current - 1;
                break;
        }

        bannerTransition(_new);
    }

    function bannerTransition(n) {
        statusTransition = true;

        contentNav.removeClass('ativo');
        contentNav.eq(n).addClass('ativo');

        $('> .ativo', containerBanner).css({'display': 'block', 'z-index': '11'});
        $('> .ativo', containerBanner).fadeOut(1000 * timeFade);
        $('> .ativo', containerBanner).removeClass('ativo');

        contentBanner.eq(n).addClass('ativo');
        contentBanner.eq(n).css({'display': 'none', 'z-index': '10'});
        contentBanner.eq(n).delay(100).fadeIn(1000 * timeFade,
            function () {
                statusTransition = false;
                autoBanner();
            }
        );
    }

    configBanner();

    initNav();

    if ($(contentBanner).size() > 1) {
        initBanner();
    }
}

////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////UTIL////////////////////////////////////////

function urlencode(str) {
    var histogram = {}, tmp_arr = [];
    var ret = (str + '').toString();

    var replacer = function (search, replace, str) {
        var tmp_arr = [];
        tmp_arr = str.split(search);
        return tmp_arr.join(replace);
    };

    // The histogram is identical to the one in urldecode.
    histogram["'"] = '%27';
    histogram['('] = '%28';
    histogram[')'] = '%29';
    histogram['*'] = '%2A';
    histogram['~'] = '%7E';
    histogram['!'] = '%21';
    histogram['%20'] = '+';
    histogram['\u20AC'] = '%80';
    histogram['\u0081'] = '%81';
    histogram['\u201A'] = '%82';
    histogram['\u0192'] = '%83';
    histogram['\u201E'] = '%84';
    histogram['\u2026'] = '%85';
    histogram['\u2020'] = '%86';
    histogram['\u2021'] = '%87';
    histogram['\u02C6'] = '%88';
    histogram['\u2030'] = '%89';
    histogram['\u0160'] = '%8A';
    histogram['\u2039'] = '%8B';
    histogram['\u0152'] = '%8C';
    histogram['\u008D'] = '%8D';
    histogram['\u017D'] = '%8E';
    histogram['\u008F'] = '%8F';
    histogram['\u0090'] = '%90';
    histogram['\u2018'] = '%91';
    histogram['\u2019'] = '%92';
    histogram['\u201C'] = '%93';
    histogram['\u201D'] = '%94';
    histogram['\u2022'] = '%95';
    histogram['\u2013'] = '%96';
    histogram['\u2014'] = '%97';
    histogram['\u02DC'] = '%98';
    histogram['\u2122'] = '%99';
    histogram['\u0161'] = '%9A';
    histogram['\u203A'] = '%9B';
    histogram['\u0153'] = '%9C';
    histogram['\u009D'] = '%9D';
    histogram['\u017E'] = '%9E';
    histogram['\u0178'] = '%9F';

    // Begin with encodeURIComponent, which most resembles PHP's encoding functions
    ret = encodeURIComponent(ret);

    for (search in histogram) {
        replace = histogram[search];
        ret = replacer(search, replace, ret); // Custom replace. No regexing
    }

    // Uppercase for full PHP compatibility
    return ret.replace(/(\%([a-z0-9]{2}))/g, function (full, m1, m2) {
        return "%" + m2.toUpperCase();
    });

    return ret;
}


function urldecode(str) {
    var histogram = {};
    var ret = str.toString();

    var replacer = function (search, replace, str) {
        var tmp_arr = [];
        tmp_arr = str.split(search);
        return tmp_arr.join(replace);
    };

    // The histogram is identical to the one in urlencode.
    histogram["'"] = '%27';
    histogram['('] = '%28';
    histogram[')'] = '%29';
    histogram['*'] = '%2A';
    histogram['~'] = '%7E';
    histogram['!'] = '%21';
    histogram['%20'] = '+';
    histogram['\u20AC'] = '%80';
    histogram['\u0081'] = '%81';
    histogram['\u201A'] = '%82';
    histogram['\u0192'] = '%83';
    histogram['\u201E'] = '%84';
    histogram['\u2026'] = '%85';
    histogram['\u2020'] = '%86';
    histogram['\u2021'] = '%87';
    histogram['\u02C6'] = '%88';
    histogram['\u2030'] = '%89';
    histogram['\u0160'] = '%8A';
    histogram['\u2039'] = '%8B';
    histogram['\u0152'] = '%8C';
    histogram['\u008D'] = '%8D';
    histogram['\u017D'] = '%8E';
    histogram['\u008F'] = '%8F';
    histogram['\u0090'] = '%90';
    histogram['\u2018'] = '%91';
    histogram['\u2019'] = '%92';
    histogram['\u201C'] = '%93';
    histogram['\u201D'] = '%94';
    histogram['\u2022'] = '%95';
    histogram['\u2013'] = '%96';
    histogram['\u2014'] = '%97';
    histogram['\u02DC'] = '%98';
    histogram['\u2122'] = '%99';
    histogram['\u0161'] = '%9A';
    histogram['\u203A'] = '%9B';
    histogram['\u0153'] = '%9C';
    histogram['\u009D'] = '%9D';
    histogram['\u017E'] = '%9E';
    histogram['\u0178'] = '%9F';

    for (replace in histogram) {
        search = histogram[replace]; // Switch order when decoding
        ret = replacer(search, replace, ret); // Custom replace. No regexing
    }

    // End with decodeURIComponent, which most resembles PHP's encoding functions
    ret = decodeURIComponent(ret);

    return ret;
}