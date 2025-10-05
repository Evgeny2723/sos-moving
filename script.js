// --- ПОЛНАЯ РАБОЧАЯ ВЕРСИЯ СКРИПТА ---

// ШАГ 1: Ждём полной загрузки всех ресурсов страницы (включая jQuery, sbjs и т.д.)
window.addEventListener("load", function() {

    console.log("Все ресурсы страницы загружены. Запускаем основной код.");

    // --- Код для Multistep Form ---
    const emailField = document.querySelector('[name="field_e_mail"]') || document.getElementById('field_e_mail');
    const nextButton = document.querySelector('#next-step-btn');

    function isValidEmail(email) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
    }

    function toggleNextButton() {
        if (!isValidEmail(emailField.value)) {
            nextButton.style.opacity = '0.5';
            nextButton.style.pointerEvents = 'none';
            emailField.classList.add('is-error');
        } else {
            nextButton.style.opacity = '1';
            nextButton.style.pointerEvents = 'auto';
            emailField.classList.remove('is-error');
        }
    }

    if (emailField && nextButton) {
        toggleNextButton();
        emailField.addEventListener('input', toggleNextButton);
    }

    // --- Код для Sourcebuster (sbjs) ---
    if (typeof sbjs !== 'undefined') {
        sbjs.init({
            callback: function(data) {
                console.log("Sourcebuster data:", data);
                const companyNameField = document.querySelector('company_name');
                if (companyNameField) {
                    // Используем .current, т.к. нам нужны данные текущей сессии
                    const sourceValue = data.current.src || 'n/a';
                    companyNameField.value = sourceValue;
                    console.log(`Поле company_name заполнено значением: ${sourceValue}`);
                }
            }
        });
    } else {
        console.error("Библиотека sbjs не найдена.");
    }

    // --- Код, который зависит от Webflow и jQuery ---
    const Webflow = window.Webflow || [];
    Webflow.push(function () {
        // Код для Slick Slider
        if ($(".is-have-slider").length) {
            let slidersArr = [];
            $(".is-have-slider").each(function (e) {
                let t = $(this);
                slidersArr[e] = {
                    slider: t.find(".slider"),
                    slides: t.find(".slide"),
                    slidesCount: t.find(".slide").length,
                    sliderDots: t.find(".slider-dots"),
                    autoplay: !!t.find(".slider").data("autoplay"),
                    variableWidth: !!t.find(".slider").data("variablewidth"),
                    variableWidthMobile: t.find(".slider").data("variablewidthmobile") !== false,
                    doubleSlides: t.find(".slider").data("doubleslides") !== false,
                    slidesToShow: t.find(".slider").data("slidestoshow") || 1,
                    slidesToShowTablet: t.find(".slider").data("slidestoshowtablet") || 1,
                    slidesToShowMobile: t.find(".slider").data("slidestoshowmobile") || 1,
                };
                if (slidersArr[e].slidesCount < 7 && slidersArr[e].doubleSlides) {
                    slidersArr[e].slides.each(function () {
                        $(this).clone().appendTo(slidersArr[e].slider);
                    });
                }
                slidersArr[e].slider.slick({
                    infinite: true,
                    slidesToShow: slidersArr[e].slidesToShow,
                    variableWidth: slidersArr[e].variableWidth,
                    slidesToScroll: 1,
                    autoplay: slidersArr[e].autoplay,
                    autoplaySpeed: 2000,
                    nextArrow: t.find(".is-next"),
                    prevArrow: t.find(".is-prev"),
                    dots: false,
                    appendDots: slidersArr[e].sliderDots,
                    draggable: true,
                    responsive: [
                        { breakpoint: 991, settings: { slidesToShow: slidersArr[e].slidesToShowTablet } },
                        { breakpoint: 768, settings: { variableWidth: slidersArr[e].variableWidthMobile, slidesToShow: slidersArr[e].slidesToShowMobile } },
                    ],
                });
            });
        }

        // Код для пагинации
        if ($(".w-page-count").length) {
            let e = $(window).width() < 768 ? 4 : 10;
            $(".w-page-count").each(function () {
                let t = $(this).closest(".w-pagination-wrapper").find('[class*="w-pagination"]').first().prop("href").split("=")[0],
                    s = parseInt(/[^/]*$/.exec($(this).text())[0].trim()),
                    a = parseInt($(this).text().split("/")[0].trim()),
                    i = Math.max(1, Math.min(e || s, s)),
                    o = Math.min(Math.max(1, a - Math.ceil((i - 1) / 2)) + (i - 1), s),
                    r = o - (i - 1);
                $(this).empty();
                for (let l = r; l <= o; l++) {
                    let n = l, c = t + "=" + n, p = n == a,
                        u = $("<a>", { class: [p && "is-current", "page-link"].filter(Boolean).join(" "), href: c, text: n });
                    $(this).append(u);
                }
            });
        }

        // Остальной код из Webflow.push
        $(".services-section + .why-sos-section").length && $(".services-section").addClass("is-mb-0");
        $(".service-content-section + .services-section").length && $(".services-section").prev(".service-content-section").addClass("is-mb-0");
        $(".services-section + .hero-form-section").length && $(".services-section").addClass("is-small-pb");
        $(".article-content-area p").each(function () {
            $(this).html().indexOf("{separator}") > -1 && $(this).html("").addClass("separator");
        });
        $(".article-content-area h2").each(function (e) {
            let t = $(".article-toc-list"), s = 97 + e, a = $(this).html();
            a.indexOf(". ") > -1 && (a = a.split(". ")[1]), $(this).attr("id", String.fromCharCode(s)), t.append('<li class="article-toc-item"><a href="#' + String.fromCharCode(s) + '" class="article-toc-link">' + a + "</a></li>");
        });

    gsap.registerPlugin(ScrollTrigger);

    // --- АНИМАЦИЯ ОТДЕЛЬНЫХ ЛИНИЙ ---

    // Находим все элементы-заполнители
    const lineFills = gsap.utils.toArray(".steps-line-fill");

    // Проходим по каждому и создаем для него свою анимацию
    lineFills.forEach(line => {

      // Находим ближайшего родителя с классом .step-item, он будет триггером
      const triggerElement = line.closest(".step-item");

      gsap.fromTo(line, 
                  { height: "0%" }, // Начальное состояние (высота 0%)
                  {
        height: "100%", // Конечное состояние (высота 100%)
        ease: "none",
        scrollTrigger: {
          trigger: triggerElement, // Триггер - родительский блок шага
          start: "top 40%",      // Начинаем, когда верх шага доходит до 70% высоты экрана
          end: "bottom 40%",     // Заканчиваем, когда низ шага доходит до 70% высоты экрана
          scrub: true,
        }
      }
                 );
    });

    // --- 2. АНИМАЦИЯ ЦИФР (OPACITY И ПУЛЬСАЦИЯ) ---

    // Находим все элементы шагов
    const steps = gsap.utils.toArray(".step-item");

    // Проходим по каждому шагу и создаем для него свою анимацию
    steps.forEach((step, index) => {
      // Находим цифру внутри текущего шага
      const number = step.querySelector(".step-number");

      if (number) {
        // Создаем временную шкалу анимации для каждой цифры
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step, // Триггер - сам элемент шага
            start: "top 40%", // Начинаем, когда верх шага достигает центра экрана
            end: "bottom 40%", // Заканчиваем, когда низ шага покидает центр экрана
            scrub: 0.8,
          }
        });

        // Добавляем анимацию на временную шкалу
        tl.to(number, {
          opacity: 1,     // Делаем непрозрачным
          scale: 1.15,    // Увеличиваем
          duration: 0.3   // Длительность фазы увеличения
        })
          .to(number, {
          scale: 1,       // Возвращаем к нормальному размеру
          duration: 0.7   // Длительность фазы уменьшения
        });
      }
    });
    });

    // --- Инициализация jQuery плагинов и обработчиков событий ---
    addInputPhoneMask();

    const nav = $(".navbar");
    $(".article-content-area").length && $(".article-content-area").each(function () {
      //  openDropdown($(this).find(".dropdown").eq(0));
    });

    window.addEventListener("scroll", function (e) {
        let t = e.target.scrollingElement.scrollTop;
        t > 10 ? nav.hasClass("is-fixed") || nav.addClass("is-fixed") : nav.hasClass("is-fixed") && nav.removeClass("is-fixed");
    });
    
    $(".reviews-collection-grid").masonry({ itemSelector: ".reviews-collection-item" });

    $("body").on("click", ".dropdown-toggle", function () {
    // 1. Находим основные элементы: сам кликнутый заголовок и его родительский .dropdown
    let clickedToggle = $(this);
    let parentDropdown = clickedToggle.parent(".dropdown");

    // 2. Находим иконку, высоту которой будем менять
    let icon = clickedToggle.find(".dropdown-icon-minus.is-plus");

    // 3. Закрываем все "соседние" открытые дропдауны (эффект аккордеона)
    let openSiblings = parentDropdown.siblings(".is--open");
    if (openSiblings.length) {
        closeDropdown(openSiblings); // Вызываем вашу функцию закрытия
        // Устанавливаем высоту иконок у закрытых "соседей" в 0.75rem
        openSiblings.find(".dropdown-icon-minus.is-plus").css("height", "0.75rem");
    }

    // 4. Переключаем состояние текущего дропдауна
    if (parentDropdown.hasClass("is--open")) {
        // Если он был открыт -> закрываем его
        closeDropdown(parentDropdown);
        // Устанавливаем высоту иконки в 0.75rem (состояние "закрыто")
        icon.css("height", "0.75rem");
    } else {
        // Если он был закрыт -> открываем его
        openDropdown(parentDropdown);
        // Устанавливаем высоту иконки в 0rem (состояние "открыто")
        icon.css("height", "0rem");
    }
});

    let d = new Date(), strDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    $(".is-date").datepicker({ zIndex: 1e3, autoHide: true, startDate: strDate, format: "yyyy-mm-dd" });
    $(".is-select").select2({ minimumResultsForSearch: -1, dropdownCssClass: "select-dropdown" });

    // --- Код для Google Autocomplete ---
    $.fn.select2.amd.define("select2/data/googleAutocompleteAdapter", ["select2/data/array", "select2/utils"], function (e, t) {
        function s(e, t) { s.__super__.constructor.call(this, e, t); }
        return (t.Extend(s, e), s.prototype.query = function (e, t) {
            var s = function (e, s) {
                var a = { results: [] };
                if (s != google.maps.places.PlacesServiceStatus.OK && t(a), e.length)
                    for (var i = 0; i < e.length; i++) a.results.push({ id: e[i].place_id.toString(), text: e[i].description.toString() });
                a.results.push({ id: " ", text: "Powered by Google", disabled: true }), t(a);
            };
            if (e.term && "" != e.term) new google.maps.places.AutocompleteService().getPlacePredictions({ input: e.term }, s);
            else { var a = { results: [] }; a.results.push({ id: " ", text: "Powered by Google", disabled: true }), t(a); }
        }, s);
    });
    var googleAutocompleteAdapter = $.fn.select2.amd.require("select2/data/googleAutocompleteAdapter");
    var $select = $(".is-address-autocomplate");
    $select.each(function () {
        $(this).select2({
            width: "100%", dataAdapter: googleAutocompleteAdapter, placeholder: $(this).attr("select2-placeholder"),
            escapeMarkup: function (e) { return e; },
            minimumInputLength: 2, templateResult: formatRepo, templateSelection: formatRepoSelection,
        }),
        $(this).on("select2:select", function (e) {
            getDetails($(e.currentTarget).find("option:selected").val(), e.currentTarget);
        });
    });

    // --- Код для обработки форм ---
    var forms = document.querySelectorAll("form");
    forms.length && forms.forEach((e) => { e.setAttribute("novalidate", ""); });
    
    $(".blog-category-list").length && $(".blog-category-list").prepend('<div role="listitem" class="w-dyn-item"><a href="/blog" aria-current="page" class="blog-category-link w--current">All Articles</a></div>');

    $("form").length && ($("form").each(function () {
        $(this).hasClass("referer-form") || ($(this).attr("data-api-redirect", $(this).attr("redirect")), $(this).removeAttr("redirect data-redirect"));
        $(".services-hero-h1").length ? ($(this).attr("data-name", "Form in " + $(".services-hero-h1").html() + " Page."), $(this).attr("name", "Form in " + $(".services-hero-h1").html() + " Page.")) : ($(this).attr("data-name", "Form in " + $("title").text() + "."), $(this).attr("name", "Form in " + $("title").text() + "."));
    }),
    $(".bottom-cta-wrapper form").length && ($(".services-hero-section form").length ? $(".bottom-cta-wrapper form").attr("redirect", $(".services-hero-section form").attr("redirect")) : $(".bottom-cta-wrapper form").attr("redirect", "/confirmation-page")));
    
    $("form").on("submit", function () {
        var e = $(this), s = e.attr("data-api-redirect"), a = e.find('[type="submit"]'), i = a.val();
        if (e.hasClass("referer-form")) return;
        a.val(a.data("wait"));
        var t = { data: formToObj(e) };
        var o = new Date();
        var r = o.getFullYear() + "-" + ("0" + (o.getMonth() + 1)).slice(-2) + "-" + ("0" + o.getDate()).slice(-2);
        t.data.provider_id = 50;
        t.data.field_last_name = "n/a";
        if (!t.data.field_date) { t.data.field_date = r; }
        for (const key in t.data) {
            if (t.data[key] === null || t.data[key] === "") {
                switch (key) {
                    case "moving_from_zip": case "moving_to_zip": t.data[key] = "00000"; break;
                    case "field_move_service_type": t.data[key] = 0; break;
                    default: t.data[key] = "n/a";
                }
            }
        }
        t = JSON.stringify(t);
        console.log("Отправляемые данные:", t);
        var l = $(this).siblings(".w-form-fail");
        $.ajax({
            url: "https://api.sosmovingla.net/server/parser/get_lead_parsing",
            type: "POST", dataType: "text", data: t, contentType: "application/json",
            statusCode: { 400: function (e) { var t = JSON.parse(e); l.html(t.status_message), l.show(), a.val(i); } },
            success: function (e) { var t = JSON.parse(e); t.status ? (window.location = s) : (l.html(t.status_message), l.show()), a.val(i); },
            error: function (e, t, s) { l.html(t.status_message), l.show(), a.val(i); },
        });
    });
});

