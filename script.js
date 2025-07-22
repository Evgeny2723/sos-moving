const Webflow = window.Webflow || [];

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (Маска телефона, Select2 и т.д.) ---

function addInputPhoneMask() {
    let e = document.querySelectorAll("input.is-phone"),
        t = /\D/g,
        s = (e) => e.value.replace(t, ""),
        a = (e) => {
            let a = e.target,
                i = s(a),
                o = "",
                { selectionEnd: r, selectionStart: l } = a;
            if (!i) {
                a.value = "";
                return;
            }
            a.value.length !== l && e.data && t.test(e.data) && (a.value = i),
                i.length > 0 && (o += `(${i.substring(0, 3)}`),
                i.length >= 4 && (o += `) ${i.substring(3, 6)}`),
                i.length >= 7 && (o += `-${i.substring(6, 8)}`),
                i.length >= 9 && (o += `${i.substring(8, 10)}`),
                i.length >= 11 && (o = `${i.substring(0, 16)}`),
                10 == i.length ? a.classList.add("valid") : a.classList.remove("valid");
            let n = getNewCaretPosition(i, o);
            (a.value = o), a.setSelectionRange(n, n);
        },
        i = (e) => {
            let t = e.target,
                s = t.value.replace(/\D/g, "");
            8 === e.keyCode && 1 === s.length && (t.value = "");
        },
        o = (e) => {
            let a = e.target,
                i = s(a),
                o = e.clipboardData || window.Clipboard;
            if (o) {
                let r = o.getData("Text");
                t.test(r) && (a.value = i);
            }
        },
        r = (e) => {
            let t = e.target;
            t.classList.contains("focus") ||
                setTimeout(() => {
                    t.selectionStart = t.value.length;
                }, 100),
                t.classList.add("focus");
        },
        l = (e) => {
            let t = e.target;
            t.classList.remove("focus");
        },
        n = (e) => {
            (selectedNumberCount = Math.abs(e.target.value.slice(e.target.selectionStart, e.target.selectionEnd).replaceAll(/\s/g, "").length)),
                (prevRawNumber = e.target.value.replaceAll(/\D/g, "")),
                (prevNumberCaretPosition = e.target.value.slice(0, e.target.selectionStart).replaceAll(/\D/g, "").length);
        };
    e.forEach((e) => {
        e.addEventListener("input", a, !1), e.addEventListener("keydown", i), e.addEventListener("paste", o, !1), e.addEventListener("focus", r, !1), e.addEventListener("focusout", l, !1), e.addEventListener("beforeinput", n, !1);
    });
}

function getNewCaretPosition(e, t) {
    let s = t.split(""),
        a = 0,
        i = prevNumberCaretPosition + (e.length - prevRawNumber.length + selectedNumberCount),
        o;
    for (o = 0; o <= s.length - 1 && a !== i; o++) /\d/.test(s[o]) && ++a;
    return o;
}

function formToObj(e) {
    var t = e.serializeArray(),
        s = {};
    return (
        $.each(t, function () {
            s[this.name] = this.value || null;
        }),
        s
    );
}

function getDetails(e, t) {
    new google.maps.Geocoder().geocode({ placeId: e }, function (e, s) {
        if ("OK" === s) {
            if (e[0]) {
                let a = extractComponents(e[0]);
                switch (t.getAttribute("name")) {
                    case "thoroughfare_from":
                        document.querySelector('[name="moving_from_zip"]').value = a.postal_code ? a.postal_code : "00000";
                        break;
                    case "thoroughfare_to":
                        document.querySelector('[name="moving_to_zip"]').value = a.postal_code ? a.postal_code : "00000";
                }
                $(t).find("option:selected").val(a.formatted_address);
            } else window.alert("No results found");
        } else window.alert("Geocoder failed due to: " + s);
    });
}

function extractComponents(e) {
    for (
        var t = { street_number: "short_name", route: "long_name", locality: "long_name", administrative_area_level_1: "short_name", country: "long_name", postal_code: "short_name" },
            s = { google_place_id: e.place_id, formatted_address: e.formatted_address, city: "", state: "", country: "", postal_code: "", lat: e.geometry.location.lat(), lng: e.geometry.location.lng() },
            a = 0;
        a < e.address_components.length;
        a++
    ) {
        var i = e.address_components[a].types[0];
        if (t[i]) {
            var o = e.address_components[a][t[i]];
            "locality" === i ? (s.city = o) : "administrative_area_level_1" === i ? (s.state = o) : "country" === i ? (s.country = o) : "postal_code" === i && (s.postal_code = o);
        }
    }
    return s;
}


// --- ОСНОВНАЯ ЛОГИКА ОТПРАВКИ ФОРМЫ ---