// --- ОБЪЯВЛЕНИЯ ВСЕХ ФУНКЦИЙ ---
function addInputPhoneMask() {
    let e = document.querySelectorAll("input.is-phone"), t = /\D/g, s = (e) => e.value.replace(t, ""),
        a = (e) => {
            let a = e.target, i = s(a), o = "", { selectionEnd: r, selectionStart: l } = a;
            if (!i) { a.value = ""; return; }
            a.value.length !== l && e.data && t.test(e.data) && (a.value = i),
            i.length > 0 && (o += `(${i.substring(0, 3)}`), i.length >= 4 && (o += `) ${i.substring(3, 6)}`),
            i.length >= 7 && (o += `-${i.substring(6, 8)}`), i.length >= 9 && (o += `${i.substring(8, 10)}`),
            i.length >= 11 && (o = `${i.substring(0, 16)}`);
            let n = getNewCaretPosition(i, o);
            a.value = o, a.setSelectionRange(n, n);
        },
        i = (e) => { let t = e.target, s = t.value.replace(/\D/g, ""); 8 === e.keyCode && 1 === s.length && (t.value = ""); },
        o = (e) => { let a = e.target, i = s(a), o = e.clipboardData || window.Clipboard; if (o) { let r = o.getData("Text"); t.test(r) && (a.value = i); } },
        r = (e) => { let t = e.target; t.classList.contains("focus") || setTimeout(() => { t.selectionStart = t.value.length; }, 100), t.classList.add("focus"); },
        l = (e) => { let t = e.target; t.classList.remove("focus"); },
        n = (e) => {
            selectedNumberCount = Math.abs(e.target.value.slice(e.target.selectionStart, e.target.selectionEnd).replaceAll(/\s/g, "").length),
            prevRawNumber = e.target.value.replaceAll(/\D/g, ""),
            prevNumberCaretPosition = e.target.value.slice(0, e.target.selectionStart).replaceAll(/\D/g, "").length;
        };
    e.forEach((e) => { e.addEventListener("input", a, !1), e.addEventListener("keydown", i), e.addEventListener("paste", o, !1), e.addEventListener("focus", r, !1), e.addEventListener("focusout", l, !1), e.addEventListener("beforeinput", n, !1); });
}
function getNewCaretPosition(e, t) {
    let s = t.split(""), a = 0, i = prevNumberCaretPosition + (e.length - prevRawNumber.length + selectedNumberCount), o;
    for (o = 0; o <= s.length - 1 && a !== i; o++) /\d/.test(s[o]) && ++a;
    return o;
}
function openDropdown(e) { let t = e.find(".dropdown-content-wrapper"); t.css({ height: t.find("div").innerHeight(), opacity: 1 }), e.addClass("is--open"); }
function closeDropdown(e) { e.find(".dropdown-content-wrapper").css({ height: 0, opacity: 0 }), e.removeClass("is--open"); }
function formatRepo(e) { return e.loading ? e.text : "<div class='select2-result-repository clearfix'><div class='select2-result-title'>" + e.text + "</div>"; }
function formatRepoSelection(e) { return e.text; }
function getDetails(e, t) {
    new google.maps.Geocoder().geocode({ placeId: e }, function (e, s) {
        if ("OK" === s) {
            if (e[0]) {
                let a = extractComponents(e[0]);
                switch (t.getAttribute("name")) {
                    case "thoroughfare_from": document.querySelector('[name="moving_from_zip"]').value = a.postal_code ? a.postal_code : "00000"; break;
                    case "thoroughfare_to": document.querySelector('[name="moving_to_zip"]').value = a.postal_code ? a.postal_code : "00000";
                }
                $(t).find("option:selected").val(a.formatted_address);
            } else window.alert("No results found");
        } else window.alert("Geocoder failed due to: " + s);
    });
}
function extractComponents(e) {
    for (var t = { street_number: "short_name", route: "long_name", locality: "long_name", administrative_area_level_1: "short_name", country: "long_name", postal_code: "short_name" },
        s = { google_place_id: e.place_id, formatted_address: e.formatted_address, city: "", state: "", country: "", postal_code: "", lat: e.geometry.location.lat(), lng: e.geometry.location.lng() },
        a = 0; a < e.address_components.length; a++) {
        var i = e.address_components[a].types[0];
        if (t[i]) {
            var o = e.address_components[a][t[i]];
            "locality" === i ? s.city = o : "administrative_area_level_1" === i ? s.state = o : "country" === i ? s.country = o : "postal_code" === i && (s.postal_code = o);
        }
    }
    return s;
}
function formToObj(e) {
    var t = e.serializeArray(), s = {};
    return ($.each(t, function () { s[this.name] = this.value || null; }), s);
}