function sendDataToAPI(form) {
    console.log("Шаг 2: Начинаем сбор и обработку данных формы.");
    var e = $(form),
        t = { data: formToObj(e) },
        s = e.attr("data-api-redirect") || "/confirmation-page", // Редирект по умолчанию
        a = e.find('[type="submit"]'),
        i = a.val();

    // Логика заглушек
    const emailRegex = /\S+@\S+\.\S+/;
    if (!t.data.field_first_name) t.data.field_first_name = "Not Provided";
    if (!t.data.field_last_name || t.data.field_last_name === "n/a") t.data.field_last_name = "Not Provided";
    if (!t.data.field_e_mail || !emailRegex.test(t.data.field_e_mail)) t.data.field_e_mail = "no-reply@example.com";
    if (!t.data.field_phone) t.data.field_phone = "(000) 000-0000";
    if (!t.data.moving_from_zip) t.data.moving_from_zip = "00000";
    if (!t.data.moving_to_zip) t.data.moving_to_zip = "00000";
    if (!t.data.field_date) {
        var o = new Date(),
            r = o.getFullYear() + "-" + ("0" + (o.getMonth() + 1)).slice(-2) + "-" + ("0" + o.getDate()).slice(-2);
        t.data.field_date = r;
    }
    if (!t.data.field_move_service_type) t.data.field_move_service_type = 0;
    t.data.provider_id = 50;
    
    console.log("Шаг 3: Данные подготовлены. Отправляем на API:", t);
    
    a.val(a.data("wait") || "Please wait..."); // Меняем текст на кнопке
    var l = e.siblings(".w-form-fail");
    var formDone = e.siblings(".w-form-done");
    
    $.ajax({
        url: "https://api.sosmovingla.net/server/parser/get_lead_parsing",
        type: "POST",
        dataType: "text",
        data: JSON.stringify(t),
        contentType: "application/json",
        success: function (response) {
            var parsedResponse = JSON.parse(response);
            console.log("Шаг 4: Успешный ответ от сервера:", parsedResponse);
            if (parsedResponse.status) {
                console.log("Редирект на:", s);
                window.location = s;
            } else {
                console.error("Сервер вернул ошибку:", parsedResponse.status_message);
                l.html(parsedResponse.status_message).show();
                a.val(i);
            }
        },
        error: function (xhr, status, error) {
            console.error("Шаг 4: Ошибка AJAX-запроса! Статус:", status, "Ошибка:", error, "Ответ:", xhr.responseText);
            var errorMessage = "Could not send the form. Please try again.";
            try {
                var response = JSON.parse(xhr.responseText);
                if(response && response.status_message) {
                    errorMessage = response.status_message;
                }
            } catch(e) {
                // Ошибка парсинга JSON, используем стандартное сообщение
            }
            l.html(errorMessage).show();
            a.val(i);
        },
    });
}


// --- ИНИЦИАЛИЗАЦИЯ ВСЕХ СКРИПТОВ ПОСЛЕ ЗАГРУЗКИ СТРАНИЦЫ ---

Webflow.push(function () {
    // Новый обработчик форм
    $('form').on('submit', function(event) {
        event.preventDefault(); 
        console.log("Шаг 1: Отправка формы перехвачена.", this);
        sendDataToAPI(this);
    });

    // Инициализация маски для телефона
    addInputPhoneMask();
    
    // Инициализация Select2 для Google Autocomplete
    $.fn.select2.amd.define("select2/data/googleAutocompleteAdapter", ["select2/data/array", "select2/utils"], function (e, t) {
        function s(e, t) {
            s.__super__.constructor.call(this, e, t);
        }
        return (
            t.Extend(s, e),
            (s.prototype.query = function (e, t) {
                var s = function (e, s) {
                    var a = { results: [] };
                    if ((s != google.maps.places.PlacesServiceStatus.OK && t(a), e.length)) for (var i = 0; i < e.length; i++) a.results.push({ id: e[i].place_id.toString(), text: e[i].description.toString() });
                    a.results.push({ id: " ", text: "Powered by Google", disabled: !0 }), t(a);
                };
                if (e.term && "" != e.term) new google.maps.places.AutocompleteService().getPlacePredictions({ input: e.term }, s);
                else {
                    var a = { results: [] };
                    a.results.push({ id: " ", text: "Powered by Google", disabled: !0 }), t(a);
                }
            }),
            s
        );
    });

    var googleAutocompleteAdapter = $.fn.select2.amd.require("select2/data/googleAutocompleteAdapter");
    $(".is-address-autocomplate").each(function () {
        $(this).select2({
            width: "100%",
            dataAdapter: googleAutocompleteAdapter,
            placeholder: $(this).attr("select2-placeholder"),
            escapeMarkup: function (e) { return e; },
            minimumInputLength: 2,
            templateResult: function (e) {
                return e.loading ? e.text : "<div class='select2-result-repository clearfix'><div class='select2-result-title'>" + e.text + "</div>";
            },
            templateSelection: function (e) {
                return e.text;
            }
        }).on("select2:select", function (e) {
            getDetails($(e.currentTarget).find("option:selected").val(), e.currentTarget);
        });
    });

    // Инициализация Datepicker
    var d = new Date(), strDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    $(".is-date").datepicker({ zIndex: 1e3, autoHide: !0, startDate: strDate, format: "yyyy-mm-dd" });
    $(".is-date").on("pick.datepicker", function () {
        $(this).removeClass("is-error");
    });

    // Инициализация обычных Select2
    $(".is-select").select2({ minimumResultsForSearch: -1, dropdownCssClass: "select-dropdown" });
    $(".is-select").on("select2:selecting", function (e) {
        $(this).removeClass("is-error");
    });
    
    // Инициализация слайдеров Slick
    $(".is-have-slider").length &&
        ((slidersArr = []),
        $(".is-have-slider").each(function (e) {
            let t = $(this);
            (slidersArr[e] = {
                slider: t.find(".slider"),
                slides: t.find(".slide"),
                slidesCount: t.find(".slide").length,
                autoplay: !!t.find(".slider").data("autoplay"),
                slidesToShow: t.find(".slider").data("slidestoshow") ? t.find(".slider").data("slidestoshow") : 1,
            }),
            slidersArr[e].slider.slick({
                infinite: !0,
                slidesToShow: slidersArr[e].slidesToShow,
                slidesToScroll: 1,
                autoplay: slidersArr[e].autoplay,
                autoplaySpeed: 4000,
                nextArrow: t.find(".is-next"),
                prevArrow: t.find(".is-prev"),
                dots: false,
            });
        }));
});
